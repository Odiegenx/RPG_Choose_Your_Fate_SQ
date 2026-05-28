package dk.ek.gruppe2.chooseyourfate.interfaces;

import dk.ek.gruppe2.chooseyourfate.dto.InventoryResponseDTO;

public interface InventoryDataAccess {

    InventoryResponseDTO getInventoryByCharacterId(Integer characterId);

    InventoryResponseDTO addItemToInventory(Integer inventoryId, Integer itemId);

    void useItem(Integer inventoryId, Integer itemId);
}
