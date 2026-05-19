USE defaultdb;

DELIMITER $$

DROP TRIGGER IF EXISTS `grant_rewards_after_quest_completion`$$
CREATE TRIGGER `grant_rewards_after_quest_completion` AFTER UPDATE ON `character_has_quest` FOR EACH ROW 
BEGIN
IF NEW.status = 1 THEN
	CALL sp_grant_quest_rewards(NEW.character_id, NEW.quest_id);
END IF;
END$$

DROP TRIGGER IF EXISTS `create_character_related_tables`$$
CREATE TRIGGER `create_character_related_tables` AFTER INSERT ON `character_avatar` FOR EACH ROW
BEGIN
INSERT INTO inventory (character_id)
VALUES (NEW.id);

INSERT INTO equipment (character_id)
VALUES (NEW.id);

INSERT INTO character_details (character_id, intelligence, charisma, fashion)
VALUES (NEW.id, 5, 5, 5);

INSERT INTO character_path (character_id)
VALUES (NEW.id);

END$$
DELIMITER ;

