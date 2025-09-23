-- =============================================
-- SQLite Database Schema for Training Management
-- =============================================

-- =============================================
-- 1. QUẢN LÝ CƠ CẤU TỔ CHỨC
-- =============================================

-- Bảng phòng ban
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_department_id INTEGER NULL,
    manager_id INTEGER NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    
    FOREIGN KEY (parent_department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE INDEX idx_department_code ON departments(department_code);
CREATE INDEX idx_parent_department ON departments(parent_department_id);

-- Bảng chức vụ
CREATE TABLE positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    position_code VARCHAR(20) UNIQUE NOT NULL,
    position_name VARCHAR(100) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    description TEXT,
    department_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE INDEX idx_position_code ON positions(position_code);
CREATE INDEX idx_department_position ON positions(department_id);

-- =============================================
-- 2. QUẢN LÝ NHÂN VIÊN
-- =============================================

-- Bảng nhân viên
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) DEFAULT 'Other' CHECK (gender IN ('Male', 'Female', 'Other')),
    id_card VARCHAR(20) UNIQUE,
    position_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Terminated')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (position_id) REFERENCES positions(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE INDEX idx_employee_code ON employees(employee_code);
CREATE INDEX idx_email ON employees(email);
CREATE INDEX idx_position_employee ON employees(position_id);
CREATE INDEX idx_department_employee ON employees(department_id);

-- =============================================
-- 3. QUẢN LÝ HỌC PHẦN
-- =============================================

-- Bảng danh mục học phần
CREATE TABLE course_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_code VARCHAR(20) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

CREATE INDEX idx_category_code ON course_categories(category_code);

-- Bảng học phần
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INTEGER NOT NULL,
    duration_hours INTEGER NOT NULL DEFAULT 0,
    credits INTEGER NOT NULL DEFAULT 0,
    level VARCHAR(20) DEFAULT 'Beginner' CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    prerequisites TEXT,
    learning_objectives TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    
    FOREIGN KEY (category_id) REFERENCES course_categories(id),
    FOREIGN KEY (created_by) REFERENCES employees(id)
);

CREATE INDEX idx_course_code ON courses(course_code);
CREATE INDEX idx_category_course ON courses(category_id);
CREATE INDEX idx_level ON courses(level);

-- Bảng khóa học (lớp học)
CREATE TABLE course_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_code VARCHAR(20) UNIQUE NOT NULL,
    course_id INTEGER NOT NULL,
    instructor_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_students INTEGER DEFAULT 30,
    current_students INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Ongoing', 'Completed', 'Cancelled')),
    location VARCHAR(200),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (instructor_id) REFERENCES employees(id)
);

CREATE INDEX idx_session_code ON course_sessions(session_code);
CREATE INDEX idx_course_session ON course_sessions(course_id);
CREATE INDEX idx_instructor_session ON course_sessions(instructor_id);
CREATE INDEX idx_status ON course_sessions(status);

-- =============================================
-- 4. BẢNG LIÊN KẾT
-- =============================================

-- Bảng đăng ký học phần
CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    course_session_id INTEGER NOT NULL,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Enrolled' CHECK (status IN ('Enrolled', 'Completed', 'Dropped', 'Failed')),
    final_score DECIMAL(5,2),
    completion_date DATETIME NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (course_session_id) REFERENCES course_sessions(id),
    UNIQUE(employee_id, course_session_id)
);

CREATE INDEX idx_employee_enrollment ON enrollments(employee_id);
CREATE INDEX idx_session_enrollment ON enrollments(course_session_id);
CREATE INDEX idx_status ON enrollments(status);

-- Bảng đánh giá học phần
CREATE TABLE course_evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id INTEGER NOT NULL,
    evaluation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
    instructor_rating INTEGER CHECK (instructor_rating >= 1 AND instructor_rating <= 5),
    facility_rating INTEGER CHECK (facility_rating >= 1 AND facility_rating <= 5),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    comments TEXT,
    
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
);

CREATE INDEX idx_enrollment_evaluation ON course_evaluations(enrollment_id);

-- =============================================
-- 5. BẢNG AUDIT LOG
-- =============================================

-- Bảng ghi log thay đổi
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values TEXT, -- JSON stored as TEXT in SQLite
    new_values TEXT, -- JSON stored as TEXT in SQLite
    changed_by INTEGER NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (changed_by) REFERENCES employees(id)
);

CREATE INDEX idx_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_changed_by ON audit_logs(changed_by);
CREATE INDEX idx_changed_at ON audit_logs(changed_at);

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
