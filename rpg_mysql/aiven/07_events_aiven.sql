USE defaultdb;

DROP EVENT IF EXISTS `clean_inventory_daily`;
CREATE EVENT clean_inventory_daily
ON SCHEDULE EVERY 1 DAY
DO
DELETE FROM inventory_has_item WHERE amount = 0;
