CREATE TABLE IF NOT EXISTS `article_tag` (
  `order` INT(11) NULL DEFAULT '10000',
  `createdAt` int(11) DEFAULT NULL,
  `updatedAt` int(11) DEFAULT NULL,
  `article_id` INT(11) NOT NULL,
  `tag_id` INT(11) NOT NULL,
  PRIMARY KEY (`article_id`, `tag_id`),
  INDEX `fk_article_tag_article1_idx` (`article_id` ASC),
  INDEX `fk_article_tag_tag1_idx` (`tag_id` ASC),
  CONSTRAINT `fk_article_tag_article1`
    FOREIGN KEY (`article_id`)
    REFERENCES `article` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_article_tag_tag1`
    FOREIGN KEY (`tag_id`)
    REFERENCES `tag` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);