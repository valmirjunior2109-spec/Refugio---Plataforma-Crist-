-- ════════════════════════════════════════════════════════════
-- Refúgio · seed.sql · GERADO por scripts/build-seed.ts
-- Não edite à mão: altere src/content e rode `npm run seed:build`.
-- Idempotente: pode ser executado mais de uma vez.
-- ════════════════════════════════════════════════════════════

begin;

-- Palavras do dia: a 1ª é publicada hoje, as demais nos dias anteriores.
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('deus-e-nosso-refugio', 'Um lugar seguro no meio da tempestade', 'salmos', 46, 1, 3, 'O salmista não descreve um dia tranquilo. Ele fala de terra que se move, de montanhas que caem no mar, de águas que rugem. E é justamente aí, no meio do que parece desabar, que ele afirma: Deus é nosso refúgio e força.

Refúgio não é a ausência de tempestade. É o lugar onde podemos nos abrigar enquanto ela passa. A fé não nos pede que finjamos que está tudo bem; ela nos convida a descobrir que não estamos desprotegidos.', 'Pense em algo que hoje parece instável na sua vida. Em vez de tentar resolver tudo de uma vez, reserve um minuto em silêncio e entregue essa situação a Deus com palavras simples.', 'Senhor, há coisas ao meu redor que parecem fora do lugar. Seja Tu o meu abrigo hoje. Ensina-me a descansar em Ti enquanto as águas se agitam. Amém.', public.app_today() - 0, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('o-senhor-e-meu-pastor', 'Guiado por quem conhece o caminho', 'salmos', 23, 1, 4, 'Davi conhecia bem o trabalho de um pastor: procurar pasto, encontrar água, proteger as ovelhas à noite. Quando ele diz que o Senhor é o seu pastor, está dizendo que alguém cuida dele com esse mesmo zelo.

O salmo não promete que não haverá vales escuros. Promete companhia dentro deles: "tu estás comigo". O cuidado de Deus não nos afasta de toda dificuldade, mas nos acompanha em cada passo.', 'Hoje, observe um momento simples de cuidado, como uma refeição, uma conversa ou um descanso. Agradeça por ele como sinal de que você está sendo guiado.', 'Bom Pastor, conduze-me hoje. Quando eu não enxergar o caminho, lembra-me de que Tu estás comigo. Restaura a minha alma. Amém.', public.app_today() - 1, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('vinde-a-mim', 'Um convite para quem está cansado', 'mateus', 11, 28, 30, 'Jesus não chama apenas os fortes, os organizados ou os que já entenderam tudo. Ele chama os cansados e sobrecarregados. É um convite para quem chegou ao limite.

Ele se apresenta como manso e humilde de coração. O descanso que oferece não vem de uma lista de exigências, mas de caminhar ao lado de alguém que nos trata com gentileza.', 'Escreva, mesmo que só em pensamento, o que mais pesa sobre você hoje. Depois, diga a Jesus: "Eu trago isto até Ti".', 'Jesus, estou cansado de carregar tanto. Aceito o Teu convite. Dá-me o descanso que só Tu podes dar e ensina-me o Teu jeito manso de viver. Amém.', public.app_today() - 2, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('nao-temas', 'Quando o medo fala alto', 'isaias', 41, 10, null, 'Estas palavras foram dirigidas a um povo que vivia longe de casa, inseguro quanto ao futuro. Deus não minimiza o medo deles. Ele oferece algo maior: sua presença.

"Eu estou contigo", "eu sou teu Deus", "eu te fortaleço", "te ajudo", "te sustento". Cada frase começa com Deus agindo. A coragem nasce menos da nossa força e mais da certeza de quem está ao nosso lado.', 'Quando o medo surgir hoje, repita devagar uma das frases deste versículo, como "eu estou contigo", e respire fundo antes de seguir.', 'Deus, Tu conheces os meus medos. Segura-me com a Tua mão. Que a Tua presença fale mais alto do que a minha insegurança. Amém.', public.app_today() - 3, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('a-paz-que-guarda', 'Trocar a ansiedade pela oração', 'filipenses', 4, 6, 7, 'Paulo escreveu estas palavras enquanto estava preso. Ele sabia o que era viver sem garantias. Mesmo assim, apresenta um caminho: levar a Deus cada pedido, com gratidão.

A promessa não é que tudo será resolvido do jeito que imaginamos, mas que a paz de Deus vai guardar o nosso coração e a nossa mente. É uma paz que não depende de entender tudo.', 'Faça uma lista curta de três preocupações e, ao lado de cada uma, algo pelo qual você é grato. Ore por elas juntas.', 'Pai, entrego a Ti as preocupações que ocupam minha mente. Obrigado pelo que já tens feito. Guarda o meu coração com a Tua paz. Amém.', public.app_today() - 4, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('ele-tem-cuidado-de-voce', 'Você é cuidado', '1-pedro', 5, 7, null, 'Pedro escreve a comunidades que enfrentavam dificuldades reais. O conselho é simples e profundo: lançar sobre Deus toda a ansiedade. Não uma parte. Toda.

O motivo é ainda mais bonito: "porque ele tem cuidado de vós". Não entregamos nossas aflições a alguém distante, mas a alguém que se importa com cada detalhe da nossa vida.', 'Escolha uma preocupação específica e entregue-a em oração. Sempre que ela voltar à mente hoje, lembre-se: "já entreguei isso a quem cuida de mim".', 'Senhor, obrigado por cuidares de mim. Lanço sobre Ti esta ansiedade que me acompanha. Ajuda-me a não pegá-la de volta. Amém.', public.app_today() - 5, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('novas-a-cada-manha', 'Misericórdias que se renovam', 'lamentacoes', 3, 22, 23, 'O livro de Lamentações nasceu de uma grande perda. Ainda assim, no meio do choro, o autor encontra um ponto de apoio: as misericórdias de Deus não têm fim e se renovam a cada manhã.

Nem todo dia começa leve. Mas cada manhã traz consigo uma nova porção da fidelidade de Deus, suficiente para o dia que começa.', 'Amanhã cedo, antes de olhar o celular, diga em voz baixa: "grande é a tua fidelidade". Deixe que essa seja a primeira palavra do seu dia.', 'Deus fiel, obrigado porque o Teu amor não se esgota. Renova em mim a esperança a cada manhã. Amém.', public.app_today() - 6, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('forca-para-o-cansado', 'Força renovada', 'isaias', 40, 29, 31, 'O texto reconhece algo muito humano: até os jovens se cansam. Ninguém é forte o tempo todo. A fraqueza não é um fracasso espiritual, é parte da nossa condição.

A promessa é para os que confiam no Senhor: forças renovadas. Às vezes isso significa voar como águia; outras vezes, simplesmente caminhar sem desistir. As duas coisas são vitórias.', 'Respeite o seu cansaço hoje. Escolha uma pausa real, mesmo que breve, e use-a para descansar diante de Deus, sem cobranças.', 'Senhor, Tu dás força ao cansado. Eu sou um deles hoje. Renova as minhas forças, nem que seja para dar o próximo passo. Amém.', public.app_today() - 7, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('nada-nos-separara', 'Um amor do qual nada nos separa', 'romanos', 8, 38, 39, 'Paulo faz uma lista que parece cobrir tudo: morte, vida, presente, futuro, altura, profundeza. Nada disso, diz ele, pode nos separar do amor de Deus em Cristo Jesus.

Há dias em que nos sentimos distantes de Deus. Mas o amor dele não depende do que sentimos naquele momento. Ele permanece firme, mesmo quando nós vacilamos.', 'Se algo faz você se sentir distante de Deus hoje, nomeie essa coisa e diga: "nem isso pode me separar do amor de Deus".', 'Pai, obrigado por um amor que não me abandona. Quando eu duvidar, lembra-me de que nada pode me separar de Ti. Amém.', public.app_today() - 8, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('a-paz-de-jesus', 'Uma paz diferente', 'joao', 14, 27, null, 'Jesus disse estas palavras aos seus amigos pouco antes de viver os momentos mais difíceis da sua vida. Eles estavam confusos e com medo. E ele lhes deixa um presente: a sua paz.

É uma paz que não é como a do mundo, que depende de tudo estar em ordem. É uma paz que pode existir mesmo quando as circunstâncias ainda não mudaram.', 'Identifique um lugar ou momento do seu dia em que costuma ficar agitado. Antes de entrar nele, peça em silêncio: "Jesus, dá-me a tua paz".', 'Jesus, recebo a paz que Tu deixaste. Acalma o meu coração e afasta dele o medo. Amém.', public.app_today() - 9, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('confia-de-todo-coracao', 'Confiar quando não entendemos', 'proverbios', 3, 5, 6, 'Provérbios é um livro sobre sabedoria prática. E um dos seus conselhos mais conhecidos é justamente reconhecer os limites do nosso próprio entendimento.

Confiar em Deus não significa deixar de pensar ou planejar. Significa reconhecê-lo em todos os caminhos, inclusive naqueles que ainda não compreendemos totalmente.', 'Pense em uma decisão que você precisa tomar. Antes de decidir, ore por ela e peça a Deus clareza e serenidade.', 'Senhor, eu não entendo tudo, mas quero confiar em Ti de todo o coração. Endireita as minhas veredas. Amém.', public.app_today() - 10, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('gratidao-em-tudo', 'Gratidão como modo de viver', '1-tessalonicenses', 5, 16, 18, 'São três frases curtas: alegrai-vos, orai, agradecei. Parecem simples, mas formam um jeito inteiro de viver.

Agradecer em tudo não é agradecer por tudo, como se a dor fosse boa. É aprender a encontrar, mesmo nos dias difíceis, sinais de que Deus continua presente.', 'Antes de dormir, anote três coisas pelas quais você é grato hoje, por menores que pareçam.', 'Pai, abre os meus olhos para ver os Teus cuidados no meu dia. Ensina-me a viver com gratidão. Amém.', public.app_today() - 11, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('basta-a-cada-dia', 'Um dia de cada vez', 'mateus', 6, 33, 34, 'Jesus conhecia bem a tendência humana de viver no amanhã, antecipando problemas que ainda não chegaram. Seu conselho é libertador: basta a cada dia o seu mal.

Buscar primeiro o Reino de Deus é colocar nossas prioridades no lugar certo e confiar que o Pai, que cuida das aves, também cuida de nós.', 'Quando a mente correr para o futuro hoje, traga-a de volta com uma pergunta: "o que eu preciso fazer apenas hoje?".', 'Senhor, ajuda-me a viver o hoje com confiança. Entrego a Ti o amanhã e tudo o que ainda não sei. Amém.', public.app_today() - 12, 'published')
on conflict (slug) do nothing;
insert into public.daily_devotionals (slug, title, book, chapter, verse_start, verse_end, reflection, application, prayer, publish_date, status)
values ('esperanca-que-transborda', 'O Deus da esperança', 'romanos', 15, 13, null, 'Paulo chama Deus de "o Deus da esperança". É um nome bonito: esperança não é apenas algo que Deus nos dá, é parte de quem ele é.

A oração do apóstolo é que sejamos cheios de alegria e paz, a ponto de transbordarmos esperança. Não por esforço próprio, mas pelo poder do Espírito Santo.', 'Pense em alguém que precisa de esperança hoje. Envie uma mensagem de carinho ou ore por essa pessoa pelo nome.', 'Deus da esperança, enche o meu coração de alegria e paz. Que a esperança transborde de mim para quem está ao meu redor. Amém.', public.app_today() - 13, 'published')
on conflict (slug) do nothing;

-- Preciso de uma palavra
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'triste', 'Estou triste', 'Quando a alma está abatida', 'salmos', 42, 11, null, 'O Salmo 42 foi escrito por alguém que estava longe do lugar onde costumava adorar e se sentia distante de Deus. Ao longo do salmo, ele conversa com a própria alma, sem esconder a tristeza.', 'A Bíblia não pede que você esconda o que sente. O salmista pergunta à própria alma: "Por que estás abatida?". Ele dá nome à dor antes de falar de esperança.

Talvez hoje você não tenha forças para muito mais do que isso: reconhecer que está triste. Isso já é um começo honesto diante de Deus. A tristeza não afasta você dele.', 'A frase "eu ainda o louvarei" fala de um futuro. Ela não exige que a alegria volte agora, mas lembra que este não é o fim da história.', 'Deus, minha alma está abatida e nem sempre sei explicar por quê. Recebe a minha tristeza como ela é. Fica comigo e devolve, no Teu tempo, a esperança ao meu coração. Amém.', '[{"book":"salmos","chapter":42,"verseStart":1,"verseEnd":5},{"book":"mateus","chapter":5,"verseStart":4,"verseEnd":null},{"book":"apocalipse","chapter":21,"verseStart":4,"verseEnd":null}]'::jsonb, 0, 'published')
on conflict (kind, topic) do nothing;
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'medo', 'Estou com medo', 'Você não está sozinho diante do medo', 'isaias', 41, 10, null, 'O profeta Isaías fala a um povo que vivia em exílio, longe da sua terra e sem saber o que viria. Nesse cenário de incerteza, Deus fala diretamente ao medo deles.', 'Repare quantas vezes Deus diz "eu" neste versículo: eu estou contigo, eu sou teu Deus, eu te fortaleço, eu te ajudo, eu te sustento. A resposta ao medo não é uma ordem para ser forte sozinho; é a promessa de uma presença.

O medo pode continuar ali por um tempo. Mas ele não precisa ser a voz mais alta.', 'A mão que sustenta você é descrita como firme e justa. Você pode dar o próximo passo sabendo que não caminha sem apoio.', 'Senhor, estou com medo. Segura a minha mão. Lembra-me de que Tu estás comigo e me sustentas. Dá-me coragem para o próximo passo. Amém.', '[{"book":"salmos","chapter":27,"verseStart":1,"verseEnd":null},{"book":"josue","chapter":1,"verseStart":9,"verseEnd":null},{"book":"2-timoteo","chapter":1,"verseStart":7,"verseEnd":null}]'::jsonb, 1, 'published')
on conflict (kind, topic) do nothing;
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'ansiedade', 'Estou ansioso', 'Entregar o que pesa na mente', 'filipenses', 4, 6, 7, 'Paulo escreveu a carta aos Filipenses enquanto estava preso, sem saber se seria libertado. Ainda assim, é uma das cartas mais cheias de alegria do Novo Testamento.', 'Paulo não diz "pare de sentir ansiedade" como se fosse simples. Ele indica um caminho: transformar cada preocupação em oração e lembrar, ao mesmo tempo, do que já recebemos.

Orar não é ignorar os problemas. É colocá-los diante de quem pode carregá-los conosco.', 'A promessa é de uma paz que guarda o coração e a mente, como um guarda que protege uma cidade. Ela pode chegar antes mesmo de as respostas chegarem.', 'Pai, minha mente está acelerada. Coloco diante de Ti cada preocupação. Obrigado pelo que já fizeste por mim. Guarda o meu coração e os meus pensamentos com a Tua paz. Amém.', '[{"book":"mateus","chapter":6,"verseStart":25,"verseEnd":34},{"book":"1-pedro","chapter":5,"verseStart":7,"verseEnd":null},{"book":"salmos","chapter":94,"verseStart":19,"verseEnd":null}]'::jsonb, 2, 'published')
on conflict (kind, topic) do nothing;
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'solidao', 'Estou me sentindo sozinho', 'Chamado pelo nome', 'isaias', 43, 1, 2, 'Deus fala ao seu povo lembrando que foi ele quem o formou. As imagens de águas e fogo representam os momentos mais difíceis da caminhada.', '"Chamei a ti por teu nome; tu és meu." Antes de qualquer promessa, Deus lembra que conhece você pessoalmente. Você não é um rosto qualquer na multidão.

A solidão pode fazer parecer que ninguém vê o que estamos vivendo. Mas a promessa é clara: quando passares pelas águas, estarei contigo.', 'Mesmo nos lugares onde ninguém mais está, Deus diz "estarei contigo". E ele também pode colocar pessoas no seu caminho. Vale a pena dar um pequeno passo em direção a alguém.', 'Senhor, sinto-me só. Obrigado porque me conheces pelo nome. Faz-me sentir a Tua presença e coloca no meu caminho pessoas com quem eu possa partilhar a vida. Amém.', '[{"book":"salmos","chapter":139,"verseStart":7,"verseEnd":10},{"book":"mateus","chapter":28,"verseStart":20,"verseEnd":null},{"book":"hebreus","chapter":13,"verseStart":5,"verseEnd":null}]'::jsonb, 3, 'published')
on conflict (kind, topic) do nothing;
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'desanimo', 'Estou desanimado', 'Força para quem já não tem vigor', 'isaias', 40, 29, 31, 'Este capítulo de Isaías começa com a palavra "consolai". É uma mensagem de ânimo a um povo cansado de esperar por mudanças.', '"Até os jovens se cansam." A Bíblia reconhece que o desânimo faz parte da vida de todos. Não é sinal de fé fraca.

A promessa é para os que confiam no Senhor. Às vezes a força renovada aparece como asas de águia; outras vezes, como a capacidade de continuar caminhando sem desistir.', 'Deus multiplica as forças de quem não tem vigor. Você não precisa ter tudo de que precisa hoje; precisa apenas do suficiente para este dia.', 'Deus, estou sem ânimo. Não consigo enxergar muito à frente. Renova as minhas forças e ajuda-me a não desistir. Amém.', '[{"book":"galatas","chapter":6,"verseStart":9,"verseEnd":null},{"book":"2-corintios","chapter":4,"verseStart":16,"verseEnd":18},{"book":"salmos","chapter":73,"verseStart":26,"verseEnd":null}]'::jsonb, 4, 'published')
on conflict (kind, topic) do nothing;
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'esperanca', 'Preciso de esperança', 'O Deus da esperança', 'romanos', 15, 13, null, 'Paulo encerra uma longa parte da carta aos Romanos com esta bênção. Ele escrevia a uma comunidade diversa, com tensões internas, desejando que a esperança os unisse.', 'Esperança, na Bíblia, não é otimismo ingênuo. É confiança em quem Deus é. Por isso Paulo o chama de "Deus da esperança".

Quando a nossa esperança acaba, a dele continua. E ele pode enchê-la novamente em nós, aos poucos, "no poder do Espírito Santo".', 'A palavra usada é "abundeis": transbordar. Hoje pode ser só uma gota, mas Deus é capaz de fazer crescer.', 'Deus da esperança, enche o meu coração de alegria e paz. Onde só vejo cansaço, faz nascer esperança. Amém.', '[{"book":"lamentacoes","chapter":3,"verseStart":21,"verseEnd":23},{"book":"jeremias","chapter":29,"verseStart":11,"verseEnd":null},{"book":"hebreus","chapter":6,"verseStart":19,"verseEnd":null}]'::jsonb, 5, 'published')
on conflict (kind, topic) do nothing;
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'paz', 'Preciso de paz', 'A paz que Jesus deixa', 'joao', 14, 27, null, 'Jesus disse estas palavras na última ceia com os discípulos, pouco antes de ser preso. Ele os preparava para dias muito difíceis.', 'A paz que Jesus oferece não depende de tudo estar resolvido. Ele a deixou justamente quando as coisas estavam prestes a ficar mais difíceis.

"Não se perturbe vosso coração." É um convite gentil a entregar a ele o que nos agita por dentro.', 'Você pode receber essa paz como um presente. Ela não precisa ser conquistada; é dada.', 'Jesus, recebo a paz que Tu deixaste. Acalma o meu coração. Tira de mim a agitação e o medo. Amém.', '[{"book":"salmos","chapter":4,"verseStart":8,"verseEnd":null},{"book":"isaias","chapter":26,"verseStart":3,"verseEnd":null},{"book":"colossenses","chapter":3,"verseStart":15,"verseEnd":null}]'::jsonb, 6, 'published')
on conflict (kind, topic) do nothing;
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'gratidao', 'Quero agradecer', 'Não te esqueças dos benefícios', 'salmos', 103, 1, 5, 'Davi começa o salmo falando consigo mesmo, convocando a própria alma a louvar. É uma lembrança deliberada de tudo o que Deus fez.', 'Gratidão também é memória. "Não te esqueças de nenhum dos benefícios dele." Às vezes precisamos lembrar a nós mesmos do cuidado que já recebemos.

Agradecer não muda apenas o nosso humor: muda a forma como enxergamos a vida e a presença de Deus nela.', 'Cada lembrança de bondade é um sinal de que Deus continua agindo. O mesmo cuidado de ontem acompanha você hoje.', 'Senhor, obrigado. Obrigado pelo cuidado que nem sempre percebo, pelas pessoas que colocaste na minha vida e pelo Teu amor constante. Amém.', '[{"book":"1-tessalonicenses","chapter":5,"verseStart":18,"verseEnd":null},{"book":"salmos","chapter":100,"verseStart":4,"verseEnd":5},{"book":"colossenses","chapter":3,"verseStart":17,"verseEnd":null}]'::jsonb, 7, 'published')
on conflict (kind, topic) do nothing;
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'aproximar-de-deus', 'Quero me aproximar de Deus', 'O Pai que corre ao nosso encontro', 'lucas', 15, 20, null, 'Este versículo faz parte da parábola que Jesus contou sobre um filho que saiu de casa e, depois de muito tempo, decidiu voltar. É uma das histórias mais conhecidas sobre o amor de Deus.', 'O filho ainda estava longe quando o pai o viu. E o pai correu. Não esperou um discurso perfeito nem uma vida organizada.

Se você deseja se aproximar de Deus, saiba que ele já está olhando na sua direção. Não é preciso saber as palavras certas. Basta dar o primeiro passo.', 'O pai da história teve compaixão. É assim que Deus recebe quem se aproxima: com abraço, não com acusação.', 'Deus, quero estar mais perto de Ti. Não sei bem por onde começar, mas aqui estou. Recebe-me como sou e ensina-me a conhecer-Te. Amém.', '[{"book":"jeremias","chapter":29,"verseStart":12,"verseEnd":13},{"book":"tiago","chapter":4,"verseStart":8,"verseEnd":null},{"book":"apocalipse","chapter":3,"verseStart":20,"verseEnd":null}]'::jsonb, 8, 'published')
on conflict (kind, topic) do nothing;
insert into public.reflections (kind, topic, label, title, book, chapter, verse_start, verse_end, context, body, hope, prayer, further_readings, sort_order, status)
values ('need', 'dificuldades', 'Estou passando por dificuldades', 'Abatidos, porém não destruídos', '2-corintios', 4, 8, 9, 'Paulo escreve sobre o próprio ministério, marcado por perseguições, viagens perigosas e muitas perdas. Ele não esconde as dificuldades.', 'Paulo usa pares de palavras: afligidos, mas não esmagados; perplexos, mas não desesperados. Ele não nega o primeiro lado de cada par, mas mostra que ele não é a palavra final.

Talvez você esteja vivendo o lado "afligido" agora. A promessa é que existe também o lado "não esmagado".', 'As dificuldades são reais, mas não têm a última palavra. Há uma força que sustenta você por dentro, mesmo quando tudo por fora pesa.', 'Senhor, estou passando por um tempo difícil. Sustenta-me para que eu não seja esmagado. Dá-me sabedoria, ajuda prática e pessoas que caminhem comigo. Amém.', '[{"book":"romanos","chapter":8,"verseStart":28,"verseEnd":null},{"book":"salmos","chapter":46,"verseStart":1,"verseEnd":null},{"book":"joao","chapter":16,"verseStart":33,"verseEnd":null}]'::jsonb, 9, 'published')
on conflict (kind, topic) do nothing;

-- Planos de leitura
insert into public.reading_plans (slug, title, description, goal, cover_tone, cover_motif, sort_order, status)
values ('conhecendo-a-biblia', 'Conhecendo a Bíblia', 'Uma primeira caminhada pelos grandes momentos da Bíblia, da criação à nova criação. Ideal para quem está começando.', 'Ter uma visão geral da história bíblica e de como ela aponta para o amor de Deus.', 'sage', 'path', 0, 'published')
on conflict (slug) do nothing;
insert into public.reading_plan_days (plan_id, day_number, title, readings, note)
select p.id, v.day_number, v.title, v.readings, v.note
from public.reading_plans p,
(values
  (1, 'No princípio', '[{"book":"genesis","chapter":1,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (2, 'Um chamado e uma promessa', '[{"book":"genesis","chapter":12,"verseStart":1,"verseEnd":9}]'::jsonb, null),
  (3, 'Deus ouve o clamor do seu povo', '[{"book":"exodo","chapter":3,"verseStart":1,"verseEnd":15}]'::jsonb, null),
  (4, 'Um caminho para viver bem', '[{"book":"exodo","chapter":20,"verseStart":1,"verseEnd":17}]'::jsonb, null),
  (5, 'Dois caminhos', '[{"book":"salmos","chapter":1,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (6, 'O servo que carrega nossas dores', '[{"book":"isaias","chapter":53,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (7, 'O nascimento de Jesus', '[{"book":"lucas","chapter":2,"verseStart":1,"verseEnd":20}]'::jsonb, null),
  (8, 'O Verbo se fez carne', '[{"book":"joao","chapter":1,"verseStart":1,"verseEnd":18}]'::jsonb, null),
  (9, 'Uma comunidade nasce', '[{"book":"atos","chapter":2,"verseStart":37,"verseEnd":47}]'::jsonb, null),
  (10, 'Todas as coisas novas', '[{"book":"apocalipse","chapter":21,"verseStart":1,"verseEnd":7}]'::jsonb, null)
) as v(day_number, title, readings, note)
where p.slug = 'conhecendo-a-biblia'
on conflict (plan_id, day_number) do nothing;
insert into public.reading_plans (slug, title, description, goal, cover_tone, cover_motif, sort_order, status)
values ('7-dias-de-esperanca', '7 dias de esperança', 'Uma semana de leituras para quem atravessa um tempo difícil e precisa lembrar que a esperança continua viva.', 'Encontrar nas Escrituras motivos para seguir confiando, um dia de cada vez.', 'sand', 'sun', 1, 'published')
on conflict (slug) do nothing;
insert into public.reading_plan_days (plan_id, day_number, title, readings, note)
select p.id, v.day_number, v.title, v.readings, v.note
from public.reading_plans p,
(values
  (1, 'Quando a alma está abatida', '[{"book":"salmos","chapter":42,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (2, 'Misericórdias a cada manhã', '[{"book":"lamentacoes","chapter":3,"verseStart":19,"verseEnd":26}]'::jsonb, null),
  (3, 'Força para o cansado', '[{"book":"isaias","chapter":40,"verseStart":27,"verseEnd":31}]'::jsonb, null),
  (4, 'A esperança não frustra', '[{"book":"romanos","chapter":5,"verseStart":1,"verseEnd":5}]'::jsonb, null),
  (5, 'Tudo coopera para o bem', '[{"book":"romanos","chapter":8,"verseStart":18,"verseEnd":28}]'::jsonb, null),
  (6, 'Tesouro em vasos de barro', '[{"book":"2-corintios","chapter":4,"verseStart":7,"verseEnd":18}]'::jsonb, null),
  (7, 'Um novo céu e uma nova terra', '[{"book":"apocalipse","chapter":21,"verseStart":1,"verseEnd":5}]'::jsonb, null)
) as v(day_number, title, readings, note)
where p.slug = '7-dias-de-esperanca'
on conflict (plan_id, day_number) do nothing;
insert into public.reading_plans (slug, title, description, goal, cover_tone, cover_motif, sort_order, status)
values ('30-dias-de-aproximacao-com-deus', '30 dias de aproximação com Deus', 'Um mês de leituras curtas, entre salmos e evangelhos, para cultivar um tempo diário de conversa com Deus.', 'Criar um hábito tranquilo de leitura e oração e conhecer mais o coração de Deus.', 'deep', 'arch', 2, 'published')
on conflict (slug) do nothing;
insert into public.reading_plan_days (plan_id, day_number, title, readings, note)
select p.id, v.day_number, v.title, v.readings, v.note
from public.reading_plans p,
(values
  (1, 'Tu me examinas e me conheces', '[{"book":"salmos","chapter":139,"verseStart":1,"verseEnd":12}]'::jsonb, null),
  (2, 'O Pai que corre ao encontro', '[{"book":"lucas","chapter":15,"verseStart":11,"verseEnd":24}]'::jsonb, null),
  (3, 'A luz que veio ao mundo', '[{"book":"joao","chapter":1,"verseStart":1,"verseEnd":14}]'::jsonb, null),
  (4, 'O Senhor é minha luz', '[{"book":"salmos","chapter":27,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (5, 'Benditos os que choram', '[{"book":"mateus","chapter":5,"verseStart":1,"verseEnd":12}]'::jsonb, null),
  (6, 'Aprendendo a orar', '[{"book":"mateus","chapter":6,"verseStart":5,"verseEnd":15}]'::jsonb, null),
  (7, 'O Bom Pastor', '[{"book":"salmos","chapter":23,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (8, 'Nascer de novo', '[{"book":"joao","chapter":3,"verseStart":1,"verseEnd":17}]'::jsonb, null),
  (9, 'A água viva', '[{"book":"joao","chapter":4,"verseStart":1,"verseEnd":26}]'::jsonb, null),
  (10, 'Um coração renovado', '[{"book":"salmos","chapter":51,"verseStart":1,"verseEnd":12}]'::jsonb, null),
  (11, 'A oração humilde', '[{"book":"lucas","chapter":18,"verseStart":9,"verseEnd":14}]'::jsonb, null),
  (12, 'Pedi, buscai, batei', '[{"book":"mateus","chapter":7,"verseStart":7,"verseEnd":12}]'::jsonb, null),
  (13, 'A minha alma se aquieta em Deus', '[{"book":"salmos","chapter":62,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (14, 'Conhecido pelo Pastor', '[{"book":"joao","chapter":10,"verseStart":1,"verseEnd":18}]'::jsonb, null),
  (15, 'Permanecer nele', '[{"book":"joao","chapter":15,"verseStart":1,"verseEnd":17}]'::jsonb, null),
  (16, 'Nada nos separará', '[{"book":"romanos","chapter":8,"verseStart":31,"verseEnd":39}]'::jsonb, null),
  (17, 'Saudade da casa de Deus', '[{"book":"salmos","chapter":84,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (18, 'Enraizados no amor', '[{"book":"efesios","chapter":3,"verseStart":14,"verseEnd":21}]'::jsonb, null),
  (19, 'A paz que guarda', '[{"book":"filipenses","chapter":4,"verseStart":4,"verseEnd":9}]'::jsonb, null),
  (20, 'À sombra do Altíssimo', '[{"book":"salmos","chapter":91,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (21, 'A parte boa', '[{"book":"lucas","chapter":10,"verseStart":38,"verseEnd":42}]'::jsonb, null),
  (22, 'Sobre as águas', '[{"book":"mateus","chapter":14,"verseStart":22,"verseEnd":33}]'::jsonb, null),
  (23, 'Bendize, ó minha alma', '[{"book":"salmos","chapter":103,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (24, 'Revestidos de bondade', '[{"book":"colossenses","chapter":3,"verseStart":1,"verseEnd":17}]'::jsonb, null),
  (25, 'Deus é amor', '[{"book":"1-joao","chapter":4,"verseStart":7,"verseEnd":21}]'::jsonb, null),
  (26, 'A minha alma tem sede de ti', '[{"book":"salmos","chapter":63,"verseStart":1,"verseEnd":8}]'::jsonb, null),
  (27, 'Acheguemo-nos com confiança', '[{"book":"hebreus","chapter":4,"verseStart":14,"verseEnd":16}]'::jsonb, null),
  (28, 'Aproximai-vos de Deus', '[{"book":"tiago","chapter":4,"verseStart":6,"verseEnd":10}]'::jsonb, null),
  (29, 'Eis que estou à porta', '[{"book":"apocalipse","chapter":3,"verseStart":20,"verseEnd":22}]'::jsonb, null),
  (30, 'Fartura de alegrias', '[{"book":"salmos","chapter":16,"verseStart":null,"verseEnd":null}]'::jsonb, null)
) as v(day_number, title, readings, note)
where p.slug = '30-dias-de-aproximacao-com-deus'
on conflict (plan_id, day_number) do nothing;
insert into public.reading_plans (slug, title, description, goal, cover_tone, cover_motif, sort_order, status)
values ('conhecendo-jesus', 'Conhecendo Jesus', 'A leitura completa do Evangelho de Marcos, o mais curto dos evangelhos, um capítulo por dia.', 'Acompanhar a vida, os ensinamentos, a morte e a ressurreição de Jesus.', 'ivory', 'leaf', 3, 'published')
on conflict (slug) do nothing;
insert into public.reading_plan_days (plan_id, day_number, title, readings, note)
select p.id, v.day_number, v.title, v.readings, v.note
from public.reading_plans p,
(values
  (1, 'Marcos 1', '[{"book":"marcos","chapter":1}]'::jsonb, null),
  (2, 'Marcos 2', '[{"book":"marcos","chapter":2}]'::jsonb, null),
  (3, 'Marcos 3', '[{"book":"marcos","chapter":3}]'::jsonb, null),
  (4, 'Marcos 4', '[{"book":"marcos","chapter":4}]'::jsonb, null),
  (5, 'Marcos 5', '[{"book":"marcos","chapter":5}]'::jsonb, null),
  (6, 'Marcos 6', '[{"book":"marcos","chapter":6}]'::jsonb, null),
  (7, 'Marcos 7', '[{"book":"marcos","chapter":7}]'::jsonb, null),
  (8, 'Marcos 8', '[{"book":"marcos","chapter":8}]'::jsonb, null),
  (9, 'Marcos 9', '[{"book":"marcos","chapter":9}]'::jsonb, null),
  (10, 'Marcos 10', '[{"book":"marcos","chapter":10}]'::jsonb, null),
  (11, 'Marcos 11', '[{"book":"marcos","chapter":11}]'::jsonb, null),
  (12, 'Marcos 12', '[{"book":"marcos","chapter":12}]'::jsonb, null),
  (13, 'Marcos 13', '[{"book":"marcos","chapter":13}]'::jsonb, null),
  (14, 'Marcos 14', '[{"book":"marcos","chapter":14}]'::jsonb, null),
  (15, 'Marcos 15', '[{"book":"marcos","chapter":15}]'::jsonb, null),
  (16, 'Marcos 16', '[{"book":"marcos","chapter":16}]'::jsonb, null)
) as v(day_number, title, readings, note)
where p.slug = 'conhecendo-jesus'
on conflict (plan_id, day_number) do nothing;
insert into public.reading_plans (slug, title, description, goal, cover_tone, cover_motif, sort_order, status)
values ('proverbios-sabedoria-para-a-vida', 'Provérbios: sabedoria para a vida', 'Um capítulo de Provérbios por dia, durante 31 dias. Conselhos práticos sobre palavras, trabalho, amizade e decisões.', 'Buscar sabedoria para o dia a dia à luz das Escrituras.', 'sand', 'stars', 4, 'published')
on conflict (slug) do nothing;
insert into public.reading_plan_days (plan_id, day_number, title, readings, note)
select p.id, v.day_number, v.title, v.readings, v.note
from public.reading_plans p,
(values
  (1, 'Provérbios 1', '[{"book":"proverbios","chapter":1}]'::jsonb, null),
  (2, 'Provérbios 2', '[{"book":"proverbios","chapter":2}]'::jsonb, null),
  (3, 'Provérbios 3', '[{"book":"proverbios","chapter":3}]'::jsonb, null),
  (4, 'Provérbios 4', '[{"book":"proverbios","chapter":4}]'::jsonb, null),
  (5, 'Provérbios 5', '[{"book":"proverbios","chapter":5}]'::jsonb, null),
  (6, 'Provérbios 6', '[{"book":"proverbios","chapter":6}]'::jsonb, null),
  (7, 'Provérbios 7', '[{"book":"proverbios","chapter":7}]'::jsonb, null),
  (8, 'Provérbios 8', '[{"book":"proverbios","chapter":8}]'::jsonb, null),
  (9, 'Provérbios 9', '[{"book":"proverbios","chapter":9}]'::jsonb, null),
  (10, 'Provérbios 10', '[{"book":"proverbios","chapter":10}]'::jsonb, null),
  (11, 'Provérbios 11', '[{"book":"proverbios","chapter":11}]'::jsonb, null),
  (12, 'Provérbios 12', '[{"book":"proverbios","chapter":12}]'::jsonb, null),
  (13, 'Provérbios 13', '[{"book":"proverbios","chapter":13}]'::jsonb, null),
  (14, 'Provérbios 14', '[{"book":"proverbios","chapter":14}]'::jsonb, null),
  (15, 'Provérbios 15', '[{"book":"proverbios","chapter":15}]'::jsonb, null),
  (16, 'Provérbios 16', '[{"book":"proverbios","chapter":16}]'::jsonb, null),
  (17, 'Provérbios 17', '[{"book":"proverbios","chapter":17}]'::jsonb, null),
  (18, 'Provérbios 18', '[{"book":"proverbios","chapter":18}]'::jsonb, null),
  (19, 'Provérbios 19', '[{"book":"proverbios","chapter":19}]'::jsonb, null),
  (20, 'Provérbios 20', '[{"book":"proverbios","chapter":20}]'::jsonb, null),
  (21, 'Provérbios 21', '[{"book":"proverbios","chapter":21}]'::jsonb, null),
  (22, 'Provérbios 22', '[{"book":"proverbios","chapter":22}]'::jsonb, null),
  (23, 'Provérbios 23', '[{"book":"proverbios","chapter":23}]'::jsonb, null),
  (24, 'Provérbios 24', '[{"book":"proverbios","chapter":24}]'::jsonb, null),
  (25, 'Provérbios 25', '[{"book":"proverbios","chapter":25}]'::jsonb, null),
  (26, 'Provérbios 26', '[{"book":"proverbios","chapter":26}]'::jsonb, null),
  (27, 'Provérbios 27', '[{"book":"proverbios","chapter":27}]'::jsonb, null),
  (28, 'Provérbios 28', '[{"book":"proverbios","chapter":28}]'::jsonb, null),
  (29, 'Provérbios 29', '[{"book":"proverbios","chapter":29}]'::jsonb, null),
  (30, 'Provérbios 30', '[{"book":"proverbios","chapter":30}]'::jsonb, null),
  (31, 'Provérbios 31', '[{"book":"proverbios","chapter":31}]'::jsonb, null)
) as v(day_number, title, readings, note)
where p.slug = 'proverbios-sabedoria-para-a-vida'
on conflict (plan_id, day_number) do nothing;
insert into public.reading_plans (slug, title, description, goal, cover_tone, cover_motif, sort_order, status)
values ('salmos-encontrando-conforto', 'Salmos: encontrando conforto', 'Quatorze salmos escolhidos para dias de cansaço, medo ou saudade. Orações antigas que continuam dando voz ao coração.', 'Aprender a orar com os salmos e encontrar consolo na presença de Deus.', 'sage', 'waves', 5, 'published')
on conflict (slug) do nothing;
insert into public.reading_plan_days (plan_id, day_number, title, readings, note)
select p.id, v.day_number, v.title, v.readings, v.note
from public.reading_plans p,
(values
  (1, 'Deitar e dormir em paz', '[{"book":"salmos","chapter":4,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (2, 'Na tua presença', '[{"book":"salmos","chapter":16,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (3, 'O Senhor é meu pastor', '[{"book":"salmos","chapter":23,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (4, 'A quem temerei?', '[{"book":"salmos","chapter":27,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (5, 'Nas tuas mãos', '[{"book":"salmos","chapter":31,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (6, 'Experimentai e vede', '[{"book":"salmos","chapter":34,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (7, 'Esperei com esperança', '[{"book":"salmos","chapter":40,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (8, 'Como a corça', '[{"book":"salmos","chapter":42,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (9, 'Deus é nosso refúgio', '[{"book":"salmos","chapter":46,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (10, 'A alma que se aquieta', '[{"book":"salmos","chapter":62,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (11, 'À sombra do Altíssimo', '[{"book":"salmos","chapter":91,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (12, 'Bendize, ó minha alma', '[{"book":"salmos","chapter":103,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (13, 'De onde virá o meu socorro?', '[{"book":"salmos","chapter":121,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (14, 'Tu me examinas e me conheces', '[{"book":"salmos","chapter":139,"verseStart":null,"verseEnd":null}]'::jsonb, null)
) as v(day_number, title, readings, note)
where p.slug = 'salmos-encontrando-conforto'
on conflict (plan_id, day_number) do nothing;
insert into public.reading_plans (slug, title, description, goal, cover_tone, cover_motif, sort_order, status)
values ('jornada-pelo-novo-testamento', 'Jornada pelo Novo Testamento', 'Os 27 livros do Novo Testamento, de Mateus a Apocalipse, em cerca de três capítulos por dia. No seu ritmo, sem pressa.', 'Ler todo o Novo Testamento e conhecer a história de Jesus e da igreja primitiva.', 'deep', 'path', 6, 'published')
on conflict (slug) do nothing;
insert into public.reading_plan_days (plan_id, day_number, title, readings, note)
select p.id, v.day_number, v.title, v.readings, v.note
from public.reading_plans p,
(values
  (1, 'Mateus 1–3', '[{"book":"mateus","chapter":1},{"book":"mateus","chapter":2},{"book":"mateus","chapter":3}]'::jsonb, null),
  (2, 'Mateus 4–6', '[{"book":"mateus","chapter":4},{"book":"mateus","chapter":5},{"book":"mateus","chapter":6}]'::jsonb, null),
  (3, 'Mateus 7–9', '[{"book":"mateus","chapter":7},{"book":"mateus","chapter":8},{"book":"mateus","chapter":9}]'::jsonb, null),
  (4, 'Mateus 10–12', '[{"book":"mateus","chapter":10},{"book":"mateus","chapter":11},{"book":"mateus","chapter":12}]'::jsonb, null),
  (5, 'Mateus 13–15', '[{"book":"mateus","chapter":13},{"book":"mateus","chapter":14},{"book":"mateus","chapter":15}]'::jsonb, null),
  (6, 'Mateus 16–18', '[{"book":"mateus","chapter":16},{"book":"mateus","chapter":17},{"book":"mateus","chapter":18}]'::jsonb, null),
  (7, 'Mateus 19–21', '[{"book":"mateus","chapter":19},{"book":"mateus","chapter":20},{"book":"mateus","chapter":21}]'::jsonb, null),
  (8, 'Mateus 22–24', '[{"book":"mateus","chapter":22},{"book":"mateus","chapter":23},{"book":"mateus","chapter":24}]'::jsonb, null),
  (9, 'Mateus 25–27', '[{"book":"mateus","chapter":25},{"book":"mateus","chapter":26},{"book":"mateus","chapter":27}]'::jsonb, null),
  (10, 'Mateus 28 a Marcos 2', '[{"book":"mateus","chapter":28},{"book":"marcos","chapter":1},{"book":"marcos","chapter":2}]'::jsonb, null),
  (11, 'Marcos 3–5', '[{"book":"marcos","chapter":3},{"book":"marcos","chapter":4},{"book":"marcos","chapter":5}]'::jsonb, null),
  (12, 'Marcos 6–8', '[{"book":"marcos","chapter":6},{"book":"marcos","chapter":7},{"book":"marcos","chapter":8}]'::jsonb, null),
  (13, 'Marcos 9–11', '[{"book":"marcos","chapter":9},{"book":"marcos","chapter":10},{"book":"marcos","chapter":11}]'::jsonb, null),
  (14, 'Marcos 12–14', '[{"book":"marcos","chapter":12},{"book":"marcos","chapter":13},{"book":"marcos","chapter":14}]'::jsonb, null),
  (15, 'Marcos 15 a Lucas 1', '[{"book":"marcos","chapter":15},{"book":"marcos","chapter":16},{"book":"lucas","chapter":1}]'::jsonb, null),
  (16, 'Lucas 2–4', '[{"book":"lucas","chapter":2},{"book":"lucas","chapter":3},{"book":"lucas","chapter":4}]'::jsonb, null),
  (17, 'Lucas 5–7', '[{"book":"lucas","chapter":5},{"book":"lucas","chapter":6},{"book":"lucas","chapter":7}]'::jsonb, null),
  (18, 'Lucas 8–10', '[{"book":"lucas","chapter":8},{"book":"lucas","chapter":9},{"book":"lucas","chapter":10}]'::jsonb, null),
  (19, 'Lucas 11–13', '[{"book":"lucas","chapter":11},{"book":"lucas","chapter":12},{"book":"lucas","chapter":13}]'::jsonb, null),
  (20, 'Lucas 14–16', '[{"book":"lucas","chapter":14},{"book":"lucas","chapter":15},{"book":"lucas","chapter":16}]'::jsonb, null),
  (21, 'Lucas 17–19', '[{"book":"lucas","chapter":17},{"book":"lucas","chapter":18},{"book":"lucas","chapter":19}]'::jsonb, null),
  (22, 'Lucas 20–22', '[{"book":"lucas","chapter":20},{"book":"lucas","chapter":21},{"book":"lucas","chapter":22}]'::jsonb, null),
  (23, 'Lucas 23 a João 1', '[{"book":"lucas","chapter":23},{"book":"lucas","chapter":24},{"book":"joao","chapter":1}]'::jsonb, null),
  (24, 'João 2–4', '[{"book":"joao","chapter":2},{"book":"joao","chapter":3},{"book":"joao","chapter":4}]'::jsonb, null),
  (25, 'João 5–7', '[{"book":"joao","chapter":5},{"book":"joao","chapter":6},{"book":"joao","chapter":7}]'::jsonb, null),
  (26, 'João 8–10', '[{"book":"joao","chapter":8},{"book":"joao","chapter":9},{"book":"joao","chapter":10}]'::jsonb, null),
  (27, 'João 11–13', '[{"book":"joao","chapter":11},{"book":"joao","chapter":12},{"book":"joao","chapter":13}]'::jsonb, null),
  (28, 'João 14–16', '[{"book":"joao","chapter":14},{"book":"joao","chapter":15},{"book":"joao","chapter":16}]'::jsonb, null),
  (29, 'João 17–19', '[{"book":"joao","chapter":17},{"book":"joao","chapter":18},{"book":"joao","chapter":19}]'::jsonb, null),
  (30, 'João 20 a Atos 1', '[{"book":"joao","chapter":20},{"book":"joao","chapter":21},{"book":"atos","chapter":1}]'::jsonb, null),
  (31, 'Atos 2–4', '[{"book":"atos","chapter":2},{"book":"atos","chapter":3},{"book":"atos","chapter":4}]'::jsonb, null),
  (32, 'Atos 5–7', '[{"book":"atos","chapter":5},{"book":"atos","chapter":6},{"book":"atos","chapter":7}]'::jsonb, null),
  (33, 'Atos 8–10', '[{"book":"atos","chapter":8},{"book":"atos","chapter":9},{"book":"atos","chapter":10}]'::jsonb, null),
  (34, 'Atos 11–13', '[{"book":"atos","chapter":11},{"book":"atos","chapter":12},{"book":"atos","chapter":13}]'::jsonb, null),
  (35, 'Atos 14–16', '[{"book":"atos","chapter":14},{"book":"atos","chapter":15},{"book":"atos","chapter":16}]'::jsonb, null),
  (36, 'Atos 17–19', '[{"book":"atos","chapter":17},{"book":"atos","chapter":18},{"book":"atos","chapter":19}]'::jsonb, null),
  (37, 'Atos 20–22', '[{"book":"atos","chapter":20},{"book":"atos","chapter":21},{"book":"atos","chapter":22}]'::jsonb, null),
  (38, 'Atos 23–25', '[{"book":"atos","chapter":23},{"book":"atos","chapter":24},{"book":"atos","chapter":25}]'::jsonb, null),
  (39, 'Atos 26–28', '[{"book":"atos","chapter":26},{"book":"atos","chapter":27},{"book":"atos","chapter":28}]'::jsonb, null),
  (40, 'Romanos 1–3', '[{"book":"romanos","chapter":1},{"book":"romanos","chapter":2},{"book":"romanos","chapter":3}]'::jsonb, null),
  (41, 'Romanos 4–6', '[{"book":"romanos","chapter":4},{"book":"romanos","chapter":5},{"book":"romanos","chapter":6}]'::jsonb, null),
  (42, 'Romanos 7–9', '[{"book":"romanos","chapter":7},{"book":"romanos","chapter":8},{"book":"romanos","chapter":9}]'::jsonb, null),
  (43, 'Romanos 10–12', '[{"book":"romanos","chapter":10},{"book":"romanos","chapter":11},{"book":"romanos","chapter":12}]'::jsonb, null),
  (44, 'Romanos 13–15', '[{"book":"romanos","chapter":13},{"book":"romanos","chapter":14},{"book":"romanos","chapter":15}]'::jsonb, null),
  (45, 'Romanos 16 a 1 Coríntios 2', '[{"book":"romanos","chapter":16},{"book":"1-corintios","chapter":1},{"book":"1-corintios","chapter":2}]'::jsonb, null),
  (46, '1 Coríntios 3–5', '[{"book":"1-corintios","chapter":3},{"book":"1-corintios","chapter":4},{"book":"1-corintios","chapter":5}]'::jsonb, null),
  (47, '1 Coríntios 6–8', '[{"book":"1-corintios","chapter":6},{"book":"1-corintios","chapter":7},{"book":"1-corintios","chapter":8}]'::jsonb, null),
  (48, '1 Coríntios 9–11', '[{"book":"1-corintios","chapter":9},{"book":"1-corintios","chapter":10},{"book":"1-corintios","chapter":11}]'::jsonb, null),
  (49, '1 Coríntios 12–14', '[{"book":"1-corintios","chapter":12},{"book":"1-corintios","chapter":13},{"book":"1-corintios","chapter":14}]'::jsonb, null),
  (50, '1 Coríntios 15 a 2 Coríntios 1', '[{"book":"1-corintios","chapter":15},{"book":"1-corintios","chapter":16},{"book":"2-corintios","chapter":1}]'::jsonb, null),
  (51, '2 Coríntios 2–4', '[{"book":"2-corintios","chapter":2},{"book":"2-corintios","chapter":3},{"book":"2-corintios","chapter":4}]'::jsonb, null),
  (52, '2 Coríntios 5–7', '[{"book":"2-corintios","chapter":5},{"book":"2-corintios","chapter":6},{"book":"2-corintios","chapter":7}]'::jsonb, null),
  (53, '2 Coríntios 8–10', '[{"book":"2-corintios","chapter":8},{"book":"2-corintios","chapter":9},{"book":"2-corintios","chapter":10}]'::jsonb, null),
  (54, '2 Coríntios 11–13', '[{"book":"2-corintios","chapter":11},{"book":"2-corintios","chapter":12},{"book":"2-corintios","chapter":13}]'::jsonb, null),
  (55, 'Gálatas 1–3', '[{"book":"galatas","chapter":1},{"book":"galatas","chapter":2},{"book":"galatas","chapter":3}]'::jsonb, null),
  (56, 'Gálatas 4–6', '[{"book":"galatas","chapter":4},{"book":"galatas","chapter":5},{"book":"galatas","chapter":6}]'::jsonb, null),
  (57, 'Efésios 1–3', '[{"book":"efesios","chapter":1},{"book":"efesios","chapter":2},{"book":"efesios","chapter":3}]'::jsonb, null),
  (58, 'Efésios 4–6', '[{"book":"efesios","chapter":4},{"book":"efesios","chapter":5},{"book":"efesios","chapter":6}]'::jsonb, null),
  (59, 'Filipenses 1–3', '[{"book":"filipenses","chapter":1},{"book":"filipenses","chapter":2},{"book":"filipenses","chapter":3}]'::jsonb, null),
  (60, 'Filipenses 4 a Colossenses 2', '[{"book":"filipenses","chapter":4},{"book":"colossenses","chapter":1},{"book":"colossenses","chapter":2}]'::jsonb, null),
  (61, 'Colossenses 3 a 1 Tessalonicenses 1', '[{"book":"colossenses","chapter":3},{"book":"colossenses","chapter":4},{"book":"1-tessalonicenses","chapter":1}]'::jsonb, null),
  (62, '1 Tessalonicenses 2–4', '[{"book":"1-tessalonicenses","chapter":2},{"book":"1-tessalonicenses","chapter":3},{"book":"1-tessalonicenses","chapter":4}]'::jsonb, null),
  (63, '1 Tessalonicenses 5 a 2 Tessalonicenses 2', '[{"book":"1-tessalonicenses","chapter":5},{"book":"2-tessalonicenses","chapter":1},{"book":"2-tessalonicenses","chapter":2}]'::jsonb, null),
  (64, '2 Tessalonicenses 3 a 1 Timóteo 2', '[{"book":"2-tessalonicenses","chapter":3},{"book":"1-timoteo","chapter":1},{"book":"1-timoteo","chapter":2}]'::jsonb, null),
  (65, '1 Timóteo 3–5', '[{"book":"1-timoteo","chapter":3},{"book":"1-timoteo","chapter":4},{"book":"1-timoteo","chapter":5}]'::jsonb, null),
  (66, '1 Timóteo 6 a 2 Timóteo 2', '[{"book":"1-timoteo","chapter":6},{"book":"2-timoteo","chapter":1},{"book":"2-timoteo","chapter":2}]'::jsonb, null),
  (67, '2 Timóteo 3 a Tito 1', '[{"book":"2-timoteo","chapter":3},{"book":"2-timoteo","chapter":4},{"book":"tito","chapter":1}]'::jsonb, null),
  (68, 'Tito 2 a Filemom 1', '[{"book":"tito","chapter":2},{"book":"tito","chapter":3},{"book":"filemom","chapter":1}]'::jsonb, null),
  (69, 'Hebreus 1–3', '[{"book":"hebreus","chapter":1},{"book":"hebreus","chapter":2},{"book":"hebreus","chapter":3}]'::jsonb, null),
  (70, 'Hebreus 4–6', '[{"book":"hebreus","chapter":4},{"book":"hebreus","chapter":5},{"book":"hebreus","chapter":6}]'::jsonb, null),
  (71, 'Hebreus 7–9', '[{"book":"hebreus","chapter":7},{"book":"hebreus","chapter":8},{"book":"hebreus","chapter":9}]'::jsonb, null),
  (72, 'Hebreus 10–12', '[{"book":"hebreus","chapter":10},{"book":"hebreus","chapter":11},{"book":"hebreus","chapter":12}]'::jsonb, null),
  (73, 'Hebreus 13 a Tiago 2', '[{"book":"hebreus","chapter":13},{"book":"tiago","chapter":1},{"book":"tiago","chapter":2}]'::jsonb, null),
  (74, 'Tiago 3–5', '[{"book":"tiago","chapter":3},{"book":"tiago","chapter":4},{"book":"tiago","chapter":5}]'::jsonb, null),
  (75, '1 Pedro 1–3', '[{"book":"1-pedro","chapter":1},{"book":"1-pedro","chapter":2},{"book":"1-pedro","chapter":3}]'::jsonb, null),
  (76, '1 Pedro 4 a 2 Pedro 1', '[{"book":"1-pedro","chapter":4},{"book":"1-pedro","chapter":5},{"book":"2-pedro","chapter":1}]'::jsonb, null),
  (77, '2 Pedro 2 a 1 João 1', '[{"book":"2-pedro","chapter":2},{"book":"2-pedro","chapter":3},{"book":"1-joao","chapter":1}]'::jsonb, null),
  (78, '1 João 2–4', '[{"book":"1-joao","chapter":2},{"book":"1-joao","chapter":3},{"book":"1-joao","chapter":4}]'::jsonb, null),
  (79, '1 João 5 a 3 João 1', '[{"book":"1-joao","chapter":5},{"book":"2-joao","chapter":1},{"book":"3-joao","chapter":1}]'::jsonb, null),
  (80, 'Judas 1 a Apocalipse 2', '[{"book":"judas","chapter":1},{"book":"apocalipse","chapter":1},{"book":"apocalipse","chapter":2}]'::jsonb, null),
  (81, 'Apocalipse 3–5', '[{"book":"apocalipse","chapter":3},{"book":"apocalipse","chapter":4},{"book":"apocalipse","chapter":5}]'::jsonb, null),
  (82, 'Apocalipse 6–8', '[{"book":"apocalipse","chapter":6},{"book":"apocalipse","chapter":7},{"book":"apocalipse","chapter":8}]'::jsonb, null),
  (83, 'Apocalipse 9–11', '[{"book":"apocalipse","chapter":9},{"book":"apocalipse","chapter":10},{"book":"apocalipse","chapter":11}]'::jsonb, null),
  (84, 'Apocalipse 12–14', '[{"book":"apocalipse","chapter":12},{"book":"apocalipse","chapter":13},{"book":"apocalipse","chapter":14}]'::jsonb, null),
  (85, 'Apocalipse 15–17', '[{"book":"apocalipse","chapter":15},{"book":"apocalipse","chapter":16},{"book":"apocalipse","chapter":17}]'::jsonb, null),
  (86, 'Apocalipse 18–20', '[{"book":"apocalipse","chapter":18},{"book":"apocalipse","chapter":19},{"book":"apocalipse","chapter":20}]'::jsonb, null),
  (87, 'Apocalipse 21–22', '[{"book":"apocalipse","chapter":21},{"book":"apocalipse","chapter":22}]'::jsonb, null)
) as v(day_number, title, readings, note)
where p.slug = 'jornada-pelo-novo-testamento'
on conflict (plan_id, day_number) do nothing;
insert into public.reading_plans (slug, title, description, goal, cover_tone, cover_motif, sort_order, status)
values ('uma-jornada-de-gratidao', 'Uma jornada de gratidão', 'Dez dias de leituras sobre gratidão: para aprender a enxergar os cuidados de Deus nos detalhes da vida.', 'Cultivar um coração agradecido, mesmo nos dias comuns.', 'ivory', 'sun', 7, 'published')
on conflict (slug) do nothing;
insert into public.reading_plan_days (plan_id, day_number, title, readings, note)
select p.id, v.day_number, v.title, v.readings, v.note
from public.reading_plans p,
(values
  (1, 'Entrai com agradecimento', '[{"book":"salmos","chapter":100,"verseStart":null,"verseEnd":null}]'::jsonb, null),
  (2, 'Não te esqueças dos benefícios', '[{"book":"salmos","chapter":103,"verseStart":1,"verseEnd":14}]'::jsonb, null),
  (3, 'O que voltou para agradecer', '[{"book":"lucas","chapter":17,"verseStart":11,"verseEnd":19}]'::jsonb, null),
  (4, 'Em tudo dai graças', '[{"book":"1-tessalonicenses","chapter":5,"verseStart":12,"verseEnd":24}]'::jsonb, null),
  (5, 'Aprendi a contentar-me', '[{"book":"filipenses","chapter":4,"verseStart":10,"verseEnd":20}]'::jsonb, null),
  (6, 'Sua bondade dura para sempre', '[{"book":"salmos","chapter":136,"verseStart":1,"verseEnd":9}]'::jsonb, null),
  (7, 'Sede gratos', '[{"book":"colossenses","chapter":3,"verseStart":12,"verseEnd":17}]'::jsonb, null),
  (8, 'O Senhor é grande', '[{"book":"salmos","chapter":145,"verseStart":1,"verseEnd":13}]'::jsonb, null),
  (9, 'Todas as bênçãos espirituais', '[{"book":"efesios","chapter":1,"verseStart":3,"verseEnd":14}]'::jsonb, null),
  (10, 'Tudo quanto tem fôlego', '[{"book":"salmos","chapter":150,"verseStart":null,"verseEnd":null}]'::jsonb, null)
) as v(day_number, title, readings, note)
where p.slug = 'uma-jornada-de-gratidao'
on conflict (plan_id, day_number) do nothing;

commit;
