-- =============================================
-- Cơ sở dữ liệu quản lý đào tạo
-- =============================================

-- Tạo database
CREATE DATABASE IF NOT EXISTS training_management;
USE training_management;

-- =============================================
-- 1. QUẢN LÝ CƠ CẤU TỔ CHỨC
-- =============================================

-- Bảng phòng ban
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_department_id INT NULL,
    manager_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (parent_department_id) REFERENCES departments(id),
    INDEX idx_department_code (department_code),
    INDEX idx_parent_department (parent_department_id)
);

-- Bảng chức vụ
CREATE TABLE positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    position_code VARCHAR(20) UNIQUE NOT NULL,
    position_name VARCHAR(100) NOT NULL,
    level INT NOT NULL DEFAULT 1,
    description TEXT,
    department_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_position_code (position_code),
    INDEX idx_department_position (department_id)
);

-- =============================================
-- 2. QUẢN LÝ NHÂN VIÊN
-- =============================================

-- Bảng nhân viên
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
    id_card VARCHAR(20) UNIQUE,
    position_id INT NOT NULL,
    department_id INT NOT NULL,
    manager_id INT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(12,2),
    status ENUM('Active', 'Inactive', 'Terminated') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (position_id) REFERENCES positions(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    INDEX idx_employee_code (employee_code),
    INDEX idx_email (email),
    INDEX idx_position_employee (position_id),
    INDEX idx_department_employee (department_id)
);

-- Cập nhật foreign key cho departments.manager_id
ALTER TABLE departments ADD CONSTRAINT fk_department_manager 
FOREIGN KEY (manager_id) REFERENCES employees(id);

-- =============================================
-- 3. QUẢN LÝ HỌC PHẦN
-- =============================================

-- Bảng danh mục học phần
CREATE TABLE course_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_code VARCHAR(20) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    INDEX idx_category_code (category_code)
);

-- Bảng học phần
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    duration_hours INT NOT NULL DEFAULT 0,
    credits INT NOT NULL DEFAULT 0,
    level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    prerequisites TEXT,
    learning_objectives TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (category_id) REFERENCES course_categories(id),
    FOREIGN KEY (created_by) REFERENCES employees(id),
    INDEX idx_course_code (course_code),
    INDEX idx_category_course (category_id),
    INDEX idx_level (level)
);

-- Bảng khóa học (lớp học)
CREATE TABLE course_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_code VARCHAR(20) UNIQUE NOT NULL,
    course_id INT NOT NULL,
    instructor_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_students INT DEFAULT 30,
    current_students INT DEFAULT 0,
    status ENUM('Scheduled', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    location VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (instructor_id) REFERENCES employees(id),
    INDEX idx_session_code (session_code),
    INDEX idx_course_session (course_id),
    INDEX idx_instructor_session (instructor_id),
    INDEX idx_status (status)
);

-- =============================================
-- 4. BẢNG LIÊN KẾT
-- =============================================

-- Bảng đăng ký học phần
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    course_session_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Enrolled', 'Completed', 'Dropped', 'Failed') DEFAULT 'Enrolled',
    final_score DECIMAL(5,2),
    completion_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (course_session_id) REFERENCES course_sessions(id),
    UNIQUE KEY unique_enrollment (employee_id, course_session_id),
    INDEX idx_employee_enrollment (employee_id),
    INDEX idx_session_enrollment (course_session_id),
    INDEX idx_status (status)
);

-- Bảng đánh giá học phần
CREATE TABLE course_evaluations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    enrollment_id INT NOT NULL,
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content_rating INT CHECK (content_rating >= 1 AND content_rating <= 5),
    instructor_rating INT CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
    facility_rating INT CHECK (facility_rating >= 1 AND facility_rating <= 5),
    overall_rating INT CHECK (overall_rating >= 1 AND overall_rating <= 5),
    comments TEXT,
    
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
    INDEX idx_enrollment_evaluation (enrollment_id)
);

-- =============================================
-- 5. BẢNG AUDIT LOG
-- =============================================

-- Bảng ghi log thay đổi
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by INT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (changed_by) REFERENCES employees(id),
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_changed_by (changed_by),
    INDEX idx_changed_at (changed_at)
);

-- =============================================
-- 6. INSERT DỮ LIỆU MẪU
-- =============================================

-- Thêm danh mục học phần mẫu
INSERT INTO course_categories (category_code, category_name, description) VALUES
('TECH', 'Công nghệ thông tin', 'Các khóa học về công nghệ thông tin và lập trình'),
('MANAGE', 'Quản lý', 'Các khóa học về kỹ năng quản lý và lãnh đạo'),
('SOFT', 'Kỹ năng mềm', 'Các khóa học về kỹ năng giao tiếp và làm việc nhóm'),
('LANG', 'Ngoại ngữ', 'Các khóa học về ngoại ngữ');

-- Thêm phòng ban mẫu
INSERT INTO departments (department_code, department_name, description) VALUES
('IT', 'Phòng Công nghệ thông tin', 'Phòng phụ trách về công nghệ thông tin'),
('HR', 'Phòng Nhân sự', 'Phòng phụ trách về quản lý nhân sự'),
('FIN', 'Phòng Tài chính', 'Phòng phụ trách về tài chính kế toán'),
('MKT', 'Phòng Marketing', 'Phòng phụ trách về marketing và bán hàng');

-- Thêm chức vụ mẫu
INSERT INTO positions (position_code, position_name, level, description, department_id) VALUES
('DEV', 'Lập trình viên', 3, 'Phát triển phần mềm', 1),
('PM', 'Quản lý dự án', 4, 'Quản lý các dự án công nghệ', 1),
('HR_MGR', 'Trưởng phòng nhân sự', 5, 'Quản lý phòng nhân sự', 2),
('HR_SPEC', 'Chuyên viên nhân sự', 3, 'Chuyên viên phụ trách nhân sự', 2),
('ACCOUNTANT', 'Kế toán', 3, 'Kế toán viên', 3),
('MKT_MGR', 'Trưởng phòng marketing', 5, 'Quản lý phòng marketing', 4);

-- Thêm nhân viên mẫu
INSERT INTO employees (employee_code, first_name, last_name, email, phone, position_id, department_id, hire_date, salary) VALUES
('EMP001', 'Nguyễn Văn', 'An', 'an.nguyen@company.com', '0123456789', 1, 1, '2023-01-15', 15000000),
('EMP002', 'Trần Thị', 'Bình', 'binh.tran@company.com', '0123456790', 2, 1, '2022-06-01', 20000000),
('EMP003', 'Lê Văn', 'Cường', 'cuong.le@company.com', '0123456791', 3, 2, '2021-03-10', 25000000),
('EMP004', 'Phạm Thị', 'Dung', 'dung.pham@company.com', '0123456792', 4, 2, '2023-02-20', 12000000),
('EMP005', 'Hoàng Văn', 'Em', 'em.hoang@company.com', '0123456793', 5, 3, '2022-11-05', 13000000),
('EMP006', 'Vũ Thị', 'Phương', 'phuong.vu@company.com', '0123456794', 6, 4, '2021-08-15', 22000000);

-- Cập nhật manager cho departments
UPDATE departments SET manager_id = 2 WHERE id = 1; -- IT department
UPDATE departments SET manager_id = 3 WHERE id = 2; -- HR department
UPDATE departments SET manager_id = 5 WHERE id = 3; -- Finance department
UPDATE departments SET manager_id = 6 WHERE id = 4; -- Marketing department

-- Thêm học phần mẫu
INSERT INTO courses (course_code, course_name, description, category_id, duration_hours, credits, level, created_by) VALUES
('JAVA101', 'Lập trình Java cơ bản', 'Khóa học lập trình Java từ cơ bản đến nâng cao', 1, 40, 3, 'Beginner', 1),
('PM201', 'Quản lý dự án Agile', 'Phương pháp quản lý dự án theo mô hình Agile', 2, 24, 2, 'Intermediate', 2),
('COMM101', 'Kỹ năng giao tiếp hiệu quả', 'Phát triển kỹ năng giao tiếp trong công việc', 3, 16, 1, 'Beginner', 3),
('ENG101', 'Tiếng Anh giao tiếp', 'Nâng cao khả năng giao tiếp tiếng Anh', 4, 32, 2, 'Beginner', 4);

-- Thêm khóa học mẫu
INSERT INTO course_sessions (session_code, course_id, instructor_id, start_date, end_date, max_students, location) VALUES
('JAVA101-2024-01', 1, 1, '2024-03-01', '2024-04-15', 25, 'Phòng học A1'),
('PM201-2024-01', 2, 2, '2024-03-15', '2024-04-30', 20, 'Phòng học B2'),
('COMM101-2024-01', 3, 3, '2024-04-01', '2024-04-30', 30, 'Phòng học C1'),
('ENG101-2024-01', 4, 4, '2024-04-15', '2024-06-15', 25, 'Phòng học D1');

-- Thêm đăng ký học phần mẫu
INSERT INTO enrollments (employee_id, course_session_id, status) VALUES
(1, 1, 'Enrolled'),
(2, 1, 'Enrolled'),
(3, 2, 'Enrolled'),
(4, 3, 'Enrolled'),
(5, 4, 'Enrolled'),
(6, 2, 'Enrolled');
