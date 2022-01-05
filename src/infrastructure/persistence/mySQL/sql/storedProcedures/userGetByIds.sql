DROP PROCEDURE IF EXISTS user_get_by_ids;

/* DELIMITER $$ */

CREATE PROCEDURE user_get_by_ids(
  IN $SESSION_ID VARCHAR(40),
  IN $USER_IDS JSON,
  IN $SORT VARCHAR(40),
  IN $SIZE INT,
  IN $OFFSET INT
)

BEGIN

  SET $SIZE = IFNULL($SIZE, -1);

  SELECT
    `user`.`id`,
    `user`.`order`,
    `user`.`name`,
    `user`.`level`,
    `user`.`email`,
    `user`.`image`,
    `user`.`status`,
    `user`.`statement`,
    `user`.`location`,
    `user`.`createdAt`,
    `user`.`updatedAt`
    FROM `user`
    WHERE JSON_CONTAINS($USER_IDS, JSON_QUOTE(user.id))
    GROUP BY `user`.`id`
    ORDER BY
      CASE WHEN $SORT = 'order'          THEN `user`.order      	        ELSE NULL END ASC,
      CASE WHEN $SORT = '-order'         THEN `user`.order      	        ELSE NULL END DESC,
      CASE WHEN $SORT = 'createdAt'   THEN `user`.createdAt	        ELSE NULL END ASC,
      CASE WHEN $SORT = '-createdAt'  THEN `user`.createdAt         ELSE NULL END DESC,
      CASE WHEN $SORT = 'updatedAt'   THEN `user`.updatedAt         ELSE NULL END ASC,
      CASE WHEN $SORT = '-updatedAt'  THEN `user`.updatedAt         ELSE NULL END DESC,
      CASE WHEN $SORT != 'order' AND $SORT != '-order'      THEN `user`.order        ELSE NULL END ASC
    LIMIT $OFFSET, $SIZE
  ;


END

/* DELIMITER ; */
/* CALL user_get_by_ids("e4e2bb46-c210-4a47-9e84-f45c789fcec1", '["e4e2bb46-c210-4a47-9e84-f45c789fcec1", "92fac4aa-5b6a-11eb-ae93-0242ac130002"]', NULL, NULL, NULL); */
