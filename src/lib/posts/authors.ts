import { z } from 'zod'

export type Author = {
  name: string
  avatar?: string
}

export const authors: Record<string, Author> = {
  'Anthony Riley': {
    name: 'Anthony Riley',
    avatar: '/images/hero.jpg',
  },
}

export const authorKeys = Object.keys(authors)
export const authorKeysSchema = z.enum(['Anthony Riley', ...authorKeys]).default('Anthony Riley')
