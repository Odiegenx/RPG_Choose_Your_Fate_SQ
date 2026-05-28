USE defaultdb;

CREATE EVENT clean_inventory_daily_aiven
ON SCHEDULE EVERY 1 DAY
DO
DELETE FROM inventory_has_item WHERE amount = 0;
