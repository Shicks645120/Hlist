import type { QuizQuestion } from "./types";

/**
 * Chaque réponse ajoute un groupe OR (au moins un tag du groupe).
 * Les questions se combinent ensuite par score, pas par AND strict.
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: "nature",
    prompt: "Quelle menace te fait le plus frissonner ?",
    multi: false,
    answers: [
      {
        id: "supernatural",
        label: "Forces surnaturelles",
        include: ["supernatural", "demon", "ghost", "possession", "haunting"],
      },
      {
        id: "human",
        label: "Le mal humain, sans magie",
        include: ["human-evil", "slasher", "mask"],
      },
      {
        id: "creature",
        label: "Une créature ou un monstre",
        include: ["creature", "monster", "alien", "zombie", "vampire"],
      },
      { id: "any-threat", label: "Peu importe" },
    ],
  },
  {
    id: "subgenre",
    prompt: "Quel type d’horreur cherches-tu ?",
    multi: false,
    answers: [
      {
        id: "slasher",
        label: "Slasher / tueur masqué",
        include: ["slasher", "mask"],
      },
      {
        id: "psycho",
        label: "Psychologique / malaise",
        include: ["psychologique", "paranoid"],
      },
      {
        id: "folk",
        label: "Folk / rituels / campagne",
        include: ["folk", "witch", "cult", "rural"],
      },
      {
        id: "found",
        label: "Found footage / caméra à l’épaule",
        include: ["found-footage"],
      },
      {
        id: "haunt",
        label: "Maison hantée / possession",
        include: ["haunting", "possession", "ghost", "demon"],
      },
      { id: "any-sub", label: "Surprends-moi" },
    ],
  },
  {
    id: "tone",
    prompt: "Quel ton préfères-tu ?",
    multi: false,
    answers: [
      {
        id: "atm",
        label: "Atmosphère et tension lente",
        include: ["atmospherique", "slow-burn"],
      },
      {
        id: "gore",
        label: "Sang et chocs visuels",
        include: ["gore", "extreme", "body-horror"],
      },
      {
        id: "fun",
        label: "Horreur avec un sourire",
        include: ["comedie-horreur", "satire"],
      },
      { id: "any-tone", label: "Les deux me vont" },
    ],
  },
  {
    id: "setting",
    prompt: "Où se passe l’histoire ?",
    multi: false,
    answers: [
      {
        id: "iso",
        label: "Lieu isolé / piégé",
        include: ["isolated", "survival", "space"],
      },
      {
        id: "sub",
        label: "Banlieue rassurante… trop",
        include: ["suburbia", "urban"],
      },
      {
        id: "rural",
        label: "Campagne / nature",
        include: ["rural", "folk"],
      },
      {
        id: "city",
        label: "Ville",
        include: ["urban", "suburbia"],
      },
      { id: "any-set", label: "Peu importe" },
    ],
  },
  {
    id: "intensity",
    prompt: "Jusqu’où oses-tu aller ?",
    multi: false,
    answers: [
      {
        id: "mild",
        label: "Frissons sans trop de gore",
        include: ["mild", "atmospherique", "slow-burn"],
        exclude: ["extreme"],
      },
      {
        id: "intense",
        label: "Intense, mais digérable",
        include: ["intense", "gore", "psychologique"],
      },
      {
        id: "extreme",
        label: "Le plus dérangeant possible",
        include: ["extreme", "gore", "body-horror"],
      },
      { id: "any-int", label: "Je m’adapte" },
    ],
  },
  {
    id: "era",
    prompt: "Classique ou contemporain ?",
    multi: false,
    answers: [
      { id: "classic", label: "Les grands classiques", include: ["classic"] },
      { id: "modern", label: "Horreur récente", include: ["modern"] },
      { id: "any-era", label: "Les deux" },
    ],
  },
  {
    id: "extras",
    prompt: "Des envies précises ? (plusieurs possibles)",
    multi: true,
    answers: [
      { id: "witch", label: "Sorcellerie / culte", include: ["witch", "cult"] },
      { id: "body", label: "Body horror", include: ["body-horror"] },
      { id: "cosmic", label: "Horreur cosmique", include: ["cosmic"] },
      { id: "vamp", label: "Vampires", include: ["vampire"] },
      { id: "zombie", label: "Zombies", include: ["zombie"] },
      { id: "alien", label: "Extraterrestres", include: ["alien"] },
      { id: "none-extra", label: "Rien de plus" },
    ],
  },
];
