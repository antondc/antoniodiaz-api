DROP PROCEDURE IF EXISTS project_get_all;

-- DELIMITER $$

CREATE PROCEDURE project_get_all(
  IN $SESSION_ID VARCHAR(40),
  IN $LANGUAGE TEXT,
  IN $SORT VARCHAR(40),
  IN $SIZE INT,
  IN $OFFSET INT,
  IN $FILTER JSON
)

BEGIN

  SET $SIZE = IFNULL($SIZE, -1);

  SELECT
    count(*) OVER() as totalItems,
    project.id,
    project.order,
    `project_translation`.title,
    `project_translation`.content_json as contentJson,
    `project_translation`.content_html as contentHtml,
    `project_translation`.published,
    project.user_id as `userId`,
    language.slug as language,
    `project`.createdAt,
    `project_translation`.updatedAt
    FROM project
    INNER JOIN `project_translation` ON project_translation.project_id = project.id
    INNER JOIN `language` ON project_translation.language_id = `language`.id
    WHERE
      `language`.slug = $LANGUAGE
      AND (
          `project_translation`.published = TRUE
        OR
          project.user_id = $SESSION_ID
      )
    ORDER BY
      CASE WHEN $SORT = 'order'          THEN `project`.order      	                ELSE NULL END ASC,
      CASE WHEN $SORT = '-order'         THEN `project`.order      	                ELSE NULL END DESC,
      CASE WHEN $SORT = 'createdAt'      THEN `project`.createdAt	                  ELSE NULL END ASC,
      CASE WHEN $SORT = '-createdAt'     THEN `project`.createdAt                    ELSE NULL END DESC,
      CASE WHEN $SORT = 'updatedAt'      THEN `project_translation`.updatedAt	                  ELSE NULL END ASC,
      CASE WHEN $SORT = '-updatedAt'     THEN `project_translation`.updatedAt                    ELSE NULL END DESC,
      CASE WHEN $SORT != 'order' AND $SORT != '-order'      THEN `project`.order     ELSE NULL END ASC
    LIMIT $OFFSET , $SIZE
  ;

END

-- DELIMITER ;

-- CALL project_get_all('e4e2bb46-c210-4a47-9e84-f45c789fcec1', 'en', '-createdAt', NULL, NULL, '{ "tags": [ "electronics" ] }');