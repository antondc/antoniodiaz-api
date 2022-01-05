CREATE TABLE IF NOT EXISTS article (
  `id`        INT(11) NOT NULL AUTO_INCREMENT,
  `order`     INT(11) NULL DEFAULT '10000',
  `user_id`   CHAR(36) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  `createdAt` INT(11) DEFAULT NULL,
  `updatedAt` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_article_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_article_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
