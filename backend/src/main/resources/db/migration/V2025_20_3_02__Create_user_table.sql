CREATE TABLE `_user` (
                         `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                         `firstname` VARCHAR(255),
                         `lastname` VARCHAR(255),
                         `email` VARCHAR(255) UNIQUE,
                         `password` VARCHAR(255) NOT NULL,
                         `role` VARCHAR(50) NOT NULL,
                         INDEX `idx_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;