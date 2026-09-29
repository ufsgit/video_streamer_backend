-- ============================================================
-- STEP 1: Create the admin_notifications table
-- Run this first in MySQL Workbench
-- ============================================================

CREATE TABLE IF NOT EXISTS `admin_notifications` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `admin_id`      INT NOT NULL COMMENT 'Which admin created this notification',
  `title`         VARCHAR(255) NOT NULL COMMENT 'Notification title shown on device',
  `message`       TEXT NOT NULL COMMENT 'Full notification body text',
  `schedule_time` TIME DEFAULT NULL COMMENT 'Daily push time HH:MM:SS. NULL = always-on banner',
  `is_active`     TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = active (shown to users), 0 = disabled',
  `created_at`    TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_notifications_admin` (`admin_id`),
  KEY `idx_admin_notifications_active` (`is_active`),
  CONSTRAINT `fk_admin_notifications_admin`
    FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ============================================================
-- STEP 2: SP — Admin creates a broadcast notification
-- ============================================================

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_notification_create`(
    IN p_admin_id      INT,
    IN p_title         VARCHAR(255),
    IN p_message       TEXT,
    IN p_schedule_time TIME  -- Pass NULL for always-on / no fixed time
)
BEGIN
    INSERT INTO admin_notifications (admin_id, title, message, schedule_time, is_active)
    VALUES (p_admin_id, p_title, p_message, p_schedule_time, 1);

    SELECT
        id,
        admin_id,
        title,
        message,
        TIME_FORMAT(schedule_time, '%H:%i:%s') AS schedule_time,
        is_active,
        created_at,
        updated_at
    FROM admin_notifications
    WHERE id = LAST_INSERT_ID();
END$$
DELIMITER ;


-- ============================================================
-- STEP 3: SP — Admin lists all their notifications
-- ============================================================

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_notification_list`(
    IN p_admin_id INT
)
BEGIN
    SELECT
        id,
        admin_id,
        title,
        message,
        TIME_FORMAT(schedule_time, '%H:%i:%s') AS schedule_time,
        is_active,
        created_at,
        updated_at
    FROM admin_notifications
    WHERE admin_id = p_admin_id
    ORDER BY created_at DESC;
END$$
DELIMITER ;


-- ============================================================
-- STEP 4: SP — Admin deletes a notification
-- ============================================================

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_notification_delete`(
    IN p_notification_id INT,
    IN p_admin_id        INT
)
BEGIN
    DELETE FROM admin_notifications
    WHERE id = p_notification_id AND admin_id = p_admin_id;

    SELECT ROW_COUNT() AS deleted_count;
END$$
DELIMITER ;


-- ============================================================
-- STEP 5: SP — Admin enables or disables a notification (toggle)
-- ============================================================

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_notification_toggle`(
    IN p_notification_id INT,
    IN p_admin_id        INT,
    IN p_is_active       TINYINT(1)  -- 1 = ON, 0 = OFF
)
BEGIN
    UPDATE admin_notifications
    SET is_active = p_is_active, updated_at = CURRENT_TIMESTAMP
    WHERE id = p_notification_id AND admin_id = p_admin_id;

    SELECT
        id,
        admin_id,
        title,
        message,
        TIME_FORMAT(schedule_time, '%H:%i:%s') AS schedule_time,
        is_active,
        created_at,
        updated_at
    FROM admin_notifications
    WHERE id = p_notification_id;
END$$
DELIMITER ;


-- ============================================================
-- STEP 6: SP — User fetches all active notifications from their doctor
--         (Call this from the user mobile app on login/refresh)
-- ============================================================

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `user_get_notifications`(
    IN p_user_id INT
)
BEGIN
    SELECT
        an.id,
        an.title,
        an.message,
        TIME_FORMAT(an.schedule_time, '%H:%i:%s') AS schedule_time,
        an.created_at
    FROM admin_notifications an
    INNER JOIN users u ON u.doctor_id = an.admin_id
    WHERE u.id = p_user_id
      AND an.is_active = 1
    ORDER BY an.created_at DESC;
END$$
DELIMITER ;
