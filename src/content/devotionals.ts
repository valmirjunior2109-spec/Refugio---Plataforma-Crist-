/**
 * Palavras do dia: conteúdo inicial, original do projeto Refúgio.
 * Só as referências bíblicas ficam aqui. O texto é sempre lido da Bíblia Livre,
 * então não existe passagem escrita à mão.
 * Em modo demonstração, as datas são atribuídas a partir de hoje (o 1º item é "hoje").
 */
import type { BibleReference } from "@/lib/bible/reference";

export interface DevotionalSeed {
  slug: string;
  title: string;
  reference: BibleReference;
  reflection: string;
  application: string;
  prayer: string;
}

export const DEVOTIONAL_SEEDS: DevotionalSeed[] = [
  {
    slug: "deus-e-nosso-refugio",
    title: "Um lugar seguro no meio da tempestade",
    reference: { book: "salmos", chapter: 46, verseStart: 1, verseEnd: 3 },
    reflection:
      "O salmista não descreve um dia tranquilo. Ele fala de terra que se move, de montanhas que caem no mar, de águas que rugem. E é justamente aí, no meio do que parece desabar, que ele afirma: Deus é nosso refúgio e força.\n\nRefúgio não é a ausência de tempestade. É o lugar onde podemos nos abrigar enquanto ela passa. A fé não nos pede que finjamos que está tudo bem; ela nos convida a descobrir que não estamos desprotegidos.",
    application:
      "Pense em algo que hoje parece instável na sua vida. Em vez de tentar resolver tudo de uma vez, reserve um minuto em silêncio e entregue essa situação a Deus com palavras simples.",
    prayer:
      "Senhor, há coisas ao meu redor que parecem fora do lugar. Seja Tu o meu abrigo hoje. Ensina-me a descansar em Ti enquanto as águas se agitam. Amém.",
  },
  {
    slug: "o-senhor-e-meu-pastor",
    title: "Guiado por quem conhece o caminho",
    reference: { book: "salmos", chapter: 23, verseStart: 1, verseEnd: 4 },
    reflection:
      "Davi conhecia bem o trabalho de um pastor: procurar pasto, encontrar água, proteger as ovelhas à noite. Quando ele diz que o Senhor é o seu pastor, está dizendo que alguém cuida dele com esse mesmo zelo.\n\nO salmo não promete que não haverá vales escuros. Promete companhia dentro deles: \"tu estás comigo\". O cuidado de Deus não nos afasta de toda dificuldade, mas nos acompanha em cada passo.",
    application:
      "Hoje, observe um momento simples de cuidado, como uma refeição, uma conversa ou um descanso. Agradeça por ele como sinal de que você está sendo guiado.",
    prayer:
      "Bom Pastor, conduze-me hoje. Quando eu não enxergar o caminho, lembra-me de que Tu estás comigo. Restaura a minha alma. Amém.",
  },
  {
    slug: "vinde-a-mim",
    title: "Um convite para quem está cansado",
    reference: { book: "mateus", chapter: 11, verseStart: 28, verseEnd: 30 },
    reflection:
      "Jesus não chama apenas os fortes, os organizados ou os que já entenderam tudo. Ele chama os cansados e sobrecarregados. É um convite para quem chegou ao limite.\n\nEle se apresenta como manso e humilde de coração. O descanso que oferece não vem de uma lista de exigências, mas de caminhar ao lado de alguém que nos trata com gentileza.",
    application:
      "Escreva, mesmo que só em pensamento, o que mais pesa sobre você hoje. Depois, diga a Jesus: \"Eu trago isto até Ti\".",
    prayer:
      "Jesus, estou cansado de carregar tanto. Aceito o Teu convite. Dá-me o descanso que só Tu podes dar e ensina-me o Teu jeito manso de viver. Amém.",
  },
  {
    slug: "nao-temas",
    title: "Quando o medo fala alto",
    reference: { book: "isaias", chapter: 41, verseStart: 10 },
    reflection:
      "Estas palavras foram dirigidas a um povo que vivia longe de casa, inseguro quanto ao futuro. Deus não minimiza o medo deles. Ele oferece algo maior: sua presença.\n\n\"Eu estou contigo\", \"eu sou teu Deus\", \"eu te fortaleço\", \"te ajudo\", \"te sustento\". Cada frase começa com Deus agindo. A coragem nasce menos da nossa força e mais da certeza de quem está ao nosso lado.",
    application:
      "Quando o medo surgir hoje, repita devagar uma das frases deste versículo, como \"eu estou contigo\", e respire fundo antes de seguir.",
    prayer:
      "Deus, Tu conheces os meus medos. Segura-me com a Tua mão. Que a Tua presença fale mais alto do que a minha insegurança. Amém.",
  },
  {
    slug: "a-paz-que-guarda",
    title: "Trocar a ansiedade pela oração",
    reference: { book: "filipenses", chapter: 4, verseStart: 6, verseEnd: 7 },
    reflection:
      "Paulo escreveu estas palavras enquanto estava preso. Ele sabia o que era viver sem garantias. Mesmo assim, apresenta um caminho: levar a Deus cada pedido, com gratidão.\n\nA promessa não é que tudo será resolvido do jeito que imaginamos, mas que a paz de Deus vai guardar o nosso coração e a nossa mente. É uma paz que não depende de entender tudo.",
    application:
      "Faça uma lista curta de três preocupações e, ao lado de cada uma, algo pelo qual você é grato. Ore por elas juntas.",
    prayer:
      "Pai, entrego a Ti as preocupações que ocupam minha mente. Obrigado pelo que já tens feito. Guarda o meu coração com a Tua paz. Amém.",
  },
  {
    slug: "ele-tem-cuidado-de-voce",
    title: "Você é cuidado",
    reference: { book: "1-pedro", chapter: 5, verseStart: 7 },
    reflection:
      "Pedro escreve a comunidades que enfrentavam dificuldades reais. O conselho é simples e profundo: lançar sobre Deus toda a ansiedade. Não uma parte. Toda.\n\nO motivo é ainda mais bonito: \"porque ele tem cuidado de vós\". Não entregamos nossas aflições a alguém distante, mas a alguém que se importa com cada detalhe da nossa vida.",
    application:
      "Escolha uma preocupação específica e entregue-a em oração. Sempre que ela voltar à mente hoje, lembre-se: \"já entreguei isso a quem cuida de mim\".",
    prayer:
      "Senhor, obrigado por cuidares de mim. Lanço sobre Ti esta ansiedade que me acompanha. Ajuda-me a não pegá-la de volta. Amém.",
  },
  {
    slug: "novas-a-cada-manha",
    title: "Misericórdias que se renovam",
    reference: { book: "lamentacoes", chapter: 3, verseStart: 22, verseEnd: 23 },
    reflection:
      "O livro de Lamentações nasceu de uma grande perda. Ainda assim, no meio do choro, o autor encontra um ponto de apoio: as misericórdias de Deus não têm fim e se renovam a cada manhã.\n\nNem todo dia começa leve. Mas cada manhã traz consigo uma nova porção da fidelidade de Deus, suficiente para o dia que começa.",
    application:
      "Amanhã cedo, antes de olhar o celular, diga em voz baixa: \"grande é a tua fidelidade\". Deixe que essa seja a primeira palavra do seu dia.",
    prayer:
      "Deus fiel, obrigado porque o Teu amor não se esgota. Renova em mim a esperança a cada manhã. Amém.",
  },
  {
    slug: "forca-para-o-cansado",
    title: "Força renovada",
    reference: { book: "isaias", chapter: 40, verseStart: 29, verseEnd: 31 },
    reflection:
      "O texto reconhece algo muito humano: até os jovens se cansam. Ninguém é forte o tempo todo. A fraqueza não é um fracasso espiritual, é parte da nossa condição.\n\nA promessa é para os que confiam no Senhor: forças renovadas. Às vezes isso significa voar como águia; outras vezes, simplesmente caminhar sem desistir. As duas coisas são vitórias.",
    application:
      "Respeite o seu cansaço hoje. Escolha uma pausa real, mesmo que breve, e use-a para descansar diante de Deus, sem cobranças.",
    prayer:
      "Senhor, Tu dás força ao cansado. Eu sou um deles hoje. Renova as minhas forças, nem que seja para dar o próximo passo. Amém.",
  },
  {
    slug: "nada-nos-separara",
    title: "Um amor do qual nada nos separa",
    reference: { book: "romanos", chapter: 8, verseStart: 38, verseEnd: 39 },
    reflection:
      "Paulo faz uma lista que parece cobrir tudo: morte, vida, presente, futuro, altura, profundeza. Nada disso, diz ele, pode nos separar do amor de Deus em Cristo Jesus.\n\nHá dias em que nos sentimos distantes de Deus. Mas o amor dele não depende do que sentimos naquele momento. Ele permanece firme, mesmo quando nós vacilamos.",
    application:
      "Se algo faz você se sentir distante de Deus hoje, nomeie essa coisa e diga: \"nem isso pode me separar do amor de Deus\".",
    prayer:
      "Pai, obrigado por um amor que não me abandona. Quando eu duvidar, lembra-me de que nada pode me separar de Ti. Amém.",
  },
  {
    slug: "a-paz-de-jesus",
    title: "Uma paz diferente",
    reference: { book: "joao", chapter: 14, verseStart: 27 },
    reflection:
      "Jesus disse estas palavras aos seus amigos pouco antes de viver os momentos mais difíceis da sua vida. Eles estavam confusos e com medo. E ele lhes deixa um presente: a sua paz.\n\nÉ uma paz que não é como a do mundo, que depende de tudo estar em ordem. É uma paz que pode existir mesmo quando as circunstâncias ainda não mudaram.",
    application:
      "Identifique um lugar ou momento do seu dia em que costuma ficar agitado. Antes de entrar nele, peça em silêncio: \"Jesus, dá-me a tua paz\".",
    prayer:
      "Jesus, recebo a paz que Tu deixaste. Acalma o meu coração e afasta dele o medo. Amém.",
  },
  {
    slug: "confia-de-todo-coracao",
    title: "Confiar quando não entendemos",
    reference: { book: "proverbios", chapter: 3, verseStart: 5, verseEnd: 6 },
    reflection:
      "Provérbios é um livro sobre sabedoria prática. E um dos seus conselhos mais conhecidos é justamente reconhecer os limites do nosso próprio entendimento.\n\nConfiar em Deus não significa deixar de pensar ou planejar. Significa reconhecê-lo em todos os caminhos, inclusive naqueles que ainda não compreendemos totalmente.",
    application:
      "Pense em uma decisão que você precisa tomar. Antes de decidir, ore por ela e peça a Deus clareza e serenidade.",
    prayer:
      "Senhor, eu não entendo tudo, mas quero confiar em Ti de todo o coração. Endireita as minhas veredas. Amém.",
  },
  {
    slug: "gratidao-em-tudo",
    title: "Gratidão como modo de viver",
    reference: { book: "1-tessalonicenses", chapter: 5, verseStart: 16, verseEnd: 18 },
    reflection:
      "São três frases curtas: alegrai-vos, orai, agradecei. Parecem simples, mas formam um jeito inteiro de viver.\n\nAgradecer em tudo não é agradecer por tudo, como se a dor fosse boa. É aprender a encontrar, mesmo nos dias difíceis, sinais de que Deus continua presente.",
    application:
      "Antes de dormir, anote três coisas pelas quais você é grato hoje, por menores que pareçam.",
    prayer:
      "Pai, abre os meus olhos para ver os Teus cuidados no meu dia. Ensina-me a viver com gratidão. Amém.",
  },
  {
    slug: "basta-a-cada-dia",
    title: "Um dia de cada vez",
    reference: { book: "mateus", chapter: 6, verseStart: 33, verseEnd: 34 },
    reflection:
      "Jesus conhecia bem a tendência humana de viver no amanhã, antecipando problemas que ainda não chegaram. Seu conselho é libertador: basta a cada dia o seu mal.\n\nBuscar primeiro o Reino de Deus é colocar nossas prioridades no lugar certo e confiar que o Pai, que cuida das aves, também cuida de nós.",
    application:
      "Quando a mente correr para o futuro hoje, traga-a de volta com uma pergunta: \"o que eu preciso fazer apenas hoje?\".",
    prayer:
      "Senhor, ajuda-me a viver o hoje com confiança. Entrego a Ti o amanhã e tudo o que ainda não sei. Amém.",
  },
  {
    slug: "esperanca-que-transborda",
    title: "O Deus da esperança",
    reference: { book: "romanos", chapter: 15, verseStart: 13 },
    reflection:
      "Paulo chama Deus de \"o Deus da esperança\". É um nome bonito: esperança não é apenas algo que Deus nos dá, é parte de quem ele é.\n\nA oração do apóstolo é que sejamos cheios de alegria e paz, a ponto de transbordarmos esperança. Não por esforço próprio, mas pelo poder do Espírito Santo.",
    application:
      "Pense em alguém que precisa de esperança hoje. Envie uma mensagem de carinho ou ore por essa pessoa pelo nome.",
    prayer:
      "Deus da esperança, enche o meu coração de alegria e paz. Que a esperança transborde de mim para quem está ao meu redor. Amém.",
  },
];
