// server/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, DataTypes } from "sequelize";

const app = express();
const PORT = 8000;

// =======================
// Middleware
// =======================
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
}));
app.use(bodyParser.json());

// =======================
// Database Connection
// =======================
const sequelize = new Sequelize("training_management", "root", "123456", {
  host: "127.0.0.1",
  dialect: "mysql",
  port: 3306,
});

try {
  await sequelize.authenticate();
  console.log("✅ Kết nối MySQL thành công!");
} catch (error) {
  console.error("❌ Lỗi kết nối MySQL:", error);
}

// =======================
// Models
// =======================
const Department = sequelize.define("Department", {
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
}, { tableName: "departments", timestamps: true });

const Position = sequelize.define("Position", {
  title: { type: DataTypes.STRING, allowNull: false },
}, { tableName: "positions", timestamps: true });

const Employee = sequelize.define("Employee", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  phone: { type: DataTypes.STRING },
}, { tableName: "employees", timestamps: true });

const CourseCategory = sequelize.define("CourseCategory", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
}, { tableName: "course_categories", timestamps: true });

const Course = sequelize.define("Course", {
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
}, { tableName: "courses", timestamps: true });

const CourseSession = sequelize.define("CourseSession", {
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
}, { tableName: "course_sessions", timestamps: true });

const Enrollment = sequelize.define("Enrollment", {
  status: { type: DataTypes.STRING, defaultValue: "pending" },
}, { tableName: "enrollments", timestamps: true });

// =======================
// Associations
// =======================
Department.hasMany(Position);
Position.belongsTo(Department);

Department.hasMany(Employee);
Employee.belongsTo(Department);

Position.hasMany(Employee);
Employee.belongsTo(Position);

CourseCategory.hasMany(Course);
Course.belongsTo(CourseCategory);

Course.hasMany(CourseSession);
CourseSession.belongsTo(Course);

Employee.hasMany(Enrollment);
Enrollment.belongsTo(Employee);

CourseSession.hasMany(Enrollment);
Enrollment.belongsTo(CourseSession);

// Sync DB
await sequelize.sync({ alter: true });

// =======================
// API Routes
// =======================

// ---- Departments ----
app.get("/api/departments", async (req, res) => {
  res.json(await Department.findAll());
});
app.get("/api/departments/:id", async (req, res) => {
  const dep = await Department.findByPk(req.params.id);
  dep ? res.json(dep) : res.status(404).json({ error: "Not found" });
});
app.post("/api/departments", async (req, res) => {
  try {
    res.status(201).json(await Department.create(req.body));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.put("/api/departments/:id", async (req, res) => {
  const dep = await Department.findByPk(req.params.id);
  if (!dep) return res.status(404).json({ error: "Not found" });
  await dep.update(req.body);
  res.json(dep);
});
app.delete("/api/departments/:id", async (req, res) => {
  const dep = await Department.findByPk(req.params.id);
  if (!dep) return res.status(404).json({ error: "Not found" });
  await dep.destroy();
  res.json({ message: "Deleted" });
});

// ---- Positions ----
app.get("/api/positions", async (req, res) => {
  res.json(await Position.findAll({ include: Department }));
});
app.post("/api/positions", async (req, res) => {
  res.status(201).json(await Position.create(req.body));
});
app.put("/api/positions/:id", async (req, res) => {
  const pos = await Position.findByPk(req.params.id);
  if (!pos) return res.status(404).json({ error: "Not found" });
  await pos.update(req.body);
  res.json(pos);
});
app.delete("/api/positions/:id", async (req, res) => {
  const pos = await Position.findByPk(req.params.id);
  if (!pos) return res.status(404).json({ error: "Not found" });
  await pos.destroy();
  res.json({ message: "Deleted" });
});

// ---- Employees ----
app.get("/api/employees", async (req, res) => {
  res.json(await Employee.findAll({ include: [Department, Position] }));
});
app.get("/api/employees/:id", async (req, res) => {
  const emp = await Employee.findByPk(req.params.id, { include: [Department, Position] });
  emp ? res.json(emp) : res.status(404).json({ error: "Not found" });
});
app.post("/api/employees", async (req, res) => {
  res.status(201).json(await Employee.create(req.body));
});
app.put("/api/employees/:id", async (req, res) => {
  const emp = await Employee.findByPk(req.params.id);
  if (!emp) return res.status(404).json({ error: "Not found" });
  await emp.update(req.body);
  res.json(emp);
});
app.delete("/api/employees/:id", async (req, res) => {
  const emp = await Employee.findByPk(req.params.id);
  if (!emp) return res.status(404).json({ error: "Not found" });
  await emp.destroy();
  res.json({ message: "Deleted" });
});

// ---- Courses ----
app.get("/api/course-categories", async (req, res) => {
  res.json(await CourseCategory.findAll());
});
app.post("/api/course-categories", async (req, res) => {
  res.status(201).json(await CourseCategory.create(req.body));
});
app.put("/api/course-categories/:id", async (req, res) => {
  const cat = await CourseCategory.findByPk(req.params.id);
  if (!cat) return res.status(404).json({ error: "Not found" });
  await cat.update(req.body);
  res.json(cat);
});
app.delete("/api/course-categories/:id", async (req, res) => {
  const cat = await CourseCategory.findByPk(req.params.id);
  if (!cat) return res.status(404).json({ error: "Not found" });
  await cat.destroy();
  res.json({ message: "Deleted" });
});

app.get("/api/courses", async (req, res) => {
  res.json(await Course.findAll({ include: CourseCategory }));
});
app.post("/api/courses", async (req, res) => {
  res.status(201).json(await Course.create(req.body));
});
app.put("/api/courses/:id", async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ error: "Not found" });
  await course.update(req.body);
  res.json(course);
});
app.delete("/api/courses/:id", async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return res.status(404).json({ error: "Not found" });
  await course.destroy();
  res.json({ message: "Deleted" });
});

// ---- Course Sessions ----
app.get("/api/course-sessions", async (req, res) => {
  res.json(await CourseSession.findAll({ include: Course }));
});
app.post("/api/course-sessions", async (req, res) => {
  res.status(201).json(await CourseSession.create(req.body));
});
app.put("/api/course-sessions/:id", async (req, res) => {
  const session = await CourseSession.findByPk(req.params.id);
  if (!session) return res.status(404).json({ error: "Not found" });
  await session.update(req.body);
  res.json(session);
});
app.delete("/api/course-sessions/:id", async (req, res) => {
  const session = await CourseSession.findByPk(req.params.id);
  if (!session) return res.status(404).json({ error: "Not found" });
  await session.destroy();
  res.json({ message: "Deleted" });
});

// ---- Enrollments ----
app.get("/api/enrollments", async (req, res) => {
  res.json(await Enrollment.findAll({ include: [Employee, CourseSession] }));
});
app.post("/api/enrollments", async (req, res) => {
  res.status(201).json(await Enrollment.create(req.body));
});
app.put("/api/enrollments/:id", async (req, res) => {
  const enr = await Enrollment.findByPk(req.params.id);
  if (!enr) return res.status(404).json({ error: "Not found" });
  await enr.update(req.body);
  res.json(enr);
});

// ---- Dashboard ----
app.get("/api/dashboard/stats", async (req, res) => {
  const totalEmployees = await Employee.count();
  const totalDepartments = await Department.count();
  const totalCourses = await Course.count();
  const totalEnrollments = await Enrollment.count();
  res.json({ totalEmployees, totalDepartments, totalCourses, totalEnrollments });
});

app.get("/api/dashboard/top-courses", async (req, res) => {
  const top = await Enrollment.findAll({
    attributes: ["CourseSessionId", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
    include: [{ model: CourseSession, include: [Course] }],
    group: ["CourseSessionId"],
    order: [[sequelize.literal("count"), "DESC"]],
    limit: 5,
  });
  res.json(top);
});

// =======================
// Start server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
