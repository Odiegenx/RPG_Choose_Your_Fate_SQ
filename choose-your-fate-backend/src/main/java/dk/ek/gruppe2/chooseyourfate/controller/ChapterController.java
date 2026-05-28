package dk.ek.gruppe2.chooseyourfate.controller;

import java.util.List;

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

import dk.ek.gruppe2.chooseyourfate.dto.chapter.ChapterResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.chapter.CreateChapterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.chapter.UpdateChapterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.service.ChapterService;

@RestController
@RequestMapping("/choose-your-fate/chapter")
public class ChapterController {
    private static final String DATA_SOURCE_HEADER = "X-Data-Source";

    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @GetMapping
    public List<ChapterResponseDTO> getAllChapters(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource
    ) {
        return chapterService.getAllChapters(dataSource);
    }

    @GetMapping("/{id}")
    public ChapterResponseDTO getChapterById(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer id
    ) {
        return chapterService.getChapterById(dataSource, id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ChapterResponseDTO createChapter(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @RequestBody CreateChapterRequestDTO request
    ) {
        return chapterService.createChapter(dataSource, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ChapterResponseDTO updateChapter(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer id,
            @RequestBody UpdateChapterRequestDTO request
    ) {
        return chapterService.updateChapter(dataSource, id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteChapter(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer id
    ) {
        chapterService.deleteChapter(dataSource, id);
    }
}
