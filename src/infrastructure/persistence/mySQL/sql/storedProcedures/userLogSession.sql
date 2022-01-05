DROP PROCEDURE IF EXISTS user_log_session;

CREATE PROCEDURE user_log_session(
  IN $USER_ID VARCHAR(40),
  IN $RESULT VARCHAR(40),
  IN $TYPE VARCHAR(40)
)
BEGIN


  INSERT INTO user_session_log (
    `result`,
    `type`,
    `user_id`,
    createdAt,
    updatedAt
  ) VALUES(
    $RESULT,
    $TYPE,
    $USER_ID,
    UNIX_TIMESTAMP(),
    UNIX_TIMESTAMP()
  );

END