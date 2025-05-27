/**
 * Encrypts a string value using AES-GCM with a password-derived key
 * @param value - The string to encrypt
 * @param password - The password to use for encryption
 * @returns Promise<string> - Base64 encoded encrypted data with salt and IV
 */
export async function encrypt(value: string, password: string): Promise<string> {
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16))

  // Generate a random initialization vector
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Derive key from password using PBKDF2
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  )

  // Encrypt the value
  const encodedValue = new TextEncoder().encode(value)
  const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, encodedValue)

  // Combine salt, IV, and encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength)
  combined.set(salt, 0)
  combined.set(iv, salt.length)
  combined.set(new Uint8Array(encryptedData), salt.length + iv.length)

  // Return as base64 string
  return btoa(String.fromCharCode(...combined))
}

/**
 * Decrypts an encrypted value using the provided password
 * @param encryptedValue - Base64 encoded encrypted data
 * @param password - The password used for encryption
 * @returns Promise<string> - The decrypted string value
 * @throws Error if decryption fails
 */
export async function decrypt(encryptedValue: string, password: string): Promise<string> {
  try {
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedValue)
        .split('')
        .map((char) => char.charCodeAt(0)),
    )

    // Extract salt, IV, and encrypted data
    const salt = combined.slice(0, 16)
    const iv = combined.slice(16, 28)
    const encryptedData = combined.slice(28)

    // Derive the same key from password
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey'],
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    )

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedData,
    )

    // Convert back to string
    return new TextDecoder().decode(decryptedData)
  } catch (error) {
    throw new Error('Failed to decrypt: Invalid password or corrupted data')
  }
}
