CREATE TABLE language (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order` INT NULL DEFAULT '10000',
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `isDefault` TINYINT(1) NULL DEFAULT NULL,
  `slug` VARCHAR(255) NULL DEFAULT 'en',
  `createdAt` int(11) DEFAULT NULL,
  `updatedAt` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `slug` (`slug` ASC)
);