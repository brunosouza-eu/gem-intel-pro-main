import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function to receive Hotmart Webhooks
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // To bypass RLS, it's highly recommended to use SUPABASE_SERVICE_ROLE_KEY in production Env Vars.
    // Fallback to VITE_SUPABASE_PUBLISHABLE_KEY if not set.
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Missing Supabase Env variables' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const payload = req.body;
    const event = payload?.event;
    const data = payload?.data;

    console.log(`[Hotmart Webhook] Evento: ${event}`);

    if (event === 'PURCHASE_COMPLETE' || event === 'PURCHASE_APPROVED') {
        const email = data?.buyer?.email;
        const transactionId = data?.purchase?.transaction;

        if (!email || !transactionId) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        // 1. Get user by email
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email);

        if (profileError || !profiles || profiles.length === 0) {
            console.log(`[Hotmart Webhook] Usuário não encontrado para email: ${email}`);
            return res.status(404).json({ error: 'User not found in Gem Intel' });
        }

        const userId = profiles[0].id;

        // 2. Insert into curso_compras
        const { error: insertError } = await supabase
            .from('curso_compras')
            .insert({
                user_id: userId,
                curso_slug: 'trade-master-pro',
                status: 'ativo',
                transaction_id: transactionId,
            });

        if (insertError) {
            // Ignore unique constraint violation if already processed
            if (insertError.code === '23505') {
                return res.status(200).json({ ok: true, message: 'Already processed' });
            }
            console.error('[Hotmart Webhook] Erro ao registrar data:', insertError);
            return res.status(500).json({ error: insertError.message });
        }

        console.log(`[Hotmart Webhook] Compra registrada para ${email}`);
        return res.status(200).json({ ok: true, message: 'Access granted' });
    }

    if (event === 'PURCHASE_REFUNDED' || event === 'PURCHASE_CANCELLED') {
        console.log(`[Hotmart Webhook] Reembolso/cancelamento: ${data?.purchase?.transaction}`);
        return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true, ignored: true });
}
