DROP PROCEDURE IF EXISTS user_create_one_undo;

CREATE PROCEDURE user_create_one_undo(
  IN $USER_ID VARCHAR(40)
)

BEGIN

  DELETE FROM user
  WHERE user.id   = $USER_ID
  ;

  SELECT $USER_ID AS userId
  ;

END