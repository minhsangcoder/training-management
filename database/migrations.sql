-- =============================================
-- MIGRATIONS - Cập nhật cơ sở dữ liệu
-- =============================================

USE training_management;

-- =============================================
-- 1. STORED PROCEDURES CHO QUẢN LÝ CƠ CẤU TỔ CHỨC
-- =============================================

-- Stored procedure: Thêm phòng ban mới
DELIMITER //
CREATE PROCEDURE sp_add_department(
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
END //
DELIMITER ;

-- Stored procedure: Cập nhật phòng ban
DELIMITER //
CREATE PROCEDURE sp_update_department(
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
END //
DELIMITER ;

-- Stored procedure: Xóa phòng ban (soft delete)
DELIMITER //
CREATE PROCEDURE sp_delete_department(
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
END //
DELIMITER ;

-- =============================================
-- 2. STORED PROCEDURES CHO QUẢN LÝ NHÂN VIÊN
-- =============================================

-- Stored procedure: Thêm nhân viên mới
DELIMITER //
CREATE PROCEDURE sp_add_employee(
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
END //
DELIMITER ;

-- Stored procedure: Cập nhật nhân viên
DELIMITER //
CREATE PROCEDURE sp_update_employee(
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
END //
DELIMITER ;

-- =============================================
-- 3. STORED PROCEDURES CHO QUẢN LÝ HỌC PHẦN
-- =============================================

-- Stored procedure: Thêm học phần mới
DELIMITER //
CREATE PROCEDURE sp_add_course(
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
END //
DELIMITER ;

-- Stored procedure: Đăng ký học phần
DELIMITER //
CREATE PROCEDURE sp_enroll_course(
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
END //
DELIMITER ;

-- =============================================
-- 4. VIEWS CHO BÁO CÁO
-- =============================================

-- View: Thông tin nhân viên chi tiết
CREATE VIEW v_employee_details AS
SELECT 
    e.id,
    e.employee_code,
    CONCAT(e.first_name, ' ', e.last_name) AS full_name,
    e.email,
    e.phone,
    e.hire_date,
    e.salary,
    e.status,
    d.department_name,
    p.position_name,
    CONCAT(m.first_name, ' ', m.last_name) AS manager_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
LEFT JOIN employees m ON e.manager_id = m.id;

-- View: Thông tin khóa học chi tiết
CREATE VIEW v_course_details AS
SELECT 
    c.id,
    c.course_code,
    c.course_name,
    c.duration_hours,
    c.credits,
    c.level,
    cc.category_name,
    CONCAT(e.first_name, ' ', e.last_name) AS created_by_name,
    c.created_at
FROM courses c
LEFT JOIN course_categories cc ON c.category_id = cc.id
LEFT JOIN employees e ON c.created_by = e.id;

-- View: Báo cáo đăng ký học phần
CREATE VIEW v_enrollment_report AS
SELECT 
    en.id,
    en.enrollment_date,
    en.status,
    en.final_score,
    CONCAT(emp.first_name, ' ', emp.last_name) AS employee_name,
    emp.employee_code,
    d.department_name,
    c.course_name,
    cs.session_code,
    cs.start_date,
    cs.end_date,
    CONCAT(inst.first_name, ' ', inst.last_name) AS instructor_name
FROM enrollments en
LEFT JOIN employees emp ON en.employee_id = emp.id
LEFT JOIN course_sessions cs ON en.course_session_id = cs.id
LEFT JOIN courses c ON cs.course_id = c.id
LEFT JOIN departments d ON emp.department_id = d.id
LEFT JOIN employees inst ON cs.instructor_id = inst.id;

-- =============================================
-- 5. TRIGGERS
-- =============================================

-- Trigger: Cập nhật số lượng học viên khi xóa đăng ký
DELIMITER //
CREATE TRIGGER tr_enrollment_delete
AFTER DELETE ON enrollments
FOR EACH ROW
BEGIN
    UPDATE course_sessions 
    SET current_students = current_students - 1
    WHERE id = OLD.course_session_id;
END //
DELIMITER ;

-- Trigger: Cập nhật số lượng học viên khi thêm đăng ký
DELIMITER //
CREATE TRIGGER tr_enrollment_insert
AFTER INSERT ON enrollments
FOR EACH ROW
BEGIN
    UPDATE course_sessions 
    SET current_students = current_students + 1
    WHERE id = NEW.course_session_id;
END //
DELIMITER ;
