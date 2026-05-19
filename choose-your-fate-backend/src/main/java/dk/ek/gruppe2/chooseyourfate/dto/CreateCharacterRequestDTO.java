package dk.ek.gruppe2.chooseyourfate.dto;

import jakarta.validation.constraints.NotNull;

public class CreateCharacterRequestDTO {
    @NotNull(message = "accountId is required")
    private Integer accountId;

    private Integer chapterId;
    private Integer sceneId;
    
    @NotNull(message = "race details id is required")
    private Integer raceDetailsId;
    private String name;

    public CreateCharacterRequestDTO() {
    }

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public Integer getRaceDetailsId() {
        return raceDetailsId;
    }

    public void setRaceDetailsId(Integer raceDetailsId) {
        this.raceDetailsId = raceDetailsId;
    }

    public Integer getChapterId() {
        return chapterId;
    }

    public void setChapterId(Integer chapterId) {
        this.chapterId = chapterId;
    }

    public Integer getSceneId() {
        return sceneId;
    }

    public void setSceneId(Integer sceneId) {
        this.sceneId = sceneId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
