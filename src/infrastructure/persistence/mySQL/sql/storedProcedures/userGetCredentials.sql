DROP PROCEDURE IF EXISTS user_get_credentials;

 /* DELIMITER $$ */

CREATE PROCEDURE user_get_credentials(
  IN $USER_ID VARCHAR(40)
)
BEGIN

-- Select user
SELECT
  `user`.`name`,
  `user`.`password`,
  `user`.`status`
  FROM `user`
  WHERE
    `user`.`id` = $USER_ID
;

END

 /* DELIMITER ;

 CALL user_get_credentials("9b360676-5b69-11eb-ae93-0242ac130002"); */