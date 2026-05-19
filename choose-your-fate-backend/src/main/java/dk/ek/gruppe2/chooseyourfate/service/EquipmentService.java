package dk.ek.gruppe2.chooseyourfate.service;

import dk.ek.gruppe2.chooseyourfate.datasource.DataSourceResolver;
import dk.ek.gruppe2.chooseyourfate.dto.EquipmentResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.UpdateEquipmentRequestDTO;
import dk.ek.gruppe2.chooseyourfate.enums.DataSourceType;
import dk.ek.gruppe2.chooseyourfate.interfaces.EquipmentDataAccess;
import dk.ek.gruppe2.chooseyourfate.service.mysql.SqlEquipmentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {

    private final DataSourceResolver dataSourceResolver;
    private final SqlEquipmentService sqlEquipmentService;

    public EquipmentService(
            DataSourceResolver dataSourceResolver,
            SqlEquipmentService sqlEquipmentService
    ) {
        this.dataSourceResolver = dataSourceResolver;
        this.sqlEquipmentService = sqlEquipmentService;
    }

    public List<EquipmentResponseDTO> getAllEquipment(String sourceHeader) {
        return resolveDataAccess(sourceHeader).getAllEquipment();
    }

    public EquipmentResponseDTO getEquipmentByCharacterId(String sourceHeader, Integer characterId) {
        return resolveDataAccess(sourceHeader).getEquipmentByCharacterId(characterId);
    }

    public EquipmentResponseDTO updateEquipment(
            String sourceHeader,
            Integer characterId,
            UpdateEquipmentRequestDTO request
    ) {
        return resolveDataAccess(sourceHeader).updateEquipment(characterId, request);
    }

    private EquipmentDataAccess resolveDataAccess(String sourceHeader) {
        DataSourceType dataSourceType = dataSourceResolver.resolve(sourceHeader);
        return switch (dataSourceType) {
            case SQL -> sqlEquipmentService;
        };
    }
}
