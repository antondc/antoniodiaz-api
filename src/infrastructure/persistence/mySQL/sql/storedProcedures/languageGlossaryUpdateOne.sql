DROP PROCEDURE IF EXISTS language_glossary_update_one;

CREATE PROCEDURE language_glossary_update_one(
  IN $LANGUAGE_ID INT,
  IN $WHO VARCHAR(40),
  IN $WHO_CONTENT_JSON JSON,
  IN $WHO_CONTENT_HTML TEXT
)

BEGIN

  UPDATE glossary
  SET
    `who`             = $WHO,
    `whoContentJson`  = $WHO_CONTENT_JSON,
    `whoContentHtml`  = $WHO_CONTENT_HTML,
    `updatedAt`       = UNIX_TIMESTAMP()
  WHERE id            = $LANGUAGE_ID
  ;

  SELECT
    id AS glossaryId
  FROM glossary
  WHERE glossary.id = $LANGUAGE_ID
  ;

END