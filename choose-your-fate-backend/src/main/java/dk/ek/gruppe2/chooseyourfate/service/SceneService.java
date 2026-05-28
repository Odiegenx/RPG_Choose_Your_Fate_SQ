package dk.ek.gruppe2.chooseyourfate.service;

import java.util.List;

import dk.ek.gruppe2.chooseyourfate.dto.scene.SceneLookaheadResponseDTO;
import org.springframework.stereotype.Service;

import dk.ek.gruppe2.chooseyourfate.dto.scene.CreateSceneRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.scene.SceneResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.scene.UpdateSceneRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.SceneDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlSceneService;

@Service
public class SceneService {

    private final SqlSceneService sqlSceneService;

    public SceneService(
            SqlSceneService sqlSceneService
    ) {
        this.sqlSceneService = sqlSceneService;
    }

    public List<SceneResponseDTO> getAllScenes(DataSourceType source) {
        return resolveDataService(source).getAllScenes();
    }

    public SceneResponseDTO getSceneById(DataSourceType source, String id) {
        return resolveDataService(source).getSceneById(id);
    }

    public SceneResponseDTO createScene(DataSourceType source, CreateSceneRequestDTO request) {
        return resolveDataService(source).createScene(request);
    }

    public SceneResponseDTO updateScene(DataSourceType source, String id, UpdateSceneRequestDTO request) {
        return resolveDataService(source).updateScene(id, request);
    }

    public void deleteScene(DataSourceType source, String id) {
        resolveDataService(source).deleteScene(id);
    }

    public SceneLookaheadResponseDTO getSceneLookahead(DataSourceType source, String id) {
        return resolveDataService(source).getSceneLookahead(id);
    }
    private SceneDataAccess resolveDataService(DataSourceType source) {
        return switch (source) {
            case SQL -> sqlSceneService;
            default -> throw new IllegalArgumentException("Unexpected value: " + source);
        };
    }
}
