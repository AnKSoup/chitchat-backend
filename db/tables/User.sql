CREATE TABLE
    IF NOT EXISTS User (
        user_id INTEGER PRIMARY KEY,
        user_name VARCHAR(32) NOT NULL,
        user_password VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL UNIQUE,
        user_token TEXT,
        user_created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- INDEXES:
-- On tokens for faster validations of authed users:
CREATE INDEX user_token_idx ON User (user_token)
WHERE
    user_token IS NOT NULL;

--Possible on user_name?