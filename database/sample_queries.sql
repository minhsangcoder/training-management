-- =============================================
-- CÁC CÂU TRUY VẤN MẪU CHO ỨNG DỤNG QUẢN LÝ ĐÀO TẠO
-- =============================================

USE training_management;

-- =============================================
-- 1. QUẢN LÝ CƠ CẤU TỔ CHỨC
-- =============================================

-- Liệt kê tất cả phòng ban
SELECT 
    id,
    department_code,
    department_name,
    description,
    parent_department_id,
    manager_id,
    created_at,
    is_active
FROM departments 
WHERE is_active = TRUE
ORDER BY department_name;

-- Liệt kê phòng ban với thông tin trưởng phòng
SELECT 
    d.id,
    d.department_code,
    d.department_name,
    CONCAT(e.first_name, ' ', e.last_name) AS manager_name,
    e.email AS manager_email
FROM departments d
LEFT JOIN employees e ON d.manager_id = e.id
WHERE d.is_active = TRUE;

-- Liệt kê tất cả chức vụ theo phòng ban
SELECT 
    p.id,
    p.position_code,
    p.position_name,
    p.level,
    d.department_name,
    p.description
FROM positions p
JOIN departments d ON p.department_id = d.id
WHERE p.is_active = TRUE AND d.is_active = TRUE
ORDER BY d.department_name, p.level DESC;

-- Thống kê số lượng nhân viên theo phòng ban
SELECT 
    d.department_name,
    COUNT(e.id) AS employee_count,
    COUNT(CASE WHEN e.status = 'Active' THEN 1 END) AS active_employees
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
WHERE d.is_active = TRUE
GROUP BY d.id, d.department_name
ORDER BY employee_count DESC;

-- =============================================
-- 2. QUẢN LÝ NHÂN VIÊN
-- =============================================

-- Liệt kê tất cả nhân viên với thông tin chi tiết
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
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.last_name, e.first_name;

-- Tìm kiếm nhân viên theo tên hoặc mã nhân viên
SELECT 
    e.id,
    e.employee_code,
    CONCAT(e.first_name, ' ', e.last_name) AS full_name,
    e.email,
    e.phone,
    d.department_name,
    p.position_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id
LEFT JOIN positions p ON e.position_id = p.id
WHERE (e.first_name LIKE '%keyword%' OR e.last_name LIKE '%keyword%' OR e.employee_code LIKE '%keyword%')
  AND e.status = 'Active';

-- Thống kê nhân viên theo phòng ban và chức vụ
SELECT 
    d.department_name,
    p.position_name,
    COUNT(e.id) AS employee_count,
    AVG(e.salary) AS avg_salary,
    MIN(e.hire_date) AS earliest_hire,
    MAX(e.hire_date) AS latest_hire
FROM employees e
JOIN departments d ON e.department_id = d.id
JOIN positions p ON e.position_id = p.id
WHERE e.status = 'Active'
GROUP BY d.id, d.department_name, p.id, p.position_name
ORDER BY d.department_name, employee_count DESC;

-- Liệt kê nhân viên sắp đến ngày nghỉ hưu (trong 5 năm tới)
SELECT 
    e.employee_code,
    CONCAT(e.first_name, ' ', e.last_name) AS full_name,
    e.hire_date,
    DATEDIFF(DATE_ADD(e.hire_date, INTERVAL 60 YEAR), CURDATE()) AS days_to_retirement,
    d.department_name,
    p.position_name
FROM employees e
JOIN departments d ON e.department_id = d.id
JOIN positions p ON e.position_id = p.id
WHERE e.status = 'Active'
  AND DATEDIFF(DATE_ADD(e.hire_date, INTERVAL 60 YEAR), CURDATE()) BETWEEN 0 AND 1825 -- 5 năm
ORDER BY days_to_retirement;

-- =============================================
-- 3. QUẢN LÝ HỌC PHẦN
-- =============================================

-- Liệt kê tất cả học phần
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
LEFT JOIN employees e ON c.created_by = e.id
WHERE c.is_active = TRUE
ORDER BY c.course_name;

-- Liệt kê các khóa học đang diễn ra
SELECT 
    cs.id,
    cs.session_code,
    c.course_name,
    CONCAT(inst.first_name, ' ', inst.last_name) AS instructor_name,
    cs.start_date,
    cs.end_date,
    cs.current_students,
    cs.max_students,
    cs.location,
    cs.status
FROM course_sessions cs
JOIN courses c ON cs.course_id = c.id
JOIN employees inst ON cs.instructor_id = inst.id
WHERE cs.status = 'Ongoing'
ORDER BY cs.start_date;

-- Liệt kê học phần theo danh mục
SELECT 
    cc.category_name,
    COUNT(c.id) AS course_count,
    AVG(c.duration_hours) AS avg_duration,
    SUM(c.duration_hours) AS total_hours
FROM course_categories cc
LEFT JOIN courses c ON cc.id = c.category_id AND c.is_active = TRUE
WHERE cc.is_active = TRUE
GROUP BY cc.id, cc.category_name
ORDER BY course_count DESC;

-- Tìm kiếm học phần theo từ khóa
SELECT 
    c.id,
    c.course_code,
    c.course_name,
    c.description,
    c.duration_hours,
    c.level,
    cc.category_name
FROM courses c
LEFT JOIN course_categories cc ON c.category_id = cc.id
WHERE (c.course_name LIKE '%keyword%' OR c.description LIKE '%keyword%' OR c.course_code LIKE '%keyword%')
  AND c.is_active = TRUE
ORDER BY c.course_name;

-- =============================================
-- 4. BÁO CÁO ĐĂNG KÝ HỌC PHẦN
-- =============================================

-- Báo cáo đăng ký học phần theo nhân viên
SELECT 
    e.employee_code,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    d.department_name,
    COUNT(en.id) AS total_enrollments,
    COUNT(CASE WHEN en.status = 'Completed' THEN 1 END) AS completed_courses,
    COUNT(CASE WHEN en.status = 'Enrolled' THEN 1 END) AS current_enrollments,
    AVG(en.final_score) AS avg_score
FROM employees e
LEFT JOIN enrollments en ON e.id = en.employee_id
LEFT JOIN departments d ON e.department_id = d.id
WHERE e.status = 'Active'
GROUP BY e.id, e.employee_code, e.first_name, e.last_name, d.department_name
ORDER BY total_enrollments DESC;

-- Báo cáo đăng ký học phần theo khóa học
SELECT 
    c.course_name,
    cs.session_code,
    CONCAT(inst.first_name, ' ', inst.last_name) AS instructor_name,
    cs.start_date,
    cs.end_date,
    cs.current_students,
    cs.max_students,
    ROUND((cs.current_students / cs.max_students) * 100, 2) AS enrollment_rate,
    AVG(en.final_score) AS avg_score
FROM course_sessions cs
JOIN courses c ON cs.course_id = c.id
JOIN employees inst ON cs.instructor_id = inst.id
LEFT JOIN enrollments en ON cs.id = en.course_session_id
GROUP BY cs.id, c.course_name, cs.session_code, inst.first_name, inst.last_name, 
         cs.start_date, cs.end_date, cs.current_students, cs.max_students
ORDER BY cs.start_date;

-- Báo cáo đánh giá học phần
SELECT 
    c.course_name,
    cs.session_code,
    COUNT(ce.id) AS evaluation_count,
    AVG(ce.content_rating) AS avg_content_rating,
    AVG(ce.instructor_rating) AS avg_instructor_rating,
    AVG(ce.facility_rating) AS avg_facility_rating,
    AVG(ce.overall_rating) AS avg_overall_rating
FROM course_sessions cs
JOIN courses c ON cs.course_id = c.id
LEFT JOIN enrollments en ON cs.id = en.course_session_id
LEFT JOIN course_evaluations ce ON en.id = ce.enrollment_id
WHERE cs.status = 'Completed'
GROUP BY cs.id, c.course_name, cs.session_code
HAVING evaluation_count > 0
ORDER BY avg_overall_rating DESC;

-- =============================================
-- 5. BÁO CÁO THỐNG KÊ
-- =============================================

-- Thống kê tổng quan hệ thống
SELECT 
    'Tổng số phòng ban' AS metric,
    COUNT(*) AS value
FROM departments WHERE is_active = TRUE
UNION ALL
SELECT 
    'Tổng số nhân viên',
    COUNT(*) 
FROM employees WHERE status = 'Active'
UNION ALL
SELECT 
    'Tổng số học phần',
    COUNT(*) 
FROM courses WHERE is_active = TRUE
UNION ALL
SELECT 
    'Tổng số khóa học',
    COUNT(*) 
FROM course_sessions
UNION ALL
SELECT 
    'Tổng số đăng ký',
    COUNT(*) 
FROM enrollments;

-- Thống kê đăng ký học phần theo tháng
SELECT 
    YEAR(en.enrollment_date) AS year,
    MONTH(en.enrollment_date) AS month,
    COUNT(en.id) AS enrollment_count,
    COUNT(CASE WHEN en.status = 'Completed' THEN 1 END) AS completed_count
FROM enrollments en
WHERE en.enrollment_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY YEAR(en.enrollment_date), MONTH(en.enrollment_date)
ORDER BY year DESC, month DESC;

-- Top 10 học phần được đăng ký nhiều nhất
SELECT 
    c.course_name,
    cc.category_name,
    COUNT(en.id) AS enrollment_count,
    AVG(en.final_score) AS avg_score
FROM courses c
LEFT JOIN course_categories cc ON c.category_id = cc.id
LEFT JOIN course_sessions cs ON c.id = cs.course_id
LEFT JOIN enrollments en ON cs.id = en.course_session_id
WHERE c.is_active = TRUE
GROUP BY c.id, c.course_name, cc.category_name
ORDER BY enrollment_count DESC
LIMIT 10;

-- =============================================
-- 6. CÁC CÂU TRUY VẤN CHO DASHBOARD
-- =============================================

-- Dashboard: Thống kê nhanh
SELECT 
    (SELECT COUNT(*) FROM employees WHERE status = 'Active') AS active_employees,
    (SELECT COUNT(*) FROM course_sessions WHERE status = 'Ongoing') AS ongoing_courses,
    (SELECT COUNT(*) FROM enrollments WHERE status = 'Enrolled') AS current_enrollments,
    (SELECT COUNT(*) FROM enrollments WHERE status = 'Completed' AND 
     completion_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) AS completed_this_month;

-- Dashboard: Nhân viên có nhiều đăng ký nhất
SELECT 
    e.employee_code,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    d.department_name,
    COUNT(en.id) AS enrollment_count,
    AVG(en.final_score) AS avg_score
FROM employees e
LEFT JOIN enrollments en ON e.id = en.employee_id
LEFT JOIN departments d ON e.department_id = d.id
WHERE e.status = 'Active'
GROUP BY e.id, e.employee_code, e.first_name, e.last_name, d.department_name
ORDER BY enrollment_count DESC
LIMIT 5;

-- Dashboard: Khóa học sắp bắt đầu
SELECT 
    cs.session_code,
    c.course_name,
    CONCAT(inst.first_name, ' ', inst.last_name) AS instructor_name,
    cs.start_date,
    DATEDIFF(cs.start_date, CURDATE()) AS days_until_start,
    cs.current_students,
    cs.max_students
FROM course_sessions cs
JOIN courses c ON cs.course_id = c.id
JOIN employees inst ON cs.instructor_id = inst.id
WHERE cs.status = 'Scheduled' 
  AND cs.start_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY cs.start_date;
