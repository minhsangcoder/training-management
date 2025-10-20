-- =====================================================
-- TRAINING MANAGEMENT DATABASE - COMPLETE BACKUP
-- Generated: 2025-10-13
-- Database: training_management
-- Description: Hệ thống quản lý đào tạo
-- =====================================================

-- Drop existing database and create new
DROP DATABASE IF EXISTS training_management;
CREATE DATABASE training_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE training_management;

-- =====================================================
-- TABLE STRUCTURES (DDL)
-- =====================================================

-- Table: departments
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `parent_department_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `department_code` (`department_code`),
  KEY `parent_department_id` (`parent_department_id`),
  KEY `manager_id` (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: positions
DROP TABLE IF EXISTS `positions`;
CREATE TABLE `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int DEFAULT '1',
  `description` text COLLATE utf8mb4_unicode_ci,
  `department_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `position_code` (`position_code`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `positions_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: employees
DROP TABLE IF EXISTS `employees`;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_card` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `salary` decimal(15,2) DEFAULT NULL,
  `status` enum('Active','Inactive','On Leave','Terminated') COLLATE utf8mb4_unicode_ci DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_code` (`employee_code`),
  UNIQUE KEY `email` (`email`),
  KEY `position_id` (`position_id`),
  KEY `department_id` (`department_id`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: course_categories
DROP TABLE IF EXISTS `course_categories`;
CREATE TABLE `course_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: courses
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category_id` int DEFAULT NULL,
  `duration_hours` int DEFAULT NULL,
  `total_credits` int DEFAULT NULL,
  `theory_credits` int DEFAULT NULL,
  `practice_credits` int DEFAULT NULL,
  `level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Beginner',
  `prerequisite_course_ids` text COLLATE utf8mb4_unicode_ci COMMENT 'Danh sách ID các học phần tiên quyết, phân cách bằng dấu phẩy',
  `concurrent_course_ids` text COLLATE utf8mb4_unicode_ci COMMENT 'Danh sách ID các học phần song hành, phân cách bằng dấu phẩy',
  `learning_objectives` text COLLATE utf8mb4_unicode_ci,
  `department_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `category_id` (`category_id`),
  KEY `department_id` (`department_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `course_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `courses_ibfk_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: course_sessions
DROP TABLE IF EXISTS `course_sessions`;
CREATE TABLE `course_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `max_participants` int DEFAULT '30',
  `status` enum('scheduled','in_progress','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'scheduled',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_sessions_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: enrollments
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `enrollment_date` datetime NOT NULL,
  `status` enum('enrolled','in_progress','completed','dropped') COLLATE utf8mb4_unicode_ci DEFAULT 'enrolled',
  `completion_date` datetime DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `session_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `course_sessions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: majors
DROP TABLE IF EXISTS `majors`;
CREATE TABLE `majors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `major_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `major_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `degree_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Bachelor',
  `duration_years` int DEFAULT '4',
  `total_credits` int DEFAULT '120',
  `department_id` int DEFAULT NULL,
  `head_of_major_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `major_code` (`major_code`),
  KEY `department_id` (`department_id`),
  KEY `head_of_major_id` (`head_of_major_id`),
  CONSTRAINT `majors_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `majors_ibfk_2` FOREIGN KEY (`head_of_major_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: cohorts
DROP TABLE IF EXISTS `cohorts`;
CREATE TABLE `cohorts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cohort_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cohort_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `max_students` int DEFAULT '30',
  `current_students` int DEFAULT '0',
  `status` enum('planning','active','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'planning',
  `program_id` int DEFAULT NULL,
  `instructor_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cohort_code` (`cohort_code`),
  KEY `program_id` (`program_id`),
  KEY `instructor_id` (`instructor_id`),
  CONSTRAINT `cohorts_ibfk_program` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `cohorts_ibfk_2` FOREIGN KEY (`instructor_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: programs
DROP TABLE IF EXISTS `programs`;
CREATE TABLE `programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `program_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `program_code` (`program_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: knowledge_blocks
DROP TABLE IF EXISTS `knowledge_blocks`;
CREATE TABLE `knowledge_blocks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `block_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `block_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `total_credits` int DEFAULT '0',
  `is_required` tinyint(1) DEFAULT '1',
  `major_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `block_code` (`block_code`),
  KEY `major_id` (`major_id`),
  CONSTRAINT `knowledge_blocks_ibfk_1` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: curriculum_structures
DROP TABLE IF EXISTS `curriculum_structures`;
CREATE TABLE `curriculum_structures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `major_id` int NOT NULL,
  `knowledge_block_id` int NOT NULL,
  `semester` int DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT '1',
  `min_credits` int DEFAULT '0',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `major_id` (`major_id`),
  KEY `knowledge_block_id` (`knowledge_block_id`),
  CONSTRAINT `curriculum_structures_ibfk_1` FOREIGN KEY (`major_id`) REFERENCES `majors` (`id`) ON DELETE CASCADE,
  CONSTRAINT `curriculum_structures_ibfk_2` FOREIGN KEY (`knowledge_block_id`) REFERENCES `knowledge_blocks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SAMPLE DATA (DML)
-- =====================================================

-- Insert departments
INSERT INTO `departments` (`id`, `department_code`, `department_name`, `description`, `parent_department_id`, `manager_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1,'IT','Phòng Công nghệ thông tin','Phòng quản lý và phát triển hệ thống công nghệ thông tin',NULL,NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(2,'HR','Phòng Nhân sự','Phòng quản lý nguồn nhân lực và đào tạo',NULL,NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(3,'FIN','Phòng Tài chính Kế toán','Phòng quản lý tài chính và kế toán',NULL,NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(4,'SALE','Phòng Kinh doanh','Phòng kinh doanh và chăm sóc khách hàng',NULL,NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(5,'PROD','Phòng Sản xuất','Phòng quản lý sản xuất và chất lượng sản phẩm',NULL,NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(6,'QC','Phòng Kiểm soát chất lượng','Phòng kiểm tra và đảm bảo chất lượng',NULL,NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(7,'ADMIN','Phòng Hành chính','Phòng quản lý hành chính tổng hợp',NULL,NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39');

-- Insert positions
INSERT INTO `positions` (`id`, `position_code`, `position_name`, `level`, `description`, `department_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1,'DIR','Giám đốc',10,'Giám đốc công ty',NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(2,'DEP_MGR','Trưởng phòng',8,'Trưởng phòng ban',NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(3,'TEAM_LEAD','Trưởng nhóm',6,'Trưởng nhóm dự án',NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(4,'SR_DEV','Senior Developer',5,'Lập trình viên cấp cao',1,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(5,'DEV','Developer',4,'Lập trình viên',1,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(6,'JR_DEV','Junior Developer',3,'Lập trình viên mới',1,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(7,'HR_MGR','Quản lý nhân sự',7,'Quản lý bộ phận nhân sự',2,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(8,'HR_SPEC','Chuyên viên nhân sự',4,'Chuyên viên tuyển dụng và đào tạo',2,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(9,'ACCT_MGR','Quản lý kế toán',7,'Quản lý bộ phận kế toán',3,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(10,'ACCT','Kế toán viên',4,'Nhân viên kế toán',3,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(11,'SALE_MGR','Quản lý kinh doanh',7,'Quản lý đội ngũ kinh doanh',4,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(12,'SALE_REP','Nhân viên kinh doanh',4,'Nhân viên bán hàng',4,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(13,'PROD_MGR','Quản lý sản xuất',7,'Quản lý phân xưởng sản xuất',5,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(14,'PROD_SUP','Giám sát sản xuất',5,'Giám sát quy trình sản xuất',5,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(15,'QC_MGR','Quản lý chất lượng',7,'Quản lý kiểm soát chất lượng',6,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(16,'QC_INSP','Kiểm tra viên QC',4,'Nhân viên kiểm tra chất lượng',6,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(17,'ADMIN_MGR','Quản lý hành chính',7,'Quản lý phòng hành chính',7,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(18,'ADMIN_STAFF','Nhân viên hành chính',3,'Nhân viên văn phòng',7,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(19,'IT_MGR','Quản lý IT',8,'Quản lý phòng IT',1,1,'2025-10-14 00:19:39','2025-10-14 00:19:39'),
(20,'INTERN','Thực tập sinh',1,'Sinh viên thực tập',NULL,1,'2025-10-14 00:19:39','2025-10-14 00:19:39');

-- Insert employees
INSERT INTO `employees` (`id`, `employee_code`, `first_name`, `last_name`, `email`, `phone`, `address`, `date_of_birth`, `gender`, `id_card`, `position_id`, `department_id`, `manager_id`, `hire_date`, `salary`, `status`, `created_at`, `updated_at`) VALUES
(7,'EMP001','Nguyễn Văn','An','nguyen.van.an@company.com','0901234567','123 Đường ABC, Quận 1, TP.HCM','1985-05-15','Male','079085001234',19,1,NULL,'2020-01-15',25000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(8,'EMP002','Trần Thị','Bình','tran.thi.binh@company.com','0902345678','456 Đường DEF, Quận 2, TP.HCM','1990-08-20','Female','079090002345',4,1,7,'2021-03-20',18000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(9,'EMP003','Lê Văn','Cường','le.van.cuong@company.com','0903456789','789 Đường GHI, Quận 3, TP.HCM','1992-11-10','Male','079092003456',5,1,7,'2022-06-01',15000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(10,'EMP004','Phạm Thị','Dung','pham.thi.dung@company.com','0904567890','321 Đường JKL, Quận 4, TP.HCM','1988-03-25','Female','079088004567',7,2,NULL,'2019-09-10',22000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(11,'EMP005','Hoàng Văn','Em','hoang.van.em@company.com','0905678901','654 Đường MNO, Quận 5, TP.HCM','1995-07-18','Male','079095005678',8,2,10,'2023-01-15',12000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(12,'EMP006','Võ Thị','Phượng','vo.thi.phuong@company.com','0906789012','987 Đường PQR, Quận 6, TP.HCM','1987-12-05','Female','079087006789',9,3,NULL,'2018-04-20',24000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(13,'EMP007','Đặng Văn','Giang','dang.van.giang@company.com','0907890123','147 Đường STU, Quận 7, TP.HCM','1991-09-30','Male','079091007890',10,3,12,'2020-11-05',14000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(14,'EMP008','Bùi Thị','Hoa','bui.thi.hoa@company.com','0908901234','258 Đường VWX, Quận 8, TP.HCM','1993-02-14','Female','079093008901',11,4,NULL,'2021-07-12',20000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(15,'EMP009','Ngô Văn','Ích','ngo.van.ich@company.com','0909012345','369 Đường YZ, Quận 9, TP.HCM','1994-06-22','Male','079094009012',12,4,14,'2022-02-28',13000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(16,'EMP010','Mai Thị','Kim','mai.thi.kim@company.com','0910123456','741 Đường ABC, Quận 10, TP.HCM','1989-10-08','Female','079089010123',13,5,NULL,'2019-12-01',21000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39'),
(17,'EMP011','Dương Văn','Lâm','duong.van.lam@company.com','0911234567','852 Đường DEF, Quận 11, TP.HCM','1996-04-17','Male','079096011234',14,5,16,'2023-05-20',11000000.00,'Active','2025-10-14 00:19:39','2025-10-14 00:19:39');

-- Insert course_categories
INSERT INTO `course_categories` (`id`, `category_code`, `category_name`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(59,'TECH','Công nghệ thông tin','Các khóa học về công nghệ thông tin và lập trình',1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(60,'MANAGE','Quản lý','Các khóa học về kỹ năng quản lý và lãnh đạo',1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(61,'SOFT','Kỹ năng mềm','Các khóa học về kỹ năng giao tiếp và làm việc nhóm',1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(62,'LANG','Ngoại ngữ','Các khóa học về ngoại ngữ',1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(63,'SAFETY','An toàn lao động','Các khóa học về an toàn và bảo hộ lao động',1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(64,'COMPLIANCE','Tuân thủ pháp luật','Các khóa học về tuân thủ quy định và pháp luật',1,'2025-10-14 00:20:15','2025-10-14 00:20:15');

-- Insert courses
INSERT INTO `courses` (`id`, `course_code`, `course_name`, `description`, `category_id`, `duration_hours`, `total_credits`, `theory_credits`, `practice_credits`, `level`, `prerequisite_course_ids`, `concurrent_course_ids`, `learning_objectives`, `created_by`, `is_active`, `created_at`, `updated_at`) VALUES
(20,'COURSE001','JavaScript Fundamentals','Học các kiến thức cơ bản về JavaScript',59,40,3,2,1,'Beginner',NULL,NULL,'Hiểu cú pháp JavaScript cơ bản, làm việc với DOM, xử lý sự kiện',7,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(21,'COURSE002','React.js Development','Phát triển ứng dụng web với React.js',59,60,4,2,2,'Intermediate','20',NULL,'Xây dựng ứng dụng React, quản lý state, làm việc với hooks',8,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(22,'COURSE003','Node.js Backend','Phát triển backend với Node.js và Express',59,50,3,2,1,'Intermediate','20','21','Tạo RESTful API, làm việc với database, authentication',9,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(23,'COURSE004','DevOps Essentials','Kiến thức cơ bản về DevOps và CI/CD',59,45,3,2,1,'Advanced',NULL,NULL,'Hiểu về Docker, CI/CD pipeline, cloud deployment',7,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(24,'COURSE005','Leadership Skills','Kỹ năng lãnh đạo và quản lý nhóm',60,30,2,2,0,'Intermediate',NULL,NULL,'Phát triển kỹ năng lãnh đạo, quản lý xung đột, động viên nhân viên',10,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(25,'COURSE006','Project Management','Quản lý dự án hiệu quả',60,40,3,2,1,'Intermediate',NULL,NULL,'Kỹ thuật quản lý dự án, lập kế hoạch, theo dõi tiến độ',10,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(26,'COURSE007','Communication Skills','Kỹ năng giao tiếp chuyên nghiệp',61,25,2,1,1,'Beginner',NULL,NULL,'Giao tiếp hiệu quả, thuyết trình, viết email chuyên nghiệp',11,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(27,'COURSE008','Teamwork & Collaboration','Làm việc nhóm và hợp tác',61,20,1,0,1,'Beginner',NULL,NULL,'Xây dựng tinh thần đồng đội, giải quyết xung đột',11,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(28,'COURSE009','English for IT','Tiếng Anh chuyên ngành IT',62,50,3,2,1,'Intermediate',NULL,NULL,'Từ vựng IT, đọc tài liệu kỹ thuật, giao tiếp với đồng nghiệp nước ngoài',10,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(29,'COURSE010','Business English','Tiếng Anh thương mại',62,40,2,2,0,'Intermediate',NULL,NULL,'Email business, đàm phán, presentation',10,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(30,'COURSE011','Workplace Safety','An toàn lao động cơ bản',63,15,1,1,0,'Beginner',NULL,NULL,'Quy định an toàn, phòng tránh tai nạn lao động',12,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(31,'COURSE012','Fire Safety Training','Đào tạo phòng cháy chữa cháy',63,10,1,0,1,'Beginner',NULL,NULL,'Sử dụng thiết bị PCCC, quy trình thoát hiểm',12,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(32,'COURSE013','Labor Law Compliance','Tuân thủ luật lao động',64,20,1,1,0,'Beginner',NULL,NULL,'Quyền và nghĩa vụ người lao động, hợp đồng lao động',10,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(33,'COURSE014','Information Security','An ninh thông tin',64,25,2,1,1,'Intermediate',NULL,NULL,'Bảo mật dữ liệu, phòng chống tấn công mạng',7,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(34,'COURSE015','Time Management','Quản lý thời gian hiệu quả',61,15,1,1,0,'Beginner',NULL,NULL,'Ưu tiên công việc, tối ưu năng suất',11,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(35,'COURSE016','Agile & Scrum','Phương pháp Agile và Scrum',60,30,2,1,1,'Intermediate','25',NULL,'Quy trình Scrum, sprint planning, retrospective',8,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(36,'COURSE017','Python Programming','Lập trình Python cơ bản',59,45,3,2,1,'Beginner',NULL,NULL,'Cú pháp Python, xử lý dữ liệu, thư viện phổ biến',9,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(37,'COURSE018','Advanced React Patterns','React nâng cao và design patterns',59,50,3,2,1,'Advanced','21,22',NULL,'HOC, Render Props, Context API, Performance optimization',8,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(38,'COURSE019','Full-Stack Project','Dự án full-stack hoàn chỉnh',59,80,4,1,3,'Advanced','21,22,23','24','Xây dựng ứng dụng full-stack từ A-Z',7,1,'2025-10-14 00:20:15','2025-10-14 00:20:15');

-- Insert majors
INSERT INTO `majors` (`id`, `major_code`, `major_name`, `description`, `degree_type`, `duration_years`, `total_credits`, `department_id`, `head_of_major_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1,'CNTT','Công nghệ thông tin','Chuyên ngành về công nghệ thông tin và phần mềm','Bachelor',4,120,1,7,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(2,'KTPM','Kỹ thuật phần mềm','Chuyên ngành kỹ thuật phần mềm','Bachelor',4,120,1,8,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(3,'KHMT','Khoa học máy tính','Chuyên ngành khoa học máy tính','Bachelor',4,120,1,9,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(4,'HTTT','Hệ thống thông tin','Chuyên ngành hệ thống thông tin quản lý','Bachelor',4,120,1,7,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(5,'TMDT','Thương mại điện tử','Chuyên ngành thương mại điện tử','Bachelor',4,120,4,14,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(6,'QTKD','Quản trị kinh doanh','Chuyên ngành quản trị kinh doanh','Bachelor',4,120,4,14,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(7,'TCNH','Tài chính ngân hàng','Chuyên ngành tài chính ngân hàng','Bachelor',4,120,3,12,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(8,'KTOAN','Kế toán','Chuyên ngành kế toán','Bachelor',4,120,3,12,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(9,'QLNS','Quản lý nhân sự','Chuyên ngành quản lý nguồn nhân lực','Bachelor',4,120,2,10,1,'2025-10-14 00:20:15','2025-10-14 00:20:15');

-- Insert knowledge_blocks
INSERT INTO `knowledge_blocks` (`id`, `block_code`, `block_name`, `description`, `total_credits`, `is_required`, `major_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1,'KTCB','Kiến thức cơ bản','Khối kiến thức giáo dục đại cương',30,1,1,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(2,'KTCN','Kiến thức chuyên ngành','Khối kiến thức chuyên ngành bắt buộc',60,1,1,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(3,'KTTC','Kiến thức tự chọn','Khối kiến thức tự chọn theo định hướng',15,0,1,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(4,'KLTN','Khóa luận tốt nghiệp','Khóa luận/Đồ án tốt nghiệp',15,1,1,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(5,'KTNN','Kiến thức ngoại ngữ','Khối ngoại ngữ bắt buộc',12,1,1,1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(6,'KTTH','Kiến thức thực hành','Khối thực tập và thực hành',8,1,1,1,'2025-10-14 00:20:15','2025-10-14 00:20:15');

-- Insert cohorts
INSERT INTO `cohorts` (`id`, `cohort_code`, `cohort_name`, `description`, `start_date`, `end_date`, `max_students`, `current_students`, `status`, `program_id`, `instructor_id`, `created_at`, `updated_at`) VALUES
(9,'COH001','JavaScript Cơ bản - K1','Khóa học JavaScript cơ bản cho người mới bắt đầu','2024-01-15','2024-03-15',25,20,'completed',1,7,'2025-10-13 17:45:33','2025-10-13 17:45:33'),
(10,'COH002','React.js Development - K1','Khóa học React.js cho developers','2024-02-01','2024-04-01',20,18,'completed',1,8,'2025-10-13 17:45:33','2025-10-13 17:45:33'),
(11,'COH003','JavaScript Cơ bản - K2','Khóa học JavaScript cơ bản - Khóa 2','2024-03-01','2024-05-01',25,22,'active',1,7,'2025-10-13 17:45:33','2025-10-13 17:45:33'),
(12,'COH004','Node.js Backend - K1','Khóa học Node.js backend development','2024-04-01','2024-06-01',18,15,'active',1,9,'2025-10-13 17:45:33','2025-10-13 17:45:33'),
(13,'COH005','Python Programming - K1','Khóa học Python cho beginners','2024-05-01','2024-07-01',20,0,'planning',1,7,'2025-10-13 17:45:33','2025-10-13 17:45:33'),
(14,'COH006','React.js Advanced - K1','Khóa học React.js nâng cao','2024-06-01','2024-08-01',15,0,'planning',1,8,'2025-10-13 17:45:33','2025-10-13 17:45:33'),
(15,'COH007','Database Design - K1','Khóa học thiết kế database','2024-07-01','2024-09-01',22,0,'planning',1,10,'2025-10-13 17:45:33','2025-10-13 17:45:33'),
(16,'COH008','DevOps Fundamentals - K1','Khóa học DevOps cơ bản','2024-08-01','2024-10-01',16,0,'planning',1,11,'2025-10-13 17:45:33','2025-10-13 17:45:33');

-- Insert programs
INSERT INTO `programs` (`id`, `program_code`, `program_name`, `description`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) VALUES
(1,'PRG2024-IT','Chương trình đào tạo IT 2024','Lộ trình đào tạo nội bộ cho khối CNTT năm 2024','2024-01-01','2024-12-31',1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(2,'PRG2024-HR','Chương trình đào tạo Nhân sự 2024','Nâng cao kỹ năng quản lý và tuân thủ cho phòng HR','2024-02-01','2024-11-30',1,'2025-10-14 00:20:15','2025-10-14 00:20:15'),
(3,'PRG2025-ONB','Onboarding 2025','Chương trình hội nhập cho nhân viên mới 2025','2025-01-15',NULL,1,'2025-10-14 00:20:15','2025-10-14 00:20:15');

-- Insert curriculum_structures
INSERT INTO `curriculum_structures` (`id`, `major_id`, `knowledge_block_id`, `semester`, `is_required`, `min_credits`, `notes`, `created_at`, `updated_at`) VALUES
(1,1,1,1,1,15,NULL,'2025-10-13 18:06:53','2025-10-13 18:06:53'),
(2,1,1,2,1,15,NULL,'2025-10-13 18:06:53','2025-10-13 18:06:53'),
(3,1,2,3,1,20,NULL,'2025-10-13 18:06:53','2025-10-13 18:06:53'),
(4,1,2,4,1,20,NULL,'2025-10-13 18:06:53','2025-10-13 18:06:53'),
(5,1,2,5,1,20,NULL,'2025-10-13 18:06:53','2025-10-13 18:06:53'),
(6,1,3,6,0,15,NULL,'2025-10-13 18:06:53','2025-10-13 18:06:53'),
(7,1,4,7,1,15,NULL,'2025-10-13 18:06:53','2025-10-13 18:06:53');

-- =====================================================
-- END OF BACKUP
-- =====================================================

