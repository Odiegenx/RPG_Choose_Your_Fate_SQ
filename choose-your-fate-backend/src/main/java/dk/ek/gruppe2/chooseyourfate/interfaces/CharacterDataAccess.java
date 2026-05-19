package dk.ek.gruppe2.chooseyourfate.interfaces;

import dk.ek.gruppe2.chooseyourfate.dto.CharacterResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.CreateCharacterRequestDTO;

import java.util.List;

public interface CharacterDataAccess<T> {

    List<CharacterResponseDTO> getAllCharacters();

    CharacterResponseDTO getCharacterById(T id);

    CharacterResponseDTO createCharacter(CreateCharacterRequestDTO request);

    void deleteCharacter(T id);

    List<CharacterResponseDTO> getCharactersByAccountId(T id);

}
