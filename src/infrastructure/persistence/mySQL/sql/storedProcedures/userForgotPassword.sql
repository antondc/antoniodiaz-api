DROP PROCEDURE IF EXISTS user_forgot_password;

CREATE PROCEDURE user_forgot_password(
  IN $USER_ID VARCHAR(40),
  IN $RESET_PASSWORD_TOKEN TEXT
)

BEGIN

  UPDATE
    user
  SET
    resetPasswordToken = $RESET_PASSWORD_TOKEN
  WHERE
    id = $USER_ID;

  SELECT
    $USER_ID as userId;

END