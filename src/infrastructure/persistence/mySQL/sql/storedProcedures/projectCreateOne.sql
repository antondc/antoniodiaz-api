DROP PROCEDURE IF EXISTS project_create_one;

-- DELIMITER $$

CREATE PROCEDURE project_create_one(
  IN $SESSION_ID    VARCHAR(40)
)

BEGIN

  INSERT IGNORE INTO `project` (
    `user_id`,
    `createdAt`,
    `updatedAt`
  ) VALUES (
    $SESSION_ID,
    UNIX_TIMESTAMP(),
    UNIX_TIMESTAMP()
  );

  SELECT LAST_INSERT_ID() as projectId;

END

-- DELIMITER ;

-- CALL project_create_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1");