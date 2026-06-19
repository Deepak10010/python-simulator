// Encode/decode sandbox code into the URL so simulations are shareable.

export function encodeCode(code: string): string {
  // UTF-8 safe base64.
  const bytes = new TextEncoder().encode(code)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin)
}

export function decodeCode(encoded: string): string {
  try {
    const bin = atob(encoded)
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return ''
  }
}
