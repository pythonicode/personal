'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '../button'
import { RiLockUnlockLine } from '@remixicon/react'
import { unlockLink } from '@/lib/actions/links/unlock-link'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { Spinner } from '../spinner'
import { useLinkPassword } from '@/lib/hooks/use-link-password'
import { useRouter } from 'next/navigation'

const UnlockForm = ({ encryptedUrl }: { encryptedUrl: string }) => {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [redirecting, setRedirecting] = useState(false)
  const [autoUnlockAttempted, setAutoUnlockAttempted] = useState(false)

  const { savedPassword, savePassword, clearPassword } = useLinkPassword('password')

  const { execute, status, result } = useAction(unlockLink, {
    onSuccess: ({ data }) => {
      console.log('Link unlocked successfully, redirecting...')
      setRedirecting(true)
      // Save the password that worked
      if (data?.password) {
        savePassword(data.password)
      }
      if (data?.decryptedUrl) {
        router.replace(data.decryptedUrl)
        // if (typeof window !== 'undefined') {
        //   window.location.href = data.decryptedUrl
        // }
      }
    },
    onError: (error) => {
      console.error('Error unlocking link:', error)
      // If this was an auto-unlock attempt, clear the saved password
      if (autoUnlockAttempted && savedPassword) {
        clearPassword()
        setAutoUnlockAttempted(true) // Prevent further auto attempts
      }
      toast.error('Error unlocking link')
    },
  })

  // Auto-unlock with saved password on mount
  useEffect(() => {
    if (savedPassword && !autoUnlockAttempted && status === 'idle') {
      console.log('Attempting auto-unlock with saved password...')
      setPassword(savedPassword)
      setAutoUnlockAttempted(true)
      execute({ encryptedUrl, password: savedPassword })
    }
  }, [savedPassword, autoUnlockAttempted, status, execute, encryptedUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    execute({ encryptedUrl, password })
  }

  return (
    <div className="flex flex-col gap-4 w-80">
      {redirecting ? (
        <Spinner />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            name="password"
            type="password"
            placeholder="Enter password to unlock link"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />

          <Button type="submit" disabled={status === 'executing' || !password}>
            <RiLockUnlockLine className="w-4 h-4 mr-2" />
            {status === 'executing' ? 'Unlocking...' : 'Unlock Link'}
          </Button>
        </form>
      )}
      {status === 'hasErrored' && (
        <p className="text-xs text-red-500">
          {result?.serverError ??
            Object.values(result?.validationErrors?.fieldErrors ?? {})
              .flat()
              .at(0) ??
            result?.validationErrors?.formErrors?.at(0)}
        </p>
      )}
    </div>
  )
}

export { UnlockForm }
