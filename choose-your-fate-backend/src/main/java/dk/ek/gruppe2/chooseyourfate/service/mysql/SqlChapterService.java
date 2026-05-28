package dk.ek.gruppe2.chooseyourfate.service.mysql;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dk.ek.gruppe2.chooseyourfate.dto.chapter.ChapterResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.chapter.CreateChapterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.chapter.UpdateChapterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.exception.ResourceNotFoundException;
import dk.ek.gruppe2.chooseyourfate.interfaces.ChapterDataAccess;
import dk.ek.gruppe2.chooseyourfate.model.mysql.Chapter;
import dk.ek.gruppe2.chooseyourfate.model.mysql.Scene;
import dk.ek.gruppe2.chooseyourfate.repository.mysql.ChapterRepository;
import dk.ek.gruppe2.chooseyourfate.repository.mysql.SceneRepository;

@Service
public class SqlChapterService implements ChapterDataAccess {

    private final ChapterRepository chapterRepository;
    private final SceneRepository sceneRepository;

    public SqlChapterService(ChapterRepository chapterRepository, SceneRepository sceneRepository) {
        this.chapterRepository = chapterRepository;
        this.sceneRepository = sceneRepository;
    }

    @Override
    public List<ChapterResponseDTO> getAllChapters() {
        return chapterRepository.findAll()
                .stream()
                .map(ChapterResponseDTO::new)
                .toList();
    }

    @Override
    public ChapterResponseDTO getChapterById(Integer id) {
        return new ChapterResponseDTO(getChapterEntity(id));
    }

    @Override
    public ChapterResponseDTO createChapter(CreateChapterRequestDTO request) {
        Chapter chapter = request.toEntity();
        return new ChapterResponseDTO(chapterRepository.save(chapter));
    }

    @Override
    public ChapterResponseDTO updateChapter(Integer id, UpdateChapterRequestDTO request) {
        Chapter chapter = getChapterEntity(id);
        chapter.setName(request.getName());
        chapter.setScenes(request.getScenes());
        chapter.setCharacters(request.getCharacters());
        if (request.getStartingSceneId() == null) {
            chapter.setStartingScene(null);
        } else {
            chapter.setStartingScene(sceneRepository.findById(request.getStartingSceneId())
                .orElseThrow(() -> new ResourceNotFoundException("Scene not found with id: " + request.getStartingSceneId())));
        }

        return new ChapterResponseDTO(chapterRepository.save(chapter));
    }

    @Override
    public void deleteChapter(Integer id) {
        if (!chapterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Chapter not found with id: " + id);
        }
        chapterRepository.deleteById(id);
    }

    @Override
    public Integer getStartingSceneByChapterId(Integer id) {
        return Optional.ofNullable(
            getChapterEntity(id).getStartingScene()
        )
        .map(Scene::getId)
        .orElseThrow(() ->
            new ResourceNotFoundException(
                "Scene not found for chapter id: " + id
            )
        );
    }

    private Chapter getChapterEntity(Integer id) {
        return chapterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found with id: " + id));
    }
}