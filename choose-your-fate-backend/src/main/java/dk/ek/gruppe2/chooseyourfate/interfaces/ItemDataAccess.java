package dk.ek.gruppe2.chooseyourfate.interfaces;

import dk.ek.gruppe2.chooseyourfate.dto.ItemRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.ItemResponseDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ItemDataAccess {
    List<ItemResponseDTO> getAllItems();

    ItemResponseDTO findById(Integer id);

    ResponseEntity<ItemResponseDTO> createItem(ItemRequestDTO requestDTO);

    ItemResponseDTO updateItem(Integer id, ItemRequestDTO requestDTO);

    void deleteItem(Integer id);
}
