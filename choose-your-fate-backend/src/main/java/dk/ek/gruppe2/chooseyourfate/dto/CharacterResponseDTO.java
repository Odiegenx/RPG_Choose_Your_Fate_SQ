package dk.ek.gruppe2.chooseyourfate.dto;

public class CharacterResponseDTO {

    private String id;
    private String accountId;
    private String chapterId;
    private String sceneId;
    private String raceDetailsId;
    private String name;
    private String flag;

    public CharacterResponseDTO() {
    }

    public CharacterResponseDTO(
            String id,
            String accountId,
            String chapterId,
            String sceneId,
            String raceDetailsId,
            String name,
            String flag
    ) {
        this.id = id;
        this.accountId = accountId;
        this.chapterId = chapterId;
        this.sceneId = sceneId;
        this.raceDetailsId = raceDetailsId;
        this.name = name;
        this.flag = flag;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getChapterId() {
        return chapterId;
    }

    public void setChapterId(String chapterId) {
        this.chapterId = chapterId;
    }

    public String getSceneId() {
        return sceneId;
    }

    public void setSceneId(String sceneId) {
        this.sceneId = sceneId;
    }

    public String getRaceDetailsId() {
        return raceDetailsId;
    }

    public void setRaceDetailsId(String raceDetailsId) {
        this.raceDetailsId = raceDetailsId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }
}
