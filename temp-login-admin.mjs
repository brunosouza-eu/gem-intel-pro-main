import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (mesma do arquivo original)
const supabaseUrl = 'https://bgtovevdkxvfnyyzjdnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndG92ZXZka3h2Zm55eXpqZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDg3MjYsImV4cCI6MjA4MzcyNDcyNn0.KWHZq9LnGFcHf2rCZVbMypZsb8RaIDjAnrFHxtYji0k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogin() {
    const email = 'ipcompanidigital@gmail.com';
    const password = '@Bruno123';

    console.log(`🔍 Verificando login para: ${email}`);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) {
        console.error('❌ Erro no login:', signInError.message);
        return;
    }

    console.log('✅ Login bem-sucedido!');
    console.log(`👤 User ID: ${signInData.user.id}`);

    // Verificar role
    /* // Com anon key provavelmente não conseguimos ler user_roles se não tiver policy pública
    const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', signInData.user.id);
    
    if (roleError) {
        console.log('⚠️  Não foi possível verificar roles (provavelmente permissão RLS), mas o ID foi recuperado.');
    } else {
        console.log('Roles:', roles);
    }
    */

    console.log('\n--- SQL PARA DAR ADMIN ---');
    console.log(`INSERT INTO public.user_roles (user_id, role) VALUES ('${signInData.user.id}', 'admin');`);
    console.log('--- FIM DO SQL ---');
}

checkLogin();
