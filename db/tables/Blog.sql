CREATE TABLE IF NOT EXISTS Blog (
    blog_id INTEGER PRIMARY KEY,
    blog_content TEXT,
    blog_modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User (user_id) ON DELETE CASCADE
);
-- Blog is deleted if user gets deleted.