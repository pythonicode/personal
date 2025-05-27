'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '../button'
import { RiLinkM, RiFileCopyLine } from '@remixicon/react'
import { generateLink } from '@/lib/actions/links/generate-link'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

const LinksForm = () => {
  const [url, setUrl] = useState('')

  const { execute, status, result } = useAction(generateLink, {
    onSuccess: (data) => {
      console.log('Link generated successfully:', data)
    },
    onError: (error) => {
      console.error('Error generating link:', error)
      toast.error('Error generating link')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    execute({ url })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-80">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          name="url"
          type="url"
          placeholder="Enter URL to encrypt"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full"
        />

        <Button type="submit" disabled={status === 'executing' || !url}>
          <RiLinkM className="w-4 h-4 mr-2" />
          {status === 'executing' ? 'Generating...' : 'Generate Encrypted Link'}
        </Button>
      </form>

      {result?.data && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800 mb-2">Link generated successfully!</p>
          <div className="flex items-center gap-2">
            <Input value={result.data.shareableLink} readOnly className="text-xs" />
            <Button
              size="icon"
              variant="outline"
              onClick={() => copyToClipboard(result.data?.shareableLink ?? '')}
              className="w-8 h-8"
            >
              <RiFileCopyLine className="w-4 h-4" />
            </Button>
          </div>
        </div>
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

export { LinksForm }
