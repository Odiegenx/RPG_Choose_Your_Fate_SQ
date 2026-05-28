package dk.ek.gruppe2.chooseyourfate.controller;

import dk.ek.gruppe2.chooseyourfate.dto.RaceDetailsResponseDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.service.RaceDetailsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/race-details")
public class RaceDetailsController {

    private static final String DATA_SOURCE_HEADER = "X-Data-Source";

    private final RaceDetailsService raceDetailsService;

    public RaceDetailsController(RaceDetailsService raceDetailsService) {
        this.raceDetailsService = raceDetailsService;
    }

    @GetMapping
    public List<RaceDetailsResponseDTO> getAllRaceDetails(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource
    ) {
        return raceDetailsService.getAllRaceDetails(dataSource);
    }

    @GetMapping("/{id}")
    public RaceDetailsResponseDTO getRaceDetailsById(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer id
    ) {
        return raceDetailsService.getRaceDetailsById(dataSource, id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public RaceDetailsResponseDTO createRaceDetails(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource
    ) {
        return raceDetailsService.createRaceDetails(dataSource);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteRaceDetails(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer id
    ) {
        raceDetailsService.deleteRaceDetails(dataSource, id);
    }
}
