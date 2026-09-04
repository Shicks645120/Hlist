import type { TagDef, TagGroup } from "./types";

export const TAG_GROUP_LABELS: Record<TagGroup, string> = {
  subgenre: "Sous-genre",
  tone: "Ton",
  threat: "Menace",
  setting: "Cadre",
  intensity: "Intensité",
  pace: "Rythme",
};

export const TAGS: TagDef[] = [
  // subgenre
  { id: "slasher", label: "Slasher", group: "subgenre" },
  { id: "folk", label: "Folk horror", group: "subgenre" },
  { id: "found-footage", label: "Found footage", group: "subgenre" },
  { id: "psychologique", label: "Psychologique", group: "subgenre" },
  { id: "supernatural", label: "Surnaturel", group: "subgenre" },
  { id: "body-horror", label: "Body horror", group: "subgenre" },
  { id: "creature", label: "Créature", group: "subgenre" },
  { id: "haunting", label: "Maison hantée", group: "subgenre" },
  { id: "possession", label: "Possession", group: "subgenre" },
  { id: "cosmic", label: "Horreur cosmique", group: "subgenre" },
  { id: "survival", label: "Survival", group: "subgenre" },
  { id: "anthology", label: "Anthologie", group: "subgenre" },
  // tone
  { id: "gore", label: "Gore", group: "tone" },
  { id: "atmospherique", label: "Atmosphérique", group: "tone" },
  { id: "comedie-horreur", label: "Comédie-horreur", group: "tone" },
  { id: "satire", label: "Satire", group: "tone" },
  { id: "tragique", label: "Tragique", group: "tone" },
  { id: "paranoid", label: "Paranoïa", group: "tone" },
  // threat
  { id: "mask", label: "Masque / tueur", group: "threat" },
  { id: "demon", label: "Démon", group: "threat" },
  { id: "ghost", label: "Fantôme", group: "threat" },
  { id: "vampire", label: "Vampire", group: "threat" },
  { id: "zombie", label: "Zombie", group: "threat" },
  { id: "witch", label: "Sorcellerie", group: "threat" },
  { id: "alien", label: "Extraterrestre", group: "threat" },
  { id: "cult", label: "Culte", group: "threat" },
  { id: "human-evil", label: "Mal humain", group: "threat" },
  { id: "monster", label: "Monstre", group: "threat" },
  // setting
  { id: "suburbia", label: "Banlieue", group: "setting" },
  { id: "rural", label: "Campagne", group: "setting" },
  { id: "urban", label: "Ville", group: "setting" },
  { id: "isolated", label: "Lieu isolé", group: "setting" },
  { id: "period", label: "Période historique", group: "setting" },
  { id: "space", label: "Espace", group: "setting" },
  { id: "japan", label: "Japon", group: "setting" },
  { id: "italy", label: "Italie / giallo", group: "setting" },
  // intensity
  { id: "mild", label: "Modérée", group: "intensity" },
  { id: "intense", label: "Intense", group: "intensity" },
  { id: "extreme", label: "Extrême", group: "intensity" },
  // pace
  { id: "slow-burn", label: "Slow burn", group: "pace" },
  { id: "fast", label: "Rythme rapide", group: "pace" },
  { id: "classic", label: "Classique", group: "pace" },
  { id: "modern", label: "Contemporain", group: "pace" },
];

export const TAG_BY_ID = Object.fromEntries(TAGS.map((t) => [t.id, t]));

export function tagLabel(id: string): string {
  return TAG_BY_ID[id]?.label ?? id;
}
