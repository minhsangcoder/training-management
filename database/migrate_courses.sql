-- Migration script to add new fields to courses table
USE training_management;

-- Add new columns to courses table
ALTER TABLE courses 
ADD COLUMN theory_credits INT DEFAULT NULL AFTER total_credits,
ADD COLUMN practice_credits INT DEFAULT NULL AFTER theory_credits,
ADD COLUMN concurrent_course_ids TEXT DEFAULT NULL AFTER prerequisite_course_ids,
ADD COLUMN department_id INT DEFAULT NULL AFTER learning_objectives;

-- Add foreign key constraint for department_id
ALTER TABLE courses 
ADD CONSTRAINT courses_ibfk_department 
FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- Update existing courses with sample data for new fields
UPDATE courses SET 
  theory_credits = CASE 
    WHEN id = 20 THEN 2
    WHEN id = 21 THEN 2
    WHEN id = 22 THEN 2
    WHEN id = 23 THEN 2
    WHEN id = 24 THEN 2
    WHEN id = 25 THEN 2
    WHEN id = 26 THEN 1
    WHEN id = 27 THEN 0
    WHEN id = 28 THEN 2
    WHEN id = 29 THEN 2
    WHEN id = 30 THEN 1
    WHEN id = 31 THEN 0
    WHEN id = 32 THEN 1
    WHEN id = 33 THEN 1
    WHEN id = 34 THEN 1
    WHEN id = 35 THEN 1
    WHEN id = 36 THEN 2
    WHEN id = 37 THEN 2
    WHEN id = 38 THEN 1
    ELSE 1
  END,
  practice_credits = CASE 
    WHEN id = 20 THEN 1
    WHEN id = 21 THEN 2
    WHEN id = 22 THEN 1
    WHEN id = 23 THEN 1
    WHEN id = 24 THEN 0
    WHEN id = 25 THEN 1
    WHEN id = 26 THEN 1
    WHEN id = 27 THEN 1
    WHEN id = 28 THEN 1
    WHEN id = 29 THEN 0
    WHEN id = 30 THEN 0
    WHEN id = 31 THEN 1
    WHEN id = 32 THEN 0
    WHEN id = 33 THEN 1
    WHEN id = 34 THEN 0
    WHEN id = 35 THEN 1
    WHEN id = 36 THEN 1
    WHEN id = 37 THEN 1
    WHEN id = 38 THEN 3
    ELSE 0
  END,
  concurrent_course_ids = CASE 
    WHEN id = 22 THEN '21'
    WHEN id = 38 THEN '24'
    ELSE NULL
  END,
  department_id = CASE 
    WHEN id IN (20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38) THEN 1
    ELSE NULL
  END;
