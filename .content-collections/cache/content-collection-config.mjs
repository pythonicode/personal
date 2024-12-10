// src/lib/posts/authors.ts
import { z } from "zod";
var authors = {
  "Anthony Riley": {
    name: "Anthony Riley",
    avatar: "/images/hero.jpg"
  }
};
var authorKeys = Object.keys(authors);
var authorKeysSchema = z.enum(["Anthony Riley", ...authorKeys]).default("Anthony Riley");

// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { exec as execCallback } from "child_process";
import { promisify } from "util";
var exec = promisify(execCallback);
var posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.mdx",
  schema: (z2) => ({
    image: z2.string(),
    title: z2.string(),
    author: authorKeysSchema,
    tags: z2.array(z2.string()).default([]),
    archived: z2.boolean().default(false),
    draft: z2.boolean().default(false),
    date: z2.coerce.date().transform((date) => date.toISOString()).optional()
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    const docs = await context.collection.documents();
    const idx = docs.findIndex((d) => document._meta.filePath === d._meta.filePath);
    const updatedAt = await context.cache(document._meta.filePath, async (filePath) => {
      const { stdout } = await exec(`git log -1 --format=%ai -- ${filePath}`);
      if (stdout) {
        return new Date(stdout.trim()).toISOString();
      }
      return (/* @__PURE__ */ new Date()).toISOString();
    });
    const createdAt = await context.cache(document._meta.filePath, async (filePath) => {
      const { stdout } = await exec(`git log --reverse --format=%ai -- ${filePath} | head -n 1`);
      if (stdout) {
        return new Date(stdout.trim()).toISOString();
      }
      return (/* @__PURE__ */ new Date()).toISOString();
    });
    return {
      ...document,
      author: authors[document.author],
      mdx,
      prev: idx > 0 ? docs[idx - 1] : null,
      next: idx < docs.length - 1 ? docs[idx + 1] : null,
      updatedAt,
      createdAt: document.date ? document.date : createdAt
    };
  }
});
var content_collections_default = defineConfig({
  collections: [posts]
});
export {
  content_collections_default as default
};
