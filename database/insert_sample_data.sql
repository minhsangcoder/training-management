-- Insert sample data for testing
USE training_management;

-- Insert departments
INSERT INTO departments (id, department_code, department_name, description, is_active, created_at, updated_at) VALUES
(1,'IT','Phòng Công nghệ thông tin','Phòng quản lý và phát triển hệ thống công nghệ thông tin',1,NOW(),NOW()),
(2,'HR','Phòng Nhân sự','Phòng quản lý nguồn nhân lực và đào tạo',1,NOW(),NOW());

-- Insert course categories
INSERT INTO course_categories (id, category_code, category_name, description, is_active, created_at, updated_at) VALUES
(1,'TECH','Công nghệ thông tin','Các khóa học về công nghệ thông tin và lập trình',1,NOW(),NOW()),
(2,'MANAGE','Quản lý','Các khóa học về kỹ năng quản lý và lãnh đạo',1,NOW(),NOW());

-- Insert employees
INSERT INTO employees (id, employee_code, first_name, last_name, email, department_id, status, created_at, updated_at) VALUES
(1,'EMP001','Nguyễn Văn','An','nguyen.van.an@company.com',1,'Active',NOW(),NOW()),
(2,'EMP002','Trần Thị','Bình','tran.thi.binh@company.com',1,'Active',NOW(),NOW());

-- Insert courses with new fields
INSERT INTO courses (course_code, course_name, description, category_id, duration_hours, total_credits, theory_credits, practice_credits, level, prerequisite_course_ids, concurrent_course_ids, learning_objectives, department_id, created_by, is_active, created_at, updated_at) VALUES
('COURSE001','JavaScript Fundamentals','Học các kiến thức cơ bản về JavaScript',1,40,3,2,1,'Beginner',NULL,NULL,'Hiểu cú pháp JavaScript cơ bản, làm việc với DOM, xử lý sự kiện',1,1,1,NOW(),NOW()),
('COURSE002','React.js Development','Phát triển ứng dụng web với React.js',1,60,4,2,2,'Intermediate','1',NULL,'Xây dựng ứng dụng React, quản lý state, làm việc với hooks',1,1,1,NOW(),NOW()),
('COURSE003','Node.js Backend','Phát triển backend với Node.js và Express',1,50,3,2,1,'Intermediate','1','2','Tạo RESTful API, làm việc với database, authentication',1,1,1,NOW(),NOW()),
('COURSE004','Leadership Skills','Kỹ năng lãnh đạo và quản lý nhóm',2,30,2,2,0,'Intermediate',NULL,NULL,'Phát triển kỹ năng lãnh đạo, quản lý xung đột, động viên nhân viên',2,2,1,NOW(),NOW());
