DROP PROCEDURE IF EXISTS user_create_confirmation;

CREATE PROCEDURE user_create_confirmation(
  IN $ACTIVATION_TOKEN TEXT
)

BEGIN

  /* Find user with token and save id on variable */
  SELECT
    @myvar:=`user`.`id` AS id
  FROM
    user
  WHERE
    activationToken = $ACTIVATION_TOKEN AND status = "inactive";

  /* Remove id */
  UPDATE
    user
  SET
    activationToken = NULL,
    status = "active"
  WHERE
    id = @myvar;

  /* Return user id */
  SELECT @myvar;

END