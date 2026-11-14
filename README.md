# refúgio.

**Um lugar para sua alma descansar.**

O Refúgio é uma plataforma web cristã, gratuita e solidária: um espaço de fé, esperança e acolhimento para encontrar conforto nas Escrituras, conversar com Deus e fortalecer a jornada espiritual.

- **Palavra do dia**: passagem bíblica, reflexão, aplicação prática e oração, com histórico.
- **Preciso de uma palavra**: dez estados do coração ("Estou triste", "Preciso de paz"...), cada um com passagem, contexto, reflexão, esperança, oração e leituras complementares.
- **Bíblia completa** em português (Bíblia Livre), com navegação por livro e capítulo, além de salvar, copiar e compartilhar trechos.
- **Diário de oração** privado, com categorias, marcadores, filtros por período, edição e exclusão.
- **Planos de leitura** (8 jornadas iniciais) com progresso individual, sem rankings e sem cobrança.
- **Meu espaço**: planos iniciados, versículos salvos, reflexões favoritas, objetivos pessoais e atividade recente.
- **Ajude o Refúgio a crescer**: feedback sem cadastro, com limite de envios.
- **Painel administrativo** para a equipe publicar conteúdo e ler feedbacks.
- **PWA instalável** (opcional), com página offline. Mobile em primeiro lugar, modo claro e escuro.

> Sem assinaturas, anúncios, paywalls ou venda de dados. Todas as funcionalidades são gratuitas, para sempre.

---

## Tecnologias

| Camada | Escolha |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS 4, com tokens de design em `src/styles/globals.css` |
| Dados e autenticação | Supabase (PostgreSQL, Auth, Row Level Security) |
| Formulários | React Hook Form + Zod (validação no cliente **e** no servidor) |
| Ícones | Lucide React |
| Testes | Vitest + Testing Library; pgTAP para RLS |
| Hospedagem | Vercel |

## Estrutura

```
src/
  app/                 Rotas (App Router). URLs em português: /biblia, /oracoes, /planos…
  actions/             Server Actions (mutações), sempre com Zod + verificação de sessão
  services/            Leitura de dados (conteúdo público, dados pessoais, painel)
  components/          UI por domínio: bible, prayer, reading-plans, admin, ui…
  content/             Conteúdo inicial original (devocionais, temas, planos)
  lib/
    bible/             Catálogo de livros, referências, leitura do texto
    supabase/          Clientes (servidor, navegador, público), guardas de acesso
    validations/       Schemas Zod compartilhados
  types/
data/bible/blivre/     Texto bíblico (um JSON por livro) + licença
supabase/
  migrations/          Migrations SQL versionadas (com RLS)
  seed.sql             Conteúdo inicial (gerado a partir de src/content)
  tests/rls.test.sql   Testes de permissões (pgTAP)
public/                Marca (SVG), ícones PWA, service worker
scripts/               Geração do texto bíblico, ícones e seed
tests/                 Testes automatizados
```

## Texto bíblico e direitos autorais

O Refúgio usa a **Bíblia Livre (BLIVRE)**, © Diego Santos, Mario Sérgio e Marco Teles, sob licença **Creative Commons Atribuição 4.0 Brasil**, obtida em <https://ebible.org/porbr2018/>. A atribuição aparece no rodapé, na página "Sobre" e em [`data/bible/blivre/LICENSE.md`](data/bible/blivre/LICENSE.md).

**Nenhum texto bíblico é digitado à mão.** Devocionais, temas e planos guardam apenas a **referência** (livro, capítulo, versículos), e o texto é sempre lido da fonte. Um teste automatizado verifica que todas as referências do conteúdo existem.

Para regenerar os arquivos a partir da fonte:

```bash
# baixe e extraia https://ebible.org/Scriptures/porbr2018_vpl.zip
npm run bible:build -- caminho/para/porbr2018_vpl.txt
```

---

## Instalação local

Requisitos: **Node.js 20.9+** (testado com Node 24) e npm.

```bash
git clone <url-do-repositorio> refugio
cd refugio
npm install
cp .env.example .env.local
npm run dev
```

Abra <http://localhost:3000>.

### Modo demonstração

Sem as variáveis do Supabase, o app funciona em **modo demonstração**, identificado por uma faixa no topo:

- todo o conteúdo público (Palavra do dia, Bíblia, temas, planos) funciona;
- contas, diário, progresso e feedback ficam **desativados**, com aviso claro. Nada finge ter sido salvo.

## Configuração do ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | sim (produção) | URL pública, usada em SEO, sitemap e links de e-mail |
| `NEXT_PUBLIC_SUPABASE_URL` | para contas | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | para contas | Chave pública (anon). A segurança vem do RLS |
| `RATE_LIMIT_SALT` | recomendada | Segredo para gerar hash não reversível do IP no limite de feedback |
| `NEXT_PUBLIC_CONTACT_EMAIL` | recomendada | E-mail para assuntos de privacidade (LGPD), exibido na política |

A aplicação **não usa** a chave `service_role`. Nunca a coloque em variáveis `NEXT_PUBLIC_*`.

## Configuração do Supabase

1. Crie um projeto em <https://supabase.com>.
2. **Aplique as migrations**, em ordem, de uma destas formas:
   - **CLI:** `npx supabase link --project-ref <ref>` e depois `npx supabase db push`;
   - **SQL Editor:** execute cada arquivo de `supabase/migrations/` na ordem do nome.
3. **Carregue o conteúdo inicial**: execute `supabase/seed.sql` no SQL Editor (é idempotente). Ele publica a 1ª Palavra do dia com a data de hoje e as demais nos dias anteriores.
4. **Auth → URL Configuration:**
   - *Site URL*: a URL do site (ex.: `https://refugio.app`);
   - *Redirect URLs*: `https://SEU-DOMINIO/auth/confirmar` (e `http://localhost:3000/auth/confirmar` para desenvolvimento).
5. **Auth → Providers → Email:** mantenha "Confirm email" ativado. Os modelos de e-mail padrão funcionam sem alteração.
6. Copie *Project URL* e *anon key* (Project Settings → API) para `.env.local`.
7. **Defina o primeiro administrador.** Crie sua conta pelo site e rode no SQL Editor:

   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'seu-email@exemplo.com');
   ```

   Papéis: `user` (padrão), `editor` (publica conteúdo) e `admin` (também gerencia papéis e moderação). Um usuário não consegue alterar o próprio papel: um gatilho no banco impede.

### Modelo de dados e segurança

| Tabela | Acesso |
| --- | --- |
| `profiles` | cada pessoa lê e edita o próprio perfil; papel protegido por gatilho |
| `daily_devotionals`, `reflections`, `reading_plans`, `reading_plan_days`, `bible_verses` | público lê o **publicado** (agendados só a partir da data); equipe gerencia |
| `prayer_entries`, `saved_verses`, `favorite_reflections`, `spiritual_goals`, `reading_plan_enrollments`, `reading_progress`, `notifications` | **somente o dono**. Não há política para administradores |
| `feedbacks` | inserção apenas pela função `submit_feedback` (validação e limite de frequência); equipe lê |
| `churches`, `church_members`, `prayer_requests`, `testimonials`, `content_reports`, `user_blocks` | comunidade (arquitetura pronta): igreja só pública após verificação; compartilhamento exige consentimento (`consent_at`); moderação, denúncia e bloqueio |

A exclusão de conta (`delete_my_account()`) remove o usuário do Auth, e todas as tabelas pessoais são apagadas em cascata.

---

## Execução

```bash
npm run dev        # desenvolvimento
npm run build      # build de produção
npm start          # servidor de produção (após o build)
```

## Testes

```bash
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm test           # Vitest (unidade + componentes)
npm run check      # os três acima
```

Os testes cobrem: integridade de todas as referências bíblicas do conteúdo contra a fonte, leitura do texto, interpretação de referências, regras da Palavra do dia (sem conteúdo futuro ou rascunho), validações (diário, feedback, autenticação, painel), proteção contra redirecionamento externo, limite de requisições, proteção contra XSS na renderização de texto e navegação.

**Testes de RLS** (requerem Docker e Supabase CLI):

```bash
npx supabase start
npx supabase test db
```

O arquivo `supabase/tests/rls.test.sql` verifica, entre outros: visitante não vê rascunhos nem diários; um usuário não lê nem altera registros de outro; ninguém se promove a admin; feedback só entra pela função; nem a administração lê diários de oração; pedidos públicos exigem consentimento e entram como pendentes.

## Deploy na Vercel

1. Importe o repositório na Vercel (framework detectado: Next.js).
2. Em **Settings → Environment Variables**, cadastre as variáveis da tabela acima para *Production* (e *Preview*, se desejar).
3. Faça o deploy. Depois, configure o **domínio** em *Settings → Domains* e atualize `NEXT_PUBLIC_SITE_URL` e as URLs de Auth no Supabase.
4. Verificação final sugerida: cadastro e confirmação por e-mail, criação de registro no diário, marcação de leitura, envio de feedback, acesso ao `/admin` com e sem papel de equipe, e instalação como PWA no celular.

Recomendação: ative o **Vercel Firewall / Attack Challenge** para reforçar a proteção dos formulários públicos.

## PWA

- Manifest em `src/app/manifest.ts`, ícones em `public/icons` (gerados com `npm run icons:build`).
- Service worker em `public/sw.js`, registrado apenas em produção. Ele guarda **somente páginas públicas** e arquivos estáticos; nunca guarda rotas pessoais, administrativas ou de autenticação, nem respostas privadas. Sem conexão, mostra `/offline`.

## Identidade visual

Logotipo original: um abrigo (telhado) sobre uma luz amparada por mãos em concha, que representa proteção, presença e cuidado. Arquivos em `public/brand/` (`logo.svg`, `logo-light.svg`, `logo-dark.svg`, `icon.svg`, `mark.svg`) e `public/favicon.svg`.

Paleta: sálvia `#668773` (identidade), verde profundo `#34463B`, areia `#E9E4D7`, marfim `#F7F5EF`, branco, cinza neutro `#8C918A` e cinza escuro `#343F37`. Tipografia: Fraunces (títulos e Escrituras) e DM Sans (texto).

## Como contribuir

Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Licença

Código sob licença [MIT](LICENSE). Texto bíblico: Bíblia Livre, CC BY 4.0 (veja `data/bible/blivre/LICENSE.md`).
