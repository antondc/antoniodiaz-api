DROP PROCEDURE IF EXISTS language_glossary_update_one;

DELIMITER $$
CREATE PROCEDURE language_glossary_update_one(
  IN $LANGUAGE_ID INT,
  IN $SITE_TITLE VARCHAR(255),
  IN $SITE_DESCRIPTION VARCHAR(255),
  IN $AUTHOR VARCHAR(255),
  IN $WHO VARCHAR(255),
  IN $WHO_CONTENT_JSON JSON,
  IN $WHO_CONTENT_HTML TEXT,
  IN $WHAT VARCHAR(255),
  IN $WHAT_SUBTITLE VARCHAR(255),
  IN $_WHEN VARCHAR(255),
  IN $_WHEN_SUBTITLE VARCHAR(255),
  IN $_WHERE VARCHAR(255),
  IN $CODE VARCHAR(255),
  IN $EMAIL VARCHAR(255),
  IN $POST VARCHAR(255),
  IN $SERVER_ERROR VARCHAR(255),
  IN $_CONTROL VARCHAR(255),
  IN $NOT_FOUND VARCHAR(255)
)

BEGIN

  UPDATE glossary
  SET
    `siteTitle`       = COALESCE($SITE_TITLE, `siteTitle`),
    `siteDescription` = COALESCE($SITE_DESCRIPTION, `siteDescription`),
    `author`          = COALESCE($AUTHOR, `author`),
    `who`             = COALESCE($WHO, `who`),
    `whoContentJson`  = COALESCE($WHO_CONTENT_JSON, `whoContentJson`),
    `whoContentHtml`  = COALESCE($WHO_CONTENT_HTML, `whoContentHtml`),
    `what`            = COALESCE($WHAT, `what`),
    `whatSubtitle`    = COALESCE($WHAT_SUBTITLE, `whatSubtitle`),
    `when`            = COALESCE($_WHEN, `when`),
    `whenSubtitle`    = COALESCE($_WHEN_SUBTITLE, `whenSubtitle`),
    `where`           = COALESCE($_WHERE, `where`),
    `code`            = COALESCE($CODE, `code`),
    `email`           = COALESCE($EMAIL, `email`),
    `post`            = COALESCE($POST, `post`),
    `serverError`     = COALESCE($SERVER_ERROR, `serverError`),
    `control`         = COALESCE($_CONTROL, `control`),
    `notFound`        = COALESCE($NOT_FOUND, `notFound`),
    `updatedAt`       = COALESCE(UNIX_TIMESTAMP(), `updatedAt`)
  WHERE id            = $LANGUAGE_ID
  ;

  SELECT
    id AS glossaryId
  FROM glossary
  WHERE glossary.id = $LANGUAGE_ID
  ;

END $$

DELIMITER ;