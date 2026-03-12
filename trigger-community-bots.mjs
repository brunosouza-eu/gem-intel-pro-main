import { config } from 'dotenv';
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/community-bots`;

const MIN_INTERVAL_MS = 20 * 60 * 1000;
const MAX_INTERVAL_MS = 90 * 60 * 1000;
const RUN_ONCE = process.argv.includes('--once');

async function triggerBots() {
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    console.log(`\n[${now}] Triggering community bots...`);

    try {
        const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'generate_activity',
                openrouter_api_key: OPENROUTER_API_KEY
            }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`Success! ${data.bots_acted || 0} bots acted:`);
            if (data.results) {
                data.results.forEach((r) => {
                    const emoji = r.success ? 'OK' : 'FAIL';
                    console.log(`   ${emoji} @${r.username || r.bot} -> ${r.action}: ${r.detail || ''}`);
                });
            }
        } else {
            console.log(`Response: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

async function main() {
    console.log('Community Bots CRON Trigger');
    console.log(`URL: ${EDGE_FUNCTION_URL}`);
    console.log(`Interval: ${MIN_INTERVAL_MS / 60000}-${MAX_INTERVAL_MS / 60000} minutes`);
    console.log(`Mode: ${RUN_ONCE ? 'Single run' : 'Continuous loop'}`);

    await triggerBots();

    if (RUN_ONCE) {
        console.log('\nSingle run complete. Exiting.');
        process.exit(0);
    }

    function scheduleNext() {
        const delay = Math.floor(Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS)) + MIN_INTERVAL_MS;
        const minutes = (delay / 60000).toFixed(1);
        console.log(`\nNext trigger in ${minutes} minutes...`);

        setTimeout(async () => {
            await triggerBots();
            scheduleNext();
        }, delay);
    }

    scheduleNext();
}

main().catch(console.error);
