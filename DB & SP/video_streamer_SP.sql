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
        doctor_id
    FROM users 
    WHERE username = p_username 
    LIMIT 1;
END$$
DELIMITER ;
