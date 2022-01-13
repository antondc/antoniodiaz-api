DROP PROCEDURE IF EXISTS project_core_get_one;

-- DELIMITER $$

CREATE PROCEDURE project_core_get_one(
  IN $ARTICLE_ID INT
)

BEGIN

  SELECT
    project.id,
    project.order,
    project.user_id as userId,
    project.createdAt,
    project.updatedAt
  FROM project
  WHERE
      `project`.id = $ARTICLE_ID
  ;

END

-- DELIMITER ;

-- CALL project_core_get_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1", 1, "es");