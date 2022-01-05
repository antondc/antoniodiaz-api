DROP PROCEDURE IF EXISTS article_core_get_one;

-- DELIMITER $$

CREATE PROCEDURE article_core_get_one(
  IN $ARTICLE_ID INT
)

BEGIN

  SELECT
    article.id,
    article.order,
    article.user_id,
    article.createdAt,
    article.updatedAt
  FROM article
  WHERE
      `article`.id = $ARTICLE_ID
  ;

END

-- DELIMITER ;

-- CALL article_core_get_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1", 1, "es");