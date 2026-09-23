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
        
        -- Video Title of the user's most recently watched video
        (SELECT v.title 
         FROM user_video_progress uvp 
         JOIN videos v ON uvp.video_id = v.id 
         WHERE uvp.user_id = u.id 
         ORDER BY uvp.last_watched_at DESC 
         LIMIT 1) AS video_title,
        
        -- Current watch timestamp in seconds
        (SELECT uvp.current_timestamp_seconds 
         FROM user_video_progress uvp 
         WHERE uvp.user_id = u.id 
         ORDER BY uvp.last_watched_at DESC 
         LIMIT 1) AS current_timestamp_seconds,

        -- Total video duration in seconds
        (SELECT uvp.total_video_duration 
         FROM user_video_progress uvp 
         WHERE uvp.user_id = u.id 
         ORDER BY uvp.last_watched_at DESC 
         LIMIT 1) AS total_video_duration,

        -- Progress percentage of this video
        (SELECT 
            CASE 
                WHEN uvp.is_completed = 1 THEN 100
                WHEN uvp.total_video_duration > 0 THEN ROUND((uvp.current_timestamp_seconds / uvp.total_video_duration) * 100)
                ELSE 0 
            END
         FROM user_video_progress uvp 
         WHERE uvp.user_id = u.id 
         ORDER BY uvp.last_watched_at DESC 
         LIMIT 1) AS video_progress_percent,

        -- Most recent watch time
        (SELECT MAX(last_watched_at) FROM user_video_progress uvp WHERE uvp.user_id = u.id) AS last_login,
        
        -- PRE WATCHED: Count watched pre-op videos
        (SELECT COUNT(*) 
         FROM user_video_progress uvp 
         JOIN videos v ON uvp.video_id = v.id 
         WHERE uvp.user_id = u.id AND uvp.is_completed = true AND v.category = 'pre-op') AS pre_watched,
         
        -- POST WATCHED: Count watched post-op videos
        (SELECT COUNT(*) 
         FROM user_video_progress uvp 
         JOIN videos v ON uvp.video_id = v.id 
         WHERE uvp.user_id = u.id AND uvp.is_completed = true AND v.category = 'post-op') AS post_watched,

        -- Total completed videos
        (SELECT COUNT(*) FROM user_video_progress uvp WHERE uvp.user_id = u.id AND uvp.is_completed = true) AS completed_videos,
        -- Total assigned videos matching user language
        (SELECT COUNT(*) FROM videos v WHERE u.language_id IS NULL OR v.language_id = u.language_id) AS assigned_videos
        
    FROM users u
    WHERE (SELECT MAX(last_watched_at) FROM user_video_progress uvp WHERE uvp.user_id = u.id) IS NOT NULL
    
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTotalAssignedVideosByLanguage`(
            IN p_language_id INT
        )
BEGIN
            SELECT COUNT(*) AS totalAssigned
            FROM vdo 
            WHERE language_id = p_language_id;
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_activity`(IN p_user_id INT)
BEGIN
                UPDATE users
                SET current_streak = 0
                WHERE id = p_user_id
                  AND last_active_date IS NOT NULL 
                  AND last_active_date < DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
                  AND current_streak > 0;

                SELECT 
                    id,
                    username,
                    name,
                    current_streak,
                    DATE_FORMAT(last_active_date, '%Y-%m-%d') AS last_active_date,
                    total_time_on_platform_seconds
                FROM users
                WHERE id = p_user_id;
            END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_engagement_progress`(
    IN p_user_id INT,
    IN p_category VARCHAR(50) -- Pass 'pre-op', 'post-op', or NULL for all
)
BEGIN
    DECLARE v_total_assigned INT DEFAULT 0;
    DECLARE v_total_completed INT DEFAULT 0;
    DECLARE v_overall_progress DECIMAL(5,2) DEFAULT 0.00;
    DECLARE v_user_language_id INT;

    -- 1. Grab the language_id of the user
    SELECT language_id INTO v_user_language_id 
    FROM users 
    WHERE id = p_user_id;

    -- 2. Get the total number of assigned videos (Videos that match the user's language and category)
    SELECT COUNT(id) 
    INTO v_total_assigned
    FROM videos 
    WHERE language_id = v_user_language_id
      AND (p_category IS NULL OR p_category = '' OR category = p_category);

    -- 3. Get the total number of COMPLETED videos (Matches user's language and category)
    SELECT COUNT(p.video_id) 
    INTO v_total_completed
    FROM user_video_progress p
    JOIN videos v ON p.video_id = v.id
    WHERE p.user_id = p_user_id 
      AND p.is_completed = 1
      AND v.language_id = v_user_language_id
      AND (p_category IS NULL OR p_category = '' OR v.category = p_category);

    -- 4. Calculate the overall progress percentage
    IF v_total_assigned > 0 THEN
        SET v_overall_progress = ROUND((v_total_completed / v_total_assigned) * 100, 2);
    ELSE
        SET v_overall_progress = 0.00;
    END IF;

    -- 5. Return the result set
    SELECT 
        v_total_assigned AS total_assigned,
        v_total_completed AS total_completed,
        v_overall_progress AS overall_progress_percentage;
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_reminder`(
    IN p_user_id INT
)
BEGIN
    SELECT 
        id,
        user_id,
        TIME_FORMAT(reminder_time, '%H:%i:%s') AS reminder_time,
        is_enabled,
        created_at,
        updated_at
    FROM user_reminders
    WHERE user_id = p_user_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_video_history`(
    IN p_user_id INT,
    IN p_category VARCHAR(50)
)
BEGIN
    SELECT 
        v.id AS video_id,
        v.title,
        v.description,
        v.category,
        v.thumbnail_url,
        p.is_completed,
        p.current_timestamp_seconds,
        p.total_video_duration,
        p.first_opened_at,
        p.last_watched_at,
        p.completed_at
    FROM videos v
    INNER JOIN user_video_progress p 
        ON v.id = p.video_id AND p.user_id = p_user_id
    WHERE (p_category IS NULL OR p_category = '' OR v.category = p_category)
    ORDER BY 
        p.last_watched_at DESC; 
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_video_progress_by_id`(
    IN p_user_id INT,
    IN p_video_id INT
)
BEGIN
    SELECT 
        user_id,
        video_id,
        COALESCE(current_timestamp_seconds, 0) AS current_timestamp_seconds,
        COALESCE(total_video_duration, 0) AS total_video_duration,
        COALESCE(is_completed, 0) AS is_completed,
        first_opened_at,
        last_watched_at,
        completed_at
    FROM user_video_progress
    WHERE user_id = p_user_id AND video_id = p_video_id;
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
                    language_id,
                    language_name,
                    status,
                    doctor_id,
                    doctor_name,
                    current_streak,
                    DATE_FORMAT(last_active_date, '%Y-%m-%d') AS last_active_date,
                    total_time_on_platform_seconds
                FROM users 
                WHERE username = p_username 
                LIMIT 1;
            END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `refresh_inactive_user_streaks`()
BEGIN
                UPDATE users
                SET current_streak = 0
                WHERE last_active_date IS NOT NULL 
                  AND last_active_date < DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
                  AND current_streak > 0;

                SELECT ROW_COUNT() AS affected_users;
            END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `save_user_reminder`(
    IN p_user_id INT,
    IN p_reminder_time TIME,
    IN p_is_enabled TINYINT
)
BEGIN
    -- Upsert reminder: Defaults is_enabled to 0 if not provided (NULL)
    INSERT INTO user_reminders (user_id, reminder_time, is_enabled)
    VALUES (
        p_user_id,
        p_reminder_time,
        COALESCE(p_is_enabled, 0)
    )
    ON DUPLICATE KEY UPDATE
        reminder_time = VALUES(reminder_time),
        is_enabled = COALESCE(p_is_enabled, is_enabled),
        updated_at = CURRENT_TIMESTAMP;

    -- Return the updated reminder record
    SELECT 
        id,
        user_id,
        TIME_FORMAT(reminder_time, '%H:%i:%s') AS reminder_time,
        is_enabled,
        created_at,
        updated_at
    FROM user_reminders
    WHERE user_id = p_user_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_user_activity`(
                IN p_user_id INT,
                IN p_time_spent_seconds INT,
                IN p_total_time_seconds INT
            )
BEGIN
                DECLARE v_last_active DATE;
                DECLARE v_current_streak INT DEFAULT 0;
                DECLARE v_new_streak INT DEFAULT 1;

                SELECT last_active_date, COALESCE(current_streak, 0)
                INTO v_last_active, v_current_streak
                FROM users 
                WHERE id = p_user_id;

                IF v_last_active IS NULL THEN
                    SET v_new_streak = 1;
                ELSEIF v_last_active = CURRENT_DATE() THEN
                    SET v_new_streak = GREATEST(v_current_streak, 1);
                ELSEIF v_last_active = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY) THEN
                    SET v_new_streak = v_current_streak + 1;
                ELSE
                    SET v_new_streak = 1;
                END IF;

                UPDATE users
                SET 
                    last_active_date = CURRENT_DATE(),
                    current_streak = v_new_streak,
                    total_time_on_platform_seconds = CASE 
                        WHEN p_total_time_seconds IS NOT NULL THEN p_total_time_seconds
                        ELSE COALESCE(total_time_on_platform_seconds, 0) + COALESCE(p_time_spent_seconds, 0)
                    END,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = p_user_id;

                SELECT 
                    id,
                    username,
                    name,
                    current_streak,
                    DATE_FORMAT(last_active_date, '%Y-%m-%d') AS last_active_date,
                    total_time_on_platform_seconds
                FROM users
                WHERE id = p_user_id;
            END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `upsert_user_video_progress`(
    IN p_user_id INT,
    IN p_video_id INT,
    IN p_current_timestamp_seconds INT,
    IN p_total_video_duration INT,
    IN p_is_completed TINYINT(1),
    IN p_first_opened_at TIMESTAMP,
    IN p_last_watched_at TIMESTAMP,
    IN p_completed_at TIMESTAMP
)
BEGIN
    INSERT INTO `user_video_progress` (
        `user_id`, 
        `video_id`, 
        `current_timestamp_seconds`, 
        `total_video_duration`, 
        `is_completed`, 
        `last_watched_at`, 
        `completed_at`
    )
    VALUES (
        p_user_id, 
        p_video_id, 
        p_current_timestamp_seconds, 
        p_total_video_duration, 
        p_is_completed, 
        IFNULL(p_last_watched_at, CURRENT_TIMESTAMP), 
        IFNULL(p_completed_at, IF(p_is_completed = 1, CURRENT_TIMESTAMP, NULL))
    )
    ON DUPLICATE KEY UPDATE
        `current_timestamp_seconds` = VALUES(`current_timestamp_seconds`),
        `total_video_duration` = VALUES(`total_video_duration`),
        `is_completed` = IF(`is_completed` = 1, 1, VALUES(`is_completed`)),
        `last_watched_at` = IFNULL(p_last_watched_at, CURRENT_TIMESTAMP),
        `completed_at` = IFNULL(p_completed_at, IF(`is_completed` = 0 AND VALUES(`is_completed`) = 1, CURRENT_TIMESTAMP, `completed_at`));

    -- Select the updated row so Node.js can send it back in the response
    SELECT 
        first_opened_at, 
        last_watched_at, 
        completed_at,
        is_completed,
        current_timestamp_seconds,
        total_video_duration
    FROM user_video_progress
    WHERE user_id = p_user_id AND video_id = p_video_id;
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
                IN p_doctor_name VARCHAR(100),
                IN p_language_id INT,
                IN p_language_name VARCHAR(100)
            )
BEGIN
                INSERT INTO users (
                    username, password_hash, name, photo_url, dob, sex, age,
                    email, phone_number, note, doctor_id, doctor_name,
                    language_id, language_name, status, registered_date
                ) VALUES (
                    p_username, p_password_hash, p_name, p_photo_url, p_dob, p_sex, p_age,
                    p_email, p_phone_number, p_note, p_doctor_id, p_doctor_name,
                    p_language_id, p_language_name, 'Active', CURRENT_TIMESTAMP
                );
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
                IN p_password_hash VARCHAR(255),
                IN p_language_id INT,
                IN p_language_name VARCHAR(100)
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
                    password_hash = COALESCE(p_password_hash, password_hash),
                    language_id = COALESCE(p_language_id, language_id),
                    language_name = COALESCE(p_language_name, language_name)
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
        u.id, 
        u.username, 
        u.name, 
        u.photo_url, 
        DATE_FORMAT(u.dob, '%Y-%m-%d') AS dob, 
        u.sex, 
        u.age, 
        u.email, 
        u.phone_number, 
        u.note, 
        u.language_id, 
        u.language_name, 
        u.doctor_id, 
        u.doctor_name, 
        u.current_streak, 
        u.last_active_date, 
        u.total_time_on_platform_seconds, 
        u.registered_date, 
        u.status, 
        u.updated_at,
        -- Notification details
        COALESCE(ur.is_enabled, 0) AS is_notification_enabled,
        CASE 
            WHEN ur.is_enabled = 1 THEN 'ON'
            ELSE 'OFF'
        END AS notification_status,
        CASE 
            WHEN ur.is_enabled = 1 THEN TIME_FORMAT(ur.reminder_time, '%H:%i:%s')
            ELSE NULL 
        END AS notification_time
    FROM users u
    LEFT JOIN user_reminders ur ON ur.user_id = u.id
    WHERE u.id = p_user_id AND u.doctor_id = p_doctor_id;
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
                    id, name, photo_url, sex, age, email, phone_number, language_id, language_name, status, registered_date 
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
