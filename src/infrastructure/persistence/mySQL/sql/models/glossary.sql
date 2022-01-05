CREATE TABLE IF NOT EXISTS glossary (
  `id`              INT(11) NOT NULL AUTO_INCREMENT,
  `home`            VARCHAR(255) NULL DEFAULT NULL,
  `login`           VARCHAR(255) NULL DEFAULT NULL,
  `logout`          VARCHAR(255) NULL DEFAULT NULL,
  `control`         VARCHAR(255) NULL DEFAULT NULL,
  `notFound`        VARCHAR(255) NULL DEFAULT NULL,
  `tags`            VARCHAR(255) NULL DEFAULT NULL,
  `trending`        VARCHAR(255) NULL DEFAULT NULL,
  `lists`           VARCHAR(255) NULL DEFAULT NULL,
  `allBookmarks`    VARCHAR(255) NULL DEFAULT NULL,
  `myBookmarks`    VARCHAR(255) NULL DEFAULT NULL,
  `bookmarks`       VARCHAR(255) NULL DEFAULT NULL,
  `links`           VARCHAR(255) NULL DEFAULT NULL,
  `myUser`          VARCHAR(255) NULL DEFAULT NULL,
  `users`           VARCHAR(255) NULL DEFAULT NULL,
  `followers`       VARCHAR(255) NULL DEFAULT NULL,
  `following`       VARCHAR(255) NULL DEFAULT NULL,
  `since`           VARCHAR(255) NULL DEFAULT NULL,
  `serverError`     VARCHAR(255) NULL DEFAULT NULL,
  `createdAt`       int(11) DEFAULT NULL,
  `updatedAt`       int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY(id) REFERENCES language (id)

    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
