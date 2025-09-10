import { createSafeActionClient } from 'next-safe-action'

export const client = createSafeActionClient({
  handleServerError: (error) => {
    return error instanceof ActionError ? error.message : 'An unknown error occurred'
  },
  defaultValidationErrorsShape: 'flattened',
})

export class ActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ActionError'
  }
}