DROP PROCEDURE IF EXISTS article_update_one;

-- DELIMITER $$

CREATE PROCEDURE article_update_one(
  IN $ARTICLE_ID INT,
  IN $LANGUAGE TEXT,
  IN $TITLE TEXT,
  IN $CONTENT_JSON TEXT,
  IN $CONTENT_HTML TEXT
)

BEGIN

  UPDATE
    article_translation
  INNER JOIN `language` ON article_translation.language_id = `language`.id
  SET
    `title`         = $TITLE,
    `content_json`  = $CONTENT_JSON,
    `content_html`  = $CONTENT_HTML
    WHERE
        `language`.slug = $LANGUAGE
      AND
        article_translation.article_id = $ARTICLE_ID
  ;

  SELECT
    $ARTICLE_ID AS articleId
  ;

END

-- DELIMITER ;

-- CALL article_update_one(1, 'es', 'title one -', '{modified}', '<div>modified</div>');