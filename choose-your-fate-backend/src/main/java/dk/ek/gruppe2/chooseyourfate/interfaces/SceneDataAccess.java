package dk.ek.gruppe2.chooseyourfate.interfaces;

import java.util.List;

import dk.ek.gruppe2.chooseyourfate.dto.scene.SceneLookaheadResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.scene.SceneResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.scene.CreateSceneRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.scene.UpdateSceneRequestDTO;

public interface SceneDataAccess {
    List<SceneResponseDTO> getAllScenes();

    SceneResponseDTO getSceneById(String id);

    SceneResponseDTO createScene(CreateSceneRequestDTO request);

    SceneResponseDTO updateScene(String id, UpdateSceneRequestDTO request);

    void deleteScene(String id);

    SceneLookaheadResponseDTO getSceneLookahead(String id);
}
