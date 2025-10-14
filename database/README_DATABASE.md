# Training Management Database - Hướng dẫn sử dụng

## 📋 Tổng quan

Database **training_management** được thiết kế cho hệ thống quản lý đào tạo với các chức năng:
- Quản lý phòng ban, chức vụ, nhân viên
- Quản lý ngành học, khối kiến thức, cấu trúc chương trình đào tạo
- Quản lý khóa học, lớp học (cohorts)
- Quản lý đăng ký và theo dõi quá trình học tập

## 📁 Cấu trúc thư mục

```
database/
├── complete_database.sql          # File backup đầy đủ (DDL + Data)
├── full_database_backup.sql       # Backup tự động từ mysqldump
├── database_schema.sql            # Schema gốc
├── sample_data.sql                # Dữ liệu mẫu
├── sample_queries.sql             # Câu truy vấn mẫu
├── database_erd.md                # Sơ đồ ERD
└── README_DATABASE.md             # File này
```

## 🚀 Cách sử dụng

### 1. Import database đầy đủ (Khuyến nghị)

```bash
# Import file complete_database.sql (chứa cả DDL và Data)
mysql -uroot < database/complete_database.sql
```

File này sẽ:
- Xóa database cũ (nếu có)
- Tạo database mới
- Tạo tất cả các bảng
- Import toàn bộ dữ liệu mẫu

### 2. Import riêng lẻ

```bash
# Tạo database trống
mysql -uroot -e "CREATE DATABASE training_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import schema
mysql -uroot training_management < database/database_schema.sql

# Import dữ liệu mẫu
mysql -uroot training_management < database/sample_data.sql
```

### 3. Backup database

```bash
# Backup toàn bộ (DDL + Data)
mysqldump -uroot training_management --no-tablespaces --skip-comments --complete-insert > database/backup_$(date +%Y%m%d).sql

# Backup chỉ cấu trúc
mysqldump -uroot training_management --no-data --no-tablespaces > database/schema_only.sql

# Backup chỉ dữ liệu
mysqldump -uroot training_management --no-create-info --no-tablespaces > database/data_only.sql
```

## 📊 Cấu trúc Database

### Các bảng chính

1. **departments** - Phòng ban
2. **positions** - Chức vụ
3. **employees** - Nhân viên
4. **majors** - Ngành học
5. **knowledge_blocks** - Khối kiến thức
6. **curriculum_structures** - Cấu trúc chương trình đào tạo
7. **course_categories** - Danh mục khóa học
8. **courses** - Khóa học
9. **cohorts** - Lớp học
10. **course_sessions** - Buổi học
11. **enrollments** - Đăng ký học

### Mối quan hệ chính

```
departments (1) ---> (n) positions
departments (1) ---> (n) employees
departments (1) ---> (n) majors

employees (1) ---> (n) courses (created_by)
employees (1) ---> (n) cohorts (instructor_id)

majors (1) ---> (n) knowledge_blocks
majors (1) ---> (n) curriculum_structures

courses (1) ---> (n) cohorts
courses (1) ---> (n) course_sessions

course_sessions (1) ---> (n) enrollments
employees (1) ---> (n) enrollments
```

## 📈 Thống kê dữ liệu mẫu

- **Phòng ban**: 7
- **Chức vụ**: 20
- **Nhân viên**: 11
- **Ngành học**: 9
- **Khối kiến thức**: 6
- **Danh mục khóa học**: 6
- **Khóa học**: 17
- **Lớp học**: 8
- **Cấu trúc CTĐT**: 7

## 🔧 Lệnh MySQL hữu ích

```sql
-- Xem tất cả bảng
SHOW TABLES;

-- Xem cấu trúc bảng
DESCRIBE departments;

-- Đếm số bản ghi
SELECT COUNT(*) FROM employees;

-- Kiểm tra foreign keys
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_SCHEMA = 'training_management';

-- Xem kích thước database
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'training_management'
GROUP BY table_schema;
```

## 🔍 Truy vấn mẫu

Tham khảo file `sample_queries.sql` để xem các truy vấn mẫu:
- Liệt kê nhân viên theo phòng ban
- Thống kê khóa học theo danh mục
- Danh sách lớp học đang diễn ra
- Cấu trúc chương trình đào tạo theo ngành

## ⚠️ Lưu ý quan trọng

1. **Character Set**: Database sử dụng `utf8mb4_unicode_ci` để hỗ trợ tiếng Việt
2. **Foreign Keys**: Tất cả ràng buộc khóa ngoại đều được thiết lập
3. **Timestamps**: Các bảng có `created_at` và `updated_at` tự động
4. **Soft Delete**: Sử dụng cột `is_active` thay vì xóa thật

## 🔄 Đồng bộ với Backend

Backend sử dụng Sequelize ORM để tự động đồng bộ schema. Tuy nhiên nên:
1. Import database lần đầu bằng file SQL
2. Để Sequelize sync thêm các indexes/constraints nếu cần
3. Không dùng `force: true` trong production

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra MySQL server đã chạy: `mysql.server status`
2. Kiểm tra quyền user: `SHOW GRANTS FOR 'root'@'localhost';`
3. Xem logs: `tail -f /usr/local/var/mysql/*.err`

---

**Version**: 1.0  
**Last Updated**: 2025-10-13  
**Maintained by**: Training Management Team

