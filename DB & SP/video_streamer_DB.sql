-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: videostreamer_db_v3
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '209751e0-37b8-11f1-bfed-40c2ba987f8c:1-47219,
35f1f18e-371f-11f1-80d5-5cb47e3771c9:1-1565';

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_admin_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','$2b$10$AAw88YyaTZz15M3QSe2Wb.HcFt7pT5U2DVOa.EgEa6LxREW1e4RhC','Dr. Admin Smith','https://example.com/photos/admin.jpg','admin@hospital.com','+1234567890','1985-05-15','2026-09-01 04:33:32','2026-09-01 05:44:50');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_versions`
--

DROP TABLE IF EXISTS `app_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_versions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) NOT NULL,
  `is_admin_update` tinyint(1) DEFAULT '0',
  `min_version` varchar(20) NOT NULL,
  `max_version` varchar(20) NOT NULL,
  `download_link` text NOT NULL,
  `update_message` text,
  `is_force_update` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `idx_admin_id` (`is_admin_update`,`id` DESC)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_versions`
--

LOCK TABLES `app_versions` WRITE;
/*!40000 ALTER TABLE `app_versions` DISABLE KEYS */;
INSERT INTO `app_versions` VALUES (1,'Admin Mobile',1,'1.00','2.00','Not Provided','Pls Update the Mobile App',1,'2026-09-09 05:36:33','2026-09-09 05:36:33'),(2,'User Mobile',0,'1.00','2.00','Not Provided','Pls Update the Mobile App',1,'2026-09-09 05:38:41','2026-09-09 05:38:41');
/*!40000 ALTER TABLE `app_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `languages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language_name` varchar(255) NOT NULL,
  `delete_status` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'English',0,'2026-09-08 06:43:40','2026-09-08 06:43:40'),(2,'Hindi',0,'2026-09-08 06:43:40','2026-09-08 06:43:40'),(3,'Malayalam',0,'2026-09-08 06:43:40','2026-09-08 06:43:40');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_activity_logs`
--

DROP TABLE IF EXISTS `user_activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_activity_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `action` varchar(50) NOT NULL,
  `video_id` int DEFAULT NULL,
  `details` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `video_id` (`video_id`),
  KEY `idx_action_date` (`action`,`created_at`),
  KEY `idx_user_history` (`user_id`,`created_at`),
  CONSTRAINT `user_activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_activity_logs_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_activity_logs`
--

LOCK TABLES `user_activity_logs` WRITE;
/*!40000 ALTER TABLE `user_activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_video_assignments`
--

DROP TABLE IF EXISTS `user_video_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_video_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `video_id` int NOT NULL,
  `watch_order` int NOT NULL,
  `assigned_by_admin_id` int DEFAULT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_video` (`user_id`,`video_id`),
  KEY `video_id` (`video_id`),
  KEY `assigned_by_admin_id` (`assigned_by_admin_id`),
  KEY `idx_watch_order` (`user_id`,`watch_order`),
  CONSTRAINT `user_video_assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_video_assignments_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_video_assignments_ibfk_3` FOREIGN KEY (`assigned_by_admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_video_assignments`
--

LOCK TABLES `user_video_assignments` WRITE;
/*!40000 ALTER TABLE `user_video_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_video_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_video_progress`
--

DROP TABLE IF EXISTS `user_video_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_video_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `video_id` int NOT NULL,
  `current_timestamp_seconds` int DEFAULT '0',
  `total_watch_time_seconds` int DEFAULT '0',
  `is_completed` tinyint(1) DEFAULT '0',
  `last_watched_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_progress` (`user_id`,`video_id`),
  KEY `video_id` (`video_id`),
  KEY `idx_last_watched` (`user_id`,`last_watched_at`),
  KEY `idx_completed` (`user_id`,`is_completed`),
  CONSTRAINT `user_video_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_video_progress_ibfk_2` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_video_progress`
--

LOCK TABLES `user_video_progress` WRITE;
/*!40000 ALTER TABLE `user_video_progress` DISABLE KEYS */;
INSERT INTO `user_video_progress` VALUES (1,1,5,975,3396,1,'2026-09-10 08:56:16',NULL),(7,1,11,424,773,0,'2026-09-10 08:56:39',NULL),(11,26,11,3,773,1,'2026-09-10 09:00:46',NULL),(16,26,26,461,491,1,'2026-09-10 09:29:31',NULL),(92,1,26,227,491,0,'2026-09-10 09:40:18',NULL),(98,26,34,564,873,0,'2026-09-11 09:39:54',NULL);
/*!40000 ALTER TABLE `user_video_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `sex` enum('Male','Female','Other') NOT NULL,
  `age` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `note` text,
  `language_id` int DEFAULT NULL,
  `language_name` varchar(100) DEFAULT NULL,
  `doctor_id` int DEFAULT NULL,
  `doctor_name` varchar(100) DEFAULT NULL,
  `current_streak` int DEFAULT '0',
  `last_active_date` date DEFAULT NULL,
  `total_time_on_platform_seconds` int DEFAULT '0',
  `registered_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_user_doctor` (`doctor_id`),
  KEY `idx_user_status` (`status`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','$2b$10$AAw88YyaTZz15M3QSe2Wb.HcFt7pT5U2DVOa.EgEa6LxREW1e4RhC','Test User Name',NULL,'2004-09-10','Male',21,NULL,'55-888',NULL,2,'malayalam',1,'Dr. Admin Smith',0,NULL,0,'2026-09-01 06:00:56','Active','2026-09-11 12:03:02'),(2,'testpatient1','$2b$10$w4Zh4S0aU5Sl8dr8DLDRUOUf3HlR2jdrvWyWGTnet2w1nIogcnifi','John Doe','profiles/1788253770425-48683213.jpeg','1990-05-15','Male',36,'john@example.com','555-1234','Post-surgery recovery',NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-01 09:09:30','Active','2026-09-04 08:47:12'),(7,'doies','$2b$10$uM1NE0BFBNLZZDzPD.TUlOKqQaUguLGG244PCN4hED7vqYRV6CEWO','doies','profiles/1788509705962-864597540.png','2001-09-10','Male',24,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:15:06','Active','2026-09-04 08:15:06'),(8,'im','$2b$10$At76LqLX6hEsb/WwazZ4Z.6vCth5SXY8KjS.mJy4HyDpdR5tDq5Ci','im',NULL,'2001-09-10','Male',24,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:18:10','Active','2026-09-04 08:18:10'),(9,'imo','$2b$10$ooncETqbT9ze4QEbMFLSfui93ZDjMPvwrPDPB580D3PlWZ5J1zUQO','imo','profiles/1788509910154-16418111.png',NULL,'Male',43,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:18:30','Active','2026-09-04 08:18:30'),(10,'test','$2b$10$EUEY4DORBht1vr5um.lLEO4F4gLNk3Z8G1drN.uCHkanC2N9uXBaS','test','profiles/1788510208797-303115437.png',NULL,'Male',30,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:23:29','Active','2026-09-04 08:23:29'),(11,'img','$2b$10$o8lxAnZIt4RMbctSyKL2sOrSm54o203oYjsG.4nuYxaoIsQNbbV7W','large img','profiles/1788511928296-798882666.jpg','2001-09-11','Male',24,'addd@gmail.com',NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:52:08','Active','2026-09-04 12:12:39'),(12,'ant12','$2b$10$KXLKBv2fc3wm.Y4p6Tt4lu/k7NkdefzoTyZfvhfTzuMJlBWVOAPB2','ant',NULL,'2001-09-10','Male',24,'ant@gmail.com','5674370986','hlooo',NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:28:47','Active','2026-09-04 10:28:47'),(15,'ant1233','$2b$10$NGP7DWEgg5fh0lOeaQQWe.zo7alfZiq.C7.CYAfm1u9msPTu9k5d6','ant',NULL,'2001-09-03','Male',25,'ant3@gmail.com','5479865478','rqwef',NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:29:58','Active','2026-09-04 10:29:58'),(16,'sdc','$2b$10$Ra9ZB4xy.8guo6qYOr2BvOIpVbB3jZTVQfCSvMOtE0IDE15TtX88C','asdc',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:30:13','Active','2026-09-04 10:30:13'),(17,'asfv','$2b$10$scVsJGpZ.9yoqNdfloB.zuSEBtT5BMhouWT6x5XNwVPIQPA.7rzLe','das',NULL,'2001-09-10','Male',24,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:31:34','Active','2026-09-04 10:31:34'),(20,'123','$2b$10$hiWa4PfxJdPuSjujcujzPO2yPepgwYdIKpfjD59cqzCqZA.7T7sk.','das',NULL,'2001-09-10','Male',24,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:33:00','Active','2026-09-04 10:33:00'),(23,'1234','$2b$10$w9U8tblvFMFr0dabn0F68.pnZI8oJesl6rryZE5GHH8k1es9Pi4r2','das',NULL,'2001-09-10','Male',24,'eiufhu2@gmail.com',NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:35:57','Active','2026-09-04 10:35:57'),(24,'sde23','$2b$10$XF8rwY.VxEYdKjU0jqDkMuqR21x32vJCjXanLIpbwr5YsAMYLNGy.','sde','profiles/1788518227246-331832920.jpg',NULL,'Male',NULL,'12d@gmail.com',NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:37:07','Active','2026-09-04 10:37:07'),(25,'das3','$2b$10$EnUvBHlV8WMFGSQNoot4r.BsSXt7oR0iE51CHIxZ1qAuD1OdBZ/fu','dasd','profiles/1788518312250-990915952.png','2001-09-17','Male',24,'dd@gmail.com','2435645345',NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:38:32','Active','2026-09-11 10:31:47'),(26,'das','$2b$10$sZdroXBWiSPzHSAeHmgz1ebsiBx7yQ.w73yHWkii1c50MYORmKU3K','das',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:40:24','Active','2026-09-04 10:40:24'),(28,'ergf','$2b$10$oL9XPAoQPRKVGLElZlcj/.Rn1KX.HBVoHtYpf.l2PScY7Jsv60J42','rfw',NULL,NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:44:14','Active','2026-09-04 10:44:14'),(29,'add','$2b$10$wNcB4mRFtiKY08ItGgl25ubX/zThKNNr233qG3Vq.Y4LnjubAR7qW','add',NULL,'2001-09-10','Male',24,'add@gmail.com',NULL,'asef',NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:45:47','Active','2026-09-04 11:08:27'),(30,'doeee','$2b$10$XAElFrKu/56Fo5bPLIzfdOgQWyPR6kVS1cgq4b77sBji5NdUaPPVG','izusdhfuz','profiles/1788769084707-753761748.png',NULL,'Male',NULL,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-07 08:18:04','Inactive','2026-09-10 05:50:58'),(32,'leo das','$2b$10$aMMyfhkHUpa8EAYQ.fiASebCr6PdjOrqUeQ64OzfwU1VbjfaEGnTm','rolex',NULL,'2001-09-16','Male',24,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-10 05:51:32','Inactive','2026-09-10 06:32:01'),(34,'leo','$2b$10$041ZOkFbhOFOwWL4ONHc6eao0GGOGlsU1WSguKh4EoyFkfSIb1FO6','leo',NULL,'2001-09-11','Male',24,NULL,NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-10 06:32:50','Active','2026-09-10 06:32:50'),(35,'rolex','$2b$10$JVv5.rNEP7p7W/1bosIi1.WIVC7WW/EeElzGCkUHMFVchwsJK5OE6','rolex',NULL,'2001-09-17','Male',24,'rolex@gmail.com','7980979898',NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-11 09:54:21','Active','2026-09-11 09:54:21'),(36,'sim','$2b$10$sx0Gt8cR9.I2YJDV1AVhpeqMtym6L82mweLRr4zKfzQB7ip9C/sxG','sim',NULL,NULL,'Male',24,'sim@gmail.com','5893048309',NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-11 10:13:52','Active','2026-09-11 10:26:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `video_url` varchar(255) NOT NULL,
  `language_id` int DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `video_source` enum('local','youtube','vimeo','external') NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `category` enum('pre-op','post-op') NOT NULL,
  `total_duration_seconds` int DEFAULT '0',
  `uploaded_by_admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uploaded_by_admin_id` (`uploaded_by_admin_id`),
  KEY `idx_video_category` (`category`),
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`uploaded_by_admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,'My First Surgery Video','This is a test description.','https://www.youtube.com/watch?v=dQw4w9WgXcQ',3,'Malayalam','youtube',NULL,'pre-op',0,1,'2026-09-02 09:53:48','2026-09-09 05:55:10'),(2,'My Local Server Video','Testing local MP4 upload.','videos/1788343099283-145119193.mp4',NULL,NULL,'local','thumbnails/1788343099793-33729851.jpeg','post-op',0,1,'2026-09-02 09:58:19','2026-09-02 09:58:19'),(3,'My Local Server Video','Testing local2','videos/1788343491142-254262379.mp4',NULL,NULL,'local','thumbnails/1788343491547-285988093.jpg','pre-op',0,1,'2026-09-02 10:04:51','2026-09-02 10:04:51'),(4,'My Local Server Video3','Testing local3','videos/1788343642605-72122656.mp4',NULL,NULL,'local','thumbnails/1788343642928-311377829.jpg','pre-op',0,1,'2026-09-02 10:07:22','2026-09-02 10:07:22'),(5,'youtub','sfdghj','https://www.youtube.com/watch?v=T7RrhHEp130',2,'Hindi','youtube',NULL,'post-op',0,1,'2026-09-04 09:28:32','2026-09-08 05:07:30'),(6,'sdf','sdf','https://www.youtube.com/watch?v=T7RrhHEp130',NULL,NULL,'youtube',NULL,'post-op',0,1,'2026-09-04 09:30:26','2026-09-04 09:30:26'),(7,'sadffgf','adscf','videos/1788515399313-929895810.mp4',NULL,NULL,'local',NULL,'post-op',0,1,'2026-09-04 09:50:03','2026-09-04 09:50:03'),(8,'First VIDEO',NULL,'https://youtu.be/X7pNbK8ATiE',1,'English','youtube',NULL,'post-op',0,1,'2026-09-07 05:17:41','2026-09-09 05:55:10'),(9,'First',NULL,'https://youtu.be/FluKUJyeYD8',3,'Malayalam','youtube',NULL,'post-op',0,1,'2026-09-07 05:25:47','2026-09-09 06:04:28'),(10,'First',NULL,'https://youtu.be/FluKUJyeYD8',NULL,NULL,'youtube',NULL,'post-op',0,1,'2026-09-07 05:32:32','2026-09-07 05:32:32'),(11,'hello',NULL,'https://youtu.be/2bfv5kp2dAM',2,'Hindi','youtube',NULL,'pre-op',0,1,'2026-09-07 06:28:31','2026-09-09 06:04:28'),(12,'testing',NULL,'https://youtu.be/2bfv5kp2dAM',NULL,NULL,'youtube','thumbnails/1788762960075-17370352.png','post-op',0,1,'2026-09-07 06:36:00','2026-09-07 06:36:00'),(14,'test','','https://youtu.be/2bfv5kp2dAM',3,'Malayalam','youtube','thumbnails/1788763303906-281155180.png','post-op',0,1,'2026-09-07 06:41:44','2026-09-09 05:55:39'),(15,'ofcccc','','https://youtu.be/jXHOHOYkbYc?si=qVhDGpzimFZkMlzz',NULL,NULL,'youtube',NULL,'post-op',0,1,'2026-09-07 08:15:07','2026-09-07 08:43:50'),(16,'dasss',NULL,'https://youtu.be/Zlj8Uz5sgIo',NULL,'kannada','youtube',NULL,'post-op',0,1,'2026-09-08 05:49:04','2026-09-08 05:49:04'),(17,'fAAA','','https://youtu.be/xeOttl1d2bo',3,'Malayalam','youtube',NULL,'post-op',0,1,'2026-09-08 06:02:59','2026-09-09 06:03:51'),(18,'\'sdifjhoiuaw',NULL,'https://youtu.be/SJVmeJaS44s',1,'English','youtube',NULL,'post-op',0,1,'2026-09-08 12:21:12','2026-09-09 06:03:51'),(19,'rmgoerk',NULL,'https://youtu.be/gt60M1nuoe0',1,'English','youtube',NULL,'post-op',0,1,'2026-09-08 12:22:17','2026-09-09 06:03:51'),(22,'free','','https://youtu.be/ez5sDt_nwhA',1,'English','youtube',NULL,'post-op',873,1,'2026-09-09 04:59:09','2026-09-11 05:37:13'),(23,'geo',NULL,'https://youtu.be/sW28DfgQdNM',1,'English','youtube',NULL,'post-op',0,1,'2026-09-09 05:05:36','2026-09-09 06:03:51'),(24,'tuiii',NULL,'https://youtu.be/aNXXCohwz00',1,'English','youtube',NULL,'post-op',0,1,'2026-09-09 05:07:43','2026-09-09 06:03:51'),(26,'English',NULL,'https://youtu.be/R3OREOaFwVc',1,'English','youtube',NULL,'pre-op',0,1,'2026-09-09 05:57:01','2026-09-09 06:03:51'),(28,'id test','','https://youtu.be/mvfo3pUiCCA',3,'Malayalam','youtube',NULL,'post-op',0,1,'2026-09-09 06:03:53','2026-09-09 06:09:59'),(31,'scene',NULL,'https://youtu.be/_nuRAflabx8',1,'English','youtube',NULL,'post-op',80,1,'2026-09-11 05:07:37','2026-09-11 05:07:37'),(34,'strell',NULL,'https://youtu.be/ez5sDt_nwhA',1,'English','youtube',NULL,'post-op',873,1,'2026-09-11 05:36:23','2026-09-11 05:36:23'),(35,'watch',NULL,'https://www.youtube.com/live/_YSpQfkjlLI?si=2WdtYRL8_JjATgtA',1,'English','youtube',NULL,'pre-op',0,1,'2026-09-11 06:25:21','2026-09-11 06:25:21'),(36,'EFEF',NULL,'https://youtu.be/o0gkdZBtwEg',1,'English','youtube',NULL,'post-op',675,1,'2026-09-11 06:26:46','2026-09-11 06:26:46');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-11 17:34:51
