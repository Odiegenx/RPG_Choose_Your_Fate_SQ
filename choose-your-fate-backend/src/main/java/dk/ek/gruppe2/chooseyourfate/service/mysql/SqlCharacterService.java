package dk.ek.gruppe2.chooseyourfate.service.mysql;

import dk.ek.gruppe2.chooseyourfate.dto.CharacterResponseDTO;
import dk.ek.gruppe2.chooseyourfate.dto.CreateCharacterRequestDTO;
import dk.ek.gruppe2.chooseyourfate.exception.ResourceNotFoundException;
import dk.ek.gruppe2.chooseyourfate.interfaces.CharacterDataAccess;
import dk.ek.gruppe2.chooseyourfate.model.mysql.Chapter;
import dk.ek.gruppe2.chooseyourfate.model.mysql.CharacterAvatar;
import dk.ek.gruppe2.chooseyourfate.model.mysql.RaceDetails;
import dk.ek.gruppe2.chooseyourfate.model.mysql.Scene;
import dk.ek.gruppe2.chooseyourfate.repository.mysql.ChapterRepository;
import dk.ek.gruppe2.chooseyourfate.repository.mysql.CharacterAvatarRepository;
import dk.ek.gruppe2.chooseyourfate.repository.mysql.RaceDetailsRepository;
import dk.ek.gruppe2.chooseyourfate.repository.mysql.SceneRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SqlCharacterService implements CharacterDataAccess<Integer> {

    @PersistenceContext
    private EntityManager entityManager;

    private final CharacterAvatarRepository characterAvatarRepository;
    private final ChapterRepository chapterRepository;
    private final SceneRepository sceneRepository;
    private final RaceDetailsRepository raceDetailsRepository;

    public SqlCharacterService(
            CharacterAvatarRepository characterAvatarRepository,
            ChapterRepository chapterRepository,
            SceneRepository sceneRepository,
            RaceDetailsRepository raceDetailsRepository
    ) {
        this.characterAvatarRepository = characterAvatarRepository;
        this.chapterRepository = chapterRepository;
        this.sceneRepository = sceneRepository;
        this.raceDetailsRepository = raceDetailsRepository;
    }

    @Override
    public List<CharacterResponseDTO> getAllCharacters() {
        return characterAvatarRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public CharacterResponseDTO getCharacterById(Integer id) {
        return toDto(getCharacterEntity(id));
    }

    @Override
    public CharacterResponseDTO createCharacter(CreateCharacterRequestDTO request) {
        if (request.getChapterId() == null || request.getSceneId() == null) {
            RaceDetails raceDetails = raceDetailsRepository.findById(request.getRaceDetailsId())
                    .orElseThrow(() -> new ResourceNotFoundException("Race details not found with id: " + request.getRaceDetailsId()));

            Chapter startingChapter = raceDetails.getStartingChapter();
            if (startingChapter == null) {
                throw new ResourceNotFoundException("Starting chapter not configured for race details with id: " + request.getRaceDetailsId());
            }

            Scene startingScene = startingChapter.getStartingScene();
            if (startingScene == null) {
                throw new ResourceNotFoundException("Starting scene not configured for race details with id: " + request.getRaceDetailsId());
            }

            request.setChapterId(startingChapter.getId());
            request.setSceneId(startingScene.getId());
        }

        validateCreateRequest(request);

        StoredProcedureQuery storedProcedure = entityManager.createStoredProcedureQuery("sp_create_character");
        storedProcedure.registerStoredProcedureParameter("p_account_id", Integer.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_chapter_id", Integer.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_scene_id", Integer.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_race_detail_id", Integer.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_name", String.class, ParameterMode.IN);
        storedProcedure.registerStoredProcedureParameter("p_character_id", Integer.class, ParameterMode.OUT);

        storedProcedure.setParameter("p_account_id", request.getAccountId());
        storedProcedure.setParameter("p_chapter_id", request.getChapterId());
        storedProcedure.setParameter("p_scene_id", request.getSceneId());
        storedProcedure.setParameter("p_race_detail_id", request.getRaceDetailsId());
        storedProcedure.setParameter("p_name", request.getName());

        storedProcedure.execute();

        Integer createdCharacterId = (Integer) storedProcedure.getOutputParameterValue("p_character_id");
        return toDto(getCharacterEntity(createdCharacterId));
    }

    @Override
    public void deleteCharacter(Integer id) {
        if (!characterAvatarRepository.existsById(id)) {
            throw new ResourceNotFoundException("Character not found with id: " + id);
        }

        StoredProcedureQuery storedProcedure = entityManager.createStoredProcedureQuery("sp_delete_character");
        storedProcedure.registerStoredProcedureParameter("p_character_id", Integer.class, ParameterMode.IN);
        storedProcedure.setParameter("p_character_id", id);
        storedProcedure.execute();
    }

    //Made to retreive all characters connected to the account that is logged in.
    @Override
    public List<CharacterResponseDTO> getCharactersByAccountId(Integer id) {
        return getCharacterentitesByAccountId(id).stream()
                .map(this::toDto)
                .toList();
    }

    private List<CharacterAvatar> getCharacterentitesByAccountId(Integer id) {
        return characterAvatarRepository.findByAccount_Id(id);
    }

    private CharacterAvatar getCharacterEntity(Integer id) {
        return characterAvatarRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Character not found with id: " + id));
    }

    // In this SQL implementation, referenced entities are validated before insert so the service fails fast with clear errors
    // and avoids database-level foreign key violations. This method also enforces domain-specific consistency, such as
    // ensuring that the selected scene belongs to the selected chapter.
    private void validateCreateRequest(CreateCharacterRequestDTO request) {
        if (!chapterRepository.existsById(request.getChapterId())) {
            throw new ResourceNotFoundException("Chapter not found with id: " + request.getChapterId());
        }

        if (!raceDetailsRepository.existsById(request.getRaceDetailsId())) {
            throw new ResourceNotFoundException("Race details not found with id: " + request.getRaceDetailsId());
        }

        var scene = sceneRepository.findById(request.getSceneId())
                .orElseThrow(() -> new ResourceNotFoundException("Scene not found with id: " + request.getSceneId()));

        if (!scene.getChapter().getId().equals(request.getChapterId())) {
            throw new IllegalArgumentException("Selected scene does not belong to the selected chapter.");
        }
    }

    private CharacterResponseDTO toDto(CharacterAvatar character) {
        return new CharacterResponseDTO(
                character.getId().toString(),
                character.getAccount().getId().toString(),
                character.getChapter().getId().toString(),
                character.getScene().getId().toString(),
                character.getRaceDetails().getId().toString(),
                character.getName(),
                character.getFlag()
        );
    }
}
