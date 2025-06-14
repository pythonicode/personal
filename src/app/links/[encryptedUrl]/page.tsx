import { UnlockForm } from '@/components/ui/links/unlock-form'

export default async function UnlockLinkPage({
  params,
}: {
  params: Promise<{ encryptedUrl: string }>
}) {
  const { encryptedUrl } = await params

  return (
    <main className="py-20">
      <section className="mx-auto max-w-screen-lg flex flex-col items-center justify-center px-4">
        <h2 className="mb-8 text-3xl text-center md:text-5xl font-black">🔒 UNLOCK LINK 🔒</h2>
        <div className="max-w-prose text-center mx-auto p-4 mb-8">
          <p className="text-muted-foreground">
            This link is password protected. Enter the password below to access the content.
          </p>
        </div>
        <UnlockForm encryptedUrl={encryptedUrl} />
      </section>
    </main>
  )
}
