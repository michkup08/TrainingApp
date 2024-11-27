-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: trainingappdb
-- ------------------------------------------------------
-- Server version	8.0.37

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
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `chat_id` bigint NOT NULL AUTO_INCREMENT,
  `user_one_id` bigint DEFAULT NULL,
  `user_two_id` bigint DEFAULT NULL,
  `last_message_date` varchar(255) DEFAULT NULL,
  `user_one_notification` bit(1) DEFAULT NULL,
  `user_two_notification` bit(1) DEFAULT NULL,
  PRIMARY KEY (`chat_id`),
  KEY `FKsq90c1b1cjc2k76kpxsbneerc` (`user_one_id`),
  KEY `FKa0gro0s3vgrxsot0bg9b9rsnl` (`user_two_id`),
  CONSTRAINT `FKa0gro0s3vgrxsot0bg9b9rsnl` FOREIGN KEY (`user_two_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKsq90c1b1cjc2k76kpxsbneerc` FOREIGN KEY (`user_one_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (2,6,4,'31-10-2024 12:06:58',_binary '',_binary '\0'),(4,6,6,'24-10-2024 17:47:42',_binary '\0',_binary '\0'),(5,7,4,'12-10-2024 13:43:17',_binary '\0',_binary '\0'),(6,6,9,'02-10-2024 18:59:58',_binary '\0',_binary '\0'),(7,6,7,'01-10-2024 14:32:48',_binary '\0',_binary '\0'),(8,4,4,'12-10-2024 13:51:15',_binary '\0',_binary '\0'),(9,9,9,'18-10-2024 11:13:46',_binary '\0',_binary '\0'),(10,4,9,'24-10-2024 17:05:55',_binary '\0',_binary '\0'),(11,15,14,'29-10-2024 13:23:33',_binary '\0',_binary '\0'),(12,4,14,'31-10-2024 11:09:14',_binary '\0',_binary ''),(13,21,11,'05-11-2024 14:17:48',_binary '\0',_binary '');
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `comment_id` bigint NOT NULL AUTO_INCREMENT,
  `context` varchar(255) DEFAULT NULL,
  `post_post_id` bigint DEFAULT NULL,
  `sender_user_id` bigint DEFAULT NULL,
  `date_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `FKr8dcfnodixuj36b7ftl47oahm` (`post_post_id`),
  KEY `FK7x5rfxsq4c8wjahkvmgqe8fys` (`sender_user_id`),
  CONSTRAINT `FK7x5rfxsq4c8wjahkvmgqe8fys` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKr8dcfnodixuj36b7ftl47oahm` FOREIGN KEY (`post_post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,'Mogę cię potrenować Mariuszku, ale nie z tymi głupimi hantlami, tylko piłkę kopać',4,9,'04-11-2024 13:55:14'),(2,'W Wilkowyjach mam lepszy sprzęt',4,6,'04-10-2024 13:55:14'),(3,'Ja się trochę cykam Adaś',24,4,'04-10-2024 13:55:14'),(4,'Przybędę, ale upewnij się że sprzęt jest na mnie gotowy',25,4,'04-10-2024 13:55:14'),(5,'No a pod tym sprawdzę komentarze',26,6,'04-10-2024 10:52:12'),(6,'Nie bójcie się mnie tak, będzie fajny trening',4,4,'04-10-2024 10:35:14'),(7,'Ja się trochę cykam',4,6,'04-10-2024 10:45:14'),(8,'I se znowu coś wyślę',26,6,'04-10-2024 10:55:14'),(9,'I znowu dla pewności',26,6,'04-10-2024 11:55:14'),(10,'aaa',26,6,'04-10-2024 12:55:14'),(11,'bbb',26,6,'04-10-2024 13:55:14'),(12,'ccc',26,6,'04-10-2024 14:06:08'),(13,'ddd',26,6,'04-10-2024 14:10:02'),(14,'Na pewno wpadnę',28,4,'08-10-2024 15:28:46'),(15,'A ja się nie skontaktuje',30,12,'24-10-2024 17:03:37'),(16,'A to bardzo się cieszę',28,6,'24-10-2024 17:37:00'),(17,'AAA',4,6,'24-10-2024 18:39:43'),(18,'To nie pisz',32,14,'29-10-2024 15:46:35'),(19,'Dokładnie',32,21,'05-11-2024 19:26:39'),(20,'Nie pisz już tak',32,21,'05-11-2024 19:32:49'),(21,'aaa',32,21,'05-11-2024 19:39:01');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises` (
  `exercise_id` bigint NOT NULL AUTO_INCREMENT,
  `custom` bit(1) DEFAULT NULL,
  `default_value` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`exercise_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
INSERT INTO `exercises` VALUES (2,_binary '\0','..x..x..','A compound exercise that targets the legs and glutes. Performed by bending the knees and lowering the hips, then standing back up.','Squat'),(3,_binary '\0','..x..x..','A full-body exercise focusing on the lower back, glutes, and hamstrings. Involves lifting a barbell from the ground to hip level.','Deadlift'),(4,_binary '\0','..x..x..','Targets the chest, shoulders, and triceps. Performed lying on a bench while pressing a barbell or dumbbells upward from chest level.','Bench Press'),(5,_binary '\0','..x..x..','Upper body exercise primarily targeting the back and biceps. Involves pulling the body up to a bar until the chin is above it.','Pull-Up'),(6,_binary '\0','..x..x..','Targets the shoulders and triceps. Performed by pressing a barbell or dumbbells overhead from shoulder height.','Overhead Press'),(7,_binary '\0','..x..x..','Focuses on the back muscles. Performed by bending at the waist and pulling a barbell towards the torso.','Barbell Row'),(8,_binary '\0','..x..x..','Bodyweight exercise that works the chest, shoulders, and triceps. Involves lowering and raising the body by bending the arms while in a plank position.','Push-Up'),(9,_binary '\0','..x..x..','Core stability exercise. Performed by holding a push-up position with the body straight and the weight on the forearms and toes.','Plank'),(10,_binary '\0','..x..x..','Works the legs and glutes. Involves stepping forward with one leg, lowering the hips until both knees are bent at a 90-degree angle.','Lunge'),(11,_binary '\0','..x..x..','Isolates the biceps. Performed by curling a dumbbell or barbell from hip level to shoulder height.','Bicep Curl'),(12,_binary '\0','..x..x..','Targets the triceps. Performed by lowering the body with the arms behind on a bench or parallel bars, then pressing back up.','Tricep Dip'),(13,_binary '\0','..x..x..','Focuses on the quads, hamstrings, and glutes. Performed on a machine where the legs push a weighted platform away from the body.','Leg Press'),(14,_binary '\0','..x..x..','Targets the hamstrings. Performed by curling the legs toward the buttocks while lying face down on a machine.','Leg Curl'),(15,_binary '\0','..x..x..','Isolates the quadriceps. Performed on a machine by extending the legs from a bent to a straight position.','Leg Extension'),(16,_binary '\0','..x..x..','Targets the back and biceps. Performed by pulling a bar down towards the chest while seated.','Lat Pulldown'),(17,_binary '\0','..x..x..','Works the shoulders. Performed by raising dumbbells or cables out to the sides of the body until arms are parallel to the floor.','Shoulder Fly');
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises_with_parameters`
--

DROP TABLE IF EXISTS `exercises_with_parameters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises_with_parameters` (
  `exercises_with_parameters_id` bigint NOT NULL AUTO_INCREMENT,
  `parameters` varchar(255) DEFAULT NULL,
  `exercise_exercise_id` bigint DEFAULT NULL,
  `training_training_id` bigint DEFAULT NULL,
  PRIMARY KEY (`exercises_with_parameters_id`),
  KEY `FKm8p3cecj275ykpl6n0tsbs0y0` (`exercise_exercise_id`),
  KEY `FKndpsfj4x24xe4l728mgvxphsw` (`training_training_id`),
  CONSTRAINT `FKm8p3cecj275ykpl6n0tsbs0y0` FOREIGN KEY (`exercise_exercise_id`) REFERENCES `exercises` (`exercise_id`),
  CONSTRAINT `FKndpsfj4x24xe4l728mgvxphsw` FOREIGN KEY (`training_training_id`) REFERENCES `trainings` (`training_id`)
) ENGINE=InnoDB AUTO_INCREMENT=334 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises_with_parameters`
--

LOCK TABLES `exercises_with_parameters` WRITE;
/*!40000 ALTER TABLE `exercises_with_parameters` DISABLE KEYS */;
INSERT INTO `exercises_with_parameters` VALUES (1,'3x8x80',2,6),(2,'3x8x80',3,7),(3,'3x8x80',4,8),(4,'3x8x80',5,9),(5,'3x8x80',6,10),(6,'3x8x80',7,6),(7,'3x8x80',8,7),(8,'3x8x80',9,8),(9,'3x8x80',10,9),(10,'3x8x80',11,10),(11,'3x8x80',12,6),(12,'3x8x80',13,7),(13,'3x8x80',14,8),(14,'3x8x80',15,9),(15,'3x8x80',16,10),(16,'3x8x80',17,6),(18,'3x5x30',2,7),(24,'3x5x180',2,33),(25,'3x5x100',2,8),(26,'3x5x200',2,33),(27,'3x5x100',2,9),(28,'2x5x100',2,10),(29,'3x5x200',2,33),(46,'3x5x200',2,33),(48,'3x5x200',2,35),(49,'3x5x200',2,NULL),(51,'3x5x200',2,38),(52,'3x5x200',2,39),(53,'3x5x200',2,37),(54,'3x5x200',2,37),(55,'5x5x100',2,40),(56,'3x5x50',15,41),(57,'3x90s',9,41),(58,'3x1min',9,42),(59,'3x10',5,42),(60,'3x5x200',2,37),(61,'3x5x200',2,37),(62,'3x5x200',2,37),(63,'3x1min',9,42),(64,'3x10',5,42),(65,'3x1min',9,42),(66,'3x15',5,42),(67,'100x1min',9,44),(68,'5x5x300kg',3,45),(69,'5x5x300kg',3,45),(70,'5x5x250kg',2,45),(71,'500',8,46),(72,'300',5,46),(73,'5x5x200kg',4,46),(74,'100x1min',9,47),(75,'3x7x130kg',3,48),(76,'3x7x130kg',3,48),(77,'3x6x80',4,49),(78,'3x7x40',11,49),(80,'3x5x120',2,51),(81,'3x5x150',3,51),(82,'10x12',5,52),(83,'100x1min',9,43),(84,'..x..x..',9,53),(85,'..x..x..',4,53),(86,'..x..x..',4,54),(87,'..x..x..',13,54),(88,'..x..x..',16,54),(89,'..x..x..',4,55),(90,'..x..x..',11,55),(91,'..x..x..',15,55),(92,'..x..x..',3,56),(93,'..x..x..',7,56),(94,'..x..x..',5,57),(95,'..x..x..',10,57),(96,'..x..x..',16,57),(97,'..x..x..',13,58),(98,'..x..x..',9,58),(99,'..x..x..',5,58),(100,'..x..x..',12,59),(101,'..x..x..',6,59),(102,'..x..x..',4,59),(103,'..x..x..',14,60),(104,'..x..x..',8,60),(105,'..x..x..',17,60),(106,'..x..x..',13,58),(107,'..x..x..',9,58),(108,'..x..x..',5,58),(109,'..x..x..',12,59),(110,'..x..x..',6,59),(111,'..x..x..',4,59),(112,'..x..x..',14,60),(113,'..x..x..',8,60),(114,'..x..x..',17,60),(115,'..x..x..',13,58),(116,'..x..x..',9,58),(117,'..x..x..',5,58),(118,'..x..x..',12,59),(119,'..x..x..',6,59),(120,'..x..x..',4,59),(121,'..x..x..',14,60),(122,'..x..x..',8,60),(123,'..x..x..',17,60),(124,'..x..x..',13,58),(125,'..x..x..',9,58),(127,'..x..x..',12,59),(128,'..x..x..',6,59),(129,'..x..x..',4,59),(130,'..x..x..',14,60),(131,'..x..x..',8,60),(132,'..x..x..',17,60),(133,'..x..x..',13,58),(134,'..x..x..',9,58),(135,'..x..x..',5,58),(136,'..x..x..',12,59),(137,'..x..x..',6,59),(138,'..x..x..',4,59),(139,'..x..x..',14,60),(140,'..x..x..',8,60),(141,'..x..x..',17,60),(142,'..x..x..',13,58),(143,'..x..x..',9,58),(144,'..x..x..',5,58),(145,'..x..x..',12,59),(146,'..x..x..',6,59),(147,'..x..x..',4,59),(148,'..x..x..',14,60),(149,'..x..x..',8,60),(151,'..x..x..',13,58),(152,'..x..x..',9,58),(153,'..x..x..',5,58),(154,'..x..x..',12,59),(155,'..x..x..',6,59),(156,'..x..x..',4,59),(157,'..x..x..',14,60),(158,'..x..x..',8,60),(159,'..x..x..',17,60),(160,'..x..x..',13,79),(161,'..x..x..',9,79),(162,'..x..x..',5,79),(163,'..x..x..',13,80),(164,'..x..x..',9,80),(165,'..x..x..',5,80),(166,'..x..x..',12,81),(167,'..x..x..',6,81),(168,'..x..x..',4,81),(169,'..x..x..',14,82),(170,'..x..x..',8,82),(171,'..x..x..',17,82),(172,'..x..x..',13,83),(173,'..x..x..',9,83),(174,'..x..x..',5,83),(175,'..x..x..',12,84),(176,'..x..x..',6,84),(177,'..x..x..',4,84),(178,'..x..x..',14,85),(179,'..x..x..',8,85),(180,'..x..x..',17,85),(181,'..x..x..',13,86),(182,'..x..x..',9,86),(183,'..x..x..',5,86),(184,'..x..x..',12,87),(185,'..x..x..',6,87),(186,'..x..x..',4,87),(187,'..x..x..',14,88),(188,'..x..x..',8,88),(189,'..x..x..',17,88),(190,'..x..x..',13,89),(191,'..x..x..',9,89),(192,'..x..x..',5,89),(193,'..x..x..',13,NULL),(194,'..x..x..',9,NULL),(195,'..x..x..',5,NULL),(196,'..x..x..',13,NULL),(197,'..x..x..',9,NULL),(198,'..x..x..',5,NULL),(199,'..x..x..',13,NULL),(200,'..x..x..',9,NULL),(201,'..x..x..',5,NULL),(202,'..x..x..',NULL,NULL),(203,'..x..x..',NULL,NULL),(204,'..x..x..',NULL,NULL),(206,'..x..x..',13,94),(207,'..x..x..',9,94),(208,'..x..x..',5,94),(209,'..x..x..',13,95),(210,'..x..x..',9,95),(211,'..x..x..',5,95),(212,'..x..x..',12,96),(213,'..x..x..',6,96),(214,'..x..x..',4,96),(215,'..x..x..',14,97),(216,'..x..x..',8,97),(217,'..x..x..',17,97),(218,'..x..x..',13,98),(219,'..x..x..',7,98),(220,'..x..x..',4,98),(221,'..x..x..',13,99),(222,'..x..x..',9,99),(223,'..x..x..',5,99),(224,'..x..x..',12,100),(225,'..x..x..',6,100),(226,'..x..x..',4,100),(227,'..x..x..',14,101),(228,'..x..x..',8,101),(229,'..x..x..',17,101),(230,'..x..x..',5,57),(232,'..x..x..',16,57),(233,'..x..x..',4,54),(234,'..x..x..',16,54),(235,'..x..x..',4,54),(236,'..x..x..',16,54),(237,'..x..x..',4,54),(238,'..x..x..',16,54),(239,'..x..x..',13,102),(240,'..x..x..',9,102),(241,'..x..x..',5,102),(242,'..x..x..',12,103),(243,'..x..x..',6,103),(244,'..x..x..',4,103),(245,'..x..x..',14,104),(246,'..x..x..',8,104),(247,'..x..x..',17,104),(248,'..x..x..',13,105),(249,'..x..x..',9,105),(250,'..x..x..',5,105),(251,'..x..x..',12,106),(252,'..x..x..',6,106),(253,'..x..x..',4,106),(254,'..x..x..',14,107),(255,'..x..x..',8,107),(256,'..x..x..',17,107),(257,'3x8x80',2,108),(258,'3x8x80',7,108),(259,'3x8x80',17,108),(260,'3x8x80',3,109),(261,'3x8x80',8,109),(262,'3x8x80',13,109),(263,'3x5x30',2,109),(264,'3x8x80',4,110),(265,'3x8x80',9,110),(266,'3x8x80',14,110),(267,'3x5x100',2,110),(268,'100x1min',9,111),(269,'5x5x300kg',3,112),(270,'5x5x250kg',2,112),(271,'500',8,113),(272,'300',5,113),(273,'5x5x200kg',4,113),(274,'100x1min',9,114),(275,'3x7x130kg',3,115),(276,'3x8x80',2,116),(277,'3x8x80',7,116),(278,'3x8x80',17,116),(279,'3x8x80',3,117),(280,'3x8x80',8,117),(281,'3x8x80',13,117),(282,'3x5x30',2,117),(283,'3x8x80',4,118),(284,'3x8x80',9,118),(285,'3x8x80',14,118),(286,'3x5x100',2,118),(287,'100x1min',9,119),(288,'5x5x300kg',3,120),(289,'5x5x250kg',2,120),(290,'500',8,121),(291,'300',5,121),(292,'5x5x200kg',4,121),(293,'100x1min',9,122),(294,'3x7x130kg',3,123),(295,'5x7x250kg',3,124),(296,'3x5x200kg',4,124),(297,'..x..x..',13,125),(298,'..x..x..',9,125),(299,'..x..x..',5,125),(300,'..x..x..',12,126),(301,'..x..x..',6,126),(302,'..x..x..',4,126),(303,'..x..x..',14,127),(304,'..x..x..',8,127),(305,'..x..x..',17,127),(306,'..x..x..',13,128),(307,'..x..x..',7,128),(308,'..x..x..',4,128),(309,'3x5x120kg',2,129),(310,'3x8x80',2,130),(311,'3x8x80',7,130),(312,'3x8x80',17,130),(313,'3x8x80',3,131),(314,'3x8x80',8,131),(315,'3x8x80',13,131),(316,'3x5x30',2,131),(317,'3x8x80',4,132),(318,'3x8x80',9,132),(319,'3x8x80',14,132),(320,'3x5x100',2,132),(321,'100x1min',9,133),(322,'5x5x300kg',3,134),(323,'5x5x250kg',2,134),(324,'500',8,135),(325,'300',5,135),(326,'5x5x200kg',4,135),(327,'100x1min',9,136),(328,'3x7x130kg',3,137),(329,'5x7x250kg',3,138),(330,'3x5x200kg',4,138),(331,'3x5x120kg',2,139),(332,'dfggfd',6,140),(333,'dfggfd',6,141);
/*!40000 ALTER TABLE `exercises_with_parameters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises_with_parameters_training`
--

DROP TABLE IF EXISTS `exercises_with_parameters_training`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises_with_parameters_training` (
  `training_training_id` bigint NOT NULL,
  `exercise_with_parameters_id` bigint NOT NULL,
  UNIQUE KEY `UKo8vowkt0o4g1rduas54aov2ye` (`exercise_with_parameters_id`),
  KEY `FKc1sp7r56jndrujcs6q7pthe4j` (`training_training_id`),
  CONSTRAINT `FKc1sp7r56jndrujcs6q7pthe4j` FOREIGN KEY (`training_training_id`) REFERENCES `trainings` (`training_id`),
  CONSTRAINT `FKkv9s7xmhg1ki7yfqth2b0u0au` FOREIGN KEY (`exercise_with_parameters_id`) REFERENCES `exercises_with_parameters` (`exercises_with_parameters_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises_with_parameters_training`
--

LOCK TABLES `exercises_with_parameters_training` WRITE;
/*!40000 ALTER TABLE `exercises_with_parameters_training` DISABLE KEYS */;
INSERT INTO `exercises_with_parameters_training` VALUES (6,1),(6,6),(6,16),(7,2),(7,7),(7,12),(7,18),(8,3),(8,8),(8,13),(8,25),(9,4),(9,9),(9,14),(9,27),(10,5),(10,10),(10,15),(10,28),(33,24),(33,26),(33,29),(33,46),(35,48),(37,62),(38,51),(39,52),(40,55),(41,56),(41,57),(42,65),(42,66),(43,83),(44,67),(45,69),(45,70),(46,71),(46,72),(46,73),(47,74),(48,76),(49,77),(49,78),(51,80),(51,81),(52,82),(53,84),(53,85),(54,237),(54,238),(55,89),(55,90),(55,91),(56,92),(56,93),(57,230),(57,232),(58,97),(58,98),(58,99),(59,100),(59,101),(59,102),(60,103),(60,104),(60,105),(95,209),(95,210),(95,211),(96,212),(96,213),(96,214),(97,215),(97,216),(97,217),(98,218),(98,219),(98,220),(99,221),(99,222),(99,223),(100,224),(100,225),(100,226),(101,227),(101,228),(101,229),(102,239),(102,240),(102,241),(103,242),(103,243),(103,244),(104,245),(104,246),(104,247),(105,248),(105,249),(105,250),(106,251),(106,252),(106,253),(107,254),(107,255),(107,256),(108,257),(108,258),(108,259),(109,260),(109,261),(109,262),(109,263),(110,264),(110,265),(110,266),(110,267),(111,268),(112,269),(112,270),(113,271),(113,272),(113,273),(114,274),(115,275),(116,276),(116,277),(116,278),(117,279),(117,280),(117,281),(117,282),(118,283),(118,284),(118,285),(118,286),(119,287),(120,288),(120,289),(121,290),(121,291),(121,292),(122,293),(123,294),(124,295),(124,296),(125,297),(125,298),(125,299),(126,300),(126,301),(126,302),(127,303),(127,304),(127,305),(128,306),(128,307),(128,308),(130,310),(130,311),(130,312),(131,313),(131,314),(131,315),(131,316),(132,317),(132,318),(132,319),(132,320),(133,321),(134,322),(134,323),(135,324),(135,325),(135,326),(136,327),(137,328),(138,329),(138,330),(139,331),(140,332),(141,333);
/*!40000 ALTER TABLE `exercises_with_parameters_training` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_post_id` bigint DEFAULT NULL,
  `sender_user_id` bigint DEFAULT NULL,
  `positive` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf03lvj1hq8dx6er36gu842eu4` (`post_post_id`),
  KEY `FKfmnbh018dy5glnjktjnbtsiqo` (`sender_user_id`),
  CONSTRAINT `FKf03lvj1hq8dx6er36gu842eu4` FOREIGN KEY (`post_post_id`) REFERENCES `posts` (`post_id`),
  CONSTRAINT `FKfmnbh018dy5glnjktjnbtsiqo` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,4,9,_binary ''),(2,24,4,_binary ''),(3,5,6,_binary ''),(4,4,7,_binary ''),(5,5,4,_binary ''),(6,24,5,_binary ''),(7,24,6,_binary ''),(8,5,4,_binary ''),(9,24,9,_binary ''),(10,26,4,_binary ''),(11,4,6,_binary ''),(12,26,6,_binary ''),(13,29,6,_binary ''),(14,28,NULL,_binary '\0'),(15,29,4,_binary ''),(16,30,4,_binary ''),(17,30,9,_binary ''),(18,4,4,_binary ''),(19,28,4,_binary '\0'),(20,28,21,_binary ''),(21,32,21,_binary ''),(22,31,21,_binary ''),(23,31,4,_binary '');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `reciver_id` bigint DEFAULT NULL,
  `reciver_name` varchar(255) DEFAULT NULL,
  `sender_id` bigint DEFAULT NULL,
  `sender_name` varchar(255) DEFAULT NULL,
  `status` enum('JOIN','LEAVE','MESSAGE') DEFAULT NULL,
  `chat_id` bigint DEFAULT NULL,
  `training_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK64w44ngcpqp99ptcb9werdfmb` (`chat_id`),
  CONSTRAINT `FK64w44ngcpqp99ptcb9werdfmb` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`chat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (3,'Siemano',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(4,'Siema wójcie, robimy trening?',NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,NULL),(5,'Pewnie, przybywaj Mariusz do naszej nowej Wilkowyjskiej siłowni',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(7,'Tylko nie połam talerzy',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(8,'A se napiszę coś sam do siebie',NULL,6,'Paweł Kozioł',6,'Paweł Kozioł',NULL,4,NULL),(9,'Ja bym się nie martwił o talerze tylko te wasze zardzewiałe ',NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,NULL),(10,'Zostaw chłopie moje gryfy',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(11,'Nie zostawię',NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,NULL),(12,'Siemano Mariusz, idziesz na skocznię skakać?',NULL,4,'Mariusz Pudzianowski',7,'Adam Małysz',NULL,5,NULL),(13,'Pewnie że idę',NULL,7,'Adam Małysz',4,'Mariusz Pudzianowski',NULL,5,NULL),(14,'aaaa',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(15,'Co ty gadasz?',NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,NULL),(16,'To kiedy idziemy?',NULL,4,'Mariusz Pudzianowski',7,'Adam Małysz',NULL,5,NULL),(17,'A ja dzisiaj mogę',NULL,7,'Adam Małysz',4,'Mariusz Pudzianowski',NULL,5,NULL),(18,'Ale dzisiaj taki wiatr że nie da rady',NULL,4,'Mariusz Pudzianowski',7,'Adam Małysz',NULL,5,NULL),(19,'Kozioł to burak',NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,NULL),(20,'Mariusz to marchewa',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(21,'Siemano Jurgen wyślesz mi jakiś plan za 50?',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(22,NULL,NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,30),(23,'eeeeee',NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,NULL),(24,'aaaa',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(25,'bbbbbb',NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,NULL),(26,'Chodziło mi o 50 groszy ale dzięki',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(27,'Was is das?',NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,NULL),(28,'Przelew poszedł',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(29,'Przelew poszedł',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(30,'D',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(31,'D',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(32,'o',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(33,'o',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(34,'b',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(35,'b',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(36,'r',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(37,'r',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(38,'a',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(39,'a',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(40,',',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(41,',',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(42,' D',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(43,' D',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(44,'D',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(45,'D',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(46,'D',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(47,'D',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(48,'Dobra, jeszcze się policzymy cwaniaczku',NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,NULL),(49,'aaaaaa',NULL,6,'Paweł Kozioł',6,'Paweł Kozioł',NULL,4,NULL),(50,'bbbb',NULL,6,'Paweł Kozioł',6,'Paweł Kozioł',NULL,4,NULL),(51,'Dobra oddam ci',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(52,'Ile chcesz?',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(53,NULL,NULL,6,'Paweł Kozioł undefined',6,'Paweł Kozioł',NULL,4,28),(55,'aaaa',NULL,6,'Paweł Kozioł',6,'Paweł Kozioł',NULL,4,NULL),(56,'100€',NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,NULL),(57,'ile???',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(58,'No niech będzie 50',NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,NULL),(59,'Dobra, zrobię ci przelew',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(60,'No i spoko',NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,NULL),(61,'To nie marudź już',NULL,9,'Jurgen Klopp',6,'Paweł Kozioł',NULL,6,NULL),(62,'Spoko, nie będę',NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,NULL),(63,'Co tam Adaś u ciebie?',NULL,7,'Adam Małysz',6,'Paweł Kozioł',NULL,7,NULL),(64,'Dobrze',NULL,6,'Paweł Kozioł',7,'Adam Małysz',NULL,7,NULL),(65,'no i elegancko',NULL,6,'Paweł Kozioł',9,'Jurgen Klopp',NULL,6,NULL),(66,'Mariusz dzięki za promocję siłowni',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(67,'Jak mnie tak dalej będziesz przezywał to nie będzie więcej promocji siłowni',NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,NULL),(68,'Dobra nie będę',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(69,NULL,NULL,4,'Mariusz Pudzianowski undefined',4,'Mariusz Pudzianowski',NULL,8,1),(70,NULL,NULL,4,'Mariusz Pudzianowski undefined',4,'Mariusz Pudzianowski',NULL,8,1),(71,NULL,NULL,4,'Mariusz Pudzianowski undefined',4,'Mariusz Pudzianowski',NULL,8,1),(72,NULL,NULL,7,'Adam Małysz undefined',4,'Mariusz Pudzianowski',NULL,5,1),(73,'Masz Adaś i trenuj',NULL,7,'Adam Małysz',4,'Mariusz Pudzianowski',NULL,5,NULL),(74,NULL,NULL,7,'Adam Małysz undefined',4,'Mariusz Pudzianowski',NULL,5,1),(75,NULL,NULL,4,'Mariusz Pudzianowski undefined',4,'Mariusz Pudzianowski',NULL,8,1),(76,NULL,NULL,4,'Mariusz Pudzianowski undefined',4,'Mariusz Pudzianowski',NULL,8,1),(77,NULL,NULL,4,'Mariusz Pudzianowski',4,'Mariusz Pudzianowski',NULL,8,1),(78,NULL,NULL,9,'Jurgen Klopp',9,'Jurgen Klopp',NULL,9,30),(79,'Siemano',NULL,9,'Jurgen Klopp',4,'Mariusz Pudzianowski',NULL,10,NULL),(80,'Aaaa',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(81,'Bbbb',NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,NULL),(82,NULL,NULL,6,'Paweł Kozioł',6,'Paweł Kozioł',NULL,4,49),(83,'qweter',NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,NULL),(84,'Wyśle ci jakiś plan treningowy',NULL,4,'Mariusz Pudzianowski',6,'Paweł Kozioł',NULL,2,NULL),(85,NULL,NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,1),(86,'Mogę ci sprzedać super plan',NULL,14,'Marek Marucha',15,'Arkadiusz Czerepach',NULL,11,NULL),(87,'To pokaż co potrafisz',NULL,15,'Arkadiusz Czerepach',14,'Marek Marucha',NULL,11,NULL),(88,NULL,NULL,14,'Marek Marucha',15,'Arkadiusz Czerepach',NULL,11,61),(89,NULL,NULL,14,'Marek Marucha',4,'Mariusz Pudzianowski',NULL,12,1),(90,NULL,NULL,6,'Paweł Kozioł',4,'Mariusz Pudzianowski',NULL,2,1),(91,'Siemano Kamil',NULL,11,'Kamil Ślimak',21,'nfgngc vghj',NULL,13,NULL);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` bigint NOT NULL AUTO_INCREMENT,
  `context` varchar(255) DEFAULT NULL,
  `sender_id_user_id` bigint DEFAULT NULL,
  `date_time` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `FK9u7rv9rv58hjq0w537t7pf7dw` (`sender_id_user_id`),
  CONSTRAINT `FK9u7rv9rv58hjq0w537t7pf7dw` FOREIGN KEY (`sender_id_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKhdlylivsugxisddetfjx1jjhk` FOREIGN KEY (`sender_id_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (4,'Szukam koleżków żeby co jakiś czas umówić się na trening',4,'04-10-2024 14:16:22'),(5,'Jeśli jest tu ktoś na tyle odważny niech się do mnie zgłosi na test Pudzianowskiego. Zobaczymy ile macie siły',4,'04-10-2024 14:15:22'),(24,'Chce se ktoś poskakać?',7,'04-10-2024 10:17:22'),(25,'Byłby ktoś chętny na zabawę ketlami na nowej siłowni w Wilkowyjach?',6,'04-10-2024 10:17:20'),(26,'A ja se przetestuje czy bez obrazków posty dobrze działają',6,'04-10-2024 10:16:22'),(27,'Otwieram nową siłownię w Wilkowyjach!!!',6,'04-09-2024 14:17:22'),(28,'Na siłowni w Wilkowyjach będzie promocja w najbliższy wtorek',6,'04-10-2024 14:17:21'),(29,'Polecam siłownię w Wilkowyjach',4,'04-10-2024 14:17:22'),(30,'Jakby ktoś chciał się umówić na trening kopania piłki zapraszam do kontaktu',9,'17-10-2024 17:12:38'),(31,'Piszę posta',6,'24-10-2024 18:40:36'),(32,'Pisze se i pisze',12,'25-10-2024 18:16:44');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_comments`
--

DROP TABLE IF EXISTS `posts_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts_comments` (
  `post_post_id` bigint NOT NULL,
  `comments_comment_id` bigint NOT NULL,
  UNIQUE KEY `UK61985v4tur31hxia7328wkkqu` (`comments_comment_id`),
  KEY `FKiq8a7nqb171ojc9xk99lxoisd` (`post_post_id`),
  CONSTRAINT `FK76kesaj5i6van8hxpocflr4yw` FOREIGN KEY (`comments_comment_id`) REFERENCES `comment` (`comment_id`),
  CONSTRAINT `FKiq8a7nqb171ojc9xk99lxoisd` FOREIGN KEY (`post_post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_comments`
--

LOCK TABLES `posts_comments` WRITE;
/*!40000 ALTER TABLE `posts_comments` DISABLE KEYS */;
INSERT INTO `posts_comments` VALUES (4,1),(4,2),(4,6),(4,7),(4,17),(24,3),(25,4),(26,5),(26,8),(26,9),(26,10),(26,11),(26,12),(26,13),(28,14),(28,16),(30,15),(32,18),(32,19),(32,20),(32,21);
/*!40000 ALTER TABLE `posts_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comunicate_id` bigint NOT NULL,
  `comunicate_type` enum('COMMENT','MESSAGE','POST') NOT NULL,
  `description` varchar(255) NOT NULL,
  `reported_id` bigint DEFAULT NULL,
  `sender_id` bigint DEFAULT NULL,
  `checked` bit(1) DEFAULT NULL,
  `reported_full_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,30,'POST','Chłop tylko wszystkich namawia do kopania piłki',9,4,_binary '\0','Jurgen Klopp'),(2,29,'POST','Sam siebie zreportuje bo jestem dziwnym typem',4,4,_binary '\0','Mariusz Pudzianowski'),(3,1,'COMMENT','Gość tutaj przezywa społeczność z siłowni',9,4,_binary '\0',NULL),(11,24,'POST','Adaś chce wysyłać użytkowników na misję samobójczą',7,12,_binary '','Adam Małysz'),(15,29,'POST','Brzydka sztanga',4,9,_binary '\0','Mariusz Pudzianowski'),(16,30,'POST','Nie siej fermentu szwabie',9,6,_binary '\0','Jurgen Klopp'),(17,31,'POST','aaaa',6,6,_binary '','Paweł Kozioł'),(18,32,'POST','Głupoty jakieś pisze',12,9,_binary '','Włodzimierz Biały'),(19,32,'POST','pisze głupoty',12,12,_binary '','Włodzimierz Biały'),(21,88,'MESSAGE','trening to fuszerka',15,14,_binary '\0','Arkadiusz Czerepach');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainer_profile`
--

DROP TABLE IF EXISTS `trainer_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainer_profile` (
  `trainer_profile_id` bigint NOT NULL AUTO_INCREMENT,
  `availability` varchar(255) DEFAULT NULL,
  `descriptions` varchar(255) DEFAULT NULL,
  `offer` varchar(255) DEFAULT NULL,
  `user_user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`trainer_profile_id`),
  UNIQUE KEY `UK65ejd2sj2yngdmiqvainohx2q` (`user_user_id`),
  CONSTRAINT `FK68qfamv5rjngarqmpbn3bhvph` FOREIGN KEY (`user_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainer_profile`
--

LOCK TABLES `trainer_profile` WRITE;
/*!40000 ALTER TABLE `trainer_profile` DISABLE KEYS */;
INSERT INTO `trainer_profile` VALUES (2,'poniedziałek - piątek Dortmund','Siemano, prowadzę korki z kopania piłki','180€/hour',9),(3,'Godziny do umówienia, Zabrze, Gliwice','Siema, prowadzę treningi personalne na siłowniach na śląsku','50zł na godzinę',11),(4,'Środa i Piątek, Katowice','Prowadzę treningi grupowe i personalne. Mam 5 lat doświadczenia','100zł za trening (około 1,5h)',12),(5,'Różnie do dogadywania na bieżąco','Prowadzę zajęcia ze sztuk walki i walk ulicznych','100€',13),(6,'poniedziałek-piątek, śląsk','Jestem super trenerem','99€/h',14),(7,'Pisz kiedy chcesz','Geniusz planowania treningów','200zł za zaplanowanie treningu',15),(8,'','','',16),(9,'','','',17),(10,'xdrgxgd','ghjvghjzgr','xdrgxdg',18),(11,'xdrgxgd','ghjvghjzgr','xdrgxdg',19),(12,'xdrgxgd','ghjvghjzgr','xdrgxdg',20),(13,'xdrgxgd','ghjvghjzgr','xdrgxdg',21);
/*!40000 ALTER TABLE `trainer_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_plans`
--

DROP TABLE IF EXISTS `training_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `user_user_id` bigint DEFAULT NULL,
  `user_activated_user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKix0s74nnryyq1wa0jfyh0d1a` (`user_activated_user_id`),
  KEY `FK7byagw0pggmanjqcu31qwasyr` (`user_user_id`),
  CONSTRAINT `FK7byagw0pggmanjqcu31qwasyr` FOREIGN KEY (`user_user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKdqabws4en3yt1w9j0apjssqkm` FOREIGN KEY (`user_activated_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_plans`
--

LOCK TABLES `training_plans` WRITE;
/*!40000 ALTER TABLE `training_plans` DISABLE KEYS */;
INSERT INTO `training_plans` VALUES (1,'Pierwszy plan treningowy',4,4),(2,'Zaawansowany plan Treningowy',4,NULL),(3,'Plan na samą środę',4,NULL),(5,'turururu',4,NULL),(11,'Super plan',4,NULL),(12,'My best training',4,NULL),(22,'New plan',5,NULL),(23,'My favourite training',5,NULL),(26,'New plan',6,NULL),(27,'New plan',6,NULL),(28,'Wielki plan Pawła Kozła',6,6),(29,'New plan',6,NULL),(30,'Pierwszy plan dla podopiecznego',9,NULL),(31,'New plan',9,NULL),(32,'Pierwszy plan dla podopiecznego - copy',9,NULL),(33,'Pierwszy plan dla podopiecznego - copy',9,NULL),(34,'Pierwszy plan dla podopiecznego - copy',6,NULL),(35,'Pierwszy plan dla podopiecznego - copy',6,NULL),(36,'Pierwszy plan dla podopiecznego - copy',6,NULL),(37,'Pierwszy plan dla podopiecznego - copy',6,NULL),(38,'Pierwszy plan dla podopiecznego - copy',6,NULL),(39,'Pierwszy plan dla podopiecznego - copy',6,NULL),(40,'Pierwszy plan dla podopiecznego - copy',6,NULL),(41,'Pierwszy plan dla podopiecznego - copy',6,NULL),(42,'Pierwszy plan dla podopiecznego - copy',6,NULL),(43,'Pierwszy plan dla podopiecznego - copy',6,NULL),(44,'Pierwszy plan dla podopiecznego - copy',6,NULL),(45,'Pierwszy plan dla podopiecznego - copy',6,NULL),(46,'Pierwszy plan dla podopiecznego - copy',6,NULL),(47,'Pierwszy plan dla podopiecznego - copy',6,NULL),(48,'Pierwszy plan dla podopiecznego - copy',6,NULL),(49,'Mój plan od kloppa',6,NULL),(50,'Pierwszy plan dla podopiecznego - copy',6,NULL),(51,'New plan',6,NULL),(52,'New plan',6,NULL),(53,'Pierwszy plan dla podopiecznego - copy',9,9),(54,'Pierwszy plan dla podopiecznego - copy',9,NULL),(55,'Pierwszy plan treningowy - copy',7,7),(56,'Pierwszy plan treningowy - copy',7,NULL),(57,'New plan',7,NULL),(58,'New plan',7,NULL),(59,'Mój plan od kloppa - copy',6,NULL),(60,'Pierwszy plan treningowy - copy',6,NULL),(61,'New plan',15,NULL),(62,'New plan',15,NULL),(63,'New plan - copy',14,14);
/*!40000 ALTER TABLE `training_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainings`
--

DROP TABLE IF EXISTS `trainings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainings` (
  `training_id` bigint NOT NULL AUTO_INCREMENT,
  `complete_percent` int DEFAULT NULL,
  `day` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start_time` varchar(255) DEFAULT NULL,
  `stop_time` varchar(255) DEFAULT NULL,
  `training_plan_id` bigint DEFAULT NULL,
  PRIMARY KEY (`training_id`),
  KEY `FKo7awk0larlolkmuykkt2gdng7` (`training_plan_id`),
  CONSTRAINT `FKo7awk0larlolkmuykkt2gdng7` FOREIGN KEY (`training_plan_id`) REFERENCES `training_plans` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainings`
--

LOCK TABLES `trainings` WRITE;
/*!40000 ALTER TABLE `trainings` DISABLE KEYS */;
INSERT INTO `trainings` VALUES (6,0,0,'Poczatek tygodnia','7:00','9:00',1),(7,0,0,'poprawka','18:30','21:00',1),(8,0,1,'Wtoreczek','9:30','10:00',1),(9,0,2,'Super środa','15:15','18:00',2),(10,0,3,'Giga czwartek','15:45','17:15',2),(32,0,2,'Środka','19:30','20:00',NULL),(33,0,2,'Środka','19:30','20:00',NULL),(35,0,3,'czwartek','15:30','18:00',NULL),(37,0,0,'piąteczek','8:30','10:00',NULL),(38,0,3,'piąteczek','15:30','18:00',3),(39,0,3,'piąteczek','8:30','10:00',3),(40,0,3,'piąteczek','8:30','10:00',11),(41,0,1,'wtoreczek','17:20','19:30',11),(42,0,0,'poniedziałeczek','07:00','09:10',11),(43,0,1,'elegancki wtoreczek','07:20','09:15',11),(44,100,2,'Środka','11:10','13:25',1),(45,0,3,'Czwarteczek','13:25','15:30',1),(46,0,4,'Piątunio','12:30','14:30',1),(47,0,5,'Sobotka','06:30','08:30',1),(48,0,3,'Czwarteczek','07:45','10:30',1),(49,0,1,'push','17:00','19:00',23),(51,0,3,'Legs','17:30','20:00',23),(52,0,5,'Pull','09:00','10:00',23),(53,0,0,'trening1','17:30','20:00',28),(54,0,1,'New training','08:30','10:00',28),(55,0,2,'trening3','15:30','17:30',28),(56,0,3,'New training','18:30','20:30',28),(57,0,4,'trening5','19:30','20:30',28),(58,0,1,'New training','14:24','16:24',30),(59,0,2,'New training','14:25','17:25',30),(60,0,3,'New training','17:30','20:30',30),(61,0,1,'New training','14:24','16:24',32),(62,0,2,'New training','14:25','17:25',32),(63,0,3,'New training','17:30','20:30',32),(64,0,1,'New training','14:24','16:24',33),(65,0,2,'New training','14:25','17:25',33),(66,0,3,'New training','17:30','20:30',33),(67,0,1,'New training','14:24','16:24',34),(68,0,2,'New training','14:25','17:25',34),(69,0,3,'New training','17:30','20:30',34),(70,0,1,'New training','14:24','16:24',35),(71,0,2,'New training','14:25','17:25',35),(72,0,3,'New training','17:30','20:30',35),(73,0,1,'New training','14:24','16:24',36),(74,0,2,'New training','14:25','17:25',36),(75,0,3,'New training','17:30','20:30',36),(76,0,1,'New training','14:24','16:24',37),(77,0,2,'New training','14:25','17:25',37),(78,0,3,'New training','17:30','20:30',37),(79,0,1,'New training','14:24','16:24',38),(80,0,1,'New training','14:24','16:24',39),(81,0,2,'New training','14:25','17:25',39),(82,0,3,'New training','17:30','20:30',39),(83,0,1,'New training','14:24','16:24',40),(84,0,2,'New training','14:25','17:25',40),(85,0,3,'New training','17:30','20:30',40),(86,0,1,'New training','14:24','16:24',41),(87,0,2,'New training','14:25','17:25',41),(88,0,3,'New training','17:30','20:30',41),(89,0,1,'New training','14:24','16:24',42),(90,0,1,'New training','14:24','16:24',43),(91,0,1,'New training','14:24','16:24',44),(92,0,1,'New training','14:24','16:24',45),(93,0,1,'New training','14:24','16:24',46),(94,0,1,'New training','14:24','16:24',48),(95,0,1,'New training','14:24','16:24',49),(96,0,2,'New training','14:25','17:25',49),(97,0,3,'New training','17:30','20:30',49),(98,0,4,'Super trening','15:26','17:50',49),(99,0,1,'New training','14:24','16:24',50),(100,0,2,'New training','14:25','17:25',50),(101,0,3,'New training','17:30','20:30',50),(102,0,1,'New training','14:24','16:24',53),(103,0,2,'New training','14:25','17:25',53),(104,0,3,'New training','17:30','20:30',53),(105,0,1,'New training','14:24','16:24',54),(106,0,2,'New training','14:25','17:25',54),(107,0,3,'New training','17:30','20:30',54),(108,0,0,'Poczatek tygodnia','7:00','9:00',55),(109,0,0,'poprawka','18:30','21:00',55),(110,0,1,'Wtoreczek','9:30','10:00',55),(111,0,2,'Środka','11:10','13:25',55),(112,0,3,'Czwarteczek','13:25','15:30',55),(113,0,4,'Piątunio','12:30','14:30',55),(114,0,5,'Sobotka','06:30','08:30',55),(115,0,3,'Czwarteczek','07:45','10:30',55),(116,0,0,'Poczatek tygodnia','7:00','9:00',56),(117,0,0,'poprawka','18:30','21:00',56),(118,0,1,'Wtoreczek','9:30','10:00',56),(119,0,2,'Środka','11:10','13:25',56),(120,0,3,'Czwarteczek','13:25','15:30',56),(121,0,4,'Piątunio','12:30','14:30',56),(122,0,5,'Sobotka','06:30','08:30',56),(123,0,3,'Czwarteczek','07:45','10:30',56),(124,0,1,'New training','12:30','14:45',1),(125,0,1,'New training','14:24','16:24',59),(126,0,2,'New training','14:25','17:25',59),(127,0,3,'New training','17:30','20:30',59),(128,0,4,'Super trening','15:26','17:50',59),(129,0,4,'New training','20:45','22:45',1),(130,0,0,'Poczatek tygodnia','7:00','9:00',60),(131,0,0,'poprawka','18:30','21:00',60),(132,0,1,'Wtoreczek','9:30','10:00',60),(133,0,2,'Środka','11:10','13:25',60),(134,0,3,'Czwarteczek','13:25','15:30',60),(135,0,4,'Piątunio','12:30','14:30',60),(136,0,5,'Sobotka','06:30','08:30',60),(137,0,3,'Czwarteczek','07:45','10:30',60),(138,0,1,'New training','12:30','14:45',60),(139,0,4,'New training','20:45','22:45',60),(140,0,1,'dfgdgf','15:09','18:09',61),(141,0,1,'dfgdgf','15:09','18:09',63);
/*!40000 ALTER TABLE `trainings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_statistics`
--

DROP TABLE IF EXISTS `user_statistics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_statistics` (
  `user_statistics_id` bigint NOT NULL AUTO_INCREMENT,
  `days_in_a_row` int DEFAULT NULL,
  `total_exercises` int DEFAULT NULL,
  `total_trainings` int DEFAULT NULL,
  PRIMARY KEY (`user_statistics_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_statistics`
--

LOCK TABLES `user_statistics` WRITE;
/*!40000 ALTER TABLE `user_statistics` DISABLE KEYS */;
INSERT INTO `user_statistics` VALUES (1,0,46,31),(2,0,0,0),(3,0,21,9),(4,0,0,0),(5,0,0,0),(6,0,3,1),(7,0,0,0),(8,0,0,0),(9,0,0,0),(10,0,0,0),(11,0,0,0),(12,0,0,0),(13,0,0,0),(14,0,0,0),(15,0,0,0),(16,0,0,0),(17,0,0,0),(18,0,0,0);
/*!40000 ALTER TABLE `user_statistics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `auth_token` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `login` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ADMIN','CLIENT','MODERATOR','TRAINER') DEFAULT NULL,
  `surname` varchar(255) NOT NULL,
  `trainer_profile_id` bigint DEFAULT NULL,
  `user_statistics_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK4iaek6ebw4xbi5isw0cej59od` (`trainer_profile_id`),
  UNIQUE KEY `UKmnb7rf2muf6l0m6dt30mlima4` (`user_statistics_id`),
  CONSTRAINT `FK3c9vt5v7xli8hremjveow8bxe` FOREIGN KEY (`user_statistics_id`) REFERENCES `user_statistics` (`user_statistics_id`),
  CONSTRAINT `FKo3unbdm6f5auwretc6nd93iqm` FOREIGN KEY (`trainer_profile_id`) REFERENCES `trainer_profile` (`trainer_profile_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'Rq27i4LmCqG9j2lCykkysMTdYq6EswfT','sdfgdf@gmail.com','mariuszek','Mariusz','013d335d78b863f9abd475394709b247','CLIENT','Pudzianowski',NULL,1),(5,'zweFa22Do3JAhECOqnLHhCewPiP6FBz1','michal1309k@gmail.com','michal','Michał','76c45e8e377a8db13755cfc205332b84','CLIENT','Kupka',NULL,2),(6,'N43FZq3YpbCRYpzBbz2y5LE8dGR2P9xv','a@gmail.pl','klient1','Paweł','013d335d78b863f9abd475394709b247','CLIENT','Kozioł',NULL,3),(7,'MzkJTWQ7c6ko7hiSedjdBz7MBgNIw7d8','malysz@gmail.com','klient2','Adam','013d335d78b863f9abd475394709b247','CLIENT','Małysz',NULL,4),(9,'cNEtcMwo8Qk1YwNMd0J2INZXOuWEMKig','super-trener@gmail.com','trener1','Jurgen','013d335d78b863f9abd475394709b247','TRAINER','Klopp',2,6),(10,'rJm6vscATnSX7wZRYJFJQynOgH16sBPY','trainingAppAdmin@gmail.com','Admin','Admin','013d335d78b863f9abd475394709b247','ADMIN','Admin',NULL,7),(11,'63vYX5mKo9TeqTMEQASxN2oO4bJMGpRf','a@gmail.pl','klient3','Kamil','013d335d78b863f9abd475394709b247','TRAINER','Ślimak',3,8),(12,'*','super-trener123@gmail.com','klient4','Włodzimierz','*','TRAINER','Biały',4,9),(13,'Og1Dhh1lcZBquYFLNQBvjlhvHiuQZkTk','eee@gmail.com','trener2','Rocky','013d335d78b863f9abd475394709b247','TRAINER','Balboa',5,10),(14,'QTBeVHlO8N5vLntI7NxPZjIrSocOG4oj','asgdfg@gmail.com','trainer3','Marek','013d335d78b863f9abd475394709b247','TRAINER','Marucha',6,11),(15,'MwULyefqXOGJsiJCHz22XhqYqaet2J0k','dfhfh@gmail.com','trener4','Arkadiusz','013d335d78b863f9abd475394709b247','TRAINER','Czerepach',7,12),(16,'4mVUXmN0455O3SIdB7QPjbhfZ8cXo5i3','hfghrtth@gmail.com','SuperTrener','Edek','013d335d78b863f9abd475394709b247','TRAINER','Kredek',8,13),(17,'iV8xFc4FUk6wlC7PInGAi0MBafU5GSz5','ftyfjy@jfhgjhg.gfj','ftyu','ftu','6e0930476c5e08020055ceb7de7971f0','TRAINER','ftyu',9,14),(18,'CDHUbIP82yh4ygbGZT2VwXy9wCEEyeAc','xfh@xgg.hdf','xgfh','nfgngc','e839e6e7c7d307e57c372153b54f828a','TRAINER','vghj',10,15),(19,'l5irhJiNpRjQjuPc4CpoAFUPDdA3240Q','xfh@xgg.hdf','xgfh','nfgngc','e839e6e7c7d307e57c372153b54f828a','TRAINER','vghj',11,16),(20,'sm5CM0fiQtwthEm9diap8O9k7oGtdEYb','xfh@xgg.hdf','xgfh','nfgngc','e839e6e7c7d307e57c372153b54f828a','TRAINER','vghj',12,17),(21,'DdQ2VimQfyB98XubZyNQpu9clWqj8aGr','xfh@xgg.hdf','xgfh','nfgngc','e839e6e7c7d307e57c372153b54f828a','TRAINER','vghj',13,18);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-06 13:37:18
