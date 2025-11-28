CREATE TABLE
    IF NOT EXISTS Comment (
        comment_id INTEGER PRIMARY KEY,
        comment_content VARCHAR(255) NOT NULL,
        comment_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        comment_modified_at DATETIME,
        in_response_to INTEGER,
        user_id INTEGER,
        blog_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE SET NULL,
        FOREIGN KEY (blog_id) REFERENCES Blog (blog_id) ON DELETE CASCADE
    );

-- If user_id is NULL -> deleted user for this comment
-- If blog gets deleted then bye bye comment :'(