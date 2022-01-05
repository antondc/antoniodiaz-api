DROP PROCEDURE IF EXISTS user_delete_one;

-- Disables user and deletes all his information
CREATE PROCEDURE user_delete_one(
  IN $USER_ID VARCHAR(40)
)

BEGIN

  -- Disable user and anonimize it
  UPDATE user
  SET
    name       =  CONCAT("disabled-", $USER_ID),
    email      =  CONCAT("disabled-", $USER_ID),
   `status`    = 'disabled',
   `updatedAt` = UNIX_TIMESTAMP()
  WHERE id     = $USER_ID
  ;

  -- Return user
  SELECT $USER_ID AS userId
  ;

END