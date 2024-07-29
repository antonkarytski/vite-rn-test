export async function computeHMAC(
  applicationKey: string,
  hmacKey: string,
  jsonInput: string
): Promise<string> {
  const textEncoder = new TextEncoder()
  const data = textEncoder.encode(jsonInput)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(applicationKey + hmacKey),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', keyMaterial, data)
  const signatureArray = Array.from(new Uint8Array(signature))

  return signatureArray
    .map((byte) => {
      return ('0' + (byte & 0xff).toString(16)).slice(-2)
    })
    .join('')
}
