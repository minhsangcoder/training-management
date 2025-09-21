# Hệ thống Quản lý Đào tạo

## Tổng quan

Hệ thống quản lý đào tạo được thiết kế để quản lý toàn diện các hoạt động đào tạo trong tổ chức, bao gồm:

- **Quản lý cơ cấu tổ chức**: Phòng ban, chức vụ
- **Quản lý nhân viên**: Thông tin nhân viên, phân quyền
- **Quản lý học phần**: Khóa học, đăng ký, đánh giá

## Cấu trúc Cơ sở Dữ liệu

### 1. Quản lý Cơ cấu Tổ chức

#### Bảng `departments` (Phòng ban)
- `id`: Khóa chính
- `department_code`: Mã phòng ban (duy nhất)
- `department_name`: Tên phòng ban
- `description`: Mô tả
- `parent_department_id`: Phòng ban cha (hierarchical)
- `manager_id`: Trưởng phòng
- `is_active`: Trạng thái hoạt động

#### Bảng `positions` (Chức vụ)
- `id`: Khóa chính
- `position_code`: Mã chức vụ (duy nhất)
- `position_name`: Tên chức vụ
- `level`: Cấp bậc
- `department_id`: Thuộc phòng ban
- `is_active`: Trạng thái hoạt động

### 2. Quản lý Nhân viên

#### Bảng `employees` (Nhân viên)
- `id`: Khóa chính
- `employee_code`: Mã nhân viên (duy nhất)
- `first_name`, `last_name`: Họ tên
- `email`: Email (duy nhất)
- `phone`: Số điện thoại
- `address`: Địa chỉ
- `date_of_birth`: Ngày sinh
- `gender`: Giới tính
- `id_card`: CMND/CCCD
- `position_id`: Chức vụ
- `department_id`: Phòng ban
- `manager_id`: Quản lý trực tiếp
- `hire_date`: Ngày vào làm
- `salary`: Lương
- `status`: Trạng thái (Active/Inactive/Terminated)

### 3. Quản lý Học phần

#### Bảng `course_categories` (Danh mục học phần)
- `id`: Khóa chính
- `category_code`: Mã danh mục
- `category_name`: Tên danh mục
- `description`: Mô tả
- `is_active`: Trạng thái hoạt động

#### Bảng `courses` (Học phần)
- `id`: Khóa chính
- `course_code`: Mã học phần (duy nhất)
- `course_name`: Tên học phần
- `description`: Mô tả
- `category_id`: Danh mục
- `duration_hours`: Số giờ học
- `credits`: Số tín chỉ
- `level`: Cấp độ (Beginner/Intermediate/Advanced)
- `prerequisites`: Điều kiện tiên quyết
- `learning_objectives`: Mục tiêu học tập
- `created_by`: Người tạo
- `is_active`: Trạng thái hoạt động

#### Bảng `course_sessions` (Khóa học/Lớp học)
- `id`: Khóa chính
- `session_code`: Mã khóa học
- `course_id`: Học phần
- `instructor_id`: Giảng viên
- `start_date`, `end_date`: Ngày bắt đầu/kết thúc
- `max_students`: Số học viên tối đa
- `current_students`: Số học viên hiện tại
- `status`: Trạng thái (Scheduled/Ongoing/Completed/Cancelled)
- `location`: Địa điểm học

#### Bảng `enrollments` (Đăng ký học phần)
- `id`: Khóa chính
- `employee_id`: Nhân viên
- `course_session_id`: Khóa học
- `enrollment_date`: Ngày đăng ký
- `status`: Trạng thái (Enrolled/Completed/Dropped/Failed)
- `final_score`: Điểm cuối khóa
- `completion_date`: Ngày hoàn thành

#### Bảng `course_evaluations` (Đánh giá học phần)
- `id`: Khóa chính
- `enrollment_id`: Đăng ký
- `evaluation_date`: Ngày đánh giá
- `content_rating`: Đánh giá nội dung (1-5)
- `instructor_rating`: Đánh giá giảng viên (1-5)
- `facility_rating`: Đánh giá cơ sở vật chất (1-5)
- `overall_rating`: Đánh giá tổng thể (1-5)
- `comments`: Nhận xét

### 4. Bảng Hỗ trợ

#### Bảng `audit_logs` (Ghi log thay đổi)
- Ghi lại mọi thay đổi dữ liệu để audit
- Hỗ trợ rollback và tracking

## Cài đặt và Sử dụng

### 1. Tạo Database

```sql
-- Chạy file database_schema.sql để tạo cấu trúc cơ sở dữ liệu
mysql -u username -p < database_schema.sql
```

### 2. Chạy Migrations

```sql
-- Chạy file migrations.sql để tạo stored procedures và triggers
mysql -u username -p training_management < migrations.sql
```

### 3. Sử dụng Stored Procedures

#### Quản lý Phòng ban

```sql
-- Thêm phòng ban mới
CALL sp_add_department('IT', 'Phòng Công nghệ thông tin', 'Mô tả phòng IT', NULL, 1, 1);

-- Cập nhật phòng ban
CALL sp_update_department(1, 'IT', 'Phòng Công nghệ thông tin', 'Mô tả mới', NULL, 2, 1);

-- Xóa phòng ban (soft delete)
CALL sp_delete_department(1, 1);
```

#### Quản lý Nhân viên

```sql
-- Thêm nhân viên mới
CALL sp_add_employee('EMP001', 'Nguyễn Văn', 'An', 'an.nguyen@company.com', 
                     '0123456789', '123 Đường ABC', '1990-01-01', 'Male', 
                     '123456789', 1, 1, NULL, '2023-01-15', 15000000, 1);

-- Cập nhật nhân viên
CALL sp_update_employee(1, 'EMP001', 'Nguyễn Văn', 'An', 'an.nguyen@company.com',
                        '0123456789', '123 Đường ABC', '1990-01-01', 'Male',
                        '123456789', 1, 1, NULL, '2023-01-15', 16000000, 'Active', 1);
```

#### Quản lý Học phần

```sql
-- Thêm học phần mới
CALL sp_add_course('JAVA101', 'Lập trình Java cơ bản', 'Mô tả khóa học Java',
                   1, 40, 3, 'Beginner', 'Không có', 'Học lập trình Java', 1);

-- Đăng ký học phần
CALL sp_enroll_course(1, 1, 1);
```

### 4. Sử dụng Views

```sql
-- Xem thông tin nhân viên chi tiết
SELECT * FROM v_employee_details;

-- Xem thông tin khóa học chi tiết
SELECT * FROM v_course_details;

-- Xem báo cáo đăng ký học phần
SELECT * FROM v_enrollment_report;
```

### 5. Chạy Báo cáo

```sql
-- Sử dụng các câu truy vấn trong file sample_queries.sql
-- Ví dụ: Thống kê nhân viên theo phòng ban
SELECT 
    d.department_name,
    COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
WHERE d.is_active = TRUE
GROUP BY d.id, d.department_name;
```

## Tính năng Chính

### 1. Quản lý Cơ cấu Tổ chức
- ✅ Thêm, sửa, xóa phòng ban
- ✅ Thêm, sửa, xóa chức vụ
- ✅ Hỗ trợ cấu trúc phòng ban phân cấp
- ✅ Quản lý trưởng phòng

### 2. Quản lý Nhân viên
- ✅ Thêm, sửa, xóa thông tin nhân viên
- ✅ Quản lý phân quyền và cấp bậc
- ✅ Theo dõi lịch sử làm việc
- ✅ Quản lý lương và phúc lợi

### 3. Quản lý Học phần
- ✅ Thêm, sửa, xóa học phần
- ✅ Quản lý danh mục học phần
- ✅ Tạo và quản lý khóa học
- ✅ Đăng ký học phần
- ✅ Đánh giá và chấm điểm
- ✅ Báo cáo thống kê

### 4. Tính năng Hỗ trợ
- ✅ Audit log cho mọi thay đổi
- ✅ Soft delete để bảo toàn dữ liệu
- ✅ Triggers tự động cập nhật
- ✅ Views cho báo cáo
- ✅ Stored procedures cho CRUD operations

## Báo cáo và Thống kê

### 1. Báo cáo Nhân viên
- Danh sách nhân viên theo phòng ban
- Thống kê lương và phúc lợi
- Báo cáo nhân viên sắp nghỉ hưu
- Phân tích hiệu suất làm việc

### 2. Báo cáo Đào tạo
- Báo cáo đăng ký học phần
- Thống kê hoàn thành khóa học
- Đánh giá chất lượng giảng dạy
- Báo cáo chi phí đào tạo

### 3. Dashboard
- Thống kê tổng quan
- Biểu đồ xu hướng
- Cảnh báo và thông báo
- Báo cáo real-time

## Bảo mật và Phân quyền

### 1. Audit Trail
- Ghi log mọi thay đổi dữ liệu
- Theo dõi người thực hiện thay đổi
- Hỗ trợ rollback dữ liệu

### 2. Data Integrity
- Foreign key constraints
- Check constraints cho validation
- Unique constraints cho dữ liệu quan trọng

### 3. Performance
- Indexes cho các trường thường xuyên truy vấn
- Views cho báo cáo phức tạp
- Stored procedures cho tối ưu hóa

## Mở rộng và Tùy chỉnh

### 1. Thêm Bảng Mới
- Thêm bảng cho các chức năng mở rộng
- Cập nhật foreign key relationships
- Thêm triggers và stored procedures

### 2. Tùy chỉnh Báo cáo
- Tạo views mới cho báo cáo
- Thêm stored procedures cho logic phức tạp
- Tùy chỉnh dashboard

### 3. Tích hợp API
- Tạo REST API endpoints
- Hỗ trợ JSON responses
- Authentication và authorization

## Hỗ trợ và Liên hệ

Để được hỗ trợ về hệ thống, vui lòng liên hệ:
- Email: support@company.com
- Phone: 0123456789
- Documentation: [Link to docs]

## License

Copyright © 2024. All rights reserved.
