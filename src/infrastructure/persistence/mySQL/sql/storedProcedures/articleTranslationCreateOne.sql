DROP PROCEDURE IF EXISTS article_translation_create_one;

-- DELIMITER $$

CREATE PROCEDURE article_translation_create_one(
  IN $LANGUAGE      TEXT,
  IN $ARTICLE_ID    INT,
  IN $TITLE         TEXT,
  IN $CONTENT_JSON  JSON,
  IN $CONTENT_HTML  TEXT
)

BEGIN

  INSERT INTO `article_translation` (
    `title`,
    `content_json`,
    `content_html`,
    `article_id`,
    `language_id`,
    `createdAt`,
    `updatedAt`
  )
  SELECT
    $TITLE,
    $CONTENT_JSON,
    $CONTENT_HTML,
    $ARTICLE_ID,
    language.id,
    UNIX_TIMESTAMP(),
    UNIX_TIMESTAMP()
  FROM `language`
  WHERE `language`.slug = $LANGUAGE
  ;

  SELECT LAST_INSERT_ID() as articleId;

END

-- DELIMITER ;

-- CALL article_translation_create_one('es', 3, 'title one -', '{modified}', '<div>modified</div>');