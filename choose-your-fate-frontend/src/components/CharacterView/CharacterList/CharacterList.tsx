import { useEffect, useState } from "react";
import { apiGet } from "../../../api/authApi";
import type { Character, CharacterListProps } from "../../../types/general";
import CharacterWindow from "./CharacterWindow/CharacterWindow";
import NewCharacterWindow from "./NewCharacterWindow/NewCharacterWindow";

import "./CharacterList.css"
import { useAuth } from "../../../context/AuthContext";

export default function CharacterList({ onSelect }: CharacterListProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const data: Character[] = await apiGet(`characters/all`, {token: token});
        

        setCharacters(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load character");
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="character-list-view">
      {characters.map((character) => (
        <CharacterWindow key={character.id} character={character} onSelect={onSelect} />
      ))}
      <NewCharacterWindow />
    </div>
  );
}