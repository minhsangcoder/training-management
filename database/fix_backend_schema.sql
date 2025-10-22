USE training_management;

-- 1) Courses: add department_id and FK if missing
ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS department_id INT DEFAULT NULL AFTER learning_objectives,
  ADD KEY IF NOT EXISTS department_id (department_id);

ALTER TABLE courses 
  ADD CONSTRAINT IF NOT EXISTS courses_ibfk_department 
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- 2) Programs: ensure table exists
CREATE TABLE IF NOT EXISTS programs (
  id int NOT NULL AUTO_INCREMENT,
  program_code varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  program_name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  description text COLLATE utf8mb4_unicode_ci,
  start_date date DEFAULT NULL,
  end_date date DEFAULT NULL,
  is_active tinyint(1) DEFAULT '1',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY program_code (program_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed a few programs if table empty
INSERT INTO programs (program_code, program_name, description, start_date, end_date, is_active)
SELECT 'PRG2024-IT','Chương trình đào tạo IT 2024','Lộ trình đào tạo nội bộ cho khối CNTT năm 2024','2024-01-01','2024-12-31',1
WHERE NOT EXISTS (SELECT 1 FROM programs);

-- 3) Cohorts: recreate to reference programs
DROP TABLE IF EXISTS cohorts;
CREATE TABLE cohorts (
  id int NOT NULL AUTO_INCREMENT,
  cohort_code varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  cohort_name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  description text COLLATE utf8mb4_unicode_ci,
  start_date date NOT NULL,
  end_date date DEFAULT NULL,
  max_students int DEFAULT '30',
  current_students int DEFAULT '0',
  status enum('planning','active','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'planning',
  program_id int DEFAULT NULL,
  instructor_id int DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY cohort_code (cohort_code),
  KEY program_id (program_id),
  KEY instructor_id (instructor_id),
  CONSTRAINT cohorts_ibfk_program FOREIGN KEY (program_id) REFERENCES programs (id) ON DELETE SET NULL,
  CONSTRAINT cohorts_ibfk_2 FOREIGN KEY (instructor_id) REFERENCES employees (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) Knowledge blocks: ensure exists
CREATE TABLE IF NOT EXISTS knowledge_blocks (
  id int NOT NULL AUTO_INCREMENT,
  block_code varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  block_name varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  description text COLLATE utf8mb4_unicode_ci,
  total_credits int DEFAULT '0',
  is_required tinyint(1) DEFAULT '1',
  major_id int DEFAULT NULL,
  is_active tinyint(1) DEFAULT '1',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY block_code (block_code),
  KEY major_id (major_id),
  CONSTRAINT knowledge_blocks_ibfk_1 FOREIGN KEY (major_id) REFERENCES majors (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) Curriculum structures: ensure exists
CREATE TABLE IF NOT EXISTS curriculum_structures (
  id int NOT NULL AUTO_INCREMENT,
  major_id int NOT NULL,
  knowledge_block_id int NOT NULL,
  semester int DEFAULT NULL,
  is_required tinyint(1) DEFAULT '1',
  min_credits int DEFAULT '0',
  notes text COLLATE utf8mb4_unicode_ci,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY major_id (major_id),
  KEY knowledge_block_id (knowledge_block_id),
  CONSTRAINT curriculum_structures_ibfk_1 FOREIGN KEY (major_id) REFERENCES majors (id) ON DELETE CASCADE,
  CONSTRAINT curriculum_structures_ibfk_2 FOREIGN KEY (knowledge_block_id) REFERENCES knowledge_blocks (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `program_knowledge_blocks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `program_id` INT NOT NULL,
  `knowledge_block_id` INT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`),
  KEY `knowledge_block_id` (`knowledge_block_id`),
  CONSTRAINT `pkb_program_fk` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pkb_kb_fk` FOREIGN KEY (`knowledge_block_id`) REFERENCES `knowledge_blocks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;