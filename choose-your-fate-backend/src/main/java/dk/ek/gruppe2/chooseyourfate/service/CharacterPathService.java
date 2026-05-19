package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.datasource.DataSourceResolver;
import dk.ek.gruppe2.chooseyourfate.dto.CharacterPathResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.UpdateCharacterPathRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.CharacterPathDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlCharacterPathService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CharacterPathService {

    private final DataSourceResolver dataSourceResolver;
    private final SqlCharacterPathService sqlCharacterPathService;

    public CharacterPathService(
            DataSourceResolver dataSourceResolver,
            SqlCharacterPathService sqlCharacterPathService
    ) {
        this.dataSourceResolver = dataSourceResolver;
        this.sqlCharacterPathService = sqlCharacterPathService;
    }

    public List<CharacterPathResponseDTO> getAllCharacterPaths(String sourceHeader) {
        return resolveDataAccess(sourceHeader).getAllCharacterPaths();
    }

    public CharacterPathResponseDTO getCharacterPathByCharacterId(String sourceHeader, Integer characterId) {
        return resolveDataAccess(sourceHeader).getCharacterPathByCharacterId(characterId);
    }

    public CharacterPathResponseDTO updateCharacterPath(
            String sourceHeader,
            Integer characterId,
            UpdateCharacterPathRequestDTO request
    ) {
        return resolveDataAccess(sourceHeader).updateCharacterPath(characterId, request);
    }

    private CharacterPathDataAccess resolveDataAccess(String sourceHeader) {
        DataSourceType dataSourceType = dataSourceResolver.resolve(sourceHeader);
        return switch (dataSourceType) {
            case SQL -> sqlCharacterPathService;
        };
    }
}
