package dk.ek.gruppe2.chooseyourfate.controller;

import java.util.List;

import dk.ek.gruppe2.chooseyourfate.dto.scene.SceneLookaheadResponseDTO;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dk.ek.gruppe2.chooseyourfate.dto.scene.CreateSceneRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.scene.SceneResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.scene.UpdateSceneRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.service.SceneService;


@RestController
@RequestMapping("/choose-your-fate/scene")
public class SceneController {
    private static final String DATA_SOURCE_HEADER = "X-Data-Source";

    private final SceneService sceneService;

    public SceneController(SceneService sceneService) {
        this.sceneService = sceneService;
    }

    @GetMapping
    public List<SceneResponseDTO> getAllscenes(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource
    ) {
        return sceneService.getAllScenes(dataSource);
    }

    @GetMapping("/{id}")
    public SceneResponseDTO getsceneById(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable String id
    ) {
        return sceneService.getSceneById(dataSource, id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SceneResponseDTO createscene(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @RequestBody CreateSceneRequestDTO request
    ) {
        return sceneService.createScene(dataSource, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public SceneResponseDTO updatescene(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable String id,
            @RequestBody UpdateSceneRequestDTO request
    ) {
        return sceneService.updateScene(dataSource, id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletescene(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable String id
    ) {
        sceneService.deleteScene(dataSource, id);
    }

    @GetMapping("/{id}/lookahead")
    public SceneLookaheadResponseDTO getSceneLookahead(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable String id
    ) {
        return sceneService.getSceneLookahead(dataSource, id);
    }

}
