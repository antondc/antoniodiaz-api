DROP PROCEDURE IF EXISTS user_reset_password;

CREATE PROCEDURE user_reset_password(
  IN $USER_NAME VARCHAR(40),
  IN $RESET_PASSWORD_TOKEN TEXT,
  IN $NEW_PASSWORD VARCHAR(40)

)

BEGIN

  /* Find user with token and save id on variable */
  SELECT
    @userId:=`user`.`id` AS id
  FROM
    user
  WHERE
    `user`.resetPasswordToken = $RESET_PASSWORD_TOKEN
    AND
    `user`.name = $USER_NAME
  ;

  -- Retrieve user
  UPDATE user
  SET
   `user`.`password`            = $NEW_PASSWORD,
   `user`.`resetPasswordToken`  = NULL,
   `user`.`updatedAt`           = UNIX_TIMESTAMP()
  WHERE
    `user`.name                 = $USER_NAME
    AND
    `user`.resetPasswordToken   = $RESET_PASSWORD_TOKEN;

  SELECT @userId;

END