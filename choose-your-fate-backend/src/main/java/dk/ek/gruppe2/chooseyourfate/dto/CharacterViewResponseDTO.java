package dk.ek.gruppe2.chooseyourfate.dto;

public record CharacterViewResponseDTO(
        Integer characterId,
        String characterName,
        Integer chapterId,
        String chapterName,
        Integer raceDetailsId,
        String raceName,
        CharacterStatsDTO stats,
        Boolean canCreateMoreCharacters
) {
}
