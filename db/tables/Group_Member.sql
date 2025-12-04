CREATE TABLE
    IF NOT EXISTS Group_Member (
        user_id INTEGER NOT NULL,
        conversation_id INTEGER NOT NULL,
        decrypt_key TEXT,
        decrypt_iv TEXT,
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        left_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE,
        FOREIGN KEY (conversation_id) REFERENCES Conversation (conversation_id) ON DELETE CASCADE
    );

-- If user or conversation gets deleted -> delete this linker

CREATE INDEX group_member_user_id_idx ON Group_Member (user_id);
CREATE INDEX group_member_conversation_id_idx ON Group_Member (conversation_id);
