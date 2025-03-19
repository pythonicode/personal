import { createSafeActionClient } from 'next-safe-action'

export const client = createSafeActionClient({
  handleServerError: (error) => {
    return error.message
  },
  defaultValidationErrorsShape: 'flattened',
})
