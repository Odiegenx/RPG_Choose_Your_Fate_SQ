import { useNavigate } from "react-router-dom";
import type { Character, Props } from "../../../types/general";

import "./CharacterPathStory.css"
import { useRef, useState } from "react";
import { retreiveCall } from "../../../api/ttsApi";
import { useAuth } from "../../../context/AuthContext";

export default function CharacterPathStory({ character }: Props) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchAudio = async () => {
    try {
      const response = await retreiveCall(`tts/test`, "Hello", token!);

      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }

      const blob = await response.blob();
      console.log(blob.type, blob.size);
      setAudioUrl(URL.createObjectURL(blob));

      setTimeout(() => {
        audioRef.current?.play().catch(console.error);
      }, 100);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const handleStartGame = async () => {
    try {
      navigate("/game");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };
  
  return (
    <div id="character-path-story" className="cw-container-row auto-width auto-height">
        <p>Story so far</p>
        <button onClick={fetchAudio}>Generate Audio</button>

        {audioUrl && (
            <audio ref={audioRef} src={audioUrl || undefined} />
        )}
        <div id="paragraph">{"hello"}</div>
        
        <button onClick={handleStartGame}>Play</button>
    </div>
  );
}