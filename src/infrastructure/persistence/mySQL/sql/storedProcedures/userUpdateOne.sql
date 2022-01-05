DROP PROCEDURE IF EXISTS user_update;

CREATE PROCEDURE user_update(
  IN $USER_ID VARCHAR(40),
  IN $NAME VARCHAR(40),
  IN $EMAIL VARCHAR(40),
  IN $IMAGE TEXT,
  IN $STATEMENT TEXT,
  IN $LOCATION VARCHAR(40)
)

BEGIN

  UPDATE user
  SET
    `name`      = $NAME,
    `email`     = $EMAIL,
    `statement` = $STATEMENT,
    `image`     = $IMAGE,
    `location`  = $LOCATION,
    `updatedAt` = UNIX_TIMESTAMP()
  WHERE id      = $USER_ID
  ;

  SELECT
    $USER_ID AS userId
  ;

END