'use client'

import { useLocalStorage } from './use-local-storage'

export function useLinkPassword(encryptedUrl: string) {
  const storageKey = `link-password-${encryptedUrl}`
  const [savedPassword, setSavedPassword] = useLocalStorage<string | null>(storageKey, null)

  const savePassword = (password: string) => {
    setSavedPassword(password)
  }

  const clearPassword = () => {
    setSavedPassword(null)
  }

  return {
    savedPassword,
    savePassword,
    clearPassword,
    hasPassword: Boolean(savedPassword),
  }
}
