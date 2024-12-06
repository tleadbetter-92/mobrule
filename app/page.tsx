import SignInForm from '@/components/sign-in-form'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Politics Site</h1>
      <SignInForm />
    </main>
  )
}

