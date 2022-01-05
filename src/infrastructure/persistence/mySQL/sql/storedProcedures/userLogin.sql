DROP PROCEDURE IF EXISTS user_login;

CREATE PROCEDURE user_login(
  IN $NAME_OR_EMAIL VARCHAR(40),
  IN $PASS VARCHAR(40),
  IN $USER_ID VARCHAR(40)
)
BEGIN

  -- Select user
  SELECT
    `user`.`id`,
    `user`.`name`,
    `user`.`level`,
    `user`.`email`,
    `user`.`status`,
    `user`.`image`,
    `user`.`statement`,
    `user`.`location`,
    `user`.`order`,
    `user`.`createdAt`,
    `user`.`updatedAt`
  FROM `user`
  WHERE
    `password`      = $PASS
  AND (
    `name`          = $NAME_OR_EMAIL
    OR
    `user`.`email`  = $NAME_OR_EMAIL
    OR
    `id`            = $USER_ID
  );

END