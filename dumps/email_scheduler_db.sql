CREATE DATABASE IF NOT EXISTS email_scheduler_db;
USE email_scheduler_db;

CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scheduled_emails (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL, 
  body TEXT NOT NULL,
  scheduled_send_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP NULL,
  status VARCHAR(50) DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_scheduled_send_time ON scheduled_emails(scheduled_send_time);
CREATE INDEX idx_user_id ON scheduled_emails(user_id);
CREATE INDEX idx_status ON scheduled_emails(status);

ALTER TABLE scheduled_emails ADD COLUMN recipients JSON NOT NULL DEFAULT '[]';
