package dk.ek.gruppe2.chooseyourfate.controller;

import dk.ek.gruppe2.chooseyourfate.dto.CharacterResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.CreateCharacterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.service.CharacterService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/choose-your-fate/characters")
public class CharacterController {

    private static final String DATA_SOURCE_HEADER = "X-Data-Source";

    private final CharacterService characterService;

    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CharacterResponseDTO> getAllCharacters(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) DataSourceType dataSource
    ) {
        return characterService.getAllCharacters(dataSource);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @characterAuthorizationService.canAccessCharacter(#id, authentication)")
    public CharacterResponseDTO getCharacterById(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) DataSourceType dataSource,
            @PathVariable String id
    ) {
        
        return characterService.getCharacterById(dataSource, id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @accountAuthorizationService.canModifyAccount(#request.accountId, authentication)")
    public CharacterResponseDTO createCharacter(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) DataSourceType dataSource,
            @RequestBody CreateCharacterRequestDTO request
    ) {
        return characterService.createCharacter(dataSource, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @characterAuthorizationService.canAccessCharacter(#id, authentication)")
    public void deleteCharacter(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) DataSourceType dataSource,
            @PathVariable String id
    ) {
        characterService.deleteCharacter(dataSource, id);
    }
    
    @GetMapping("/all")
    public List<CharacterResponseDTO> getCharactersByAccountId(
            @RequestHeader(value = DATA_SOURCE_HEADER, required = false) DataSourceType dataSource,
            Authentication auth
    ) {
        Map<String, Object> extraInfo =  (Map<String, Object>) auth.getDetails(); 

        Object accountId = extraInfo.get("sqlId");

        return characterService.getCharactersByAccountId(dataSource, accountId.toString());
    }
}
