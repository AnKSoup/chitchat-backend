CREATE TABLE IF NOT EXISTS User (
    user_id INTEGER PRIMARY KEY,
    user_name VARCHAR(32) NOT NULL,
    user_hashed_password VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_token TEXT,
    user_created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);