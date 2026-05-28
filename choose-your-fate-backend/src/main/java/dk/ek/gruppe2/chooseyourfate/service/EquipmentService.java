package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.dto.EquipmentResponseDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.EquipmentDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlEquipmentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {

    private final SqlEquipmentService sqlEquipmentService;

    public EquipmentService(
        SqlEquipmentService sqlEquipmentService
    ) {
        this.sqlEquipmentService = sqlEquipmentService;
    }

    public List<EquipmentResponseDTO> getAllEquipment(DataSourceType sourceHeader) {
        return resolveDataAccess(sourceHeader).getAllEquipment();
    }

    public EquipmentResponseDTO getEquipmentByCharacterId(DataSourceType sourceHeader, Integer characterId) {
        return resolveDataAccess(sourceHeader).getEquipmentByCharacterId(characterId);
    }

    private EquipmentDataAccess resolveDataAccess(DataSourceType sourceHeader) {
        return switch (sourceHeader) {
            case SQL -> sqlEquipmentService;
        };
    }
}
