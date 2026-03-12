import { createClient } from '@supabase/supabase-js';

// Quick script to add credits to your account
// Run with: npx tsx add-credits-local.ts

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addCredits(email: string, amount: number) {
    try {
        // Get user ID from email
        const { data: users, error: userError } = await supabase
            .from('user_profiles')
            .select('id, credits')
            .eq('id', (await supabase.auth.getUser()).data.user?.id)
            .single();

        if (userError || !users) {
            console.error('Error finding user:', userError);
            return;
        }

        console.log(`Current balance: ${users.credits} credits`);

        // Add credits
        const { data, error } = await supabase
            .from('user_profiles')
            .update({ credits: users.credits + amount })
            .eq('id', users.id)
            .select();

        if (error) {
            console.error('Error adding credits:', error);
            return;
        }

        console.log(`✅ Added ${amount} credits!`);
        console.log(`New balance: ${users.credits + amount} credits`);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Usage: Replace with your email and desired amount
addCredits('souzadecarvalho1988@gmail.com', 100);
