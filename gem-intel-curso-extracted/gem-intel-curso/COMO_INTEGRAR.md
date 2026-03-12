# Trade Master Pro — Integração no Gem Intel
## Guia de Integração Passo a Passo

---

## 📁 Estrutura dos Arquivos

```
gem-intel-curso/
├── app/
│   ├── biblioteca/
│   │   └── trade-master-pro/
│   │       ├── page.tsx                  ← Página inicial do curso
│   │       └── [modulo]/[aula]/
│   │           └── page.tsx              ← Player de aula
│   └── api/
│       └── webhooks/
│           └── hotmart/
│               └── route.ts             ← Recebe pagamentos da Hotmart
├── components/
│   └── curso/
│       ├── CoursePlayer.tsx             ← Player Panda Video + progresso
│       └── CourseSidebar.tsx            ← Sidebar de navegação do curso
├── lib/
│   ├── curso-data.ts                    ← Estrutura das 37 aulas
│   └── curso-progress.ts               ← Funções Supabase
├── types/
│   └── curso.ts                         ← TypeScript types
├── supabase/
│   └── migration_curso.sql             ← Crie as tabelas no Supabase
└── middleware.ts                        ← Proteção de rotas (MESCLAR)
```

---

## 🚀 Passos de Integração

### 1. Copiar os arquivos
```bash
# Na raiz do projeto Gem Intel:
cp -r gem-intel-curso/app/biblioteca ./app/
cp -r gem-intel-curso/app/api/webhooks ./app/api/
cp -r gem-intel-curso/components/curso ./components/
cp gem-intel-curso/lib/curso-data.ts ./lib/
cp gem-intel-curso/lib/curso-progress.ts ./lib/
cp gem-intel-curso/types/curso.ts ./types/
```

### 2. Rodar a migration no Supabase
1. Acesse: **Supabase Dashboard → SQL Editor**
2. Cole o conteúdo de `supabase/migration_curso.sql`
3. Execute (Run)

### 3. Configurar variáveis de ambiente
No `.env.local` (já deve ter as Supabase, apenas adicione):
```env
# Hotmart webhook — gere em: Hotmart > Ferramentas > Webhooks
HOTMART_WEBHOOK_TOKEN=seu_token_secreto_hotmart
```

### 4. Configurar Panda Video
Em `components/curso/CoursePlayer.tsx`, linha 17:
```ts
// Substitua pelo seu Player ID do painel Panda Video
const PANDA_PLAYER_BASE = 'https://player-vz-XXXX.tv.pandavideo.com.br/embed/'
```
Para cada aula, no `lib/curso-data.ts`, preencha o `videoId`:
```ts
{ id: 'a1', videoId: 'abc123def456', ... }
```

### 5. Mesclar o middleware
Abra seu `middleware.ts` atual e copie o **BLOCO CURSO** do arquivo
`gem-intel-curso/middleware.ts`. Adicione dentro da sua função `middleware()`
existente e atualize o `matcher` para incluir a rota do curso.

### 6. Adicionar o curso no menu Biblioteca
No componente de sidebar do Gem Intel, adicione o link:
```tsx
<SidebarItem
  href="/biblioteca/trade-master-pro"
  icon={<BookIcon />}
  label="Trade Master Pro"
  badge="NOVO"
/>
```

### 7. Configurar webhook na Hotmart
1. Hotmart Dashboard → **Ferramentas → Webhooks**
2. URL: `https://gem-intel-pro-main.vercel.app/api/webhooks/hotmart`
3. Eventos: `PURCHASE_COMPLETE`, `PURCHASE_REFUNDED`
4. Token: o mesmo que você colocou no `.env`

---

## 💰 Fluxo de Venda

```
Aluno compra na Hotmart
        ↓
Hotmart dispara webhook POST /api/webhooks/hotmart
        ↓
Backend busca o user pelo email → insere em curso_compras
        ↓
Middleware libera acesso à rota /biblioteca/trade-master-pro/*
        ↓
Aluno acessa e assiste as aulas dentro do Gem Intel
```

---

## 🎬 Adicionar os Vídeos

1. Faça upload dos vídeos no **Panda Video** (pandavideo.com.br)
2. Cada vídeo gera um ID — ex: `7f3a9b2c1d`
3. Abra `lib/curso-data.ts` e preencha o campo `videoId` de cada aula
4. O progresso é salvo automaticamente a cada 15s

---

## 📊 Ver Progresso dos Alunos (Admin)

Query útil no Supabase SQL Editor:
```sql
SELECT
  p.email,
  COUNT(*) FILTER (WHERE pa.concluida) AS aulas_concluidas,
  ROUND(COUNT(*) FILTER (WHERE pa.concluida)::NUMERIC / 37 * 100) AS pct
FROM progresso_aulas pa
JOIN auth.users u ON u.id = pa.user_id
JOIN profiles p ON p.id = pa.user_id
WHERE pa.curso_slug = 'trade-master-pro'
GROUP BY p.email
ORDER BY pct DESC;
```

---

## ✅ Checklist Final

- [ ] Arquivos copiados para o projeto
- [ ] Migration SQL executada no Supabase
- [ ] `HOTMART_WEBHOOK_TOKEN` no `.env`
- [ ] Panda Video Player ID configurado
- [ ] VideoIds das aulas preenchidos em `curso-data.ts`
- [ ] Middleware mesclado
- [ ] Link adicionado no menu Biblioteca
- [ ] Webhook configurado na Hotmart
- [ ] Deploy feito no Vercel (`git push`)
- [ ] Teste de compra com cartão de teste da Hotmart
