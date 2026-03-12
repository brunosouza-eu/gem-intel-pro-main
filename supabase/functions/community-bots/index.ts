/**
 * 🤖 COMMUNITY BOTS — Engagement Engine
 * 
 * Edge Function that generates realistic bot activity in the community.
 * Invoked via CRON or manually from Admin panel.
 * 
 * Actions: create posts, comment on posts, like posts, follow users
 * Uses OpenRouter AI with real market data for humanized content
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ═══════════════════════════════════════════════════════
// HELPERS: Market Data Fetching
// ═══════════════════════════════════════════════════════

async function fetchBTCPrice(): Promise<{ price: number; change24h: number } | null> {
    try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT");
        if (!res.ok) return null;
        const d = await res.json();
        return { price: parseFloat(d.lastPrice), change24h: parseFloat(d.priceChangePercent) };
    } catch { return null; }
}

async function fetchTopMovers(): Promise<{ gainers: any[]; losers: any[] }> {
    try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
        if (!res.ok) return { gainers: [], losers: [] };
        const all = await res.json();
        const usdt = all
            .filter((t: any) => t.symbol.endsWith("USDT") && parseFloat(t.quoteVolume) > 5_000_000)
            .map((t: any) => ({
                symbol: t.symbol.replace("USDT", ""),
                change: parseFloat(t.priceChangePercent),
                price: parseFloat(t.lastPrice),
                volume: parseFloat(t.quoteVolume),
            }));
        const sorted = [...usdt].sort((a, b) => b.change - a.change);
        return {
            gainers: sorted.slice(0, 5),
            losers: sorted.slice(-5).reverse(),
        };
    } catch { return { gainers: [], losers: [] }; }
}

async function fetchFearGreed(): Promise<{ value: number; label: string } | null> {
    try {
        const res = await fetch("https://api.alternative.me/fng/?limit=1");
        if (!res.ok) return null;
        const data = await res.json();
        const current = data.data?.[0];
        if (!current) return null;
        return { value: parseInt(current.value), label: current.value_classification };
    } catch { return null; }
}

// ═══════════════════════════════════════════════════════
// HELPERS: Utilities
// ═══════════════════════════════════════════════════════

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function weightedRandom(weights: { action: string; weight: number }[]): string {
    const total = weights.reduce((sum, w) => sum + w.weight, 0);
    let rand = Math.random() * total;
    for (const w of weights) {
        rand -= w.weight;
        if (rand <= 0) return w.action;
    }
    return weights[0].action;
}

// ═══════════════════════════════════════════════════════
// CORE: Build Market Context for AI
// ═══════════════════════════════════════════════════════

async function buildMarketContext(supabase: any): Promise<string> {
    const [btc, movers, fng] = await Promise.all([
        fetchBTCPrice(),
        fetchTopMovers(),
        fetchFearGreed(),
    ]);

    // Fetch some tokens from DB
    const { data: tokens } = await supabase
        .from('tokens')
        .select('ticker, name, current_price, change_24h, score, status, narrative')
        .not('current_price', 'is', null)
        .order('change_24h', { ascending: false })
        .limit(15);

    let ctx = "=== DADOS DO MERCADO AGORA ===\n";

    if (btc) {
        ctx += `Bitcoin: $${btc.price.toFixed(0)} (${btc.change24h >= 0 ? '+' : ''}${btc.change24h.toFixed(2)}%)\n`;
    }

    if (fng) {
        const labels: Record<string, string> = {
            "Extreme Fear": "Medo Extremo", "Fear": "Medo", "Neutral": "Neutro",
            "Greed": "Ganância", "Extreme Greed": "Ganância Extrema"
        };
        ctx += `Fear & Greed: ${fng.value}/100 (${labels[fng.label] || fng.label})\n`;
    }

    if (movers.gainers.length > 0) {
        ctx += "\nTop Altas: " + movers.gainers.map(g => `${g.symbol} +${g.change.toFixed(1)}%`).join(", ") + "\n";
        ctx += "Top Quedas: " + movers.losers.map(l => `${l.symbol} ${l.change.toFixed(1)}%`).join(", ") + "\n";
    }

    if (tokens && tokens.length > 0) {
        ctx += "\nTokens monitorados pelo Gem Intel:\n";
        tokens.slice(0, 8).forEach((t: any) => {
            ctx += `- ${t.ticker}: $${t.current_price} (${t.change_24h >= 0 ? '+' : ''}${t.change_24h?.toFixed(2)}%) Score: ${t.score || 'N/A'} Status: ${t.status || 'N/A'}\n`;
        });
    }

    return ctx;
}

// ═══════════════════════════════════════════════════════
// CORE: AI Content Generation via OpenRouter
// ═══════════════════════════════════════════════════════

async function generateContent(
    apiKey: string,
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number = 300
): Promise<string | null> {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://gem-intel.app",
                "X-Title": "Gem-Intel-Community-Bots"
            },
            body: JSON.stringify({
                model: "anthropic/claude-3.5-sonnet",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.85,
                max_tokens: maxTokens,
            }),
        });

        if (!response.ok) {
            console.error("OpenRouter error:", response.status, await response.text().catch(() => ""));
            return null;
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (error) {
        console.error("AI generation error:", error);
        return null;
    }
}

// ═══════════════════════════════════════════════════════
// ACTION: Create Post
// ═══════════════════════════════════════════════════════

async function actionCreatePost(
    supabase: any,
    bot: any,
    marketContext: string,
    apiKey: string,
    recentPosts: any[]
): Promise<{ success: boolean; detail?: string }> {

    const postTypes = ['insight', 'analysis', 'question', 'alert_share'];
    const postType = pickRandom(postTypes);

    const postTypeInstructions: Record<string, string> = {
        'insight': 'Compartilhe uma observação ou opinião sobre o mercado. Pode ser sobre tendência, sentimento, ou uma moeda específica.',
        'analysis': 'Faça uma mini análise técnica ou fundamental de algum ativo. Mencione preços, indicadores ou padrões que você percebe.',
        'question': 'Faça uma pergunta sobre o mercado para gerar discussão. Pergunte sobre previsões, estratégias, ou opiniões sobre um ativo.',
        'alert_share': 'Compartilhe um alerta sobre uma movimentação importante, uma notícia de mercado, ou uma oportunidade que você percebe.',
    };

    // Build recent posts context so bot can interact
    let recentPostsCtx = "";
    if (recentPosts.length > 0) {
        recentPostsCtx = "\n\n=== POSTS RECENTES NA COMUNIDADE ===\n";
        recentPosts.slice(0, 5).forEach((p: any) => {
            recentPostsCtx += `- @${p.username || 'Anônimo'}: "${p.content?.slice(0, 120)}..."\n`;
        });
        recentPostsCtx += "\nVocê pode mencionar ou reagir a esses posts se quiser, mas não é obrigatório.";
    }

    const userPrompt = `${marketContext}${recentPostsCtx}

TIPO DE POST: ${postType}
INSTRUÇÃO: ${postTypeInstructions[postType]}

Agora gere UM post para a comunidade. Escreva APENAS o conteúdo do post, nada mais.
Use $TICKER quando mencionar moedas (ex: $BTC, $ETH, $SOL).
O post deve ter entre 50 e 500 caracteres.
NÃO use markdown. NÃO use # ou **. Escreva como texto simples.
VARIE o tamanho — às vezes curto (50-100 chars), às vezes longo (200-500 chars).`;

    const content = await generateContent(apiKey, bot.personality_prompt, userPrompt, 400);
    if (!content) return { success: false, detail: "AI generation failed" };

    // Clean content (remove any markdown, quotes, etc.)
    const cleanContent = content
        .replace(/^["']|["']$/g, '')
        .replace(/^#+\s*/gm, '')
        .replace(/\*\*/g, '')
        .replace(/^\s*-\s*/gm, '')
        .trim();

    if (cleanContent.length < 10 || cleanContent.length > 1000) {
        return { success: false, detail: `Content length invalid: ${cleanContent.length}` };
    }

    const { data, error } = await supabase.rpc('bot_create_post', {
        p_bot_user_id: bot.user_id,
        p_content: cleanContent,
        p_post_type: postType,
    });

    if (error) {
        console.error("bot_create_post error:", error);
        return { success: false, detail: error.message };
    }

    return { success: true, detail: `Post created: "${cleanContent.slice(0, 60)}..."` };
}

// ═══════════════════════════════════════════════════════
// ACTION: Comment on Post
// ═══════════════════════════════════════════════════════

async function actionComment(
    supabase: any,
    bot: any,
    marketContext: string,
    apiKey: string,
    recentPosts: any[]
): Promise<{ success: boolean; detail?: string }> {

    if (recentPosts.length === 0) {
        return { success: false, detail: "No posts to comment on" };
    }

    // Pick a recent post that this bot hasn't commented on yet
    const { data: botComments } = await supabase
        .from('post_comments')
        .select('post_id')
        .eq('user_id', bot.user_id)
        .in('post_id', recentPosts.map((p: any) => p.id));

    const commentedPostIds = new Set((botComments || []).map((c: any) => c.post_id));
    const eligiblePosts = recentPosts.filter((p: any) => !commentedPostIds.has(p.id) && p.user_id !== bot.user_id);

    if (eligiblePosts.length === 0) {
        return { success: false, detail: "No eligible posts to comment on" };
    }

    const targetPost = pickRandom(eligiblePosts);

    const userPrompt = `${marketContext}

=== POST QUE VOCÊ VAI COMENTAR ===
Autor: @${targetPost.username || 'Anônimo'} (Level ${targetPost.level || 1})
Conteúdo: "${targetPost.content}"
Likes: ${targetPost.likes_count || 0} | Comentários: ${targetPost.comments_count || 0}

Agora gere UM comentário natural para esse post. Escreva APENAS o comentário.
- Reaja ao que a pessoa disse
- Pode concordar, discordar, complementar, ou fazer uma pergunta
- Seja natural e conversacional
- Pode usar emojis com moderação
- O comentário deve ter entre 20 e 300 caracteres
- NÃO use markdown. Escreva como texto simples.
- NÃO comece com "Ótimo post!" ou frases genéricas. Seja específico.`;

    const content = await generateContent(apiKey, bot.personality_prompt, userPrompt, 250);
    if (!content) return { success: false, detail: "AI generation failed" };

    const cleanContent = content
        .replace(/^["']|["']$/g, '')
        .replace(/^#+\s*/gm, '')
        .replace(/\*\*/g, '')
        .trim();

    if (cleanContent.length < 5 || cleanContent.length > 500) {
        return { success: false, detail: `Comment length invalid: ${cleanContent.length}` };
    }

    const { data, error } = await supabase.rpc('bot_add_comment', {
        p_bot_user_id: bot.user_id,
        p_post_id: targetPost.id,
        p_content: cleanContent,
    });

    if (error) {
        console.error("bot_add_comment error:", error);
        return { success: false, detail: error.message };
    }

    return { success: true, detail: `Commented on post by @${targetPost.username}: "${cleanContent.slice(0, 50)}..."` };
}

// ═══════════════════════════════════════════════════════
// ACTION: Like Posts
// ═══════════════════════════════════════════════════════

async function actionLike(
    supabase: any,
    bot: any,
    recentPosts: any[]
): Promise<{ success: boolean; detail?: string }> {

    if (recentPosts.length === 0) {
        return { success: false, detail: "No posts to like" };
    }

    // Like 1-3 random posts
    const numLikes = randomInt(1, Math.min(3, recentPosts.length));
    const shuffled = [...recentPosts].sort(() => Math.random() - 0.5);
    const toLike = shuffled.slice(0, numLikes);
    let liked = 0;

    for (const post of toLike) {
        const { error } = await supabase.rpc('bot_toggle_like', {
            p_bot_user_id: bot.user_id,
            p_post_id: post.id,
        });
        if (!error) liked++;
    }

    return { success: liked > 0, detail: `Liked ${liked} posts` };
}

// ═══════════════════════════════════════════════════════
// ACTION: Follow Users
// ═══════════════════════════════════════════════════════

async function actionFollow(
    supabase: any,
    bot: any
): Promise<{ success: boolean; detail?: string }> {

    // Find users the bot is not following yet
    const { data: allUsers } = await supabase
        .from('profiles')
        .select('id, username')
        .neq('id', bot.user_id)
        .limit(50);

    if (!allUsers || allUsers.length === 0) {
        return { success: false, detail: "No users to follow" };
    }

    const { data: alreadyFollowing } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', bot.user_id);

    const followingIds = new Set((alreadyFollowing || []).map((f: any) => f.following_id));
    const eligible = allUsers.filter((u: any) => !followingIds.has(u.id));

    if (eligible.length === 0) {
        return { success: false, detail: "Already following everyone" };
    }

    const target = pickRandom(eligible);
    const { error } = await supabase.rpc('bot_follow_user', {
        p_bot_user_id: bot.user_id,
        p_target_user_id: target.id,
    });

    if (error) {
        console.error("bot_follow_user error:", error);
        return { success: false, detail: error.message };
    }

    return { success: true, detail: `Followed @${target.username || target.id}` };
}

// ═══════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Verify authorization (must be service role or admin)
        const authHeader = req.headers.get("Authorization");
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        // Accept either service_role key directly or a valid admin token
        const token = authHeader?.replace("Bearer ", "") || "";
        const isServiceRole = token === serviceRoleKey;

        // Create service client (always needed for bot operations)
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            serviceRoleKey
        );

        // Parse request body
        let body: any = {};
        try { body = await req.json(); } catch { /* no body is fine */ }

        // MODO CRON/SCRIPT LOCAL: Se a requisição enviar a chave do OpenRouter no body,
        // consideramos autorizada (ignora verificação de header Bearer)
        if (body.openrouter_api_key && body.openrouter_api_key.startsWith('sk-or-v')) {
            // Bypass auth
            console.log("Authorized via payload API key");
        } else {
            // Verificação normal de cabeçalho
            if (!isServiceRole && authHeader) {
                const userClient = createClient(
                    Deno.env.get("SUPABASE_URL")!,
                    Deno.env.get("SUPABASE_ANON_KEY")!,
                    { global: { headers: { Authorization: authHeader } } }
                );
                const { data: { user } } = await userClient.auth.getUser(token);
                if (!user) {
                    return new Response(JSON.stringify({ error: "Unauthorized" }), {
                        status: 401,
                        headers: { ...corsHeaders, "Content-Type": "application/json" }
                    });
                }
                // Check if admin
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (profile?.role !== 'admin') {
                    return new Response(JSON.stringify({ error: "Admin access required" }), {
                        status: 403,
                        headers: { ...corsHeaders, "Content-Type": "application/json" }
                    });
                }
            } else if (!isServiceRole) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
        }

        const action = body.action || "generate_activity";
        const OPENROUTER_API_KEY = body.openrouter_api_key || Deno.env.get("OPENROUTER_API_KEY");

        if (!OPENROUTER_API_KEY) {
            return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // ─── Action: Get Stats ───
        if (action === "get_stats") {
            const { data: stats } = await supabase.rpc('get_bot_stats');

            // Get individual bot info
            const { data: bots } = await supabase
                .from('bot_profiles')
                .select(`
          id, persona_name, persona_style, is_active, topics,
          user_id, profiles!bot_profiles_user_id_fkey (username, avatar_url, level, xp, posts_count)
        `)
                .order('persona_name');

            return new Response(JSON.stringify({ stats, bots }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // ─── Action: Toggle Bot ───
        if (action === "toggle_bot") {
            const { bot_id, is_active } = body;
            if (!bot_id) {
                return new Response(JSON.stringify({ error: "bot_id required" }), {
                    status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
            await supabase.from('bot_profiles').update({ is_active }).eq('id', bot_id);
            return new Response(JSON.stringify({ success: true }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // ─── Action: Generate Activity (main bot engine) ───
        if (action === "generate_activity") {
            const now = new Date();
            const currentHour = now.getUTCHours() - 3; // BRT = UTC-3
            const adjustedHour = currentHour < 0 ? currentHour + 24 : currentHour;

            console.log(`🤖 Bot Engine running at ${adjustedHour}:00 BRT`);

            // Get active bots within their active hours
            const { data: activeBots, error: botsError } = await supabase
                .from('bot_profiles')
                .select('*, profiles!bot_profiles_user_id_fkey (username, avatar_url, level)')
                .eq('is_active', true)
                .lte('active_hours_start', adjustedHour)
                .gte('active_hours_end', adjustedHour);

            if (botsError || !activeBots || activeBots.length === 0) {
                console.log("No active bots found for current hour:", adjustedHour);
                return new Response(JSON.stringify({
                    message: "No active bots for this hour",
                    hour: adjustedHour,
                    error: botsError?.message
                }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }

            console.log(`Found ${activeBots.length} active bots`);

            // Check cooldown — select bots that haven't acted recently
            const eligibleBots = [];
            for (const bot of activeBots) {
                const { data: lastAction } = await supabase
                    .from('bot_activity_log')
                    .select('created_at')
                    .eq('bot_profile_id', bot.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (!lastAction) {
                    eligibleBots.push(bot);
                    continue;
                }

                const lastActionTime = new Date(lastAction.created_at).getTime();
                const cooldownMs = randomInt(bot.posting_frequency_min, bot.posting_frequency_max) * 60 * 1000;
                if (Date.now() - lastActionTime > cooldownMs) {
                    eligibleBots.push(bot);
                }
            }

            if (eligibleBots.length === 0) {
                return new Response(JSON.stringify({ message: "All bots in cooldown" }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }

            // Select 1-3 bots to act
            const numBots = Math.min(randomInt(1, 3), eligibleBots.length);
            const selectedBots = [...eligibleBots].sort(() => Math.random() - 0.5).slice(0, numBots);

            // Fetch shared context
            const marketContext = await buildMarketContext(supabase);

            // Get recent posts for interaction
            const { data: recentPosts } = await supabase
                .from('posts')
                .select('id, user_id, content, post_type, likes_count, comments_count, created_at, username:profiles!posts_user_id_fkey(username, level)')
                .order('created_at', { ascending: false })
                .limit(20);

            // Flatten the username join
            const flatPosts = (recentPosts || []).map((p: any) => ({
                ...p,
                username: p.username?.username || 'Anônimo',
                level: p.username?.level || 1,
            }));

            const results = [];

            for (const bot of selectedBots) {
                // Decide action with weighted randomness
                const actionType = weightedRandom([
                    { action: 'post', weight: 50 },
                    { action: 'comment', weight: 30 },
                    { action: 'like', weight: 15 },
                    { action: 'follow', weight: 5 },
                ]);

                console.log(`Bot @${bot.profiles?.username || bot.persona_name} → ${actionType}`);

                let result;
                switch (actionType) {
                    case 'post':
                        result = await actionCreatePost(supabase, bot, marketContext, OPENROUTER_API_KEY, flatPosts);
                        break;
                    case 'comment':
                        result = await actionComment(supabase, bot, marketContext, OPENROUTER_API_KEY, flatPosts);
                        break;
                    case 'like':
                        result = await actionLike(supabase, bot, flatPosts);
                        break;
                    case 'follow':
                        result = await actionFollow(supabase, bot);
                        break;
                    default:
                        result = { success: false, detail: "Unknown action" };
                }

                results.push({
                    bot: bot.persona_name,
                    username: bot.profiles?.username,
                    action: actionType,
                    ...result,
                });
            }

            console.log("🤖 Bot Engine results:", JSON.stringify(results, null, 2));

            return new Response(JSON.stringify({
                success: true,
                timestamp: now.toISOString(),
                hour_brt: adjustedHour,
                bots_acted: results.length,
                results,
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("🤖 Bot Engine error:", error);
        return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});
