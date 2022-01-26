DROP PROCEDURE IF EXISTS language_glossary_update_one;

CREATE PROCEDURE language_glossary_update_one(
  IN $LANGUAGE_ID INT,
  IN $WHO VARCHAR(40),
  IN $WHO_CONTENT_JSON JSON,
  IN $WHO_CONTENT_HTML TEXT,
  IN $WHAT VARCHAR(40),
  IN $WHAT_SUBTITLE VARCHAR(40),
  IN $_WHEN VARCHAR(40),
  IN $_WHERE VARCHAR(40),
  IN $POST VARCHAR(40),
  IN $SERVER_ERROR VARCHAR(40),
  IN $_CONTROL VARCHAR(40),
  IN $NOT_FOUND VARCHAR(40)
)

BEGIN

  UPDATE glossary
  SET
    `who`             = COALESCE($WHO, `who`),
    `whoContentJson`  = COALESCE($WHO_CONTENT_JSON, `whoContentJson`),
    `whoContentHtml`  = COALESCE($WHO_CONTENT_HTML, `whoContentHtml`),
    `what`            = COALESCE($WHAT, `what`),
    `whatSubtitle`    = COALESCE($WHAT_SUBTITLE, `whatSubtitle`),
    `when`            = COALESCE($_WHEN, `when`),
    `where`           = COALESCE($_WHERE, `where`),
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

END