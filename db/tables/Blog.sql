CREATE TABLE
    IF NOT EXISTS Blog (
        blog_id INTEGER UNIQUE NOT NULL,
        blog_content TEXT,
        blog_modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (blog_id) REFERENCES User (user_id) ON DELETE CASCADE
    );

-- Blog is deleted if user gets deleted.