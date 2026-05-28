package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.dto.CharacterDetailsResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.UpdateCharacterDetailsRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.CharacterDetailsDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlCharacterDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CharacterDetailsService {

    private final SqlCharacterDetailsService sqlCharacterDetailsService;

    public CharacterDetailsService(
        SqlCharacterDetailsService sqlCharacterDetailsService
    ) {
        this.sqlCharacterDetailsService = sqlCharacterDetailsService;
    }

    public List<CharacterDetailsResponseDTO> getAllCharacterDetails(DataSourceType sourceHeader) {
        return resolveDataAccess(sourceHeader).getAllCharacterDetails();
    }

    public CharacterDetailsResponseDTO getCharacterDetailsByCharacterId(DataSourceType sourceHeader, Integer characterId) {
        return resolveDataAccess(sourceHeader).getCharacterDetailsByCharacterId(characterId);
    }

    public CharacterDetailsResponseDTO updateCharacterDetails(
            DataSourceType sourceHeader,
            Integer characterId,
            UpdateCharacterDetailsRequestDTO request
    ) {
        return resolveDataAccess(sourceHeader).updateCharacterDetails(characterId, request);
    }

    private CharacterDetailsDataAccess resolveDataAccess(DataSourceType sourceHeader) {
        return switch (sourceHeader) {
            case SQL -> sqlCharacterDetailsService;
        };
    }
}