import type { CharacterWindowProps } from "../../../../types/general";
import "./CharacterWindow.css"



export default function CharacterWindow({ character, onSelect }: CharacterWindowProps) {

  const handleOpenCharacterView = async () => {
    onSelect(character);
  };

  return (
    <div id="character-window" onClick={handleOpenCharacterView}>
      <div className="character-info">
        <p>{character?.name ?? "Name"}</p>
        <p>{character?.chapterId ?? "Chapter"}</p>
        <p>{character?.raceDetailsId ?? "Race"}</p>
        {/* Stats maybe? */}
      </div>

      <div>
        <i className="arrow right"></i>
      </div>
    </div>
  );
}