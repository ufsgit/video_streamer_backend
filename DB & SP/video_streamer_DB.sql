-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: video_stream_db_v1
-- ------------------------------------------------------
-- Server version	8.0.45

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_video_progress`
--

LOCK TABLES `user_video_progress` WRITE;
/*!40000 ALTER TABLE `user_video_progress` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','$2b$10$AAw88YyaTZz15M3QSe2Wb.HcFt7pT5U2DVOa.EgEa6LxREW1e4RhC','Test User Name',NULL,'2004-09-10','Male',21,NULL,'55-888',NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-01 06:00:56','Active','2026-09-04 06:48:25'),(2,'testpatient1','$2b$10$w4Zh4S0aU5Sl8dr8DLDRUOUf3HlR2jdrvWyWGTnet2w1nIogcnifi','John Doe','profiles/1788253770425-48683213.jpeg','1990-05-15','Male',36,'john@example.com','555-1234','Post-surgery recovery',1,'Dr. Admin Smith',0,NULL,0,'2026-09-01 09:09:30','Active','2026-09-04 08:47:12'),(7,'doies','$2b$10$uM1NE0BFBNLZZDzPD.TUlOKqQaUguLGG244PCN4hED7vqYRV6CEWO','doies','profiles/1788509705962-864597540.png','2001-09-10','Male',24,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:15:06','Active','2026-09-04 08:15:06'),(8,'im','$2b$10$At76LqLX6hEsb/WwazZ4Z.6vCth5SXY8KjS.mJy4HyDpdR5tDq5Ci','im',NULL,'2001-09-10','Male',24,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:18:10','Active','2026-09-04 08:18:10'),(9,'imo','$2b$10$ooncETqbT9ze4QEbMFLSfui93ZDjMPvwrPDPB580D3PlWZ5J1zUQO','imo','profiles/1788509910154-16418111.png',NULL,'Male',43,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:18:30','Active','2026-09-04 08:18:30'),(10,'test','$2b$10$EUEY4DORBht1vr5um.lLEO4F4gLNk3Z8G1drN.uCHkanC2N9uXBaS','test','profiles/1788510208797-303115437.png',NULL,'Male',30,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:23:29','Active','2026-09-04 08:23:29'),(11,'img','$2b$10$o8lxAnZIt4RMbctSyKL2sOrSm54o203oYjsG.4nuYxaoIsQNbbV7W','large img','profiles/1788511928296-798882666.jpg','2001-09-11','Male',24,'addd@gmail.com',NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 08:52:08','Active','2026-09-04 12:12:39'),(12,'ant12','$2b$10$KXLKBv2fc3wm.Y4p6Tt4lu/k7NkdefzoTyZfvhfTzuMJlBWVOAPB2','ant',NULL,'2001-09-10','Male',24,'ant@gmail.com','5674370986','hlooo',1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:28:47','Active','2026-09-04 10:28:47'),(15,'ant1233','$2b$10$NGP7DWEgg5fh0lOeaQQWe.zo7alfZiq.C7.CYAfm1u9msPTu9k5d6','ant',NULL,'2001-09-03','Male',25,'ant3@gmail.com','5479865478','rqwef',1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:29:58','Active','2026-09-04 10:29:58'),(16,'sdc','$2b$10$Ra9ZB4xy.8guo6qYOr2BvOIpVbB3jZTVQfCSvMOtE0IDE15TtX88C','asdc',NULL,NULL,'Male',NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:30:13','Active','2026-09-04 10:30:13'),(17,'asfv','$2b$10$scVsJGpZ.9yoqNdfloB.zuSEBtT5BMhouWT6x5XNwVPIQPA.7rzLe','das',NULL,'2001-09-10','Male',24,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:31:34','Active','2026-09-04 10:31:34'),(20,'123','$2b$10$hiWa4PfxJdPuSjujcujzPO2yPepgwYdIKpfjD59cqzCqZA.7T7sk.','das',NULL,'2001-09-10','Male',24,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:33:00','Active','2026-09-04 10:33:00'),(23,'1234','$2b$10$w9U8tblvFMFr0dabn0F68.pnZI8oJesl6rryZE5GHH8k1es9Pi4r2','das',NULL,'2001-09-10','Male',24,'eiufhu2@gmail.com',NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:35:57','Active','2026-09-04 10:35:57'),(24,'sde23','$2b$10$XF8rwY.VxEYdKjU0jqDkMuqR21x32vJCjXanLIpbwr5YsAMYLNGy.','sde','profiles/1788518227246-331832920.jpg',NULL,'Male',NULL,'12d@gmail.com',NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:37:07','Active','2026-09-04 10:37:07'),(25,'das3','$2b$10$Bi/i7dNg2u.6EgcL2a/Pau1fR2iawRtNqJQa7McGS1bXi5pXaP1H6','dasd','profiles/1788518312250-990915952.png',NULL,'Male',NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:38:32','Active','2026-09-04 10:38:32'),(26,'das','$2b$10$sZdroXBWiSPzHSAeHmgz1ebsiBx7yQ.w73yHWkii1c50MYORmKU3K','das',NULL,NULL,'Male',NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:40:24','Active','2026-09-04 10:40:24'),(28,'ergf','$2b$10$oL9XPAoQPRKVGLElZlcj/.Rn1KX.HBVoHtYpf.l2PScY7Jsv60J42','rfw',NULL,NULL,'Male',NULL,NULL,NULL,NULL,1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:44:14','Active','2026-09-04 10:44:14'),(29,'add','$2b$10$wNcB4mRFtiKY08ItGgl25ubX/zThKNNr233qG3Vq.Y4LnjubAR7qW','add',NULL,'2001-09-10','Male',24,'add@gmail.com',NULL,'asef',1,'Dr. Admin Smith',0,NULL,0,'2026-09-04 10:45:47','Active','2026-09-04 11:08:27');
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
  `video_source` enum('local','youtube','vimeo','external') NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `category` enum('pre-op','post-op') NOT NULL,
  `uploaded_by_admin_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uploaded_by_admin_id` (`uploaded_by_admin_id`),
  KEY `idx_video_category` (`category`),
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`uploaded_by_admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,'My First Surgery Video','This is a test description.','https://www.youtube.com/watch?v=dQw4w9WgXcQ','youtube',NULL,'pre-op',1,'2026-09-02 09:53:48','2026-09-02 09:53:48'),(2,'My Local Server Video','Testing local MP4 upload.','videos/1788343099283-145119193.mp4','local','thumbnails/1788343099793-33729851.jpeg','post-op',1,'2026-09-02 09:58:19','2026-09-02 09:58:19'),(3,'My Local Server Video','Testing local2','videos/1788343491142-254262379.mp4','local','thumbnails/1788343491547-285988093.jpg','pre-op',1,'2026-09-02 10:04:51','2026-09-02 10:04:51'),(4,'My Local Server Video3','Testing local3','videos/1788343642605-72122656.mp4','local','thumbnails/1788343642928-311377829.jpg','pre-op',1,'2026-09-02 10:07:22','2026-09-02 10:07:22'),(5,'youtub','sfdghj','https://www.youtube.com/watch?v=T7RrhHEp130','youtube',NULL,'post-op',1,'2026-09-04 09:28:32','2026-09-04 09:28:32'),(6,'sdf','sdf','https://www.youtube.com/watch?v=T7RrhHEp130','youtube',NULL,'post-op',1,'2026-09-04 09:30:26','2026-09-04 09:30:26'),(7,'sadffgf','adscf','videos/1788515399313-929895810.mp4','local',NULL,'post-op',1,'2026-09-04 09:50:03','2026-09-04 09:50:03');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-04 18:14:14
