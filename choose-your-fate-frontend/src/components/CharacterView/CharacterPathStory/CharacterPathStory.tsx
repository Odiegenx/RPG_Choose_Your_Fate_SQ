import { useNavigate } from "react-router-dom";
import type { CharacterPath, CharacterPathStoryProps } from "../../../types/general";

import "./CharacterPathStory.css"
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiGet } from "../../../api/authApi";

export default function CharacterPathStory({ character }: CharacterPathStoryProps) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchCharacterPath() {
      try {
        setLoadingSummary(true);

        const characterPath: CharacterPath = await apiGet(
          `character-paths/${character.characterId}`,
          { token: token }
        );

        setSummary(characterPath.summary);
      } catch (err) {
        console.error(err);
        alert("Failed to load character path");
      } finally {
        setLoadingSummary(false);
      }
    }

    if (character?.characterId) {
      fetchCharacterPath();
    }
  }, [character, token]);

  const fetchAudio = async () => {
    try {
      const response = await apiGet("character-paths/" + character.characterId + `/audio`, {token: token});

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
        <p>Story so far for {character.characterName}</p>
        <button onClick={fetchAudio} className="max-height-40">Generate Audio</button>

        {audioUrl && (
            <audio ref={audioRef} src={audioUrl || undefined} />
        )}
        <div id="paragraph">{loadingSummary ? "Loading story..." : summary}</div>
        
        <button onClick={handleStartGame}>Play</button>
    </div>
  );
}
