package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.dto.chapter.ChapterResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.chapter.CreateChapterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.chapter.UpdateChapterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.ChapterDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlChapterService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChapterService {

    private final SqlChapterService sqlChapterService;

    public ChapterService(
            SqlChapterService sqlChapterService
    ) {
        this.sqlChapterService = sqlChapterService;
    }

    public List<ChapterResponseDTO> getAllChapters(DataSourceType source) {
        return resolveDataService(source).getAllChapters();
    }

    public ChapterResponseDTO getChapterById(DataSourceType source, Integer id) {
        return resolveDataService(source).getChapterById(id);
    }

    public ChapterResponseDTO createChapter(DataSourceType source, CreateChapterRequestDTO request) {
        return resolveDataService(source).createChapter(request);
    }

    public ChapterResponseDTO updateChapter(DataSourceType source, Integer id, UpdateChapterRequestDTO request) {
        return resolveDataService(source).updateChapter(id, request);
    }

    public void deleteChapter(DataSourceType source, Integer id) {
        resolveDataService(source).deleteChapter(id);
    }

    public ChapterResponseDTO registerChapter(CreateChapterRequestDTO request) {
        return sqlChapterService.createChapter(request);
    }

    private ChapterDataAccess resolveDataService(DataSourceType source) {
        return switch (source) {
            case SQL -> sqlChapterService;
            default -> throw new IllegalArgumentException("Unexpected value: " + source);
        };
    }
}
