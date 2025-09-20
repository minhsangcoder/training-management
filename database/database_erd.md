# Entity Relationship Diagram (ERD)

## Cấu trúc Cơ sở Dữ liệu Quản lý Đào tạo

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                DEPARTMENTS                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK)                    │ INT AUTO_INCREMENT                               │
│ department_code (UK)       │ VARCHAR(20)                                      │
│ department_name            │ VARCHAR(100)                                     │
│ description                │ TEXT                                             │
│ parent_department_id (FK)  │ INT → departments.id                             │
│ manager_id (FK)            │ INT → employees.id                               │
│ created_at                 │ TIMESTAMP                                        │
│ updated_at                 │ TIMESTAMP                                        │
│ is_active                  │ BOOLEAN                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                POSITIONS                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK)                    │ INT AUTO_INCREMENT                               │
│ position_code (UK)         │ VARCHAR(20)                                      │
│ position_name              │ VARCHAR(100)                                     │
│ level                      │ INT                                              │
│ description                │ TEXT                                             │
│ department_id (FK)         │ INT → departments.id                             │
│ created_at                 │ TIMESTAMP                                        │
│ updated_at                 │ TIMESTAMP                                        │
│ is_active                  │ BOOLEAN                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               EMPLOYEES                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK)                    │ INT AUTO_INCREMENT                               │
│ employee_code (UK)         │ VARCHAR(20)                                      │
│ first_name                 │ VARCHAR(50)                                      │
│ last_name                  │ VARCHAR(50)                                      │
│ email (UK)                 │ VARCHAR(100)                                     │
│ phone                      │ VARCHAR(20)                                      │
│ address                    │ TEXT                                             │
│ date_of_birth              │ DATE                                             │
│ gender                     │ ENUM('Male','Female','Other')                    │
│ id_card (UK)               │ VARCHAR(20)                                      │
│ position_id (FK)           │ INT → positions.id                               │
│ department_id (FK)         │ INT → departments.id                             │
│ manager_id (FK)            │ INT → employees.id                               │
│ hire_date                  │ DATE                                             │
│ salary                     │ DECIMAL(12,2)                                    │
│ status                     │ ENUM('Active','Inactive','Terminated')           │
│ created_at                 │ TIMESTAMP                                        │
│ updated_at                 │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            COURSE_CATEGORIES                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK)                    │ INT AUTO_INCREMENT                               │
│ category_code (UK)         │ VARCHAR(20)                                      │
│ category_name              │ VARCHAR(100)                                     │
│ description                │ TEXT                                             │
│ created_at                 │ TIMESTAMP                                        │
│ updated_at                 │ TIMESTAMP                                        │
│ is_active                  │ BOOLEAN                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                COURSES                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK)                    │ INT AUTO_INCREMENT                               │
│ course_code (UK)           │ VARCHAR(20)                                      │
│ course_name                │ VARCHAR(200)                                     │
│ description                │ TEXT                                             │
│ category_id (FK)           │ INT → course_categories.id                       │
│ duration_hours             │ INT                                              │
│ credits                    │ INT                                              │
│ level                      │ ENUM('Beginner','Intermediate','Advanced')       │
│ prerequisites              │ TEXT                                             │
│ learning_objectives        │ TEXT                                             │
│ created_by (FK)            │ INT → employees.id                               │
│ created_at                 │ TIMESTAMP                                        │
│ updated_at                 │ TIMESTAMP                                        │
│ is_active                  │ BOOLEAN                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            COURSE_SESSIONS                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK)                    │ INT AUTO_INCREMENT                               │
│ session_code (UK)          │ VARCHAR(20)                                      │
│ course_id (FK)             │ INT → courses.id                                 │
│ instructor_id (FK)         │ INT → employees.id                               │
│ start_date                 │ DATE                                             │
│ end_date                   │ DATE                                             │
│ max_students               │ INT                                              │
│ current_students           │ INT                                              │
│ status                     │ ENUM('Scheduled','Ongoing','Completed','Cancelled')│
│ location                   │ VARCHAR(200)                                     │
│ notes                      │ TEXT                                             │
│ created_at                 │ TIMESTAMP                                        │
│ updated_at                 │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ENROLLMENTS                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK)                    │ INT AUTO_INCREMENT                               │
│ employee_id (FK)           │ INT → employees.id                               │
│ course_session_id (FK)     │ INT → course_sessions.id                         │
│ enrollment_date            │ TIMESTAMP                                        │
│ status                     │ ENUM('Enrolled','Completed','Dropped','Failed')  │
│ final_score                │ DECIMAL(5,2)                                     │
│ completion_date            │ TIMESTAMP                                        │
│ notes                      │ TEXT                                             │
│ created_at                 │ TIMESTAMP                                        │
│ updated_at                 │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 1:1
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           COURSE_EVALUATIONS                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK)                    │ INT AUTO_INCREMENT                               │
│ enrollment_id (FK)         │ INT → enrollments.id                             │
│ evaluation_date            │ TIMESTAMP                                        │
│ content_rating             │ INT (1-5)                                        │
│ instructor_rating          │ INT (1-5)                                        │
│ facility_rating            │ INT (1-5)                                        │
│ overall_rating             │ INT (1-5)                                        │
│ comments                   │ TEXT                                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AUDIT_LOGS                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ id (PK)                    │ INT AUTO_INCREMENT                               │
│ table_name                 │ VARCHAR(50)                                      │
│ record_id                  │ INT                                              │
│ action                     │ ENUM('INSERT','UPDATE','DELETE')                  │
│ old_values                 │ JSON                                             │
│ new_values                 │ JSON                                             │
│ changed_by (FK)            │ INT → employees.id                               │
│ changed_at                 │ TIMESTAMP                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Mối quan hệ chính:

1. **DEPARTMENTS** ↔ **POSITIONS** (1:N)
   - Một phòng ban có nhiều chức vụ
   - Một chức vụ thuộc về một phòng ban

2. **DEPARTMENTS** ↔ **EMPLOYEES** (1:N)
   - Một phòng ban có nhiều nhân viên
   - Một nhân viên thuộc về một phòng ban

3. **POSITIONS** ↔ **EMPLOYEES** (1:N)
   - Một chức vụ có nhiều nhân viên
   - Một nhân viên có một chức vụ

4. **EMPLOYEES** ↔ **EMPLOYEES** (1:N)
   - Một nhân viên có thể quản lý nhiều nhân viên khác
   - Một nhân viên có một quản lý trực tiếp

5. **COURSE_CATEGORIES** ↔ **COURSES** (1:N)
   - Một danh mục có nhiều học phần
   - Một học phần thuộc về một danh mục

6. **COURSES** ↔ **COURSE_SESSIONS** (1:N)
   - Một học phần có nhiều khóa học
   - Một khóa học thuộc về một học phần

7. **EMPLOYEES** ↔ **COURSE_SESSIONS** (1:N)
   - Một nhân viên có thể là giảng viên của nhiều khóa học
   - Một khóa học có một giảng viên

8. **EMPLOYEES** ↔ **ENROLLMENTS** (1:N)
   - Một nhân viên có thể đăng ký nhiều khóa học
   - Một đăng ký thuộc về một nhân viên

9. **COURSE_SESSIONS** ↔ **ENROLLMENTS** (1:N)
   - Một khóa học có nhiều đăng ký
   - Một đăng ký thuộc về một khóa học

10. **ENROLLMENTS** ↔ **COURSE_EVALUATIONS** (1:1)
    - Một đăng ký có một đánh giá
    - Một đánh giá thuộc về một đăng ký

## Các ràng buộc quan trọng:

- **Unique Constraints**: Đảm bảo tính duy nhất của mã phòng ban, mã nhân viên, mã học phần, email, CMND
- **Foreign Key Constraints**: Đảm bảo tính toàn vẹn dữ liệu
- **Check Constraints**: Đảm bảo giá trị hợp lệ (điểm từ 1-5, lương > 0)
- **Soft Delete**: Sử dụng trường `is_active` thay vì xóa thật
- **Audit Trail**: Ghi log mọi thay đổi dữ liệu
