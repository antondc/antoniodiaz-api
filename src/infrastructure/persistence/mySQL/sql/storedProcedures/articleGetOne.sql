DROP PROCEDURE IF EXISTS article_get_one;

-- DELIMITER $$

CREATE PROCEDURE article_get_one(
  IN $SESSION_ID VARCHAR(40),
  IN $ARTICLE_ID INT,
  IN $LANGUAGE TEXT
)

BEGIN
  SELECT
    article.id,
    article.user_id as `userId`,
    `article_translation`.published,
    `article_translation`.title,
    `article_translation`.content_json,
    `article_translation`.content_html,
    `article`.createdAt,
    `article_translation`.updatedAt,
    language.slug as language
  FROM article
  INNER JOIN `article_translation` ON article_translation.article_id = article.id
  INNER JOIN `language` ON article_translation.language_id = `language`.id
  WHERE
      `language`.slug = $LANGUAGE
    AND
      article.id = $ARTICLE_ID
    AND (
        `article_translation`.published = TRUE
      OR
        article.user_id = $SESSION_ID
    )
  ;

END

-- DELIMITER ;

-- CALL article_get_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1", 1, "es");