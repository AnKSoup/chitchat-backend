CREATE TABLE
    IF NOT EXISTS Message (
        message_id INTEGER PRIMARY KEY,
        message_content TEXT NOT NULL,
        message_tag TEXT NOT NULL,
        message_sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        message_modified_at DATETIME,
        in_response_to INTEGER,
        user_id INTEGER,
        conversation_id INTEGER NOT NULL,
        FOREIGN KEY (in_response_to) REFERENCES Message (message_id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE SET NULL,
        FOREIGN KEY (conversation_id) REFERENCES Conversation (conversation_id) ON DELETE CASCADE
    );

-- If user_id is NULL -> deleted user for this message
-- If conversation gets deleted then bye bye message :'(

CREATE INDEX message_conversation_id_idx ON Message (conversation_id);
CREATE INDEX message_user_id_idx ON Message (user_id)
WHERE
    user_id IS NOT NULL;