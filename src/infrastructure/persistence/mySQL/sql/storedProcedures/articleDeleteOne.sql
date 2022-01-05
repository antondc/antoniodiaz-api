DROP PROCEDURE IF EXISTS article_delete_one;

-- DELIMITER $$

CREATE PROCEDURE article_delete_one(
  IN $SESSION_ID VARCHAR(40),
  IN $ARTICLE_ID INT,
  IN $LANGUAGE TEXT
)

BEGIN

  DELETE
    article_translation
  FROM
    article_translation
  INNER JOIN `language` ON article_translation.language_id = `language`.id
  INNER JOIN `article` ON article.id = article_translation.article_id
  WHERE
      article.user_id = $SESSION_ID
    AND
      article_translation.article_id = $ARTICLE_ID
    AND
      `language`.slug = $LANGUAGE
  ;

  SELECT
    $ARTICLE_ID AS articleId
  ;

END

-- DELIMITER ;

-- CALL article_delete_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1", 1, 'es');