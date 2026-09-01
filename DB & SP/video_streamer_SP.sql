DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `dash_get_activity_logs`()
BEGIN
    SELECT 
        u.name AS patient_name,
        u.note AS ward,
        (SELECT MAX(created_at) FROM user_activity_logs ual WHERE ual.user_id = u.id AND ual.action = 'LOGIN') AS last_login,
        (SELECT COUNT(*) FROM user_video_progress uvp WHERE uvp.user_id = u.id AND uvp.is_completed = true) AS completed_videos,
        (SELECT COUNT(*) FROM user_video_assignments uva WHERE uva.user_id = u.id) AS assigned_videos
    FROM users u
    -- We sort by last login to show the most recently active users first
    ORDER BY last_login DESC
    LIMIT 5;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `dash_get_avg_videos`()
BEGIN
    SELECT COALESCE(AVG(completed_count), 0) AS avg_videos 
    FROM (
        SELECT user_id, COUNT(*) as completed_count 
        FROM user_video_progress 
        WHERE is_completed = true 
        GROUP BY user_id
    ) AS user_stats;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `dash_get_completion_rate`()
BEGIN
    SELECT 
        CASE 
            WHEN total_assigned = 0 THEN 0 
            ELSE (total_completed / total_assigned) * 100 
        END AS completion_rate 
    FROM (
        SELECT 
            (SELECT COUNT(*) FROM user_video_assignments) AS total_assigned, 
            (SELECT COUNT(*) FROM user_video_progress WHERE is_completed = true) AS total_completed
    ) AS stats;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `dash_get_total_logins`()
BEGIN
    SELECT COUNT(*) AS total_logins 
    FROM user_activity_logs 
    WHERE action = 'LOGIN';
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `login_admin`(IN p_username VARCHAR(50))
BEGIN
    SELECT 
        id, 
        username, 
        password_hash, 
        name, 
        photo_url, 
        email, 
        phone_number,
        dob,
        created_at
    FROM admins 
    WHERE username = p_username 
    LIMIT 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `login_user`(IN p_username VARCHAR(50))
BEGIN
    SELECT 
        id, 
        username, 
        password_hash, 
        name, 
        photo_url, 
        email, 
        status,
        doctor_id,
        doctor_name
    FROM users 
    WHERE username = p_username 
    LIMIT 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `user_create`(
    IN p_username VARCHAR(50),
    IN p_password_hash VARCHAR(255),
    IN p_name VARCHAR(100),
    IN p_photo_url VARCHAR(255),
    IN p_dob DATE,
    IN p_sex ENUM('Male', 'Female', 'Other'),
    IN p_age INT,
    IN p_email VARCHAR(100),
    IN p_phone_number VARCHAR(20),
    IN p_note TEXT,
    IN p_doctor_id INT,
    IN p_doctor_name VARCHAR(100)
)
BEGIN
    -- Insert the new user
    INSERT INTO users (
        username, 
        password_hash, 
        name, 
        photo_url,
        dob, 
        sex, 
        age,
        email, 
        phone_number, 
        note, 
        doctor_id,
        doctor_name,
        status,
        registered_date
    ) VALUES (
        p_username, 
        p_password_hash, 
        p_name, 
        p_photo_url,
        p_dob, 
        p_sex, 
        p_age,
        p_email, 
        p_phone_number, 
        p_note, 
        p_doctor_id,
        p_doctor_name,
        'Active',
        CURRENT_TIMESTAMP
    );
    
    -- Return the newly created user's ID
    SELECT LAST_INSERT_ID() AS new_user_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `user_delete`(
    IN p_user_id INT,
    IN p_doctor_id INT
)
BEGIN
    DELETE FROM users 
    WHERE id = p_user_id AND doctor_id = p_doctor_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `user_edit`(
    IN p_user_id INT,
    IN p_doctor_id INT,
    IN p_name VARCHAR(100),
    IN p_photo_url VARCHAR(255),
    IN p_dob DATE,
    IN p_sex ENUM('Male', 'Female', 'Other'),
    IN p_age INT,
    IN p_email VARCHAR(100),
    IN p_phone_number VARCHAR(20),
    IN p_note TEXT,
    IN p_status ENUM('Active', 'Inactive'),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    UPDATE users 
    SET 
        name = p_name,
        photo_url = COALESCE(p_photo_url, photo_url),
        dob = p_dob,
        sex = p_sex,
        age = p_age,
        email = p_email,
        phone_number = p_phone_number,
        note = p_note,
        status = p_status,
        password_hash = COALESCE(p_password_hash, password_hash)
    WHERE id = p_user_id AND doctor_id = p_doctor_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `user_lists`(
    IN p_doctor_id INT,
    IN p_limit INT,
    IN p_offset INT,
    IN p_date_from DATE,
    IN p_date_to DATE,
    IN p_search_query VARCHAR(100)
)
BEGIN
    SELECT 
        id, name, photo_url, sex, age, email, phone_number, status, registered_date 
    FROM users 
    WHERE doctor_id = p_doctor_id
      AND (p_date_from IS NULL OR DATE(registered_date) >= p_date_from)
      AND (p_date_to IS NULL OR DATE(registered_date) <= p_date_to)
      AND (p_search_query IS NULL OR p_search_query = '' OR 
           name LIKE CONCAT(p_search_query, '%') OR 
           email LIKE CONCAT(p_search_query, '%') OR 
           phone_number LIKE CONCAT(p_search_query, '%'))
    ORDER BY registered_date DESC
    LIMIT p_limit OFFSET p_offset;
END$$
DELIMITER ;
