import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { accountNumber, bankCode, amount, description } = body

  if (!accountNumber || !bankCode || !amount) {
    return NextResponse.json({ error: 'accountNumber, bankCode, and amount are required' }, { status: 400 })
  }

  if (!PAYSTACK_SECRET) {
    return NextResponse.json({ error: 'Paystack is not configured.' }, { status: 500 })
  }

  try {
    const recipientRes = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'nuban', account_number: accountNumber, bank_code: bankCode, currency: 'NGN' }),
    })
    const recipientData = await recipientRes.json()
    if (!recipientRes.ok || !recipientData.status) {
      return NextResponse.json({ error: recipientData.message ?? 'Failed to create transfer recipient.' }, { status: 400 })
    }
    const recipientCode = recipientData.data.recipient_code

    const transferRes = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'balance', recipient: recipientCode, amount, reason: description ?? 'Transfer' }),
    })
    const transferData = await transferRes.json()
    if (!transferRes.ok || !transferData.status) {
      return NextResponse.json({ error: transferData.message ?? 'Transfer failed.' }, { status: 400 })
    }

    const { error: insertError } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'debit',
      amount: amount / 100,
      description: description ?? 'Transfer',
      recipient_account: accountNumber,
      recipient_bank: bankCode,
      status: transferData.data.status ?? 'pending',
      paystack_reference: transferData.data.transfer_code,
    })

    if (insertError) {
      return NextResponse.json({ error: 'Transfer succeeded but failed to record transaction.' }, { status: 500 })
    }

    await supabase.rpc('deduct_balance', { user_id: user.id, amount: amount / 100 })

    return NextResponse.json({ success: true, transfer: transferData.data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
