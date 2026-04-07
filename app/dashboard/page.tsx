import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, balance')
    .eq('id', user.id)
    .single()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, type, amount, description, created_at, status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const balance = profile?.balance ?? 0
  const fullName = profile?.full_name ?? user.email

  return (
    <main className="min-h-screen bg-background p-6 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {fullName}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <Button type="submit" variant="outline" size="sm">Sign Out</Button>
          </form>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Link href="/send">
            <Button className="w-full" size="lg">Send Money</Button>
          </Link>
          <Link href="/transactions">
            <Button className="w-full" variant="outline" size="lg">Transaction History</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!transactions || transactions.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No transactions yet.</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{tx.description || 'Transfer'}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-semibold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
