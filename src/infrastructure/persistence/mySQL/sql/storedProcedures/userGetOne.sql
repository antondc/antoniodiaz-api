DROP PROCEDURE IF EXISTS user_get_one;

-- DELIMITER $$

CREATE PROCEDURE user_get_one(
  IN $SESSION_ID VARCHAR(40),
  IN $USER_ID VARCHAR(40),
  IN $EMAIL VARCHAR(40),
  IN $NAME_ VARCHAR(40)
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
    `user`.`id` = $USER_ID
    OR `name`   = $NAME_
    OR `email`  = $EMAIL
  GROUP BY `user`.`id`
;

END

-- DELIMITER ;

-- CALL user_get_one(NULL, NULL, "hello@antoniodiaz.me", "hello@antoniodiaz.me");