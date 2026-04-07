import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, balance, created_at')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Link href="/dashboard"><Button variant="outline" size="sm">← Back</Button></Link>
        </div>
        <Card>
          <CardHeader><CardTitle>Account Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Full Name</p>
              <p className="font-medium">{profile?.full_name ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Phone</p>
              <p className="font-medium">{profile?.phone ?? '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Balance</p>
              <p className="font-medium text-green-600">₦{(profile?.balance ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Member Since</p>
              <p className="font-medium">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</p>
            </div>
          </CardContent>
        </Card>
        <form action="/api/auth/signout" method="POST">
          <Button type="submit" variant="outline" className="w-full">Sign Out</Button>
        </form>
      </div>
    </main>
  )
}
