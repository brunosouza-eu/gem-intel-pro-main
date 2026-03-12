import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const BUCKET_NAME = 'avatars';

// Mapping: persona_name -> { username, display_name, avatar_file_prefix }
const BOT_UPDATES = {
    'CryptoMarcus': {
        username: 'marcus.silva',
        display_name: 'Marcus Silva',
        avatar_prefix: 'real_marcus'
    },
    'LunaTrader': {
        username: 'luna.oliveira',
        display_name: 'Luna Oliveira',
        avatar_prefix: 'real_luna'
    },
    'BitSage': {
        username: 'roberto.mendes',
        display_name: 'Roberto Mendes',
        avatar_prefix: 'real_bitsage'
    },
    'NeuroCrypto': {
        username: 'andre.nakamura',
        display_name: 'André Nakamura',
        avatar_prefix: 'real_neuro'
    },
    'DeFiQueen': {
        username: 'beatriz.correa',
        display_name: 'Beatriz Corrêa',
        avatar_prefix: 'real_defiqueen'
    },
    'SatoshiJr': {
        username: 'gabriel.santos',
        display_name: 'Gabriel Santos',
        avatar_prefix: 'real_satoshi'
    },
    'AltHunter': {
        username: 'felipe.duarte',
        display_name: 'Felipe Duarte',
        avatar_prefix: 'real_althunter'
    },
    'BlockchainDev': {
        username: 'thiago.ribeiro',
        display_name: 'Thiago Ribeiro',
        avatar_prefix: 'real_blockdev'
    },
    'CryptoMãe': {
        username: 'marcia.ferreira',
        display_name: 'Márcia Ferreira',
        avatar_prefix: 'real_cryptomae'
    },
    'TradingNinja': {
        username: 'rafael.costa',
        display_name: 'Rafael Costa',
        avatar_prefix: 'real_ninja'
    }
};

async function run() {
    const artifactDir = 'C:\\Users\\Windows\\.gemini\\antigravity\\brain\\9939af29-4c70-4d21-80d8-b0240e59408a';
    const dirFiles = fs.readdirSync(artifactDir);

    for (const [personaName, info] of Object.entries(BOT_UPDATES)) {
        console.log(`\nProcessing ${personaName} -> ${info.display_name}...`);

        // Get user_id from bot_profiles
        const { data: bots } = await supabase
            .from('bot_profiles')
            .select('user_id')
            .eq('persona_name', personaName);

        if (!bots || bots.length === 0) {
            console.log(`  Bot profile not found for ${personaName}`);
            continue;
        }

        const userId = bots[0].user_id;

        // Find the avatar file
        const avatarFile = dirFiles.find(f => f.startsWith(info.avatar_prefix) && f.endsWith('.png'));

        let avatarUrl = null;

        if (avatarFile) {
            const avatarPath = path.join(artifactDir, avatarFile);
            const fileContent = fs.readFileSync(avatarPath);
            const cleanName = info.username.replace(/[^a-z0-9-]/g, '');
            const storagePath = `bots/${cleanName}.png`;

            console.log(`  Uploading ${avatarFile} to ${storagePath}...`);

            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(storagePath, fileContent, { upsert: true, contentType: 'image/png' });

            if (uploadError) {
                console.error(`  Upload error:`, uploadError.message);
            } else {
                const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
                avatarUrl = urlData.publicUrl;
                console.log(`  Avatar URL: ${avatarUrl}`);
            }
        } else {
            console.log(`  No new avatar file found for prefix "${info.avatar_prefix}", keeping existing.`);
        }

        // Update profile with new username + avatar
        const updateData = {
            username: info.username,
        };

        if (avatarUrl) {
            updateData.avatar_url = avatarUrl;
        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId);

        if (updateError) {
            console.error(`  Profile update error:`, updateError.message);
        } else {
            console.log(`  ✅ Updated profile: ${info.display_name} (@${info.username})`);
        }
    }

    console.log('\n🎉 All bots updated with Brazilian names and ultra-realistic avatars!');
}

run().catch(console.error);
