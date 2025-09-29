-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: training_management
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) NOT NULL,
  `record_id` int NOT NULL,
  `action` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `changed_by` int NOT NULL,
  `changed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_table_record` (`table_name`,`record_id`),
  KEY `idx_changed_by` (`changed_by`),
  KEY `idx_changed_at` (`changed_at`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`changed_by`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_categories`
--

DROP TABLE IF EXISTS `course_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_code` varchar(20) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_code` (`category_code`),
  KEY `idx_category_code` (`category_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_categories`
--

LOCK TABLES `course_categories` WRITE;
/*!40000 ALTER TABLE `course_categories` DISABLE KEYS */;
INSERT INTO `course_categories` VALUES (1,'TECH','Công nghệ thông tin','Các khóa học về công nghệ thông tin và lập trình','2025-09-20 18:17:02','2025-09-20 18:17:02',1),(2,'MANAGE','Quản lý','Các khóa học về kỹ năng quản lý và lãnh đạo','2025-09-20 18:17:02','2025-09-20 18:17:02',1),(3,'SOFT','Kỹ năng mềm','Các khóa học về kỹ năng giao tiếp và làm việc nhóm','2025-09-20 18:17:02','2025-09-20 18:17:02',1),(4,'LANG','Ngoại ngữ','Các khóa học về ngoại ngữ','2025-09-20 18:17:02','2025-09-20 18:17:02',1);
/*!40000 ALTER TABLE `course_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_sessions`
--

DROP TABLE IF EXISTS `course_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_code` varchar(20) NOT NULL,
  `course_id` int NOT NULL,
  `instructor_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `max_students` int DEFAULT '30',
  `current_students` int DEFAULT '0',
  `status` enum('Scheduled','Ongoing','Completed','Cancelled') DEFAULT 'Scheduled',
  `location` varchar(200) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_code` (`session_code`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_sessions_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_sessions`
--

LOCK TABLES `course_sessions` WRITE;
/*!40000 ALTER TABLE `course_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_code` varchar(20) NOT NULL,
  `course_name` varchar(200) NOT NULL,
  `description` text,
  `total_credits` int NOT NULL DEFAULT '0',
  `theory_credits` int NOT NULL DEFAULT '0',
  `practice_credits` int NOT NULL DEFAULT '0',
  `prerequisite_course_ids` text,
  `corequisite_course_ids` text,
  `prior_course_ids` text,
  `managing_department_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `duration_hours` int NOT NULL DEFAULT '0',
  `level` enum('Beginner','Intermediate','Advanced') DEFAULT 'Beginner',
  `learning_objectives` text,
  `created_by` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `idx_course_code` (`course_code`),
  KEY `idx_dept` (`managing_department_id`),
  KEY `idx_cat` (`category_id`),
  CONSTRAINT `fk_courses_cat` FOREIGN KEY (`category_id`) REFERENCES `course_categories` (`id`),
  CONSTRAINT `fk_courses_dept` FOREIGN KEY (`managing_department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'CS101','Nhập môn Lập trình','Học phần cơ bản về lập trình',4,3,1,NULL,NULL,NULL,1,1,60,'Beginner',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(2,'CS102','Cấu trúc dữ liệu và Giải thuật','Học về CTDL và GT',4,3,1,'[1]','[3]','[11]',1,2,60,'Intermediate',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(3,'CS103','Cơ sở dữ liệu','Thiết kế và quản lý CSDL',3,2,1,'[1]',NULL,NULL,1,2,45,'Intermediate',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(4,'CS201','Lập trình Web','Phát triển ứng dụng web',4,2,2,'[1,2]',NULL,NULL,1,2,60,'Advanced',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(5,'CS202','Lập trình Mobile','Phát triển app di động',4,2,2,'[1,2]',NULL,NULL,1,2,60,'Advanced',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(6,'ECON101','Kinh tế vi mô','Nguyên lý kinh tế vi mô',3,3,0,NULL,NULL,NULL,2,1,45,'Beginner',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(7,'ECON102','Kinh tế vĩ mô','Nguyên lý kinh tế vĩ mô',3,3,0,NULL,NULL,NULL,2,1,45,'Beginner',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(8,'MG101','Quản trị dự án','Quản lý dự án phần mềm',3,3,0,NULL,NULL,NULL,2,2,45,'Intermediate',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(9,'ENG101','Tiếng Anh 1','Tiếng Anh cơ bản',3,2,1,NULL,NULL,NULL,3,4,45,'Beginner',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(10,'ENG102','Tiếng Anh 2','Tiếng Anh trung cấp',3,2,1,'[9]',NULL,NULL,3,4,45,'Intermediate',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(11,'MATH101','Toán cao cấp 1','Giải tích 1',3,3,0,NULL,NULL,NULL,4,1,45,'Beginner',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(12,'MATH102','Toán cao cấp 2','Giải tích 2',3,3,0,'[11]',NULL,NULL,4,1,45,'Intermediate',NULL,1,'2025-09-29 19:48:50','2025-09-29 19:48:50',1);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_code` varchar(20) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `description` text,
  `parent_department_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `department_code` (`department_code`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'IT','Khoa Công nghệ thông tin','Khoa quản lý các học phần về CNTT',NULL,NULL,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(2,'ECON','Khoa Kinh tế','Khoa quản lý các học phần về kinh tế',NULL,NULL,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(3,'ENG','Khoa Ngoại ngữ','Khoa quản lý các học phần ngoại ngữ',NULL,NULL,'2025-09-29 19:48:50','2025-09-29 19:48:50',1),(4,'MATH','Khoa Toán','Khoa quản lý các học phần toán học',NULL,NULL,'2025-09-29 19:48:50','2025-09-29 19:48:50',1);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT 'Other',
  `id_card` varchar(20) DEFAULT NULL,
  `position_id` int NOT NULL,
  `department_id` int NOT NULL,
  `manager_id` int DEFAULT NULL,
  `hire_date` date NOT NULL,
  `salary` decimal(12,2) DEFAULT NULL,
  `status` enum('Active','Inactive','Terminated') DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_code` (`employee_code`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `id_card` (`id_card`),
  KEY `manager_id` (`manager_id`),
  KEY `idx_employee_code` (`employee_code`),
  KEY `idx_email` (`email`),
  KEY `idx_position_employee` (`position_id`),
  KEY `idx_department_employee` (`department_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`),
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'EMP001','Nguyễn Văn','An','an.nguyen@company.com','0123456789',NULL,NULL,'Other',NULL,1,1,NULL,'2023-01-15',15000000.00,'Active','2025-09-20 18:17:02','2025-09-20 18:17:02'),(2,'EMP002','Trần Thị','Bình','binh.tran@company.com','0123456790',NULL,NULL,'Other',NULL,2,1,NULL,'2022-06-01',20000000.00,'Active','2025-09-20 18:17:02','2025-09-20 18:17:02'),(3,'EMP003','Lê Văn','Cường','cuong.le@company.com','0123456791',NULL,NULL,'Other',NULL,3,2,NULL,'2021-03-10',25000000.00,'Active','2025-09-20 18:17:02','2025-09-20 18:17:02'),(4,'EMP004','Phạm Thị','Dung','dung.pham@company.com','0123456792',NULL,NULL,'Other',NULL,4,2,NULL,'2023-02-20',12000000.00,'Active','2025-09-20 18:17:02','2025-09-20 18:17:02'),(5,'EMP005','Hoàng Văn','Em','em.hoang@company.com','0123456793',NULL,NULL,'Other',NULL,5,3,NULL,'2022-11-05',13000000.00,'Active','2025-09-20 18:17:02','2025-09-20 18:17:02'),(6,'EMP006','Vũ Thị','Phương','phuong.vu@company.com','0123456794',NULL,NULL,'Other',NULL,6,4,NULL,'2021-08-15',22000000.00,'Active','2025-09-20 18:17:02','2025-09-20 18:17:02');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `course_session_id` int NOT NULL,
  `enrollment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Enrolled','Completed','Dropped','Failed') DEFAULT 'Enrolled',
  `final_score` decimal(5,2) DEFAULT NULL,
  `completion_date` timestamp NULL DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_enrollment` (`employee_id`,`course_session_id`),
  KEY `course_session_id` (`course_session_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`course_session_id`) REFERENCES `course_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position_code` varchar(20) NOT NULL,
  `position_name` varchar(100) NOT NULL,
  `level` int NOT NULL DEFAULT '1',
  `description` text,
  `department_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `position_code` (`position_code`),
  KEY `idx_position_code` (`position_code`),
  KEY `idx_department_position` (`department_id`),
  CONSTRAINT `positions_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,'DEV','Lập trình viên',3,'Phát triển phần mềm',1,'2025-09-20 18:17:02','2025-09-20 18:17:02',1),(2,'PM','Quản lý dự án',4,'Quản lý các dự án công nghệ',1,'2025-09-20 18:17:02','2025-09-20 18:17:02',1),(3,'HR_MGR','Trưởng phòng nhân sự',5,'Quản lý phòng nhân sự',2,'2025-09-20 18:17:02','2025-09-20 18:17:02',1),(4,'HR_SPEC','Chuyên viên nhân sự',3,'Chuyên viên phụ trách nhân sự',2,'2025-09-20 18:17:02','2025-09-20 18:17:02',1),(5,'ACCOUNTANT','Kế toán',3,'Kế toán viên',3,'2025-09-20 18:17:02','2025-09-20 18:17:02',1),(6,'MKT_MGR','Trưởng phòng marketing',5,'Quản lý phòng marketing',4,'2025-09-20 18:17:02','2025-09-20 18:17:02',1);
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_employee_details`
--

DROP TABLE IF EXISTS `v_employee_details`;
/*!50001 DROP VIEW IF EXISTS `v_employee_details`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_employee_details` AS SELECT 
 1 AS `id`,
 1 AS `employee_code`,
 1 AS `full_name`,
 1 AS `email`,
 1 AS `phone`,
 1 AS `hire_date`,
 1 AS `salary`,
 1 AS `status`,
 1 AS `department_name`,
 1 AS `position_name`,
 1 AS `manager_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_enrollment_report`
--

DROP TABLE IF EXISTS `v_enrollment_report`;
/*!50001 DROP VIEW IF EXISTS `v_enrollment_report`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_enrollment_report` AS SELECT 
 1 AS `id`,
 1 AS `enrollment_date`,
 1 AS `status`,
 1 AS `final_score`,
 1 AS `employee_name`,
 1 AS `employee_code`,
 1 AS `department_name`,
 1 AS `course_name`,
 1 AS `session_code`,
 1 AS `start_date`,
 1 AS `end_date`,
 1 AS `instructor_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'training_management'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_course` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_course`(
    IN p_course_code VARCHAR(20),
    IN p_course_name VARCHAR(200),
    IN p_description TEXT,
    IN p_category_id INT,
    IN p_duration_hours INT,
    IN p_credits INT,
    IN p_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    IN p_prerequisites TEXT,
    IN p_learning_objectives TEXT,
    IN p_created_by INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO courses (course_code, course_name, description, category_id, duration_hours, 
                        credits, level, prerequisites, learning_objectives, created_by)
    VALUES (p_course_code, p_course_name, p_description, p_category_id, p_duration_hours,
            p_credits, p_level, p_prerequisites, p_learning_objectives, p_created_by);
    
    -- Ghi log
    INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by)
    VALUES ('courses', LAST_INSERT_ID(), 'INSERT', 
            JSON_OBJECT('course_code', p_course_code, 'course_name', p_course_name), 
            p_created_by);
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_department` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_department`(
    IN p_department_code VARCHAR(20),
    IN p_department_name VARCHAR(100),
    IN p_description TEXT,
    IN p_parent_department_id INT,
    IN p_manager_id INT,
    IN p_created_by INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO departments (department_code, department_name, description, parent_department_id, manager_id)
    VALUES (p_department_code, p_department_name, p_description, p_parent_department_id, p_manager_id);
    
    -- Ghi log
    INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by)
    VALUES ('departments', LAST_INSERT_ID(), 'INSERT', 
            JSON_OBJECT('department_code', p_department_code, 'department_name', p_department_name), 
            p_created_by);
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_add_employee` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_add_employee`(
    IN p_employee_code VARCHAR(20),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_address TEXT,
    IN p_date_of_birth DATE,
    IN p_gender ENUM('Male', 'Female', 'Other'),
    IN p_id_card VARCHAR(20),
    IN p_position_id INT,
    IN p_department_id INT,
    IN p_manager_id INT,
    IN p_hire_date DATE,
    IN p_salary DECIMAL(12,2),
    IN p_created_by INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO employees (employee_code, first_name, last_name, email, phone, address, 
                          date_of_birth, gender, id_card, position_id, department_id, 
                          manager_id, hire_date, salary)
    VALUES (p_employee_code, p_first_name, p_last_name, p_email, p_phone, p_address,
            p_date_of_birth, p_gender, p_id_card, p_position_id, p_department_id,
            p_manager_id, p_hire_date, p_salary);
    
    -- Ghi log
    INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by)
    VALUES ('employees', LAST_INSERT_ID(), 'INSERT', 
            JSON_OBJECT('employee_code', p_employee_code, 'first_name', p_first_name, 
                       'last_name', p_last_name, 'email', p_email), 
            p_created_by);
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_delete_department` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_department`(
    IN p_id INT,
    IN p_deleted_by INT
)
BEGIN
    DECLARE v_old_values JSON;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Lưu giá trị cũ
    SELECT JSON_OBJECT(
        'department_code', department_code,
        'department_name', department_name,
        'is_active', is_active
    ) INTO v_old_values
    FROM departments WHERE id = p_id;
    
    -- Soft delete
    UPDATE departments 
    SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
    
    -- Ghi log
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by)
    VALUES ('departments', p_id, 'UPDATE', v_old_values, 
            JSON_OBJECT('is_active', FALSE), p_deleted_by);
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_enroll_course` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_enroll_course`(
    IN p_employee_id INT,
    IN p_course_session_id INT,
    IN p_enrolled_by INT
)
BEGIN
    DECLARE v_max_students INT;
    DECLARE v_current_students INT;
    DECLARE v_session_status VARCHAR(20);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Kiểm tra trạng thái khóa học
    SELECT max_students, current_students, status 
    INTO v_max_students, v_current_students, v_session_status
    FROM course_sessions 
    WHERE id = p_course_session_id;
    
    -- Kiểm tra điều kiện đăng ký
    IF v_session_status != 'Scheduled' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Khóa học không ở trạng thái đăng ký';
    END IF;
    
    IF v_current_students >= v_max_students THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Khóa học đã đầy';
    END IF;
    
    -- Đăng ký học phần
    INSERT INTO enrollments (employee_id, course_session_id, status)
    VALUES (p_employee_id, p_course_session_id, 'Enrolled');
    
    -- Cập nhật số lượng học viên
    UPDATE course_sessions 
    SET current_students = current_students + 1
    WHERE id = p_course_session_id;
    
    -- Ghi log
    INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by)
    VALUES ('enrollments', LAST_INSERT_ID(), 'INSERT', 
            JSON_OBJECT('employee_id', p_employee_id, 'course_session_id', p_course_session_id), 
            p_enrolled_by);
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_department` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_department`(
    IN p_id INT,
    IN p_department_code VARCHAR(20),
    IN p_department_name VARCHAR(100),
    IN p_description TEXT,
    IN p_parent_department_id INT,
    IN p_manager_id INT,
    IN p_updated_by INT
)
BEGIN
    DECLARE v_old_values JSON;
    DECLARE v_new_values JSON;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Lưu giá trị cũ
    SELECT JSON_OBJECT(
        'department_code', department_code,
        'department_name', department_name,
        'description', description,
        'parent_department_id', parent_department_id,
        'manager_id', manager_id
    ) INTO v_old_values
    FROM departments WHERE id = p_id;
    
    -- Cập nhật
    UPDATE departments 
    SET department_code = p_department_code,
        department_name = p_department_name,
        description = p_description,
        parent_department_id = p_parent_department_id,
        manager_id = p_manager_id,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
    
    -- Lưu giá trị mới
    SET v_new_values = JSON_OBJECT(
        'department_code', p_department_code,
        'department_name', p_department_name,
        'description', p_description,
        'parent_department_id', p_parent_department_id,
        'manager_id', p_manager_id
    );
    
    -- Ghi log
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by)
    VALUES ('departments', p_id, 'UPDATE', v_old_values, v_new_values, p_updated_by);
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_employee` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_employee`(
    IN p_id INT,
    IN p_employee_code VARCHAR(20),
    IN p_first_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_address TEXT,
    IN p_date_of_birth DATE,
    IN p_gender ENUM('Male', 'Female', 'Other'),
    IN p_id_card VARCHAR(20),
    IN p_position_id INT,
    IN p_department_id INT,
    IN p_manager_id INT,
    IN p_hire_date DATE,
    IN p_salary DECIMAL(12,2),
    IN p_status ENUM('Active', 'Inactive', 'Terminated'),
    IN p_updated_by INT
)
BEGIN
    DECLARE v_old_values JSON;
    DECLARE v_new_values JSON;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Lưu giá trị cũ
    SELECT JSON_OBJECT(
        'employee_code', employee_code,
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'position_id', position_id,
        'department_id', department_id,
        'status', status
    ) INTO v_old_values
    FROM employees WHERE id = p_id;
    
    -- Cập nhật
    UPDATE employees 
    SET employee_code = p_employee_code,
        first_name = p_first_name,
        last_name = p_last_name,
        email = p_email,
        phone = p_phone,
        address = p_address,
        date_of_birth = p_date_of_birth,
        gender = p_gender,
        id_card = p_id_card,
        position_id = p_position_id,
        department_id = p_department_id,
        manager_id = p_manager_id,
        hire_date = p_hire_date,
        salary = p_salary,
        status = p_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
    
    -- Lưu giá trị mới
    SET v_new_values = JSON_OBJECT(
        'employee_code', p_employee_code,
        'first_name', p_first_name,
        'last_name', p_last_name,
        'email', p_email,
        'position_id', p_position_id,
        'department_id', p_department_id,
        'status', p_status
    );
    
    -- Ghi log
    INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by)
    VALUES ('employees', p_id, 'UPDATE', v_old_values, v_new_values, p_updated_by);
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `v_employee_details`
--

/*!50001 DROP VIEW IF EXISTS `v_employee_details`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_employee_details` AS select `e`.`id` AS `id`,`e`.`employee_code` AS `employee_code`,concat(`e`.`first_name`,' ',`e`.`last_name`) AS `full_name`,`e`.`email` AS `email`,`e`.`phone` AS `phone`,`e`.`hire_date` AS `hire_date`,`e`.`salary` AS `salary`,`e`.`status` AS `status`,`d`.`department_name` AS `department_name`,`p`.`position_name` AS `position_name`,concat(`m`.`first_name`,' ',`m`.`last_name`) AS `manager_name` from (((`employees` `e` left join `departments` `d` on((`e`.`department_id` = `d`.`id`))) left join `positions` `p` on((`e`.`position_id` = `p`.`id`))) left join `employees` `m` on((`e`.`manager_id` = `m`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_enrollment_report`
--

/*!50001 DROP VIEW IF EXISTS `v_enrollment_report`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_enrollment_report` AS select `en`.`id` AS `id`,`en`.`enrollment_date` AS `enrollment_date`,`en`.`status` AS `status`,`en`.`final_score` AS `final_score`,concat(`emp`.`first_name`,' ',`emp`.`last_name`) AS `employee_name`,`emp`.`employee_code` AS `employee_code`,`d`.`department_name` AS `department_name`,`c`.`course_name` AS `course_name`,`cs`.`session_code` AS `session_code`,`cs`.`start_date` AS `start_date`,`cs`.`end_date` AS `end_date`,concat(`inst`.`first_name`,' ',`inst`.`last_name`) AS `instructor_name` from (((((`enrollments` `en` left join `employees` `emp` on((`en`.`employee_id` = `emp`.`id`))) left join `course_sessions` `cs` on((`en`.`course_session_id` = `cs`.`id`))) left join `courses` `c` on((`cs`.`course_id` = `c`.`id`))) left join `departments` `d` on((`emp`.`department_id` = `d`.`id`))) left join `employees` `inst` on((`cs`.`instructor_id` = `inst`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-30  5:36:48
