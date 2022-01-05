DROP PROCEDURE IF EXISTS user_get_all;

-- DELIMITER $$

CREATE PROCEDURE user_get_all(
  IN $SESSION_ID VARCHAR(40),
  IN $SORT VARCHAR(40),
  IN $SIZE INT,
  IN $OFFSET INT,
  IN $FILTER JSON
)

BEGIN

  SET $SIZE = IFNULL($SIZE, -1);
  SET @filterName  = JSON_UNQUOTE(JSON_EXTRACT($FILTER, '$.name'));

  SELECT
    count(*) OVER() as totalItems,
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
    HAVING
      (
        CASE WHEN @filterName IS NOT NULL THEN CONVERT(UPPER(`user`.name) USING utf8) = CONVERT(UPPER(@filterName) USING utf8) END
        OR
        CASE WHEN @filterName IS NULL THEN TRUE END
      )
    ORDER BY
      CASE WHEN $SORT = 'order'          THEN `user`.order      	                ELSE NULL END ASC,
      CASE WHEN $SORT = '-order'         THEN `user`.order      	                ELSE NULL END DESC,
      CASE WHEN $SORT = 'name'           THEN `user`.name      	                  ELSE NULL END ASC,
      CASE WHEN $SORT = '-name'          THEN `user`.name      	                  ELSE NULL END DESC,
      CASE WHEN $SORT = 'createdAt'      THEN `user`.createdAt	                  ELSE NULL END ASC,
      CASE WHEN $SORT = '-createdAt'     THEN `user`.createdAt                    ELSE NULL END DESC,
      CASE WHEN $SORT != 'order' AND $SORT != '-order'      THEN `user`.order     ELSE NULL END ASC
    LIMIT $OFFSET , $SIZE
  ;

END

-- DELIMITER ;

-- CALL user_get_all('e4e2bb46-c210-4a47-9e84-f45c789fcec1', '-following', NULL, NULL }');