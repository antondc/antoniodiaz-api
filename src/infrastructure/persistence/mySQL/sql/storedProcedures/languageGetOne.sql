DROP PROCEDURE IF EXISTS language_get_one;

CREATE PROCEDURE language_get_one(
  IN $SLUG VARCHAR(4)
)

BEGIN

 SELECT
    language.id,
    language.order,
    language.name,
    language.isDefault,
    language.slug,
    JSON_OBJECT(
      'who', glossary.who,
      'whoContentJson', glossary.whoContentJson,
      'whoHtmlText', glossary.whoHtmlText,
      'what', glossary.what,
      'whatSubtitle', glossary.whatSubtitle,
      'when', glossary.when,
      'where', glossary.where,
      'post', glossary.post,
      'serverError', glossary.serverError,
      'control', glossary.control,
      'notFound', glossary.notFound
    ) glossary
  FROM language
  INNER JOIN glossary ON language.id = glossarry.id
  WHERE language.slug = $SLUG;

END