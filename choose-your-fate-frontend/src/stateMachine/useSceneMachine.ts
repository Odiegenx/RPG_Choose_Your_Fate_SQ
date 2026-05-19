import { useState } from "react";
import { scenes } from "./scenes";

export function useSceneMachine(initialScene = 0) {
  const [sceneId, setSceneId] = useState(initialScene);

  const scene = scenes[sceneId];

  function goTo(nextId: number) {
    setSceneId(nextId);
  }

  return {
    scene,
    goTo
  };
}