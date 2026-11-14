# Como contribuir com o Refúgio

Obrigado por querer ajudar! O Refúgio é um projeto solidário. Toda contribuição deve servir às pessoas que buscam acolhimento.

## Princípios inegociáveis

Não serão aceitas contribuições que introduzam:

- assinaturas, anúncios, paywalls, planos premium ou compras;
- rastreadores de terceiros, monetização ou compartilhamento de dados pessoais;
- rankings, competição espiritual ou mecanismos de culpa para trazer o usuário de volta;
- acesso administrativo ao diário de oração;
- texto bíblico protegido por direitos autorais.

## Conteúdo

- **Texto bíblico nunca é digitado à mão.** Use apenas referências (livro, capítulo, versículos); o app lê o texto da Bíblia Livre.
- Antes de citar uma passagem numa reflexão, leia o texto na tradução usada (`/biblia/<livro>/<capitulo>`).
- O tom deve ser acolhedor, simples, respeitoso entre tradições cristãs e sem julgamentos.
- Não prometa curas ou resultados de orações. Não diagnostique. Em temas sensíveis, mantenha o lembrete de ajuda humana.
- Ao alterar `src/content`, rode `npm run seed:build` para atualizar `supabase/seed.sql`.

## Fluxo de desenvolvimento

1. Crie um branch a partir de `main`: `git checkout -b feat/minha-melhoria`.
2. Rode o projeto localmente (veja o README). O modo demonstração dispensa o Supabase para a maior parte da interface.
3. Antes de abrir o PR, rode:

   ```bash
   npm run check   # typecheck + lint + testes
   npm run build
   ```

4. Mudanças no banco entram como **nova migration** em `supabase/migrations/` (nunca edite uma migration já aplicada). Toda tabela nova precisa de RLS e de testes em `supabase/tests/`.
5. Descreva no PR o que mudou, por que, e como testar. Inclua capturas de tela para mudanças visuais (mobile e desktop).

## Padrões de código

- TypeScript estrito; sem `any` desnecessário.
- Mutações em `src/actions` (Server Actions) sempre: validam com Zod, verificam a sessão no servidor e retornam `ActionResult`.
- Leitura de dados em `src/services`. Componentes não acessam o banco diretamente.
- Autorização nunca depende apenas da interface: servidor **e** RLS.
- Acessibilidade: rótulos em formulários, foco visível, contraste AA, `aria-*` quando necessário.
- Mobile em primeiro lugar.

## Reportar problemas

Use as issues do repositório ou a página **Ajude o Refúgio a crescer** no próprio site. Para falhas de segurança, não abra issue pública: entre em contato pelo e-mail de privacidade indicado na Política de privacidade.
