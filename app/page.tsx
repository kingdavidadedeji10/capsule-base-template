import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/config/app'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-2">
        <h1 className="text-6xl font-bold tracking-tight pb-5">{APP_NAME}</h1>
        <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
        <p className="text-muted-foreground">Your app starts here.</p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">Create Account</Link>
        </Button>
      </div>
    </main>
  )
}

