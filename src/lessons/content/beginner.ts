import type { LessonA } from '../types'

// Phase 1 — Beginner lessons (catalog sections 1–10), all trace-driven.
// Each sample is written to exercise EVERY sub-topic in the lesson, so a
// student who steps all the way through has seen the whole concept.

export const beginnerLessons: LessonA[] = [
  {
    id: 'python-basics',
    number: 1,
    title: 'Python Basics',
    tier: 'beginner',
    strategy: 'A',
    emoji: '🐍',
    blurb: 'Variables, comments and how Python runs your code line by line.',
    topics: ['variables', 'comments', 'indentation', 'identifiers', 'constants'],
    explanation: [
      'A Python program runs one line at a time, from top to bottom.',
      'A variable is a labelled box that holds a value. Assigning with = puts a value in the box; you can change it later.',
      'Comments start with #. Indentation (spaces) groups lines into blocks. Step through and watch each variable appear the moment its line runs.',
    ],
    sampleCode: `# Comments start with # and are ignored by Python

# A variable is a labelled box that holds a value
name = "Ada"
age = 36

# Assign several variables at once
x, y, z = 1, 2, 3

# Reassign a variable to a new value
age = age + 1

# Constants use ALL_CAPS by convention (a hint to humans, not a rule)
MAX_SCORE = 100

# Indentation defines a block — these lines belong to the if
if age > 18:
    status = "adult"
    can_vote = True

print(name, "is", age, "->", status)`,
    show: { calc: true, variables: true, output: true },
  },
  {
    id: 'data-types',
    number: 2,
    title: 'Data Types',
    tier: 'beginner',
    strategy: 'A',
    emoji: '🔢',
    blurb: 'int, float, complex, bool and str — and converting between them.',
    topics: ['int', 'float', 'complex', 'bool', 'str', 'type()', 'conversion'],
    explanation: [
      'Every value has a type: int (whole numbers), float (decimals), str (text), bool (True/False) and complex (real + imaginary).',
      'type() tells you a value\'s type. int(), float(), str() and bool() convert between them.',
      'Watch how "42" (text) becomes 42 (a number) — the token colour changes with the type.',
    ],
    sampleCode: `# The core built-in types
count = 7              # int  (whole number)
price = 19.99          # float (decimal)
nickname = "Ada"       # str  (text)
is_active = True       # bool (True / False)
point = 2 + 3j         # complex (real + imaginary)

# type() reveals a value's type
print(type(count))
print(type(price))
print(type(nickname))

# Converting between types
age_text = "42"
age_num = int(age_text)     # str -> int
half = age_num / 4          # int / int -> float
rounded = int(half)         # float -> int (truncates toward 0)
as_text = str(count)        # int -> str
truthy = bool(0)            # 0 -> False, anything else -> True

print(age_num, half, rounded)
print("count as text:", as_text, "| bool(0) =", truthy)`,
    show: { calc: true, variables: true, output: true },
  },
  {
    id: 'operators',
    number: 3,
    title: 'Operators',
    tier: 'beginner',
    strategy: 'A',
    emoji: '➕',
    blurb: 'Arithmetic, comparison, assignment, logical, membership, identity, bitwise.',
    topics: [
      'arithmetic',
      'comparison',
      'assignment',
      'logical',
      'membership',
      'identity',
      'bitwise',
    ],
    explanation: [
      'Operators combine values. Arithmetic: + - * / // % **. Comparison: == != < > <= >= produce booleans.',
      'Logical: and / or / not. Membership: in / not in. Identity: is / is not (same object?). Bitwise work on the binary bits.',
      'The Calculation panel shows each operation with your values filled in — step through to see every result.',
    ],
    sampleCode: `a = 17
b = 5

# Arithmetic
print(a + b, a - b, a * b)
print(a / b)        # true division -> float
print(a // b)       # floor division -> 3
print(a % b)        # modulo (remainder) -> 2
print(a ** 2)       # power -> 289

# Comparison -> booleans
print(a > b, a == b, a != b)

# Assignment operators (update in place)
total = 10
total += 5          # total = total + 5
total *= 2          # total = total * 2

# Logical
print(a > b and b > 0)
print(not (a == b))

# Membership
nums = [1, 2, 3]
print(3 in nums, 9 not in nums)

# Identity — same object in memory?
x = nums
print(x is nums)        # True: same list
print([1] is [1])       # False: two different lists

# Bitwise (operate on binary bits)
print(6 & 3, 6 | 3, 6 ^ 3, 6 << 1)`,
    show: { calc: true, variables: true, heap: true, output: true },
  },
  {
    id: 'input-output',
    number: 4,
    title: 'Input & Output',
    tier: 'beginner',
    strategy: 'A',
    emoji: '🖨️',
    blurb: 'print(), input(), f-strings and formatting your output nicely.',
    topics: ['print()', 'input()', 'sep / end', 'f-strings', 'format()'],
    explanation: [
      'print() shows values; sep and end control how they are joined. (input() is pre-filled here so it runs without typing.)',
      'f-strings (f"...") drop variables and expressions straight into text. You can format numbers: {pi:.2f}, {ratio:.0%}.',
      'Watch the Output panel fill up one line at a time as each print runs.',
    ],
    sampleCode: `name = input("Your name? ")        # pre-filled: Grace
age = int(input("Your age? "))     # pre-filled: 30

# Several values; sep and end control formatting
print("Hello", name, sep=" -> ")
print("Line A", end=" | ")
print("Line B")

# f-strings embed values and expressions directly
print(f"{name} is {age} years old")
print(f"Next year: {age + 1}")

# Number formatting inside f-strings
pi = 3.14159
print(f"pi rounded: {pi:.2f}")
print(f"as percent: {0.25:.0%}")

# str.format() — older style, same idea
print("{} scored {}".format(name, 95))`,
    show: { calc: true, variables: true, output: true },
    inputs: ['Grace', '30'],
  },
  {
    id: 'strings',
    number: 5,
    title: 'Strings',
    tier: 'beginner',
    strategy: 'A',
    emoji: '🔤',
    blurb: 'Indexing, slicing, methods, escapes — and why strings never change.',
    topics: [
      'indexing',
      'slicing',
      'methods',
      'escape sequences',
      'immutability',
      'concatenation',
    ],
    explanation: [
      'A string is a sequence of characters. word[0] is the first, word[-1] the last. Slicing word[1:4] grabs a range; word[::-1] reverses.',
      'Methods like .upper() return a NEW string — the original never changes (immutability). + joins, * repeats.',
      'Step through and watch each new string pop into existence.',
    ],
    sampleCode: `word = "Python"

# Indexing (0-based; negatives count from the end)
print(word[0], word[-1])

# Slicing  [start:stop:step]
print(word[1:4])     # "yth"
print(word[:3])      # "Pyt"
print(word[::-1])    # reversed -> "nohtyP"

# Strings are immutable: methods return NEW strings
print(word.upper(), word.lower())
print("  spaced  ".strip())
print(word.replace("Py", "My"))

# Queries
print(len(word), word.find("t"), "tho" in word)

# Splitting and joining
parts = "a,b,c".split(",")
joined = "-".join(parts)
print(parts, joined)

# Concatenation (+) and repetition (*)
print("ha" * 3 + "!")

# Escape sequences: \\t tab, \\n newline, \\" quote
print("Tab\\tand\\nnewline")

# f-string interpolation
name = "Ada"
print(f"Hi {name}, your name has {len(name)} letters")`,
    show: { calc: true, variables: true, heap: true, output: true },
  },
  {
    id: 'control-flow',
    number: 6,
    title: 'Control Flow',
    tier: 'beginner',
    strategy: 'A',
    emoji: '🔀',
    blurb: 'if / elif / else, nested conditions and the ternary operator.',
    topics: ['if', 'elif', 'else', 'nested', 'ternary', 'combined conditions'],
    explanation: [
      'Conditions let your program choose. Python checks if, then each elif, and runs else only if none matched.',
      'The Calculation panel shows each condition with values filled in (e.g. 78 >= 90 → False), so you see exactly why a branch is taken or skipped.',
      'Conditions can be nested, combined with and/or, or written compactly as a ternary.',
    ],
    sampleCode: `score = 78
temp = 30

# if / elif / else chain
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

# Nested conditions
if grade != "F":
    if score >= 75:
        note = "solid pass"
    else:
        note = "just scraped through"
else:
    note = "retake needed"

# Ternary: value_if_true if condition else value_if_false
weather = "hot" if temp > 25 else "cool"

# Combining conditions with and / or
eligible = score >= 70 and temp < 35

print("Grade:", grade)
print("Note:", note)
print("Weather:", weather, "| Eligible:", eligible)`,
    show: { calc: true, variables: true, output: true },
  },
  {
    id: 'loops',
    number: 7,
    title: 'Loops',
    tier: 'beginner',
    strategy: 'A',
    emoji: '🔁',
    blurb: 'for & while loops, nesting, break, continue, pass and for-else.',
    topics: ['for', 'while', 'nested', 'break', 'continue', 'pass', 'for-else'],
    explanation: [
      'A loop repeats lines. for walks through a sequence; while repeats while a condition holds.',
      'continue skips to the next pass; break exits early; pass does nothing (a placeholder). A loop\'s else runs only if it finished without breaking.',
      'Watch the loop variable and running total update on every pass as the highlighted line bounces back to the top.',
    ],
    sampleCode: `# for loop over a range, skipping evens with continue
total = 0
for n in range(1, 6):       # 1, 2, 3, 4, 5
    if n % 2 == 0:
        continue            # skip even numbers
    total += n
print("sum of odds 1..5 =", total)

# for loop over a list, stopping early with break
names = ["Ada", "Alan", "Grace", "Linus"]
found = ""
for person in names:
    if person.startswith("G"):
        found = person
        break               # stop at the first match
print("first G-name:", found)

# nested loops build a small grid
grid = ""
for row in range(1, 3):
    for col in range(1, 3):
        grid += f"({row},{col}) "
print("grid:", grid)

# while loop counting down
countdown = 3
while countdown > 0:
    print("T-minus", countdown)
    countdown -= 1
print("Lift off!")

# pass is a do-nothing placeholder
for _ in range(2):
    pass

# for-else: else runs only if the loop never breaks
for n in [1, 3, 5]:
    if n % 2 == 0:
        break
else:
    print("all numbers were odd")`,
    show: { calc: true, variables: true, heap: true, output: true },
  },
  {
    id: 'collections',
    number: 8,
    title: 'Collections',
    tier: 'beginner',
    strategy: 'A',
    emoji: '🧺',
    blurb: 'Lists, tuples, sets and dictionaries — and what makes each different.',
    topics: ['list', 'tuple', 'set', 'dict', 'indexing', 'methods', 'iteration'],
    explanation: [
      'Lists are ordered and changeable. Tuples are ordered but frozen (immutable). Sets keep only unique items. Dicts map keys to values.',
      'Watch the Lists/dicts panel: appending adds a cell, sets drop duplicates, and the dict grows new key→value rows.',
    ],
    sampleCode: `# LIST — ordered and changeable
fruits = ["apple", "banana"]
fruits.append("cherry")      # add to the end
fruits.insert(0, "kiwi")     # add at index 0
fruits[1] = "blueberry"      # replace by index
removed = fruits.pop()       # remove & return the last item
print(fruits, "| removed:", removed)
print("first two:", fruits[:2], "| count:", len(fruits))
fruits.sort()
print("sorted:", fruits)

# TUPLE — ordered but immutable
point = (3, 4)
x, y = point                 # unpacking
print("x =", x, "y =", y)

# SET — unique items only
nums = {1, 2, 2, 3, 3, 3}    # duplicates are dropped
nums.add(4)
evens = {2, 4, 6}
print("set:", nums)
print("union:", nums | evens, "| intersection:", nums & evens)

# DICT — key -> value pairs
ages = {"Ada": 36, "Alan": 41}
ages["Grace"] = 45           # add a new entry
ages["Ada"] = 37             # update an existing entry
print("Ada is", ages["Ada"])
print("keys:", list(ages.keys()))
for name, age in ages.items():
    print(name, "->", age)`,
    show: { calc: true, variables: true, heap: true, output: true },
  },
  {
    id: 'functions',
    number: 9,
    title: 'Functions',
    tier: 'beginner',
    strategy: 'A',
    emoji: '🧰',
    blurb: 'Parameters, return values, defaults, keywords and variable scope.',
    topics: [
      'def',
      'parameters',
      'return',
      'default args',
      'keyword args',
      'scope',
    ],
    explanation: [
      'A function packages reusable code. Calling it pushes a new frame onto the call stack with its own local variables; return pops it and hands a value back.',
      'Arguments can be positional or by keyword; parameters can have defaults. A function can return several values at once (as a tuple).',
      'Watch the Call stack panel grow and shrink as functions are called and return.',
    ],
    sampleCode: `# Parameters + a return value
def add(a, b):
    return a + b

# Default argument
def greet(name="friend"):
    return f"Hello, {name}!"

# Returns several values at once (a tuple)
def stats(numbers):
    total = sum(numbers)
    count = len(numbers)
    return total, count

# Scope: local vs global
counter = 0            # global variable

def bump():
    global counter     # modify the global, not a new local
    counter += 1

total = add(3, 4)              # positional arguments
hi = greet("Ada")
default_hi = greet()           # uses the default
named = greet(name="Linus")    # keyword argument
s, c = stats([10, 20, 30])     # unpack the returned tuple
bump()
bump()

print(hi, "|", default_hi, "|", named)
print("3 + 4 =", total)
print("sum =", s, "count =", c)
print("counter =", counter)`,
    show: { calc: true, variables: true, stack: true, output: true },
  },
  {
    id: 'modules',
    number: 10,
    title: 'Modules',
    tier: 'beginner',
    strategy: 'A',
    emoji: '📚',
    blurb: 'Reuse code from the standard library with import, from-import and aliases.',
    topics: ['import', 'from … import', 'alias (as)', 'standard library'],
    explanation: [
      'Modules are bundles of ready-made code. "import math" gives you math.sqrt, math.pi and more.',
      '"from module import name" pulls one tool in directly; "import module as alias" gives it a short name.',
      'Step through to see values computed by the standard library appear as variables.',
    ],
    sampleCode: `import math
import random
from random import randint   # import one name directly
import datetime as dt        # import with a short alias

# Using the math module
print("sqrt(144) =", math.sqrt(144))
print("pi =", round(math.pi, 4))
print("factorial(5) =", math.factorial(5))

# random (seeded so the results are repeatable)
random.seed(42)
print("random float:", round(random.random(), 3))
print("dice roll:", randint(1, 6))            # used directly
print("pick:", random.choice(["red", "green", "blue"]))

# datetime via its alias
today = dt.date(2026, 6, 19)
print("year:", today.year, "| month:", today.month)`,
    show: { calc: true, variables: true, output: true },
  },
]
