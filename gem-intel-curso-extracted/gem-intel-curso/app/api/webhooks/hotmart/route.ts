// ─────────────────────────────────────────────────────────────────────────────
// /api/webhooks/hotmart  —  Recebe eventos de compra da Hotmart
// Configura em: Hotmart > Ferramentas > Webhooks > URL: seu-dominio/api/webhooks/hotmart
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from 'next/server'
import { registrarCompraHotmart } from '@/lib/curso-progress'
import crypto from 'crypto'

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN!   // token secreto definido na Hotmart

// Valida a assinatura do webhook (segurança)
function validarAssinatura(body: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', HOTMART_TOKEN)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-hotmart-signature') ?? ''

  // Valida assinatura (não rejeitar em dev se token não configurado)
  if (HOTMART_TOKEN && !validarAssinatura(body, signature)) {
    console.error('[Hotmart Webhook] Assinatura inválida')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = payload?.event          // ex: 'PURCHASE_COMPLETE'
  const data  = payload?.data

  console.log(`[Hotmart Webhook] Evento: ${event}`)

  // ── Compra aprovada ────────────────────────────────────────────────────────
  if (event === 'PURCHASE_COMPLETE' || event === 'PURCHASE_APPROVED') {
    const email           = data?.buyer?.email
    const transactionId   = data?.purchase?.transaction
    const valor           = data?.purchase?.price?.value ?? 0

    if (!email || !transactionId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { ok, error } = await registrarCompraHotmart({ email, transactionId, valor })

    if (!ok) {
      console.error('[Hotmart Webhook] Erro ao registrar:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    console.log(`[Hotmart Webhook] Compra registrada para ${email}`)
    return NextResponse.json({ ok: true })
  }

  // ── Reembolso ─────────────────────────────────────────────────────────────
  if (event === 'PURCHASE_REFUNDED' || event === 'PURCHASE_CANCELLED') {
    const transactionId = data?.purchase?.transaction
    if (transactionId) {
      // Marcar compra como reembolsada (revogar acesso)
      // TODO: implementar revogação de acesso se necessário
      console.log(`[Hotmart Webhook] Reembolso/cancelamento: ${transactionId}`)
    }
    return NextResponse.json({ ok: true })
  }

  // Outros eventos: apenas confirmar recebimento
  return NextResponse.json({ ok: true, ignored: true })
}
