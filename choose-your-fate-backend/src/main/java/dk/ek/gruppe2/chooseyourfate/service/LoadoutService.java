package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.dto.LoadoutResponseDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.LoadoutDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlLoadoutService;
import org.springframework.stereotype.Service;

@Service
public class LoadoutService {

    private final SqlLoadoutService sqlLoadoutService;

    public LoadoutService(
            SqlLoadoutService sqlLoadoutService
    ) {
        this.sqlLoadoutService = sqlLoadoutService;
    }

    public LoadoutResponseDTO getLoadoutByCharacterId(DataSourceType source, Integer characterId) {
        return resolveDataService(source).getLoadoutByCharacterId(characterId);
    }

    public LoadoutResponseDTO unequipItem(DataSourceType source, Integer characterId, Integer itemId) {
        return resolveDataService(source).unequipItem(characterId, itemId);
    }

    public LoadoutResponseDTO equipItem(DataSourceType source, Integer characterId, Integer itemId) {
        return resolveDataService(source).equipItem(characterId, itemId);
    }

    private LoadoutDataAccess resolveDataService(DataSourceType source) {
        return switch (source) {
            case SQL -> sqlLoadoutService;
        };
    }

}
