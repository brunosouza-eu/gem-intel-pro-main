import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://bgtovevdkxvfnyyzjdnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndG92ZXZka3h2Zm55eXpqZG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDg3MjYsImV4cCI6MjA4MzcyNDcyNn0.KWHZq9LnGFcHf2rCZVbMypZsb8RaIDjAnrFHxtYji0k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminAccount() {
    const email = 'ipcompanidigital@gmail.com';
    const password = '@Bruno123';

    console.log('🚀 Iniciando criação de conta de administrador...');
    console.log(`📧 Email: ${email}`);

    try {
        // 1. Criar conta de usuário
        console.log('\n📝 Passo 1: Criando conta de usuário...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    language: 'pt'
                }
            }
        });

        if (signUpError) {
            if (signUpError.message.includes('already registered') || signUpError.message.includes('User already registered')) {
                console.log('⚠️  Usuário já existe.');
                console.log('\n📧 Solicitando reset de senha...');

                // Solicitar reset de senha
                const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: 'http://localhost:8080/update-password'
                });

                if (resetError) {
                    console.error('❌ Erro ao solicitar reset:', resetError.message);
                } else {
                    console.log('✅ Email de reset de senha enviado!');
                    console.log('📧 Verifique o email e redefina a senha para: @Bruno123');
                }

                console.log('\n⚠️  INSTRUÇÕES MANUAIS:');
                console.log('1. Verifique o email ipcompanidigital@gmail.com');
                console.log('2. Clique no link de reset de senha');
                console.log('3. Defina a nova senha como: @Bruno123');
                console.log('4. Faça login na aplicação com as novas credenciais');
                console.log('5. Acesse o Supabase Dashboard para adicionar a role de admin manualmente');
                console.log('\nSQL para adicionar admin (execute no Supabase SQL Editor):');
                console.log('SELECT id, email FROM auth.users WHERE email = \'ipcompanidigital@gmail.com\';');
                console.log('-- Copie o ID retornado e execute:');
                console.log('INSERT INTO public.user_roles (user_id, role) VALUES (\'<USER_ID_AQUI>\', \'admin\');');

                return {
                    success: false,
                    needsPasswordReset: true,
                    message: 'Usuário já existe. Email de reset de senha enviado.'
                };
            } else {
                throw signUpError;
            }
        }

        console.log('✅ Conta criada com sucesso!');
        console.log(`👤 User ID: ${signUpData.user.id}`);
        console.log('📧 Verifique seu email para confirmar a conta.');

        // Aguardar um pouco para o trigger criar o profile
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Adicionar role de admin
        console.log('\n👑 Passo 2: Concedendo permissões de administrador...');
        console.log('⚠️  ATENÇÃO: Para adicionar a role de admin, execute o seguinte SQL no Supabase:');
        console.log('\n--- SQL PARA EXECUTAR NO SUPABASE ---');
        console.log(`INSERT INTO public.user_roles (user_id, role) VALUES ('${signUpData.user.id}', 'admin');`);
        console.log('--- FIM DO SQL ---\n');

        return {
            success: true,
            userId: signUpData.user.id,
            needsManualAdminGrant: true,
            message: 'Conta criada com sucesso! Execute o SQL acima no Supabase para conceder permissões de admin.'
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
    process.exit(result.success ? 0 : 1);
});
