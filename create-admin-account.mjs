import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://bgtovevdkxvfnyyzjdnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndG92ZXZka3h2Zm55eXpqZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDg3MjYsImV4cCI6MjA4MzcyNDcyNn0.KWHZq9LnGFcHf2rCZVbMypZsb8RaIDjAnrFHxtYji0k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminAccount() {
    const email = 'admin@gemintel.com';
    const password = '@Bruno123';

    console.log('🚀 Criando conta de administrador...');
    console.log(`📧 Email: ${email}`);
    console.log(`🔐 Senha: ${password}`);
    console.log('');

    try {
        // 1. Criar conta de usuário
        console.log('📝 Passo 1: Criando conta de usuário no Supabase...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    language: 'pt'
                },
                emailRedirectTo: 'http://localhost:8080/dashboard'
            }
        });

        if (signUpError) {
            if (signUpError.message.includes('already registered') || signUpError.message.includes('User already registered')) {
                console.log('⚠️  Usuário já existe. Tentando fazer login...');

                // Tentar fazer login
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (signInError) {
                    console.error('❌ Erro ao fazer login:', signInError.message);
                    console.log('\n💡 Dica: Se a senha estiver incorreta, você pode:');
                    console.log('1. Usar um email diferente');
                    console.log('2. Resetar a senha desta conta');
                    console.log('3. Deletar a conta no Supabase Dashboard e criar novamente');
                    return {
                        success: false,
                        error: signInError.message
                    };
                }

                console.log('✅ Login realizado com sucesso!');
                console.log(`👤 User ID: ${signInData.user.id}`);

                // Verificar se já é admin
                const { data: existingRole } = await supabase
                    .from('user_roles')
                    .select('*')
                    .eq('user_id', signInData.user.id)
                    .eq('role', 'admin')
                    .maybeSingle();

                if (existingRole) {
                    console.log('✅ Usuário já possui permissões de administrador!');
                    console.log('\n🎉 Tudo pronto! Você pode fazer login com:');
                    console.log(`   Email: ${email}`);
                    console.log(`   Senha: ${password}`);
                    console.log(`   URL: http://localhost:8080/auth`);
                    return {
                        success: true,
                        userId: signInData.user.id,
                        message: 'Usuário já existe e já é administrador'
                    };
                }

                console.log('\n👑 Adicionando permissões de administrador...');
                console.log('⚠️  Execute o seguinte SQL no Supabase Dashboard:');
                console.log('\n--- COPIE E EXECUTE NO SUPABASE SQL EDITOR ---');
                console.log(`INSERT INTO public.user_roles (user_id, role) VALUES ('${signInData.user.id}', 'admin');`);
                console.log('--- FIM DO SQL ---\n');

                return {
                    success: true,
                    userId: signInData.user.id,
                    needsManualAdminGrant: true,
                    message: 'Conta existe. Execute o SQL acima para conceder permissões de admin.'
                };
            } else {
                throw signUpError;
            }
        }

        console.log('✅ Conta criada com sucesso!');
        console.log(`👤 User ID: ${signUpData.user?.id}`);

        if (signUpData.user?.identities?.length === 0) {
            console.log('⚠️  Email já confirmado anteriormente.');
        } else {
            console.log('📧 Email de confirmação enviado. Verifique sua caixa de entrada.');
            console.log('   (Para desenvolvimento local, você pode pular a confirmação)');
        }

        // Aguardar um pouco para o trigger criar o profile
        console.log('\n⏳ Aguardando criação do perfil...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Adicionar role de admin
        console.log('\n👑 Passo 2: Concedendo permissões de administrador...');
        console.log('⚠️  Execute o seguinte SQL no Supabase Dashboard:');
        console.log('\n--- COPIE E EXECUTE NO SUPABASE SQL EDITOR ---');
        console.log(`INSERT INTO public.user_roles (user_id, role) VALUES ('${signUpData.user?.id}', 'admin');`);
        console.log('--- FIM DO SQL ---\n');

        console.log('📍 Como adicionar a role de admin:');
        console.log('1. Acesse: https://supabase.com/dashboard/project/bgtovevdkxvfnyyzjdnb/sql/new');
        console.log('2. Cole o SQL acima');
        console.log('3. Clique em "Run" ou pressione Ctrl+Enter');
        console.log('4. Faça login na aplicação: http://localhost:8080/auth');
        console.log('');

        return {
            success: true,
            userId: signUpData.user?.id,
            needsManualAdminGrant: true,
            email: email,
            password: password,
            message: 'Conta criada! Execute o SQL acima para conceder permissões de admin.'
        };

    } catch (error) {
        console.error('❌ Erro:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Executar
createAdminAccount().then(result => {
    console.log('\n📊 Resultado final:');
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
        console.log('\n✅ Processo concluído com sucesso!');
        if (result.needsManualAdminGrant) {
            console.log('⚠️  Não esqueça de executar o SQL no Supabase para adicionar permissões de admin.');
        }
    } else {
        console.log('\n❌ Processo falhou. Verifique os erros acima.');
    }

    process.exit(result.success ? 0 : 1);
});
