package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.dto.CharacterResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.CreateCharacterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.CharacterDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlCharacterService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CharacterService {

    private final SqlCharacterService sqlCharacterService;

    public CharacterService(
            SqlCharacterService sqlCharacterService
    ) {
        this.sqlCharacterService = sqlCharacterService;
    }

    public List<CharacterResponseDTO> getAllCharacters(DataSourceType sourceHeader) {
        return resolveDataAccess(sourceHeader).getAllCharacters();
    }

    public CharacterResponseDTO getCharacterById(DataSourceType sourceHeader, String id) {
        return resolveDataAccess(sourceHeader).getCharacterById(Integer.parseInt(id));
    }

    public CharacterResponseDTO createCharacter(DataSourceType sourceHeader, CreateCharacterRequestDTO request) {
        return resolveDataAccess(sourceHeader).createCharacter(request);
    }

    public void deleteCharacter(DataSourceType sourceHeader, String id) {
        resolveDataAccess(sourceHeader).deleteCharacter(Integer.parseInt(id));
    }

    public List<CharacterResponseDTO> getCharactersByAccountId(DataSourceType sourceHeader, String id) {
        return resolveDataAccess(sourceHeader).getCharactersByAccountId(Integer.parseInt(id));
    }

    private CharacterDataAccess<Integer> resolveDataAccess(DataSourceType sourceHeader) {
        DataSourceType dataSourceType = sourceHeader == null ? DataSourceType.SQL : sourceHeader;
        return switch (dataSourceType) {
            case SQL -> sqlCharacterService;
        };
    }
}
