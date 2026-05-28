package dk.ek.gruppe2.chooseyourfate.controller;

import dk.ek.gruppe2.chooseyourfate.dto.CharacterDetailsResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.UpdateCharacterDetailsRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.service.CharacterDetailsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/character-details")
public class CharacterDetailsController {

    private static final String DATA_SOURCE_HEADER = "X-Data-Source";

    private final CharacterDetailsService characterDetailsService;

    public CharacterDetailsController(CharacterDetailsService characterDetailsService) {
        this.characterDetailsService = characterDetailsService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CharacterDetailsResponseDTO> getAllCharacterDetails(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource
    ) {
        return characterDetailsService.getAllCharacterDetails(dataSource);
    }

    @GetMapping("/{characterId}")
    @PreAuthorize("hasRole('ADMIN') or @characterAuthorizationService.canAccessCharacter(#characterId, authentication)")
    public CharacterDetailsResponseDTO getCharacterDetailsByCharacterId(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer characterId
    ) {
        return characterDetailsService.getCharacterDetailsByCharacterId(dataSource, characterId);
    }

    @PutMapping("/{characterId}")
    @PreAuthorize("hasRole('ADMIN') or @characterAuthorizationService.canAccessCharacter(#characterId, authentication)")
    public CharacterDetailsResponseDTO updateCharacterDetails(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = true) DataSourceType dataSource,
            @PathVariable Integer characterId,
            @RequestBody UpdateCharacterDetailsRequestDTO request
    ) {
        return characterDetailsService.updateCharacterDetails(dataSource, characterId, request);
    }
}
