CREATE TABLE IF NOT EXISTS user (
  `id` CHAR(40) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `name` VARCHAR(255) UNIQUE NULL DEFAULT NULL,
  `level` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `email` VARCHAR(255) UNIQUE NULL DEFAULT NULL,
  `image` TEXT NULL DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `status` ENUM('inactive', 'active', 'disabled', 'removed') NOT NULL DEFAULT 'inactive',
  `statement` TEXT NULL DEFAULT NULL,
  `location` VARCHAR(255) NULL DEFAULT NULL,
  `order` INT(11) NULL DEFAULT '10000',
  `activationToken` TEXT CHARACTER SET 'utf8' COLLATE 'utf8_bin' DEFAULT NULL,
  `resetPasswordToken` TEXT CHARACTER SET 'utf8' COLLATE 'utf8_bin' DEFAULT NULL,
  `createdAt` int(11) DEFAULT NULL,
  `updatedAt` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);