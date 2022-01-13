DROP PROCEDURE IF EXISTS project_sort_one;

-- DELIMITER $$

CREATE PROCEDURE project_sort_one(
  IN $SESSION_ID VARCHAR(40),
  IN $ARTICLE_ID INT,
  IN $NEW_ORDER INT
)

BEGIN

  SET @old_order := (select `order` FROM project WHERE id = $ARTICLE_ID);
  SET @direction_up = @old_order < $NEW_ORDER;
  SET @low = IF(@direction_up, @old_order + 1, $NEW_ORDER);
  SET @high = IF(@direction_up, $NEW_ORDER, @old_order - 1);

  UPDATE
    project
  SET
    project.order = NULL
  WHERE
    id = $ARTICLE_ID
  ;

  UPDATE
    project
  SET
    project.order = IF(@direction_up, project.order - 1, project.order + 1)
  WHERE
      project.order >= @low
    AND
      project.order <= @high
  ;

  UPDATE
    project
  SET
    project.order = $NEW_ORDER
  WHERE
    id = $ARTICLE_ID
  ;

  SELECT
    $ARTICLE_ID as id
  ;

END

-- DELIMITER ;

-- CALL project_sort_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1", 3, 6);