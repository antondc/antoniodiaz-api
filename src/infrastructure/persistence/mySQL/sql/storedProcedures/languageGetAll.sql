DROP PROCEDURE IF EXISTS language_get_all;

CREATE PROCEDURE language_get_all()

BEGIN

 SELECT
    l.id,
    l.order,
    l.name,
    l.isDefault,
    l.slug,
    JSON_OBJECT(
      'id', g.id,
      'home', g.home,
      'login', g.login,
      'logout', g.logout,
      'control', g.control,
      'notFound', g.notFound,
      'tags', g.tags,
      'trending', g.trending,
      'lists', g.lists,
      'allBookmarks', g.allBookmarks,
      'myBookmarks', g.myBookmarks,
      'bookmarks', g.bookmarks,
      'links', g.links,
      'myUser', g.myUser,
      'users', g.users,
      'followers', g.followers,
      'following', g.following,
      'since', g.since,
      'serverError', g.serverError
    ) glossary
  FROM language l
  INNER JOIN glossary g ON l.id = g.id;

END