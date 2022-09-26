DROP PROCEDURE IF EXISTS article_get_one;

-- DELIMITER $$

CREATE PROCEDURE article_get_one(
  IN $SESSION_ID VARCHAR(40),
  IN $ARTICLE_ID INT,
  IN $LANGUAGE TEXT
)

BEGIN
  SELECT
    `article`.`id`,
    `article`.`order`,
    `article_translation`.`og_image` as ogImage,
    `article_translation`.`title`,
    `article_translation`.`content_json` as contentJson,
    `article_translation`.`content_html` as contentHtml,
    `article_translation`.`published`,
    `article`.`user_id` as userId,
    `language`.`slug` as language,
    `article`.`createdAt`,
    `article_translation`.`updatedAt`,
    (
      SELECT
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', `tag`.`id`,
            'text', `tag`.`text`
          )
        )
      FROM article_tag
      JOIN tag
      ON `article_tag`.`tag_id` = `tag`.`id`
      WHERE `article`.`id` = `article_tag`.`article_id`
    ) AS tags
  FROM article
  INNER JOIN `article_translation` ON `article_translation`.`article_id` = `article`.`id`
  INNER JOIN `language` ON `article_translation`.`language_id` = `language`.`id`
  WHERE
      `language`.`slug` = $LANGUAGE
    AND
      `article`.`id` = $ARTICLE_ID
    AND (
        `article_translation`.`published` = TRUE
      OR
        `article`.`user_id` = $SESSION_ID
    )
  ;

END

-- DELIMITER ;

-- CALL article_get_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1", 1, "es");