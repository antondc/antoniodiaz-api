CREATE TABLE IF NOT EXISTS glossary (
  `id`              INT(11) NOT NULL AUTO_INCREMENT,
  `who`             VARCHAR(255) NULL DEFAULT NULL,
  `whoHtmlText`     TEXT NULL DEFAULT NULL,
  `what`            VARCHAR(255) NULL DEFAULT NULL,
  `whatSubtitle`    VARCHAR(255) NULL DEFAULT NULL,
  `when`            VARCHAR(255) NULL DEFAULT NULL,
  `post`            VARCHAR(255) NULL DEFAULT NULL,
  `where`           VARCHAR(255) NULL DEFAULT NULL,
  `serverError`     VARCHAR(255) NULL DEFAULT NULL,
  `control`         VARCHAR(255) NULL DEFAULT NULL,
  `notFound`        VARCHAR(255) NULL DEFAULT NULL,
  `createdAt`       int(11) DEFAULT NULL,
  `updatedAt`       int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY(id) REFERENCES language (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
