import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    console.log("Fetching profiles with avatar_url...");
    const { data: profiles } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .not('avatar_url', 'is', null)
        .limit(10);
    console.log("Profiles:", Object.fromEntries(profiles.map(p => [p.username, p.avatar_url])));

    console.log("\nFetching tokens with image...");
    const { data: tokens } = await supabase
        .from('tokens')
        .select('ticker, icon_url, name')
        .limit(5);
    console.log("Tokens:", tokens);
}

main().catch(console.error);
