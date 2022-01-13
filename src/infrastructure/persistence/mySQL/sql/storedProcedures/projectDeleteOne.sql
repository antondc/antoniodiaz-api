DROP PROCEDURE IF EXISTS project_delete_one;

-- DELIMITER $$

CREATE PROCEDURE project_delete_one(
  IN $SESSION_ID VARCHAR(40),
  IN $ARTICLE_ID INT,
  IN $LANGUAGE TEXT
)

BEGIN

  DELETE
    project_translation
  FROM
    project_translation
  INNER JOIN `language` ON project_translation.language_id = `language`.id
  INNER JOIN `project` ON project.id = project_translation.project_id
  WHERE
      project.user_id = $SESSION_ID
    AND
      project_translation.project_id = $ARTICLE_ID
    AND
      `language`.slug = $LANGUAGE
  ;

  SELECT
    $ARTICLE_ID AS projectId
  ;

END

-- DELIMITER ;

-- CALL project_delete_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1", 1, 'es');