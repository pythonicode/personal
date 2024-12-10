import { authorKeysSchema, authors } from '@/lib/posts/authors'
import { Serializable } from '@/types/utils'
import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'

// Convert callback-based exec to Promise-based
const exec = promisify(execCallback)

// for more information on configuration, visit:
// https://www.content-collections.dev/docs/configuration

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '*.mdx',
  schema: (z) => ({
    image: z.string(),
    title: z.string(),
    author: authorKeysSchema,
    tags: z.array(z.string()).default([]),
    archived: z.boolean().default(false),
    draft: z.boolean().default(false),
    date: z.coerce
      .date()
      .transform((date) => date.toISOString())
      .optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document)

    const updatedAt = await context.cache(document._meta.filePath, async (filePath) => {
      const { stdout } = await exec(`git log -1 --format=%ai -- ${filePath}`)
      if (stdout) {
        return new Date(stdout.trim()).toISOString()
      }
      return new Date().toISOString()
    })

    const createdAt = await context.cache(document._meta.filePath, async (filePath) => {
      const { stdout } = await exec(`git log --reverse --format=%ai -- ${filePath} | head -n 1`)
      if (stdout) {
        return new Date(stdout.trim()).toISOString()
      }
      return new Date().toISOString()
    })

    return {
      ...document,
      author: authors[document.author],
      mdx,
      updatedAt,
      createdAt: document.date ? document.date : createdAt,
    } satisfies Serializable
  },
})

export default defineConfig({
  collections: [posts],
})
