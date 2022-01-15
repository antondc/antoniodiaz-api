DROP PROCEDURE IF EXISTS project_update_one;

-- DELIMITER $$

CREATE PROCEDURE project_update_one(
  IN $LANGUAGE        TEXT,
  IN $ARTICLE_ID      INT,
  IN $TITLE           TEXT,
  IN $CAROUSEL        JSON,
  IN $CONTENT_JSON    JSON,
  IN $CONTENT_HTML    TEXT,
  IN $PUBLISHED       TEXT
)

BEGIN

  INSERT INTO `project_translation` (
    `title`,
    `carousel`,
    `content_json`,
    `content_html`,
    `project_id`,
    `language_id`,
    `published`,
    `createdAt`,
    `updatedAt`
  )
  SELECT
    $TITLE,
    $CAROUSEL,
    $CONTENT_JSON,
    $CONTENT_HTML,
    $ARTICLE_ID,
    language.id,
    $PUBLISHED,
    UNIX_TIMESTAMP(),
    UNIX_TIMESTAMP()
  FROM `language`
  WHERE `language`.slug = $LANGUAGE
  ON DUPLICATE KEY UPDATE
    `project_translation`.`title`         = $TITLE,
    `project_translation`.`carousel`      = $CAROUSEL,
    `project_translation`.`content_json`  = $CONTENT_JSON,
    `project_translation`.`content_html`  = $CONTENT_HTML,
    `project_translation`.`project_id`    = $ARTICLE_ID,
    `project_translation`.`language_id`   = language.id,
    `project_translation`.`published`     = $PUBLISHED,
    `project_translation`.`updatedAt`     = UNIX_TIMESTAMP()
  ;

  SELECT LAST_INSERT_ID() as projectId;

END

-- DELIMITER ;

-- CALL project_update_one('es', 3, 'UPDATED', '{}', '<div>modified</div>');