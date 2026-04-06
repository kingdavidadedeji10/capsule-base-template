import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Signed in as {user.email}</p>
      </div>
      <form action="/api/auth/signout" method="POST">
        <Button type="submit" variant="outline">
          Sign Out
        </Button>
      </form>
    </main>
  )
}
