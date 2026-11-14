/**
 * "Preciso de uma palavra": conteúdo inicial, original do projeto Refúgio.
 * O texto tem caráter de acolhimento espiritual e não substitui
 * acompanhamento profissional, pastoral ou serviços de emergência.
 */
import type { NeedTopicSlug } from "@/types/content";
import type { BibleReference } from "@/lib/bible/reference";

export interface NeedSeed {
  topic: NeedTopicSlug;
  label: string;
  title: string;
  reference: BibleReference;
  context: string;
  reflection: string;
  hope: string;
  prayer: string;
  furtherReadings: BibleReference[];
}

const r = (book: string, chapter: number, verseStart?: number, verseEnd?: number): BibleReference => ({
  book,
  chapter,
  verseStart: verseStart ?? null,
  verseEnd: verseEnd ?? null,
});

export const NEED_SEEDS: NeedSeed[] = [
  {
    topic: "triste",
    label: "Estou triste",
    title: "Quando a alma está abatida",
    reference: r("salmos", 42, 11),
    context:
      "O Salmo 42 foi escrito por alguém que estava longe do lugar onde costumava adorar e se sentia distante de Deus. Ao longo do salmo, ele conversa com a própria alma, sem esconder a tristeza.",
    reflection:
      "A Bíblia não pede que você esconda o que sente. O salmista pergunta à própria alma: \"Por que estás abatida?\". Ele dá nome à dor antes de falar de esperança.\n\nTalvez hoje você não tenha forças para muito mais do que isso: reconhecer que está triste. Isso já é um começo honesto diante de Deus. A tristeza não afasta você dele.",
    hope:
      "A frase \"eu ainda o louvarei\" fala de um futuro. Ela não exige que a alegria volte agora, mas lembra que este não é o fim da história.",
    prayer:
      "Deus, minha alma está abatida e nem sempre sei explicar por quê. Recebe a minha tristeza como ela é. Fica comigo e devolve, no Teu tempo, a esperança ao meu coração. Amém.",
    furtherReadings: [r("salmos", 42, 1, 5), r("mateus", 5, 4), r("apocalipse", 21, 4)],
  },
  {
    topic: "medo",
    label: "Estou com medo",
    title: "Você não está sozinho diante do medo",
    reference: r("isaias", 41, 10),
    context:
      "O profeta Isaías fala a um povo que vivia em exílio, longe da sua terra e sem saber o que viria. Nesse cenário de incerteza, Deus fala diretamente ao medo deles.",
    reflection:
      "Repare quantas vezes Deus diz \"eu\" neste versículo: eu estou contigo, eu sou teu Deus, eu te fortaleço, eu te ajudo, eu te sustento. A resposta ao medo não é uma ordem para ser forte sozinho; é a promessa de uma presença.\n\nO medo pode continuar ali por um tempo. Mas ele não precisa ser a voz mais alta.",
    hope:
      "A mão que sustenta você é descrita como firme e justa. Você pode dar o próximo passo sabendo que não caminha sem apoio.",
    prayer:
      "Senhor, estou com medo. Segura a minha mão. Lembra-me de que Tu estás comigo e me sustentas. Dá-me coragem para o próximo passo. Amém.",
    furtherReadings: [r("salmos", 27, 1), r("josue", 1, 9), r("2-timoteo", 1, 7)],
  },
  {
    topic: "ansiedade",
    label: "Estou ansioso",
    title: "Entregar o que pesa na mente",
    reference: r("filipenses", 4, 6, 7),
    context:
      "Paulo escreveu a carta aos Filipenses enquanto estava preso, sem saber se seria libertado. Ainda assim, é uma das cartas mais cheias de alegria do Novo Testamento.",
    reflection:
      "Paulo não diz \"pare de sentir ansiedade\" como se fosse simples. Ele indica um caminho: transformar cada preocupação em oração e lembrar, ao mesmo tempo, do que já recebemos.\n\nOrar não é ignorar os problemas. É colocá-los diante de quem pode carregá-los conosco.",
    hope:
      "A promessa é de uma paz que guarda o coração e a mente, como um guarda que protege uma cidade. Ela pode chegar antes mesmo de as respostas chegarem.",
    prayer:
      "Pai, minha mente está acelerada. Coloco diante de Ti cada preocupação. Obrigado pelo que já fizeste por mim. Guarda o meu coração e os meus pensamentos com a Tua paz. Amém.",
    furtherReadings: [r("mateus", 6, 25, 34), r("1-pedro", 5, 7), r("salmos", 94, 19)],
  },
  {
    topic: "solidao",
    label: "Estou me sentindo sozinho",
    title: "Chamado pelo nome",
    reference: r("isaias", 43, 1, 2),
    context:
      "Deus fala ao seu povo lembrando que foi ele quem o formou. As imagens de águas e fogo representam os momentos mais difíceis da caminhada.",
    reflection:
      "\"Chamei a ti por teu nome; tu és meu.\" Antes de qualquer promessa, Deus lembra que conhece você pessoalmente. Você não é um rosto qualquer na multidão.\n\nA solidão pode fazer parecer que ninguém vê o que estamos vivendo. Mas a promessa é clara: quando passares pelas águas, estarei contigo.",
    hope:
      "Mesmo nos lugares onde ninguém mais está, Deus diz \"estarei contigo\". E ele também pode colocar pessoas no seu caminho. Vale a pena dar um pequeno passo em direção a alguém.",
    prayer:
      "Senhor, sinto-me só. Obrigado porque me conheces pelo nome. Faz-me sentir a Tua presença e coloca no meu caminho pessoas com quem eu possa partilhar a vida. Amém.",
    furtherReadings: [r("salmos", 139, 7, 10), r("mateus", 28, 20), r("hebreus", 13, 5)],
  },
  {
    topic: "desanimo",
    label: "Estou desanimado",
    title: "Força para quem já não tem vigor",
    reference: r("isaias", 40, 29, 31),
    context:
      "Este capítulo de Isaías começa com a palavra \"consolai\". É uma mensagem de ânimo a um povo cansado de esperar por mudanças.",
    reflection:
      "\"Até os jovens se cansam.\" A Bíblia reconhece que o desânimo faz parte da vida de todos. Não é sinal de fé fraca.\n\nA promessa é para os que confiam no Senhor. Às vezes a força renovada aparece como asas de águia; outras vezes, como a capacidade de continuar caminhando sem desistir.",
    hope:
      "Deus multiplica as forças de quem não tem vigor. Você não precisa ter tudo de que precisa hoje; precisa apenas do suficiente para este dia.",
    prayer:
      "Deus, estou sem ânimo. Não consigo enxergar muito à frente. Renova as minhas forças e ajuda-me a não desistir. Amém.",
    furtherReadings: [r("galatas", 6, 9), r("2-corintios", 4, 16, 18), r("salmos", 73, 26)],
  },
  {
    topic: "esperanca",
    label: "Preciso de esperança",
    title: "O Deus da esperança",
    reference: r("romanos", 15, 13),
    context:
      "Paulo encerra uma longa parte da carta aos Romanos com esta bênção. Ele escrevia a uma comunidade diversa, com tensões internas, desejando que a esperança os unisse.",
    reflection:
      "Esperança, na Bíblia, não é otimismo ingênuo. É confiança em quem Deus é. Por isso Paulo o chama de \"Deus da esperança\".\n\nQuando a nossa esperança acaba, a dele continua. E ele pode enchê-la novamente em nós, aos poucos, \"no poder do Espírito Santo\".",
    hope:
      "A palavra usada é \"abundeis\": transbordar. Hoje pode ser só uma gota, mas Deus é capaz de fazer crescer.",
    prayer:
      "Deus da esperança, enche o meu coração de alegria e paz. Onde só vejo cansaço, faz nascer esperança. Amém.",
    furtherReadings: [r("lamentacoes", 3, 21, 23), r("jeremias", 29, 11), r("hebreus", 6, 19)],
  },
  {
    topic: "paz",
    label: "Preciso de paz",
    title: "A paz que Jesus deixa",
    reference: r("joao", 14, 27),
    context:
      "Jesus disse estas palavras na última ceia com os discípulos, pouco antes de ser preso. Ele os preparava para dias muito difíceis.",
    reflection:
      "A paz que Jesus oferece não depende de tudo estar resolvido. Ele a deixou justamente quando as coisas estavam prestes a ficar mais difíceis.\n\n\"Não se perturbe vosso coração.\" É um convite gentil a entregar a ele o que nos agita por dentro.",
    hope:
      "Você pode receber essa paz como um presente. Ela não precisa ser conquistada; é dada.",
    prayer:
      "Jesus, recebo a paz que Tu deixaste. Acalma o meu coração. Tira de mim a agitação e o medo. Amém.",
    furtherReadings: [r("salmos", 4, 8), r("isaias", 26, 3), r("colossenses", 3, 15)],
  },
  {
    topic: "gratidao",
    label: "Quero agradecer",
    title: "Não te esqueças dos benefícios",
    reference: r("salmos", 103, 1, 5),
    context:
      "Davi começa o salmo falando consigo mesmo, convocando a própria alma a louvar. É uma lembrança deliberada de tudo o que Deus fez.",
    reflection:
      "Gratidão também é memória. \"Não te esqueças de nenhum dos benefícios dele.\" Às vezes precisamos lembrar a nós mesmos do cuidado que já recebemos.\n\nAgradecer não muda apenas o nosso humor: muda a forma como enxergamos a vida e a presença de Deus nela.",
    hope:
      "Cada lembrança de bondade é um sinal de que Deus continua agindo. O mesmo cuidado de ontem acompanha você hoje.",
    prayer:
      "Senhor, obrigado. Obrigado pelo cuidado que nem sempre percebo, pelas pessoas que colocaste na minha vida e pelo Teu amor constante. Amém.",
    furtherReadings: [r("1-tessalonicenses", 5, 18), r("salmos", 100, 4, 5), r("colossenses", 3, 17)],
  },
  {
    topic: "aproximar-de-deus",
    label: "Quero me aproximar de Deus",
    title: "O Pai que corre ao nosso encontro",
    reference: r("lucas", 15, 20),
    context:
      "Este versículo faz parte da parábola que Jesus contou sobre um filho que saiu de casa e, depois de muito tempo, decidiu voltar. É uma das histórias mais conhecidas sobre o amor de Deus.",
    reflection:
      "O filho ainda estava longe quando o pai o viu. E o pai correu. Não esperou um discurso perfeito nem uma vida organizada.\n\nSe você deseja se aproximar de Deus, saiba que ele já está olhando na sua direção. Não é preciso saber as palavras certas. Basta dar o primeiro passo.",
    hope:
      "O pai da história teve compaixão. É assim que Deus recebe quem se aproxima: com abraço, não com acusação.",
    prayer:
      "Deus, quero estar mais perto de Ti. Não sei bem por onde começar, mas aqui estou. Recebe-me como sou e ensina-me a conhecer-Te. Amém.",
    furtherReadings: [r("jeremias", 29, 12, 13), r("tiago", 4, 8), r("apocalipse", 3, 20)],
  },
  {
    topic: "dificuldades",
    label: "Estou passando por dificuldades",
    title: "Abatidos, porém não destruídos",
    reference: r("2-corintios", 4, 8, 9),
    context:
      "Paulo escreve sobre o próprio ministério, marcado por perseguições, viagens perigosas e muitas perdas. Ele não esconde as dificuldades.",
    reflection:
      "Paulo usa pares de palavras: afligidos, mas não esmagados; perplexos, mas não desesperados. Ele não nega o primeiro lado de cada par, mas mostra que ele não é a palavra final.\n\nTalvez você esteja vivendo o lado \"afligido\" agora. A promessa é que existe também o lado \"não esmagado\".",
    hope:
      "As dificuldades são reais, mas não têm a última palavra. Há uma força que sustenta você por dentro, mesmo quando tudo por fora pesa.",
    prayer:
      "Senhor, estou passando por um tempo difícil. Sustenta-me para que eu não seja esmagado. Dá-me sabedoria, ajuda prática e pessoas que caminhem comigo. Amém.",
    furtherReadings: [r("romanos", 8, 28), r("salmos", 46, 1), r("joao", 16, 33)],
  },
];
