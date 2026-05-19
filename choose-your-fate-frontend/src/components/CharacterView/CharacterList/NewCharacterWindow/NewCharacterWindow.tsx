import "./NewCharacterWindow.css"

export default function NewCharacterWindow() {
  return (
    <div id="new-character-window">
      <div className="new-character-info">
        <p>{"New Character"}</p>
      </div>

      <div>
        <i className="arrow right"></i>
      </div>
    </div>
  );
}