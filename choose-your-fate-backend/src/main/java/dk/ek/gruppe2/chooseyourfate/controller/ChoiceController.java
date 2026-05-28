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

import dk.ek.gruppe2.chooseyourfate.dto.choice.ChoiceResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.choice.CreateChoiceRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.choice.UpdateChoiceRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.service.ChoiceService;


@RestController
@RequestMapping("/choose-your-fate/choices")
public class ChoiceController {
    private static final String DATA_SOURCE_HEADER = "X-Data-Source";

    private final ChoiceService choiceService;

    public ChoiceController(ChoiceService choiceService) {
        this.choiceService = choiceService;
    }

    @GetMapping
    public List<ChoiceResponseDTO> getAllChoices(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource
    ) {
        return choiceService.getAllChoices(dataSource);
    }

    @GetMapping("/{id}")
    public ChoiceResponseDTO getChoiceById(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer id
    ) {
        return choiceService.getChoiceById(dataSource, id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ChoiceResponseDTO createChoice(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @RequestBody CreateChoiceRequestDTO request
    ) {
        return choiceService.createChoice(dataSource, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ChoiceResponseDTO updateChoice(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer id,
            @RequestBody UpdateChoiceRequestDTO request
    ) {
        return choiceService.updateChoice(dataSource, id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteChoice(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer id
    ) {
        choiceService.deleteChoice(dataSource, id);
    }
}
