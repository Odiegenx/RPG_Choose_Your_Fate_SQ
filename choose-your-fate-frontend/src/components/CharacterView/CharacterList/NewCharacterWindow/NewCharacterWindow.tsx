import type { NewCharacterWindowProps } from "../../../../types/general";
import "./NewCharacterWindow.css"

export default function NewCharacterWindow({ onSelect }: NewCharacterWindowProps) {
  const handleOpenCharacterView = async () => {
      onSelect({accountId: "", chapterId: "", flag: "", id: "new-char", name: "", raceDetailsId: "", sceneId: ""});
  };

  return (
    <div id="new-character-window" onClick={handleOpenCharacterView}>
      <div className="new-character-info">
        <p>{"New Character"}</p>
      </div>

      <div>
        <i className="arrow right"></i>
      </div>
    </div>
  );
}