'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '../button'
import { RiLockUnlockLine } from '@remixicon/react'
import { unlockLink } from '@/lib/actions/links/unlock-link'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const UnlockForm = ({ encryptedUrl }: { encryptedUrl: string }) => {
  const [password, setPassword] = useState('')

  const { execute, status, result } = useAction(unlockLink, {
    onSuccess: ({ data }) => {
      console.log('Link unlocked successfully, redirecting...')
    },
    onError: (error) => {
      console.error('Error unlocking link:', error)
      toast.error('Error unlocking link')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    execute({ encryptedUrl, password })
  }

  return (
    <div className="flex flex-col gap-4 w-80">
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
