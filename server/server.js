// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'appuser', // thay bằng user MySQL của bạn
  password: '123456', // thay bằng mật khẩu MySQL
  database: 'training_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// =================== DEPARTMENTS ===================
app.get('/api/departments', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM departments');
  res.json(rows);
});

app.get('/api/departments/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM departments WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.post('/api/departments', async (req, res) => {
  const { departmentCode, departmentName, description } = req.body;
  await pool.query('INSERT INTO departments (department_code, department_name, description) VALUES (?, ?, ?)',
    [departmentCode, departmentName, description]);
  res.json({ message: 'Department created' });
});

app.put('/api/departments/:id', async (req, res) => {
  const { departmentName, description } = req.body;
  await pool.query('UPDATE departments SET department_name=?, description=? WHERE id=?',
    [departmentName, description, req.params.id]);
  res.json({ message: 'Department updated' });
});

app.delete('/api/departments/:id', async (req, res) => {
  await pool.query('DELETE FROM departments WHERE id=?', [req.params.id]);
  res.json({ message: 'Department deleted' });
});

// =================== POSITIONS ===================
app.get('/api/positions', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM positions');
  res.json(rows);
});

app.post('/api/positions', async (req, res) => {
  const { title, description } = req.body;
  await pool.query('INSERT INTO positions (title, description) VALUES (?, ?)', [title, description]);
  res.json({ message: 'Position created' });
});

app.put('/api/positions/:id', async (req, res) => {
  const { title, description } = req.body;
  await pool.query('UPDATE positions SET title=?, description=? WHERE id=?', [title, description, req.params.id]);
  res.json({ message: 'Position updated' });
});

app.delete('/api/positions/:id', async (req, res) => {
  await pool.query('DELETE FROM positions WHERE id=?', [req.params.id]);
  res.json({ message: 'Position deleted' });
});

// =================== EMPLOYEES ===================
app.get('/api/employees', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM employees');
  res.json(rows);
});

app.get('/api/employees/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM employees WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.post('/api/employees', async (req, res) => {
  const { firstName, lastName, email, phone, departmentId, positionId } = req.body;
  await pool.query(
    'INSERT INTO employees (first_name, last_name, email, phone, department_id, position_id) VALUES (?, ?, ?, ?, ?, ?)',
    [firstName, lastName, email, phone, departmentId, positionId]
  );
  res.json({ message: 'Employee created' });
});

app.put('/api/employees/:id', async (req, res) => {
  const { firstName, lastName, email, phone, departmentId, positionId } = req.body;
  await pool.query(
    'UPDATE employees SET first_name=?, last_name=?, email=?, phone=?, department_id=?, position_id=? WHERE id=?',
    [firstName, lastName, email, phone, departmentId, positionId, req.params.id]
  );
  res.json({ message: 'Employee updated' });
});

app.delete('/api/employees/:id', async (req, res) => {
  await pool.query('DELETE FROM employees WHERE id=?', [req.params.id]);
  res.json({ message: 'Employee deleted' });
});

// =================== COURSES + CATEGORIES + SESSIONS ===================
app.get('/api/course-categories', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM course_categories');
  res.json(rows);
});

app.post('/api/course-categories', async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO course_categories (name) VALUES (?)', [name]);
  res.json({ message: 'Category created' });
});

app.put('/api/course-categories/:id', async (req, res) => {
  const { name } = req.body;
  await pool.query('UPDATE course_categories SET name=? WHERE id=?', [name, req.params.id]);
  res.json({ message: 'Category updated' });
});

app.delete('/api/course-categories/:id', async (req, res) => {
  await pool.query('DELETE FROM course_categories WHERE id=?', [req.params.id]);
  res.json({ message: 'Category deleted' });
});

app.get('/api/courses', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM courses');
  res.json(rows);
});

app.get('/api/courses/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM courses WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.post('/api/courses', async (req, res) => {
  const { courseCode, courseName, description } = req.body;
  await pool.query('INSERT INTO courses (course_code, course_name, description) VALUES (?, ?, ?)',
    [courseCode, courseName, description]);
  res.json({ message: 'Course created' });
});

app.put('/api/courses/:id', async (req, res) => {
  const { courseName, description } = req.body;
  await pool.query('UPDATE courses SET course_name=?, description=? WHERE id=?',
    [courseName, description, req.params.id]);
  res.json({ message: 'Course updated' });
});

app.delete('/api/courses/:id', async (req, res) => {
  await pool.query('DELETE FROM courses WHERE id=?', [req.params.id]);
  res.json({ message: 'Course deleted' });
});

// Course sessions
app.get('/api/course-sessions', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM course_sessions');
  res.json(rows);
});

app.post('/api/course-sessions', async (req, res) => {
  const { courseId, startDate, endDate } = req.body;
  await pool.query('INSERT INTO course_sessions (course_id, start_date, end_date) VALUES (?, ?, ?)',
    [courseId, startDate, endDate]);
  res.json({ message: 'Course session created' });
});

app.put('/api/course-sessions/:id', async (req, res) => {
  const { startDate, endDate } = req.body;
  await pool.query('UPDATE course_sessions SET start_date=?, end_date=? WHERE id=?',
    [startDate, endDate, req.params.id]);
  res.json({ message: 'Course session updated' });
});

app.delete('/api/course-sessions/:id', async (req, res) => {
  await pool.query('DELETE FROM course_sessions WHERE id=?', [req.params.id]);
  res.json({ message: 'Course session deleted' });
});

// =================== ENROLLMENTS ===================
app.get('/api/enrollments', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM enrollments');
  res.json(rows);
});

app.post('/api/enrollments', async (req, res) => {
  const { employeeId, courseSessionId } = req.body;
  await pool.query('INSERT INTO enrollments (employee_id, course_session_id) VALUES (?, ?)',
    [employeeId, courseSessionId]);
  res.json({ message: 'Enrollment created' });
});

app.put('/api/enrollments/:id', async (req, res) => {
  const { status } = req.body;
  await pool.query('UPDATE enrollments SET status=? WHERE id=?', [status, req.params.id]);
  res.json({ message: 'Enrollment updated' });
});

// =================== DASHBOARD ===================
app.get('/api/dashboard/stats', async (req, res) => {
  const [[{ totalEmployees }]] = await pool.query('SELECT COUNT(*) AS totalEmployees FROM employees');
  const [[{ totalDepartments }]] = await pool.query('SELECT COUNT(*) AS totalDepartments FROM departments');
  const [[{ totalCourses }]] = await pool.query('SELECT COUNT(*) AS totalCourses FROM courses');
  res.json({ totalEmployees, totalDepartments, totalCourses });
});

app.get('/api/dashboard/enrollment-report', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT MONTH(created_at) AS month, COUNT(*) AS enrollments
    FROM enrollments
    GROUP BY MONTH(created_at)
  `);
  res.json(rows);
});

app.get('/api/dashboard/top-courses', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT c.course_name, COUNT(e.id) AS total
    FROM enrollments e
    JOIN course_sessions cs ON e.course_session_id = cs.id
    JOIN courses c ON cs.course_id = c.id
    GROUP BY c.id
    ORDER BY total DESC
    LIMIT 5
  `);
  res.json(rows);
});

app.get('/api/dashboard/upcoming-courses', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT c.course_name, cs.start_date
    FROM course_sessions cs
    JOIN courses c ON cs.course_id = c.id
    WHERE cs.start_date > NOW()
    ORDER BY cs.start_date ASC
    LIMIT 5
  `);
  res.json(rows);
});

// =================== START SERVER ===================
app.listen(8000, () => {
  console.log('✅ Server running at http://localhost:8000');
});
