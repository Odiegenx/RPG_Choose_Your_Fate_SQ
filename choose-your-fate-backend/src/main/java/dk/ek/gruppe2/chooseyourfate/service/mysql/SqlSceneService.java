package dk.ek.gruppe2.chooseyourfate.service.mysql;

import dk.ek.gruppe2.chooseyourfate.dto.scene.SceneLookaheadResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.scene.SceneResponseDTO;

import java.util.List;

import org.springframework.stereotype.Service;

import dk.ek.gruppe2.chooseyourfate.dto.scene.CreateSceneRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.scene.UpdateSceneRequestDTO;
import dk.ek.gruppe2.chooseyourfate.exception.ResourceNotFoundException;
import dk.ek.gruppe2.chooseyourfate.interfaces.SceneDataAccess;
import dk.ek.gruppe2.chooseyourfate.model.mysql.Chapter;
import dk.ek.gruppe2.chooseyourfate.model.mysql.Scene;
import dk.ek.gruppe2.chooseyourfate.repository.mysql.ChapterRepository;
import dk.ek.gruppe2.chooseyourfate.repository.mysql.SceneRepository;

@Service
public class SqlSceneService implements SceneDataAccess {
    private final SceneRepository sceneRepository;
    private final ChapterRepository chapterRepository;

    public SqlSceneService(SceneRepository sceneRepository, ChapterRepository chapterRepository) {
        this.sceneRepository = sceneRepository;
        this.chapterRepository = chapterRepository;
    }

    @Override
    // Returns all SQL scenes with one-scene lookahead choices included.
    public List<SceneResponseDTO> getAllScenes() {
        return sceneRepository.findAllWithLookAhead()
                .stream()
                .map(SceneResponseDTO::new)
                .toList();
    }

    @Override
    // Returns one SQL scene with the choices and destination scenes already loaded.
    public SceneResponseDTO getSceneById(String id) {
        return new SceneResponseDTO(getSceneEntity(id));
    }

    @Override
    public SceneResponseDTO createScene(CreateSceneRequestDTO request) {
        Scene scene = request.toEntity(getChapterById(request.getChapterId()));
        return new SceneResponseDTO(sceneRepository.save(scene));
    }

    @Override
    public SceneResponseDTO updateScene(String id, UpdateSceneRequestDTO request) {
        Scene scene = getSceneEntity(id);
        scene.setName(request.getName());
        scene.setChapter(getChapterById(request.getChapterId()));
        return new SceneResponseDTO(sceneRepository.save(scene));
    }

    @Override
    public void deleteScene(String id) {
        Integer parsedId = Integer.parseInt(id);
        if (!sceneRepository.existsById(parsedId)) {
            throw new ResourceNotFoundException("Scene not found with id: " + id);
        }
        sceneRepository.deleteById(parsedId);
    }

    private Scene getSceneEntity(String id) {
        Integer parsedId = Integer.parseInt(id);
        return sceneRepository.findByIdWithLookAhead(parsedId)
                .orElseThrow(() -> new ResourceNotFoundException("Scene not found with id: " + id));
    }

    private Chapter getChapterById(Integer chapterId){
        return chapterRepository.findById(chapterId)
            .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id: " + chapterId));
    }

    @Override
    public SceneLookaheadResponseDTO getSceneLookahead(String id) {
        return new SceneLookaheadResponseDTO(getSceneEntity(id));
    }
}
