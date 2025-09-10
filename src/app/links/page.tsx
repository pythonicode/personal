import { LinksForm } from '@/components/ui/links/form'

export default function LinksPage() {
  return (
    <main className="flex py-20 min-h-screen">
      <section className="mx-auto max-w-screen-lg flex flex-col items-center justify-center px-4 grow">
        <h2 className="mb-8 text-3xl text-center md:text-5xl font-black">✨ ENCRYPTED LINKS ✨</h2>
        <LinksForm />
        <div className="max-w-prose text-center mx-auto p-4 mb-8">
          <p className="text-muted-foreground">
            Generate password-protected links that can only be accessed by those with the password.
            Perfect for sharing sensitive URLs securely.
          </p>
        </div>
      </section>
    </main>
  )
}
