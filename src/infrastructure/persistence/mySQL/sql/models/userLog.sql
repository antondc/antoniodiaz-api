CREATE TABLE IF NOT EXISTS `user_session_log` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `result` ENUM('success', 'failure') NOT NULL DEFAULT 'success',
  `type` ENUM('login', 'logout') NOT NULL DEFAULT 'login',
  `createdAt` int(11) DEFAULT NULL,
  `updatedAt` int(11) DEFAULT NULL,
  `user_id` CHAR(36) CHARACTER SET 'utf8' COLLATE 'utf8_bin' NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_session_log_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_session_log_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);