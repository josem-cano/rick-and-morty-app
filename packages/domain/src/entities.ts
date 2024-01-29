import { Character as ApiCharacter } from "rickmortyapi";
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Character extends ApiCharacter {
  favourite: boolean;
}

export interface CharactersPage {
  characters: Character[];
  totalPages: number;
}
