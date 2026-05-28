package dk.ek.gruppe2.chooseyourfate.interfaces;

import java.util.List;

import dk.ek.gruppe2.chooseyourfate.dto.chapter.ChapterResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.chapter.CreateChapterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.chapter.UpdateChapterRequestDTO;


public interface ChapterDataAccess {
    List<ChapterResponseDTO> getAllChapters();

    ChapterResponseDTO getChapterById(Integer id);

    ChapterResponseDTO createChapter(CreateChapterRequestDTO request);

    ChapterResponseDTO updateChapter(Integer id, UpdateChapterRequestDTO request);

    void deleteChapter(Integer id);
    
    Integer getStartingSceneByChapterId(Integer id);
}