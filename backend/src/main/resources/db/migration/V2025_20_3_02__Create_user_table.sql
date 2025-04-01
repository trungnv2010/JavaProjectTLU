

use `java-project`;
CREATE TABLE IF NOT EXISTS `_user` (
                                       `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                                       `firstname` VARCHAR(255),
    `lastname` VARCHAR(255),
    `email` VARCHAR(255) UNIQUE,
    `city` VARCHAR(255) ,
    `phone` VARCHAR(255) ,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    INDEX `idx_user_email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Bảng categories (Danh mục sản phẩm)
CREATE TABLE IF NOT EXISTS `category` (
                                          `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                                          `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng products (Sản phẩm)
CREATE TABLE IF NOT EXISTS `product` (
                                         `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                                         `category_id` BIGINT NOT NULL,
                                         `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10, 2) NOT NULL,
    `discount_price` DECIMAL(10, 2),
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `image_url` VARCHAR(255),
    `brand` VARCHAR(100),
    `model` VARCHAR(100),
    `specifications` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng orders (Đơn hàng)
CREATE TABLE IF NOT EXISTS `order` (
                                       `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                                       `user_id` BIGINT NOT NULL,
                                       `total_amount` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    `shipping_address` TEXT NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` ENUM('unpaid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `_user` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng order_items (Chi tiết đơn hàng)
CREATE TABLE IF NOT EXISTS `order_item` (
                                            `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                                            `order_id` BIGINT NOT NULL,
                                            `product_id` BIGINT NOT NULL,
                                            `quantity` INT NOT NULL,
                                            `price` DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng reviews (Đánh giá)
CREATE TABLE IF NOT EXISTS `review` (
                                        `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                                        `product_id` BIGINT NOT NULL,
                                        `user_id` BIGINT NOT NULL,
                                        `rating` INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    `comment` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `_user` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `user_product_review` (`user_id`, `product_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

---------------------------------------------------------------------------

-- Chọn cơ sở dữ liệu
USE `java-project`;

-- Điền dữ liệu vào bảng _user
INSERT INTO `_user` (`firstname`, `lastname`, `email`, `city`, `phone`, `password`, `role`) VALUES
                                                                                                ('Admin', 'User', 'admin@example.com', 'Hà Nội', '0901234567', '$2a$10$n9pu6XeCS87HLm4.Xi8a1eZQkIq1JdKqAaMbVv9Z5myXs7CKgRIUG', 'ADMIN'),
                                                                                                ('John', 'Doe', 'john.doe@example.com', 'Hồ Chí Minh', '0912345678', '$2a$10$LWj9kMT/EScdmvoGaNAnC.hI4zjDDXzJQpFwwqYsGjC9s4ViVqYC.', 'USER'),
                                                                                                ('Jane', 'Smith', 'jane.smith@example.com', 'Đà Nẵng', '0923456789', '$2a$10$SXhV7eJ/zMQKPeF9QOH4eu/oBr/.yDXMyC.sSTaI5.qrwFXzZ9YZS', 'USER'),
                                                                                                ('Nguyễn', 'Văn A', 'nguyenvana@example.com', 'Hà Nội', '0934567890', '$2a$10$8JF1XaP3DMv6sWK2UZh0peGI1JVhDvPHt27HRdqj5UVJBCk1IH98C', 'USER'),
                                                                                                ('Trần', 'Thị B', 'tranthib@example.com', 'Hồ Chí Minh', '0945678901', '$2a$10$H5DEkJRiRLfNdftJT8dxzOkCp27.tXb9hM4KYDQnMDY8d5W8UgfCK', 'USER');

-- Điền dữ liệu vào bảng category
INSERT INTO `category` (`name`, `description`) VALUES
                                                   ('Điện thoại cao cấp', 'Các dòng điện thoại cao cấp, giá trên 15 triệu'),
                                                   ('Điện thoại tầm trung', 'Các dòng điện thoại tầm trung, giá từ 8-15 triệu'),
                                                   ('Điện thoại giá rẻ', 'Các dòng điện thoại giá rẻ, dưới 8 triệu'),
                                                   ('Phụ kiện', 'Các phụ kiện điện thoại như ốp lưng, dán màn hình'),
                                                   ('Tai nghe', 'Các loại tai nghe không dây và có dây');

-- Điền dữ liệu vào bảng product
INSERT INTO `product` (`category_id`, `name`, `description`, `price`, `discount_price`, `stock_quantity`, `image_url`, `brand`, `model`, `specifications`) VALUES
                                                                                                                                                               (1, 'iPhone 15 Pro Max', 'Điện thoại iPhone 15 Pro Max mới nhất từ Apple với nhiều tính năng nâng cấp', 34990000, 33990000, 50, 'iphone15promax.jpg', 'Apple', 'iPhone 15 Pro Max', '{"screen": "6.7 inch", "cpu": "A17 Pro", "ram": "8GB", "storage": "256GB", "camera": "48MP", "battery": "4422mAh"}'),
                                                                                                                                                               (1, 'Samsung Galaxy S24 Ultra', 'Flagship mới nhất của Samsung với bút S-Pen tích hợp', 31990000, 30990000, 45, 'samsungs24ultra.jpg', 'Samsung', 'Galaxy S24 Ultra', '{"screen": "6.8 inch", "cpu": "Snapdragon 8 Gen 3", "ram": "12GB", "storage": "256GB", "camera": "200MP", "battery": "5000mAh"}'),
                                                                                                                                                               (2, 'Google Pixel 8', 'Điện thoại thông minh với khả năng chụp ảnh hàng đầu', 19990000, 18990000, 30, 'pixel8.jpg', 'Google', 'Pixel 8', '{"screen": "6.2 inch", "cpu": "Tensor G3", "ram": "8GB", "storage": "128GB", "camera": "50MP", "battery": "4575mAh"}'),
                                                                                                                                                               (2, 'Xiaomi 14', 'Điện thoại tầm trung mạnh mẽ với cấu hình cao', 14990000, 13990000, 60, 'xiaomi14.jpg', 'Xiaomi', '14', '{"screen": "6.36 inch", "cpu": "Snapdragon 8 Gen 2", "ram": "8GB", "storage": "256GB", "camera": "50MP", "battery": "4610mAh"}'),
                                                                                                                                                               (3, 'Realme C55', 'Điện thoại giá rẻ với pin lớn và màn hình lớn', 4990000, 4490000, 100, 'realmec55.jpg', 'Realme', 'C55', '{"screen": "6.72 inch", "cpu": "Helio G88", "ram": "6GB", "storage": "128GB", "camera": "64MP", "battery": "5000mAh"}'),
                                                                                                                                                               (3, 'Vivo Y36', 'Điện thoại giá rẻ thiết kế đẹp, pin trâu', 5990000, 5490000, 80, 'vivoy36.jpg', 'Vivo', 'Y36', '{"screen": "6.64 inch", "cpu": "Snapdragon 680", "ram": "8GB", "storage": "128GB", "camera": "50MP", "battery": "5000mAh"}'),
                                                                                                                                                               (4, 'Ốp lưng iPhone 15 Pro Max', 'Ốp lưng chính hãng bảo vệ điện thoại', 790000, 690000, 200, 'case_iphone15promax.jpg', 'Apple', 'MagSafe Case', '{"material": "Silicone", "color": "Black", "compatible": "iPhone 15 Pro Max"}'),
                                                                                                                                                               (4, 'Dán cường lực Samsung S24 Ultra', 'Miếng dán bảo vệ màn hình chống va đập', 390000, 350000, 300, 'screen_protector_s24ultra.jpg', 'Spigen', 'Glas.tR EZ Fit', '{"material": "Tempered Glass", "hardness": "9H", "thickness": "0.33mm"}'),
                                                                                                                                                               (5, 'AirPods Pro 2', 'Tai nghe không dây cao cấp với tính năng chống ồn', 6990000, 6490000, 40, 'airpodspro2.jpg', 'Apple', 'AirPods Pro 2', '{"connectivity": "Bluetooth 5.3", "battery": "6h", "noise_cancellation": true}'),
                                                                                                                                                               (5, 'Galaxy Buds2 Pro', 'Tai nghe không dây Samsung với âm thanh Hi-Fi', 4990000, 4490000, 35, 'galaxybudspro2.jpg', 'Samsung', 'Galaxy Buds2 Pro', '{"connectivity": "Bluetooth 5.3", "battery": "5h", "noise_cancellation": true}');

-- Điền dữ liệu vào bảng order
INSERT INTO `order` (`user_id`, `total_amount`, `status`, `shipping_address`, `payment_method`, `payment_status`) VALUES
                                                                                                                      (2, 34680000, 'delivered', 'Số 123, Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh', 'credit_card', 'paid'),
                                                                                                                      (3, 19340000, 'shipped', '45 Lê Lợi, Quận Hải Châu, Đà Nẵng', 'bank_transfer', 'paid'),
                                                                                                                      (4, 5040000, 'processing', '78 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội', 'cod', 'unpaid'),
                                                                                                                      (5, 6840000, 'pending', '25 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', 'momo', 'paid'),
                                                                                                                      (2, 4490000, 'cancelled', '56 Phan Văn Trị, Quận Gò Vấp, TP. Hồ Chí Minh', 'zalopay', 'refunded');

-- Điền dữ liệu vào bảng order_item
INSERT INTO `order_item` (`order_id`, `product_id`, `quantity`, `price`) VALUES
                                                                             (1, 1, 1, 33990000),
                                                                             (1, 7, 1, 690000),
                                                                             (2, 3, 1, 18990000),
                                                                             (2, 8, 1, 350000),
                                                                             (3, 5, 1, 4490000),
                                                                             (3, 8, 1, 350000),
                                                                             (3, 7, 1, 200000),
                                                                             (4, 9, 1, 6490000),
                                                                             (4, 8, 1, 350000),
                                                                             (5, 10, 1, 4490000);

-- Điền dữ liệu vào bảng review
INSERT INTO `review` (`product_id`, `user_id`, `rating`, `comment`) VALUES
                                                                        (1, 2, 5, 'iPhone 15 Pro Max quá tuyệt vời, camera chụp ảnh rất đẹp và pin trâu'),
                                                                        (1, 3, 4, 'Máy mạnh, mượt nhưng giá hơi cao. Cầm khá nặng tay.'),
                                                                        (2, 4, 5, 'Màn hình đẹp, bút S-Pen rất tiện lợi cho công việc'),
                                                                        (3, 5, 4, 'Camera Pixel quá đỉnh, chụp đêm rất tốt'),
                                                                        (4, 2, 5, 'Điện thoại có hiệu năng tốt với giá tầm trung'),
                                                                        (5, 3, 3, 'Máy ổn với tầm giá, camera tạm được'),
                                                                        (9, 4, 5, 'Âm thanh tuyệt vời, tính năng chống ồn hoạt động rất tốt'),
                                                                        (10, 5, 4, 'Tai nghe đeo thoải mái, pin trâu');