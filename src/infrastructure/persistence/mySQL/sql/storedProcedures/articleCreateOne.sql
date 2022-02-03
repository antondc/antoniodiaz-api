DROP PROCEDURE IF EXISTS article_create_one;

-- DELIMITER $$

CREATE PROCEDURE article_create_one(
  IN $SESSION_ID    VARCHAR(40)
)

BEGIN

  SET @newOrder := (select IFNULL(MAX(`order`), 0) FROM project);

  INSERT IGNORE INTO `article` (
    `user_id`,
    `order`,
    `createdAt`,
    `updatedAt`
  ) VALUES (
    $SESSION_ID,
    @newOrder + 1,
    UNIX_TIMESTAMP(),
    UNIX_TIMESTAMP()
  );

  SELECT LAST_INSERT_ID() as articleId;

END

-- DELIMITER ;

-- CALL article_create_one("e4e2bb46-c210-4a47-9e84-f45c789fcec1");