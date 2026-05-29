package dk.ek.gruppe2.chooseyourfate.controller;

import dk.ek.gruppe2.chooseyourfate.dto.ItemRequestDTO;
import dk.ek.gruppe2.chooseyourfate.dto.ItemResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import dk.ek.gruppe2.chooseyourfate.service.ItemService;
import java.util.List;

@RestController
@RequestMapping("/choose-your-fate/items")
public class ItemController {

    ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or @characterAuthorizationService.canAccessCharacter(#characterId, authentication)")
    public List<ItemResponseDTO> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @characterAuthorizationService.canAccessCharacter(#characterId, authentication)")
    public ItemResponseDTO getItemById(@PathVariable("id") Integer id) {
        return itemService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @characterAuthorizationService.canAccessCharacter(#characterId, authentication)")
    public ResponseEntity<ItemResponseDTO> createItem(@RequestBody ItemRequestDTO requestDTO) {
        return itemService.createItem(requestDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @characterAuthorizationService.canAccessCharacter(#characterId, authentication)")
    public ItemResponseDTO updateItem(
            @PathVariable("id") Integer id,
            @RequestBody ItemRequestDTO requestDTO) {
        return itemService.updateItem(id, requestDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @characterAuthorizationService.canAccessCharacter(#characterId, authentication)")
    public void deleteItem(
            @PathVariable("id") Integer id) {
        itemService.deleteItem(id);
    }
}

