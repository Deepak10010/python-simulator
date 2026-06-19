"""
Execution tracer for the Python Concept Simulator.

Runs user source under sys.settrace and produces a JSON-serializable list of
execution steps. Each step snapshots the call stack, local variables, a heap of
referenced container/objects, and accumulated stdout.

The frontend animates through these steps locally, so this runs once per
"Run" and returns the whole trace.
"""

import sys
import io
import ast
import copy
import json
import types as _types
import builtins

MAX_STEPS = 1000          # guard against runaway loops
MAX_CONTAINER_ITEMS = 50  # cap large containers in the snapshot
MAX_DEPTH = 4             # cap nested-container recursion
SUB_MAX_LEN = 40          # cap substituted value length in calculations
USER_FILENAME = "<program>"


# --- calculation extraction --------------------------------------------------
# For each executing line we try to surface the *calculation* happening, e.g.
#   total = total + n   ->   5 + 3   ->   8
# We do this from the AST so we can substitute current variable values into the
# expression and (when side-effect free) evaluate the result.

def _build_stmt_map(tree):
    """Map line number -> the interesting statement node on that line."""
    m = {}
    for node in ast.walk(tree):
        if isinstance(node, (ast.Assign, ast.AugAssign, ast.AnnAssign,
                             ast.If, ast.While, ast.Return, ast.Expr)):
            ln = getattr(node, "lineno", None)
            if ln is not None and ln not in m:
                m[ln] = node
    return m


def _calc_display(value):
    try:
        r = repr(value)
    except Exception:
        return "<?>"
    return r if len(r) <= SUB_MAX_LEN else r[: SUB_MAX_LEN - 3] + "..."


def _as_load(node):
    """Deep-copy an expression node forcing every ctx to Load (for eval)."""
    n = copy.deepcopy(node)
    for sub in ast.walk(n):
        if hasattr(sub, "ctx"):
            sub.ctx = ast.Load()
    return n


class _Substituter(ast.NodeTransformer):
    """Replace variable Names with a textual rendering of their value."""

    def __init__(self, varmap):
        self.varmap = varmap

    def visit_Name(self, node):
        if isinstance(node.ctx, ast.Load) and node.id in self.varmap:
            return ast.copy_location(
                ast.Name(id=self.varmap[node.id], ctx=ast.Load()), node
            )
        return node


def _build_varmap(frame):
    """Display strings for substitutable values (skip callables/modules)."""
    m = {}
    for scope in (frame.f_globals, frame.f_locals):
        for k, v in scope.items():
            if k.startswith("__"):
                continue
            if callable(v) or isinstance(v, type) or isinstance(v, _types.ModuleType):
                continue
            m[k] = _calc_display(v)
    return m


def _compute_calc(stmt_map, frame):
    node = stmt_map.get(frame.f_lineno)
    if node is None:
        return None

    target_text = None
    if isinstance(node, ast.Assign):
        expr_node = node.value
        target_text = ", ".join(ast.unparse(t) for t in node.targets)
    elif isinstance(node, ast.AugAssign):
        expr_node = ast.BinOp(left=_as_load(node.target), op=node.op,
                              right=copy.deepcopy(node.value))
        ast.fix_missing_locations(expr_node)
        target_text = ast.unparse(node.target)
    elif isinstance(node, ast.AnnAssign):
        if node.value is None:
            return None
        expr_node = node.value
        target_text = ast.unparse(node.target)
    elif isinstance(node, (ast.If, ast.While)):
        expr_node = node.test
        target_text = None
    elif isinstance(node, ast.Return):
        if node.value is None:
            return None
        expr_node = node.value
        target_text = "return"
    elif isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
        expr_node = node.value
        target_text = None
    else:
        return None

    try:
        expr_str = ast.unparse(expr_node)
    except Exception:
        return None

    varmap = _build_varmap(frame)
    try:
        sub_node = _Substituter(varmap).visit(copy.deepcopy(expr_node))
        ast.fix_missing_locations(sub_node)
        substituted = ast.unparse(sub_node)
    except Exception:
        substituted = expr_str

    has_call = any(
        isinstance(n, (ast.Call, ast.Await, ast.Yield, ast.YieldFrom, ast.NamedExpr))
        for n in ast.walk(expr_node)
    )
    result = None
    if not has_call:
        try:
            val = eval(
                compile(ast.Expression(_as_load(expr_node)), "<calc>", "eval"),
                frame.f_globals,
                frame.f_locals,
            )
            result = _calc_display(val)
        except Exception:
            result = None

    # Suppress trivial calculations (plain literals with nothing to show).
    nothing_substituted = substituted == expr_str
    trivial_result = result is None or result == substituted
    if nothing_substituted and trivial_result:
        return None

    return {
        "target": target_text,
        "expr": expr_str,
        "substituted": substituted,
        "result": result,
    }


def _trace_source(source, predefined_inputs=None):
    steps = []
    truncated = {"value": False}
    top_error = {"value": None}

    # Parse the AST up front so we can surface per-line calculations.
    try:
        stmt_map = _build_stmt_map(ast.parse(source))
    except SyntaxError:
        stmt_map = {}

    stdout_buf = io.StringIO()

    # Provide a controllable input() so programs that read stdin don't hang.
    inputs = list(predefined_inputs or [])
    input_idx = {"i": 0}

    def fake_input(prompt=""):
        if prompt:
            stdout_buf.write(str(prompt))
        if input_idx["i"] < len(inputs):
            val = str(inputs[input_idx["i"]])
            input_idx["i"] += 1
        else:
            val = ""
        stdout_buf.write(val + "\n")
        return val

    # ---- value serialization -------------------------------------------------
    def serialize_value(value, heap, depth=0):
        if value is None:
            return {"kind": "none", "repr": "None"}
        if isinstance(value, bool):
            return {"kind": "bool", "value": value, "repr": repr(value)}
        if isinstance(value, int):
            return {"kind": "int", "value": value, "repr": repr(value)}
        if isinstance(value, float):
            return {"kind": "float", "value": value, "repr": repr(value)}
        if isinstance(value, complex):
            return {"kind": "complex", "repr": repr(value)}
        if isinstance(value, str):
            return {"kind": "str", "value": value, "repr": repr(value)}
        if isinstance(value, (list, tuple, set, dict)):
            oid = id(value)
            register_heap(value, heap, depth)
            return {"kind": "ref", "id": oid, "repr": _short_repr(value)}
        # Custom objects with a __dict__ become heap objects too.
        if hasattr(value, "__dict__") and not isinstance(value, type):
            oid = id(value)
            register_heap(value, heap, depth)
            return {"kind": "ref", "id": oid, "repr": _short_repr(value)}
        return {"kind": "opaque", "repr": _short_repr(value)}

    def _short_repr(value):
        try:
            r = repr(value)
        except Exception:
            r = "<unreprable>"
        return r if len(r) <= 120 else r[:117] + "..."

    def register_heap(value, heap, depth):
        oid = id(value)
        if oid in heap:
            return
        if depth >= MAX_DEPTH:
            heap[oid] = {"id": oid, "type": "object",
                         "className": type(value).__name__,
                         "attrs": [{"name": "…", "value": {"kind": "opaque", "repr": "(too deep)"}}]}
            return
        # Reserve the slot first to break reference cycles.
        heap[oid] = {"id": oid, "type": "object"}
        if isinstance(value, dict):
            entries = []
            for k, v in list(value.items())[:MAX_CONTAINER_ITEMS]:
                entries.append({"key": _short_repr(k),
                                "value": serialize_value(v, heap, depth + 1)})
            heap[oid] = {"id": oid, "type": "dict", "entries": entries}
        elif isinstance(value, (list, tuple, set)):
            kind = "list" if isinstance(value, list) else (
                "tuple" if isinstance(value, tuple) else "set")
            items = [serialize_value(v, heap, depth + 1)
                     for v in list(value)[:MAX_CONTAINER_ITEMS]]
            heap[oid] = {"id": oid, "type": kind, "items": items}
        else:
            attrs = []
            for name, v in list(vars(value).items())[:MAX_CONTAINER_ITEMS]:
                attrs.append({"name": name,
                              "value": serialize_value(v, heap, depth + 1)})
            heap[oid] = {"id": oid, "type": "object",
                         "className": type(value).__name__, "attrs": attrs}

    def serialize_locals(frame_locals, heap):
        out = {}
        for name, val in frame_locals.items():
            if name.startswith("__") and name.endswith("__"):
                continue
            out[name] = serialize_value(val, heap)
        return out

    def build_stack(frame):
        # Collect user frames from outermost to innermost.
        frames = []
        f = frame
        while f is not None:
            if f.f_code.co_filename == USER_FILENAME:
                frames.append(f)
            f = f.f_back
        frames.reverse()
        heap = {}
        stack = []
        for f in frames:
            name = f.f_code.co_name
            stack.append({
                "name": "<module>" if name == "<module>" else name,
                "line": f.f_lineno,
                "locals": serialize_locals(f.f_locals, heap),
            })
        return stack, heap

    def record(frame, event, line_override=None):
        if len(steps) >= MAX_STEPS:
            truncated["value"] = True
            raise _StopTracing()
        stack, heap = build_stack(frame)
        step = {
            "line": line_override if line_override is not None else frame.f_lineno,
            "event": event,
            "stack": stack,
            "heap": heap,
            "stdout": stdout_buf.getvalue(),
        }
        if event == "line":
            calc = _compute_calc(stmt_map, frame)
            if calc is not None:
                step["calc"] = calc
        steps.append(step)

    # ---- trace callback ------------------------------------------------------
    def tracer(frame, event, arg):
        if frame.f_code.co_filename != USER_FILENAME:
            return None
        if event in ("line", "call", "return", "exception"):
            try:
                record(frame, event)
            except _StopTracing:
                raise
        return tracer

    # ---- run -----------------------------------------------------------------
    real_stdout = sys.stdout
    real_input = builtins.input
    sys.stdout = stdout_buf
    builtins.input = fake_input
    try:
        code = compile(source, USER_FILENAME, "exec")
        ns = {"__name__": "__main__"}
        sys.settrace(tracer)
        try:
            exec(code, ns)
        except _StopTracing:
            pass
        except SyntaxError:
            raise
        except BaseException as e:  # user runtime error
            top_error["value"] = f"{type(e).__name__}: {e}"
    except SyntaxError as e:
        top_error["value"] = f"SyntaxError: {e}"
    finally:
        sys.settrace(None)
        sys.stdout = real_stdout
        builtins.input = real_input

    # Append a final step carrying the error/truncation note if needed.
    if top_error["value"] or truncated["value"]:
        last_stack = steps[-1]["stack"] if steps else []
        last_heap = steps[-1]["heap"] if steps else {}
        final = {
            "line": steps[-1]["line"] if steps else 0,
            "event": "exception" if top_error["value"] else "line",
            "stack": last_stack,
            "heap": last_heap,
            "stdout": stdout_buf.getvalue(),
        }
        if top_error["value"]:
            final["error"] = top_error["value"]
        if truncated["value"]:
            final["note"] = f"Execution stopped after {MAX_STEPS} steps (possible infinite loop)."
        steps.append(final)

    return {
        "steps": steps,
        "truncated": truncated["value"],
        "error": top_error["value"],
    }


class _StopTracing(Exception):
    pass


def run_trace(source, predefined_inputs=None):
    """Entry point called from JS. Returns a JSON string."""
    result = _trace_source(source, predefined_inputs)
    return json.dumps(result)
