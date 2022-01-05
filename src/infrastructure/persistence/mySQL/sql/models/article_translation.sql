CREATE TABLE IF NOT EXISTS article_translation (
  `id`            INT(11) NOT NULL AUTO_INCREMENT,
  `title`         VARCHAR(255) NULL DEFAULT NULL,
  `content_json`  TEXT NULL DEFAULT NULL,
  `content_html`  TEXT NULL DEFAULT NULL,
  `article_id`    INT(11) NOT NULL,
  `language_id`   INT NOT NULL,
  `published`     TINYINT(1) NULL DEFAULT 0,
  `createdAt`     INT(11) DEFAULT NULL,
  `updatedAt`     INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_article_translation_article1_idx` (`article_id` ASC),
  INDEX `fk_article_translation_language1_idx` (`language_id` ASC),
  CONSTRAINT `fk_article_translation_article1`
    FOREIGN KEY (`article_id`)
    REFERENCES `article` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_article_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
