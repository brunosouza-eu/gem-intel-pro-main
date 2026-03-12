import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const HOTMART_HOTTOK = Deno.env.get("HOTMART_HOTTOK")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

/**
 * OFFER CODE → ACTION MAPPING
 * 
 * Plans:
 *   66pn89ja = Pro Mensal
 *   mcw7ajf5 = Pro Anual
 *   8rkh4vnv = Elite Mensal
 *   qg9w13pa = Elite Anual
 *
 * Credit Packs:
 *   f7eld6ze = Recarga Rápida (30 créditos)
 *   g0shftr1 = Recarga Turbo (100 créditos)
 *
 * Curso avulso:
 *   sj4n59vd = Curso Trade Master (30 créditos bônus)
 *
 * Cross-Selling Rules:
 *   - Every plan purchase also grants course access
 *   - Every credit pack purchase also grants course access
 *   - Every course purchase also grants 30 bonus credits
 */

const OFFER_ACTIONS: Record<string, {
  isSubscription?: boolean;
  plan?: 'pro' | 'elite';
  credits?: number;
  course?: boolean;
}> = {
  // Pro Plans
  '66pn89ja': { isSubscription: true, plan: 'pro', course: true },
  'mcw7ajf5': { isSubscription: true, plan: 'pro', course: true },
  
  // Elite Plans
  '8rkh4vnv': { isSubscription: true, plan: 'elite', course: true },
  'qg9w13pa': { isSubscription: true, plan: 'elite', course: true },
  
  // Credit Packs (+ course bonus)
  'f7eld6ze': { isSubscription: false, credits: 30, course: true },
  'g0shftr1': { isSubscription: false, credits: 100, course: true },
  
  // Standalone Course (+ 30 credits bonus)
  'sj4n59vd': { isSubscription: false, credits: 30, course: true },
}

const APPROVAL_EVENTS = ['PURCHASE_APPROVED', 'APPROVED']
const REVOCATION_EVENTS = ['PURCHASE_REFUNDED', 'REFUNDED', 'PURCHASE_CHARGEBACK', 'CHARGEBACK']

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-hotmart-hottok',
      },
    })
  }

  try {
    // ── 1. Verify Hottok ──────────────────────────────────────
    const hottok =
      req.headers.get("x-hotmart-hottok") ||
      new URL(req.url).searchParams.get("hottok")

    if (HOTMART_HOTTOK && hottok !== HOTMART_HOTTOK) {
      console.warn("❌ Invalid Hotmart Token")
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    // ── 2. Parse Webhook Body ─────────────────────────────────
    const body = await req.json()
    console.log("📦 Hotmart Webhook Event:", JSON.stringify(body, null, 2))

    // Support Hotmart Webhook v1.0 and v2.0 formats
    let event = ''
    let buyerEmail = ''
    let offerCode = ''
    let transactionId = ''
    let buyerName = ''

    if (body.event) {
      // v2.0
      event = body.event
      buyerEmail = body.data?.buyer?.email?.toLowerCase()?.trim() || ''
      buyerName = body.data?.buyer?.name || ''
      offerCode = body.data?.purchase?.offer?.code || body.data?.offer?.code || ''
      transactionId = body.data?.purchase?.transaction || ''
    } else {
      // v1.0
      event = body.status || ''
      buyerEmail = (body.email || '').toLowerCase().trim()
      buyerName = body.name || ''
      offerCode = body.off || ''
      transactionId = body.transaction || ''
    }

    // Only process approved or revoked purchases
    const isApproval = APPROVAL_EVENTS.includes(event)
    const isRevocation = REVOCATION_EVENTS.includes(event)

    if (!isApproval && !isRevocation) {
      console.log(`ℹ️ Ignoring event: ${event}`)
      return new Response(JSON.stringify({ message: `Ignored: ${event}` }), { status: 200 })
    }

    if (!buyerEmail) {
      console.warn("⚠️ Missing buyer email")
      return new Response(JSON.stringify({ error: "Missing email" }), { status: 400 })
    }

    console.log(`✅ Processing event: ${event} | email=${buyerEmail} offer=${offerCode} tx=${transactionId}`)

    // ── 3. Connect to Supabase ────────────────────────────────
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // ── 4. Locate or Register User ────────────────────────────
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const matchedUser = authUsers?.users?.find(
      (u: any) => u.email?.toLowerCase()?.trim() === buyerEmail
    )

    // ==========================================
    // FLUXO A: REVOGAÇÃO (Estorno / Chargeback)
    // ==========================================
    if (isRevocation) {
      if (!matchedUser) {
        console.log(`ℹ️ User not found for revocation ${buyerEmail}. Deleting any pending purchases.`)
        await supabase.from('pending_purchases').delete().eq('email', buyerEmail).eq('offer_code', offerCode)
        return new Response(JSON.stringify({ success: true, message: "Pending purchase removed." }), { status: 200 })
      }

      const userId = matchedUser.id
      const action = OFFER_ACTIONS[offerCode]

      if (!action) {
        return new Response(JSON.stringify({ success: true, message: "Unknown offer code for revocation." }), { status: 200 })
      }

      // Fetch current profile to calculate deductions
      const { data: profile } = await supabase.from('profiles').select('credits').eq('id', userId).single()
      let updatePayload: any = {}
      let deductCredits = action.credits || 0

      if (action.isSubscription) {
        updatePayload.plan = 'free'
      }
      
      if (action.course) {
        // Safe measure: if they refund anything with course access, we revoke it.
        // If they had it from somewhere else, admin will have to restore it. 
        updatePayload.has_course_access = false
      }

      if (Object.keys(updatePayload).length > 0) {
        await supabase.from('profiles').update(updatePayload).eq('id', userId)
      }

      if (deductCredits > 0 && profile) {
         const finalCredits = Math.max(0, (profile.credits || 0) - deductCredits)
         await supabase.from('profiles').update({ credits: finalCredits }).eq('id', userId)
         
         await supabase.from('credit_transactions').insert({
             user_id: userId,
             amount: -deductCredits,
             type: 'spend',
             source: 'refund',
             description: `Estorno Hotmart: ${offerCode}`,
             balance_after: finalCredits
         })
      }

      // Remove from pending to prevent future claims
      await supabase.from('pending_purchases').delete().eq('email', buyerEmail).eq('offer_code', offerCode)

      console.log(`✅ Revocation successful for ${buyerEmail}`)
      return new Response(JSON.stringify({ success: true, message: "Refund processed" }), { status: 200 })
    }


    // ==========================================
    // FLUXO B: APROVAÇÃO (Nova Compra)
    // ==========================================
    
    // 4.1. Record Pending Purchase always
    const { error: insertError } = await supabase
      .from('pending_purchases')
      .insert({
        email: buyerEmail,
        offer_code: offerCode,
        transaction_id: transactionId,
        buyer_name: buyerName,
      })

    if (insertError) {
      console.error("⚠️ Insert pending_purchases error (may be duplicate):", insertError.message)
    }

    // 4.2. If User is not registered yet, we stop here.
    if (!matchedUser) {
      console.log(`ℹ️ User not found yet for ${buyerEmail}. Purchase saved as pending.`)
      return new Response(JSON.stringify({
        success: true,
        message: "Purchase saved. Will be claimed when user registers.",
      }), { status: 200 })
    }

    const userId = matchedUser.id

    // 4.3. Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, plan, credits, has_course_access, email')
      .eq('id', userId)
      .single()

    if (!profile) {
      console.error(`❌ Profile not found for user ${userId}`)
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404 })
    }

    // 4.4. Process ALL unclaimed purchases for this email
    // This resolves cases where the user bought multiple items before creating the account!
    const { data: unclaimed } = await supabase
      .from('pending_purchases')
      .select('*')
      .eq('email', buyerEmail)
      .eq('claimed', false)

    if (!unclaimed || unclaimed.length === 0) {
      console.log("ℹ️ No unclaimed purchases (already processed earlier in this request tree)")
      return new Response(JSON.stringify({ success: true, message: "Already processed" }), { status: 200 })
    }

    let newPlan: string = profile.plan || 'free'
    let addCredits = 0
    let giveCourse = profile.has_course_access || false

    for (const purchase of unclaimed) {
      const action = OFFER_ACTIONS[purchase.offer_code]

      if (action) {
        // Plan upgrade (never downgrade: elite > pro > free)
        if (action.plan) {
          if (action.plan === 'elite') {
            newPlan = 'elite'
          } else if (action.plan === 'pro' && newPlan !== 'elite') {
            newPlan = 'pro'
          }
        }

        // Add avulso credits permanently
        if (action.credits) {
          addCredits += action.credits
        }

        // Add course access permanently
        if (action.course) {
          giveCourse = true
        }
      } else {
        console.warn(`⚠️ Unknown offer code: ${purchase.offer_code}. Granting safe default (Course).`)
        giveCourse = true
      }

      // Mark as claimed
      await supabase
        .from('pending_purchases')
        .update({
          claimed: true,
          claimed_at: new Date().toISOString(),
          user_id: userId,
        })
        .eq('id', purchase.id)
    }

    // 4.5. Update profile with accumulated rewards
    const finalCredits = (profile.credits || 0) + addCredits

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        plan: newPlan,
        credits: finalCredits,
        has_course_access: giveCourse,
        email: buyerEmail, // Ensure email explicitly matches
      })
      .eq('id', userId)

    if (updateError) {
      console.error("❌ Profile update error:", updateError)
      return new Response(JSON.stringify({ error: "Failed to update profile" }), { status: 500 })
    }

    // 4.6. Log credit transaction if credits were given
    if (addCredits > 0) {
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: addCredits,
          type: 'earn',
          source: 'hotmart_purchase',
          description: `Pacote de Créditos / Bônus Hotmart (TXs combinadas)`,
          balance_after: finalCredits,
        })
    }

    console.log(`🎉 Success: user=${userId} plan=${newPlan} credits=${finalCredits} course=${giveCourse}`)

    return new Response(JSON.stringify({
      success: true,
      userId,
      plan: newPlan,
      credits: finalCredits,
      courseAccess: giveCourse,
    }), { status: 200 })

  } catch (error) {
    console.error("💥 Webhook error:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
  }
})
