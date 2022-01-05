DROP PROCEDURE IF EXISTS debugger;

CREATE PROCEDURE debugger(
  msg VARCHAR(255)
)
BEGIN
  INSERT INTO _debug_messages (message) VALUES (msg);
END