import { LinksForm } from '@/components/ui/links/form'

export default function LinksPage() {
  return (
    <main className="py-20">
      <section className="mx-auto max-w-screen-lg flex flex-col items-center justify-center px-4">
        <h2 className="mb-8 text-3xl text-center md:text-5xl font-black">✨ ENCRYPTED LINKS ✨</h2>
        <div className="max-w-prose text-center mx-auto p-4 mb-8">
          <p className="text-muted-foreground">
            Generate password-protected links that can only be accessed by those with the password.
            Perfect for sharing sensitive information securely.
          </p>
        </div>
        <LinksForm />
      </section>
    </main>
  )
}
