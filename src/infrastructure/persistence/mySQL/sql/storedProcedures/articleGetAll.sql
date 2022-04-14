DROP PROCEDURE IF EXISTS article_get_all;

-- DELIMITER $$

CREATE PROCEDURE article_get_all(
  IN $SESSION_ID VARCHAR(40),
  IN $LANGUAGE TEXT,
  IN $SORT VARCHAR(40),
  IN $SIZE INT,
  IN $OFFSET INT,
  IN $FILTER JSON
)

BEGIN

  SET $SIZE = IFNULL($SIZE, -1);

  SELECT
    count(*) OVER() as totalItems,
    article.id,
    article.order,
    `article_translation`.title,
    `article_translation`.og_image as ogImage,
    `article_translation`.content_json as contentJson,
    `article_translation`.content_html as contentHtml,
    `article_translation`.published,
    article.user_id as `userId`,
    language.slug as language,
    `article`.createdAt,
    `article_translation`.updatedAt
    FROM article
    INNER JOIN `article_translation` ON article_translation.article_id = article.id
    INNER JOIN `language` ON article_translation.language_id = `language`.id
    WHERE
      `language`.slug = $LANGUAGE
      AND (
          `article_translation`.published = TRUE
        OR
          article.user_id = $SESSION_ID
      )
    ORDER BY
      CASE WHEN $SORT = 'order'          THEN `article`.order      	                ELSE NULL END ASC,
      CASE WHEN $SORT = '-order'         THEN `article`.order      	                ELSE NULL END DESC,
      CASE WHEN $SORT = 'createdAt'      THEN `article`.createdAt	                  ELSE NULL END ASC,
      CASE WHEN $SORT = '-createdAt'     THEN `article`.createdAt                    ELSE NULL END DESC,
      CASE WHEN $SORT = 'updatedAt'      THEN `article_translation`.updatedAt	                  ELSE NULL END ASC,
      CASE WHEN $SORT = '-updatedAt'     THEN `article_translation`.updatedAt                    ELSE NULL END DESC,
      CASE WHEN $SORT != 'order' AND $SORT != '-order'      THEN `article`.order     ELSE NULL END ASC
    LIMIT $OFFSET , $SIZE
  ;

END

-- DELIMITER ;

-- CALL article_get_all('e4e2bb46-c210-4a47-9e84-f45c789fcec1', 'en', '-createdAt', NULL, NULL, '{ "tags": [ "electronics" ] }');