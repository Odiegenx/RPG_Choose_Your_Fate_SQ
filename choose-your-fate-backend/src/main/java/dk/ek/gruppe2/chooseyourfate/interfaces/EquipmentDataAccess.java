package dk.ek.gruppe2.chooseyourfate.interfaces;

import dk.ek.gruppe2.chooseyourfate.dto.EquipmentResponseDTO;

import java.util.List;

public interface EquipmentDataAccess {

    List<EquipmentResponseDTO> getAllEquipment();

    EquipmentResponseDTO getEquipmentByCharacterId(Integer characterId);
}
