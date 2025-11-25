CREATE TABLE
    IF NOT EXISTS Conversation (
        conversation_id INTEGER PRIMARY KEY,
        conversation_name VARCHAR(255) NOT NULL,
        conversation_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        owner_id INTEGER NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES User (user_id)
    );

-- WARNING: Make sure owner changes before user gets deleted.