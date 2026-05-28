package dk.ek.gruppe2.chooseyourfate.interfaces;

import dk.ek.gruppe2.chooseyourfate.dto.LoadoutResponseDTO;

public interface LoadoutDataAccess {

    LoadoutResponseDTO getLoadoutByCharacterId(Integer characterId);

    LoadoutResponseDTO unequipItem(Integer characterId,  Integer itemId);

    LoadoutResponseDTO equipItem(Integer characterId, Integer itemId);
}
