USE choose_your_fate;

-- Spring security expects these exact values when using hasRole("USER") / hasRole("ADMIN").
UPDATE account
SET role = 'ROLE_USER'
WHERE role IS NULL
   OR role NOT IN ('ROLE_USER', 'ROLE_ADMIN');

ALTER TABLE account
    MODIFY role ENUM('ROLE_USER', 'ROLE_ADMIN') NOT NULL DEFAULT 'ROLE_USER';

-- UPDATE account SET role = 'ROLE_ADMIN' WHERE username = 'your_admin_username';
