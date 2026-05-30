import { useEffect, useRef, useState } from "react";
import { apiGet, apiPut } from "../api/authApi";
import { ShowDialog } from "../components/ShowDialog/ShowDialog";
import { useAuth } from "../context/AuthContext";
import type { Character, ChoiceResponse, Scene, SceneLookaheadResponse, SceneResponse } from "../types/general";

function toDialogScene(scene: SceneResponse, choices: ChoiceResponse[] = []): Scene {
    return {
        id: scene.id,
        dialog: [scene.name],
        img: "/images/Welcome.png",
        choices: choices.map((choice) => ({
            id: choice.id,
            name: choice.description,
            destination_id: choice.destinationSceneId
        }))
    };
}

function sceneIdsMatch(left: string | number, right: string | number) {
    return left.toString() === right.toString();
}

export default function Game() {
    const { token, loading: authLoading } = useAuth();
    const [scene, setScene] = useState<Scene | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const lookaheadRef = useRef<SceneLookaheadResponse | null>(null);
    const activeLookaheadRequest = useRef(0);

    async function loadLookahead(sceneId: number | string) {
        const lookahead: SceneLookaheadResponse = await apiGet(`scene/${sceneId}/lookahead`, { token });
        lookaheadRef.current = lookahead;
        setScene(toDialogScene(lookahead.scene, lookahead.choices));
        return lookahead;
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
                await loadLookahead(character.sceneId);
            } catch (err) {
                console.error(err);
                setError("Failed to load game.");
            } finally {
                setLoading(false);
            }
        }

        loadCharacterScene();
    }, [authLoading, token]);

    async function prefetchLookahead(sceneId: string | number) {
        const requestId = activeLookaheadRequest.current + 1;
        activeLookaheadRequest.current = requestId;

        const lookahead: SceneLookaheadResponse = await apiGet(`scene/${sceneId}/lookahead`, { token });

        if (activeLookaheadRequest.current !== requestId) {
            return;
        }

        lookaheadRef.current = lookahead;
        setScene(toDialogScene(lookahead.scene, lookahead.choices));
    }

    async function goTo(destinationSceneId: string | number, choiceId: string | number) {
        const characterId = localStorage.getItem("characterId");

        if (!characterId) {
            setError("No character selected.");
            return;
        }

        try {
            setError(null);
            const destinationScene = lookaheadRef.current?.destinationScenes.find((scene) =>
                sceneIdsMatch(scene.id, destinationSceneId)
            );

            if (destinationScene) {
                setScene(toDialogScene(destinationScene));
            } else {
                setLoading(true);
            }

            const [choiceResult, lookaheadResult] = await Promise.allSettled([
                apiPut(`character-paths/${characterId}/chosen/${choiceId}`, undefined, { token }),
                prefetchLookahead(destinationSceneId)
            ]);

            if (choiceResult.status === "rejected") {
                throw choiceResult.reason;
            }

            if (lookaheadResult.status === "rejected") {
                console.error(lookaheadResult.reason);
                alert("Scene loaded, but the next choices failed to load. Please try again.");
            }
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
