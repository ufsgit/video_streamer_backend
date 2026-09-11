DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_list_languages`()
BEGIN
    SELECT 
        id, 
        language_name 
    FROM languages 
    WHERE delete_status = 0;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `check_app_version`(
    IN p_current_version VARCHAR(20),
    IN p_is_admin_update TINYINT(1)
)
BEGIN
    -- Declare memory variables
    DECLARE v_min_version VARCHAR(20);
    DECLARE v_max_version VARCHAR(20);
    DECLARE v_download_link TEXT;
    DECLARE v_update_message TEXT;
    DECLARE v_is_force_update TINYINT(1);
    DECLARE v_needs_update BOOLEAN DEFAULT FALSE;

    -- 1. Grab data instantly (using the index you created above)
    SELECT 
        min_version, max_version, download_link, update_message, is_force_update
    INTO 
        v_min_version, v_max_version, v_download_link, v_update_message, v_is_force_update
    FROM 
        app_versions 
    WHERE 
        is_admin_update = p_is_admin_update
    ORDER BY 
        id DESC 
    LIMIT 1;

    -- 2. Do the math in memory (ultra fast)
    IF INET_ATON(SUBSTRING_INDEX(CONCAT(p_current_version, '.0.0.0'), '.', 4)) NOT BETWEEN 
       INET_ATON(SUBSTRING_INDEX(CONCAT(v_min_version, '.0.0.0'), '.', 4)) AND 
       INET_ATON(SUBSTRING_INDEX(CONCAT(v_max_version, '.0.0.0'), '.', 4)) 
       AND v_is_force_update = 1 THEN
        SET v_needs_update = TRUE;
    END IF;

    -- 3. Return the result
    IF v_needs_update THEN
        SELECT 1 AS update_required, v_download_link AS download_link, v_update_message AS update_message;
    ELSE
        SELECT 0 AS update_required, '' AS download_link, '' AS update_message;
    END IF;
    
END$$
DELIMITER ;

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
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_active_languages`()
BEGIN
    SELECT 
        id, 
        language_name 
    FROM 
        languages 
    WHERE 
        delete_status = 0;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_admin_profile`(IN p_admin_id INT)
BEGIN
    SELECT 
        a.id,
        a.username,
        a.password_hash,
        a.name,
        a.photo_url,
        a.email,
        a.phone_number,
        DATE_FORMAT(a.dob, '%Y-%m-%d') AS dob,
        a.created_at,
        a.updated_at,
        COUNT(u.id) AS total_users
    FROM 
        admins a
    LEFT JOIN 
        users u ON a.id = u.doctor_id
    WHERE 
        a.id = p_admin_id
    GROUP BY 
        a.id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_profile`(IN p_user_id INT)
BEGIN
    SELECT 
        u.*,
        COUNT(CASE WHEN uvp.is_completed = 1 THEN 1 END) AS total_video_done,
        COUNT(CASE WHEN uvp.is_completed = 1 AND v.category = 'post-op' THEN 1 END) AS post_video_done,
        COUNT(CASE WHEN uvp.is_completed = 1 AND v.category = 'pre-op' THEN 1 END) AS pre_video_done
    FROM 
        users u
    LEFT JOIN 
        user_video_progress uvp ON u.id = uvp.user_id
    LEFT JOIN 
        videos v ON uvp.video_id = v.id
    WHERE 
        u.id = p_user_id
    GROUP BY 
        u.id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_videos_by_category_and_language`(
            IN p_category VARCHAR(50),
            IN p_language_id INT,
            IN p_limit INT,
            IN p_offset INT,
            IN p_search VARCHAR(255) 
        )
BEGIN
            SELECT 
                id, 
                title, 
                description, 
                video_url, 
                language_id, 
                language, 
                video_source, 
                thumbnail_url, 
                category, 
                created_at 
            FROM videos 
            WHERE category = p_category
              AND (p_language_id IS NULL OR language_id = p_language_id)
              AND (
                  p_search IS NULL 
                  OR title LIKE CONCAT('%', p_search, '%')
                  OR description LIKE CONCAT('%', p_search, '%')
              )
            ORDER BY created_at DESC
            LIMIT p_limit OFFSET p_offset;
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `upsert_user_video_progress`(
    IN p_user_id INT,
    IN p_video_id INT,
    IN p_current_timestamp_seconds INT,
    IN p_total_watch_time_seconds INT,
    IN p_is_completed TINYINT(1)
)
BEGIN
    INSERT INTO `user_video_progress` (
        `user_id`, 
        `video_id`, 
        `current_timestamp_seconds`, 
        `total_watch_time_seconds`, 
        `is_completed`, 
        `last_watched_at`, 
        `completed_at`
    )
    VALUES (
        p_user_id, 
        p_video_id, 
        p_current_timestamp_seconds, 
        p_total_watch_time_seconds, 
        p_is_completed, 
        CURRENT_TIMESTAMP, 
        IF(p_is_completed = 1, CURRENT_TIMESTAMP, NULL)
    )
    ON DUPLICATE KEY UPDATE
        `current_timestamp_seconds` = VALUES(`current_timestamp_seconds`),
        `total_watch_time_seconds` = VALUES(`total_watch_time_seconds`),
        `is_completed` = IF(`is_completed` = 1, 1, VALUES(`is_completed`)),
        `last_watched_at` = CURRENT_TIMESTAMP,
        `completed_at` = IF(`is_completed` = 0 AND VALUES(`is_completed`) = 1, CURRENT_TIMESTAMP, `completed_at`);
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `user_getbyid`(
    IN p_user_id INT,
    IN p_doctor_id INT
)
BEGIN
    SELECT 
        id, 
        username, 
        password_hash, 
        name, 
        photo_url, 
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob, 
        sex, 
        age, 
        email, 
        phone_number, 
        note, 
        doctor_id, 
        doctor_name, 
        current_streak, 
        last_active_date, 
        total_time_on_platform_seconds, 
        registered_date, 
        status, 
        updated_at
    FROM users 
    WHERE id = p_user_id AND doctor_id = p_doctor_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `user_get_engagement`(
    IN p_user_id INT,
    IN p_language_id INT
)
BEGIN
    SELECT 
        -- 1. Total Assigned Videos filtered by language
        (SELECT COUNT(*) 
         FROM videos v 
         WHERE (p_language_id IS NULL OR v.language_id = p_language_id)
        ) AS total_assigned,

        -- 2. Total Completed Videos for this user
        (SELECT COUNT(*) 
         FROM user_video_progress uvp 
         WHERE uvp.user_id = p_user_id 
           AND uvp.is_completed = 1
        ) AS total_completed;
        
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

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `video_create`(
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_video_url VARCHAR(255),
    IN p_video_source ENUM('local', 'youtube', 'vimeo', 'external'),
    IN p_thumbnail_url VARCHAR(255),
    IN p_category ENUM('pre-op', 'post-op'),
    IN p_admin_id INT,
    IN p_language_id INT,
    IN p_language VARCHAR(255),
    IN p_total_duration_seconds INT
)
BEGIN
    INSERT INTO videos (
        title, 
        description, 
        video_url, 
        video_source, 
        thumbnail_url, 
        category, 
        uploaded_by_admin_id, 
        language_id,
        language,
        total_duration_seconds,
        created_at
    ) VALUES (
        p_title, 
        p_description, 
        p_video_url, 
        p_video_source, 
        p_thumbnail_url, 
        p_category, 
        p_admin_id, 
        p_language_id,
        p_language,
        p_total_duration_seconds,
        CURRENT_TIMESTAMP
    );
    
    SELECT LAST_INSERT_ID() AS new_video_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `video_delete`(IN p_id INT)
BEGIN DELETE FROM videos WHERE id = p_id; END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `video_edit`(
    IN p_id INT, 
    IN p_title VARCHAR(255), 
    IN p_description TEXT, 
    IN p_video_url VARCHAR(255), 
    IN p_video_source VARCHAR(50), 
    IN p_thumbnail_url VARCHAR(255), 
    IN p_category VARCHAR(50),
    IN p_language_id INT,
    IN p_language VARCHAR(255),
    IN p_total_duration_seconds INT
)
BEGIN 
    UPDATE videos 
    SET 
        title = COALESCE(p_title, title), 
        description = COALESCE(p_description, description), 
        video_url = COALESCE(p_video_url, video_url), 
        video_source = COALESCE(p_video_source, video_source), 
        thumbnail_url = COALESCE(p_thumbnail_url, thumbnail_url), 
        category = COALESCE(p_category, category),
        language_id = COALESCE(p_language_id, language_id),
        language = COALESCE(p_language, language),
        total_duration_seconds = COALESCE(p_total_duration_seconds, total_duration_seconds)
    WHERE id = p_id; 
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `video_getbyid`(IN p_id INT)
BEGIN
    SELECT 
        id, 
        title, 
        description, 
        video_url, 
        language_id, 
        language, 
        video_source, 
        thumbnail_url, 
        category, 
        total_duration_seconds,
        uploaded_by_admin_id,
        created_at,
        updated_at
    FROM videos 
    WHERE id = p_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `video_lists`(
IN p_adminId INT,
 IN p_limit INT,
 IN p_offset INT,
 IN p_category VARCHAR(50),
 IN p_source VARCHAR(50),
 IN p_search VARCHAR(255))
BEGIN SELECT * FROM videos 
WHERE (uploaded_by_admin_id = p_adminId OR p_adminId IS NULL) 
AND (p_category = 'all' OR category = p_category) 
AND (p_source = 'all' OR video_source = p_source) 
AND (p_search IS NULL OR title LIKE CONCAT(p_search, '%')) 
ORDER BY created_at DESC LIMIT p_limit OFFSET p_offset; 
END$$
DELIMITER ;
