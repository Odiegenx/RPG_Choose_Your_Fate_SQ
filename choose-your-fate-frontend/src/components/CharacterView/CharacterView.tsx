import { useState } from "react";
import type { Character } from "../../types/general";
import CharacterList from "./CharacterList/CharacterList";
import CharacterDetailView from "./CharacterDetailView/CharacterDetailView";
import CharacterPathStory from "./CharacterPathStory/CharacterPathStory";

import "./CharacterView.css"

export default function CharacterView() {
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    
    return (
        <div id="vw-character" className="cw-container auto-width auto-height">
            <CharacterList onSelect={setSelectedCharacter} />
            {selectedCharacter && (
                <CharacterDetailView character={selectedCharacter} />
            )}
            {selectedCharacter && (
                <CharacterPathStory character={selectedCharacter}/>
            )}
        </div>
    );
}