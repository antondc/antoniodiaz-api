DROP PROCEDURE IF EXISTS language_get_all;

CREATE PROCEDURE language_get_all()

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
      'whoContentHtml', glossary.whoContentHtml,
      'what', glossary.what,
      'whatSubtitle', glossary.whatSubtitle,
      'when', glossary.when,
      'whenSubtitle', glossary.whenSubtitle,
      'where', glossary.where,
      'post', glossary.post,
      'serverError', glossary.serverError,
      'control', glossary.control,
      'notFound', glossary.notFound
    ) glossary
  FROM language
  INNER JOIN glossary ON language.id = glossary.id;

END