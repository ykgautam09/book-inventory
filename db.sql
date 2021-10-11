USE `local`;  -- database name

DROP TABLE IF EXISTS `book_inventory`;  -- drop previous existing table
CREATE TABLE IF NOT EXISTS `book_inventory`
(
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` VARCHAR(100) NOT NULL,
    `user_name` VARCHAR(50) NOT NULL ,
    `user_email` VARCHAR(100) UNIQUE NOT NULL ,
    `user_password` VARCHAR(200) NOT NULL ,
    `user_image` VARCHAR(100) DEFAULT NULL ,
    `total_orders` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_logged_in` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);