USE defaultdb;

DELIMITER $$

DROP FUNCTION IF EXISTS `fn_is_quest_complete`$$
CREATE FUNCTION `fn_is_quest_complete`(p_character_id INT, p_quest_id INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
DECLARE v_quest_status BOOLEAN;
SELECT EXISTS (
    SELECT 1
    FROM character_has_quest
    WHERE character_id = p_character_id
      AND quest_id = p_quest_id
      AND `status` = 1
) INTO v_quest_status;
RETURN v_quest_status;
END$$

DROP FUNCTION IF EXISTS `fn_has_required_item`$$
CREATE FUNCTION `fn_has_required_item`(p_character_id INT, p_item_id INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
DECLARE v_character_has_item BOOLEAN;
SELECT EXISTS (
	SELECT 1 FROM inventory_has_item
	INNER JOIN inventory on inventory.id = inventory_has_item.inventory_id
	WHERE inventory.character_id = p_character_id AND inventory_has_item.item_id = p_item_id
    ) INTO v_character_has_item;
RETURN v_character_has_item;
END$$

DELIMITER ;
