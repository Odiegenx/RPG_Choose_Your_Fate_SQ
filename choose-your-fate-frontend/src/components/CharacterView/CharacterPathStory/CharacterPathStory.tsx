import { useNavigate } from "react-router-dom";
import type { AiResponse, CharacterPath, CharacterPathStoryProps } from "../../../types/general";

import "./CharacterPathStory.css"
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiGet, apiGetBlob, apiPost } from "../../../api/authApi";

function base64ToAudioBlob(audioBlob: string) {
  const base64 = audioBlob.includes(",") ? audioBlob.split(",")[1] : audioBlob;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: "audio/mpeg" });
}

export default function CharacterPathStory({ character }: CharacterPathStoryProps) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function playAudioBlob(blob: Blob) {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioUrl(URL.createObjectURL(blob));

    setTimeout(() => {
      audioRef.current?.play().catch(console.error);
    }, 100);
  }

  useEffect(() => {
    async function fetchCharacterPath() {
      try {
        setLoadingSummary(true);

        const characterPath: CharacterPath = await apiGet(
          `character-paths/${character.characterId}`,
          { token: token }
        );

        setAudioBlob(characterPath.audioBlob);

        if (characterPath.summary === null) {
          const aiSummary: AiResponse = await apiPost(
            "ai/ask",
            {
              requestType: "PATH_SUMMARY",
              characterId: character.characterId,
            },
            { token: token }
          );

          setSummary(aiSummary.response);
          return;
        }

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
      if (audioBlob !== null) {
        playAudioBlob(base64ToAudioBlob(audioBlob));
        return;
      }

      const blob = await apiGetBlob("character-paths/" + character.characterId + `/audio`, {token: token});
      playAudioBlob(blob);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const handleStartGame = async () => {
    try {
      localStorage.setItem("characterId", character.characterId.toString());
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
