DROP PROCEDURE IF EXISTS project_get_one;

-- DELIMITER $$

CREATE PROCEDURE project_get_one(
  IN $SESSION_ID VARCHAR(40),
  IN $ARTICLE_ID INT,
  IN $LANGUAGE TEXT
)

BEGIN
  SELECT
    project.id,
    project.order,
    `project_translation`.title,
    `project_translation`.carousel,
    `project_translation`.content_json as contentJson,
    `project_translation`.content_html as contentHtml,
    `project_translation`.published,
    project.user_id as `userId`,
    language.slug as language,
    `project`.createdAt,
    `project_translation`.updatedAt
  FROM project
  INNER JOIN `project_translation` ON project_translation.project_id = project.id
  INNER JOIN `language` ON project_translation.language_id = `language`.id
  WHERE
      `language`.slug = $LANGUAGE
    AND
      project.id = $ARTICLE_ID
    AND (
        `project_translation`.published = TRUE
      OR
        project.user_id = $SESSION_ID
    )
  ;

END

-- DELIMITER ;

-- CALL project_get_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1", 1, "es");