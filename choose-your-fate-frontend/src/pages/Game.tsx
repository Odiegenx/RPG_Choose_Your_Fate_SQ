import { useEffect, useState } from "react";
import { apiGet, apiPut } from "../api/authApi";
import { ShowDialog } from "../components/ShowDialog/ShowDialog";
import { useAuth } from "../context/AuthContext";
import type { Character, Scene, SceneLookaheadResponse } from "../types/general";

function toDialogScene(lookahead: SceneLookaheadResponse): Scene {
    return {
        id: lookahead.scene.id,
        dialog: [lookahead.scene.name],
        img: "/images/Welcome.png",
        choices: lookahead.choices.map((choice) => ({
            id: choice.id,
            name: choice.description,
            destination_id: choice.destinationSceneId
        }))
    };
}

export default function Game() {
    const { token, loading: authLoading } = useAuth();
    const [scene, setScene] = useState<Scene | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadScene(sceneId: number | string) {
        const lookahead: SceneLookaheadResponse = await apiGet(`scene/${sceneId}/lookahead`, { token });
        setScene(toDialogScene(lookahead));
    }

    useEffect(() => {
        async function loadCharacterScene() {
            if (authLoading) {
                return;
            }

            const characterId = localStorage.getItem("characterId");

            if (!characterId) {
                setError("No character selected.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const character: Character = await apiGet(`characters/${characterId}`, { token });
                await loadScene(character.sceneId);
            } catch (err) {
                console.error(err);
                setError("Failed to load game.");
            } finally {
                setLoading(false);
            }
        }

        loadCharacterScene();
    }, [authLoading, token]);

    async function goTo(sceneId: string | number, choiceId: string | number) {
        const characterId = localStorage.getItem("characterId");

        if (!characterId) {
            setError("No character selected.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await apiPut(`character-paths/${characterId}/chosen/${choiceId}`, undefined, { token });
            await loadScene(sceneId);
        } catch (err) {
            console.error(err);
            alert("Choice failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div>Loading game...</div>;
    }

    if (error || !scene) {
        return <div>{error ?? "No scene loaded."}</div>;
    }

    return <ShowDialog nextscene={scene} changeScene={goTo} />;
}
