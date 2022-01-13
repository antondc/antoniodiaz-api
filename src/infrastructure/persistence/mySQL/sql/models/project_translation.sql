CREATE TABLE IF NOT EXISTS project_translation (
  `id`            INT(11) NOT NULL AUTO_INCREMENT,
  `title`         VARCHAR(255) NULL DEFAULT NULL,
  `content_json`  JSON NULL DEFAULT NULL,
  `content_html`  TEXT NULL DEFAULT NULL,
  `project_id`    INT(11) NOT NULL,
  `language_id`   INT NOT NULL,
  `published`     TINYINT(1) NOT NULL DEFAULT FALSE,
  `createdAt`     INT(11) DEFAULT NULL,
  `updatedAt`     INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE `unique_index`(`project_id`, `language_id`),
  INDEX `fk_project_translation_project1_idx` (`project_id` ASC),
  INDEX `fk_project_translation_language1_idx` (`language_id` ASC),
  CONSTRAINT `fk_project_translation_project1`
    FOREIGN KEY (`project_id`)
    REFERENCES `project` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_project_translation_language1`
    FOREIGN KEY (`language_id`)
    REFERENCES `language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
