// server/server.js - FIXED VERSION
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Sequelize, DataTypes } from "sequelize";

const app = express();
const PORT = 8000;

// =======================
// Middleware - FIXED CORS
// =======================
app.use(cors({
  origin: [
    "http://localhost:3000", // Vite dev server default
    "http://localhost:3001", // Custom port nếu có
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// =======================
// Database Connection - IMPROVED ERROR HANDLING
// =======================
const sequelize = new Sequelize("training_management", "root", "123456", {
  host: "127.0.0.1",
  dialect: "mysql",
  port: 3306,
  logging: console.log, // Enable logging to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối MySQL thành công!");
    return true;
  } catch (error) {
    console.error("❌ Lỗi kết nối MySQL:", error);
    return false;
  }
}

// =======================
// Models - ENHANCED WITH STATUS
// =======================
const Department = sequelize.define("Department", {
  code: { 
    type: DataTypes.STRING(50), 
    allowNull: false, 
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  name: { 
    type: DataTypes.STRING(255), 
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  description: { 
    type: DataTypes.TEXT,
    allowNull: true 
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, { 
  tableName: "departments", 
  timestamps: true,
  underscored: true // Use snake_case for timestamps
});

const Position = sequelize.define("Position", {
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  title: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, { 
  tableName: "positions", 
  timestamps: true,
  underscored: true
});

const Employee = sequelize.define("Employee", {
  employee_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(255), 
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: { 
    type: DataTypes.STRING(20) 
  },
  hire_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'terminated'),
    defaultValue: 'active'
  }
}, { 
  tableName: "employees", 
  timestamps: true,
  underscored: true
});

const CourseCategory = sequelize.define("CourseCategory", {
  name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, { 
  tableName: "course_categories", 
  timestamps: true,
  underscored: true
});

const Course = sequelize.define("Course", {
  code: { 
    type: DataTypes.STRING(50), 
    allowNull: false, 
    unique: true 
  },
  name: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  duration_hours: {
    type: DataTypes.INTEGER
  },
  instructor: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'completed', 'cancelled'),
    defaultValue: 'draft'
  }
}, { 
  tableName: "courses", 
  timestamps: true,
  underscored: true
});

const CourseSession = sequelize.define("CourseSession", {
  start_date: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  end_date: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  max_participants: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  }
}, { 
  tableName: "course_sessions", 
  timestamps: true,
  underscored: true
});

const Enrollment = sequelize.define("Enrollment", {
  status: { 
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'), 
    defaultValue: "pending" 
  },
  enrolled_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, { 
  tableName: "enrollments", 
  timestamps: true,
  underscored: true
});

// =======================
// Associations
// =======================
Department.hasMany(Position, { foreignKey: 'department_id' });
Position.belongsTo(Department, { foreignKey: 'department_id' });

Department.hasMany(Employee, { foreignKey: 'department_id' });
Employee.belongsTo(Department, { foreignKey: 'department_id' });

Position.hasMany(Employee, { foreignKey: 'position_id' });
Employee.belongsTo(Position, { foreignKey: 'position_id' });

CourseCategory.hasMany(Course, { foreignKey: 'course_category_id' });
Course.belongsTo(CourseCategory, { foreignKey: 'course_category_id' });

Course.hasMany(CourseSession, { foreignKey: 'course_id' });
CourseSession.belongsTo(Course, { foreignKey: 'course_id' });

Employee.hasMany(Enrollment, { foreignKey: 'employee_id' });
Enrollment.belongsTo(Employee, { foreignKey: 'employee_id' });

CourseSession.hasMany(Enrollment, { foreignKey: 'course_session_id' });
Enrollment.belongsTo(CourseSession, { foreignKey: 'course_session_id' });

// =======================
// Helper function to handle errors
// =======================
const handleError = (res, error, defaultMessage = "Internal server error") => {
  console.error("API Error:", error);
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: error.errors.map(e => e.message).join(', ')
    });
  }
  
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: "Dữ liệu đã tồn tại"
    });
  }
  
  res.status(500).json({
    error: error.message || defaultMessage
  });
};

// =======================
// API Routes - ENHANCED WITH BETTER ERROR HANDLING
// =======================

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    database: sequelize.connectionManager.pool ? "connected" : "disconnected"
  });
});

// ---- Departments ----
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await Department.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json(departments);
  } catch (error) {
    handleError(res, error, "Không thể tải danh sách phòng ban");
  }
});

app.get("/api/departments/:id", async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ error: "Không tìm thấy phòng ban" });
    }
    res.json(department);
  } catch (error) {
    handleError(res, error, "Không thể tải thông tin phòng ban");
  }
});

app.post("/api/departments", async (req, res) => {
  try {
    const { code, name, description, status = 'active' } = req.body;
    
    if (!code || !name) {
      return res.status(400).json({
        error: "Mã phòng ban và tên phòng ban là bắt buộc"
      });
    }

    const department = await Department.create({
      code,
      name,
      description,
      status
    });
    
    res.status(201).json(department);
  } catch (error) {
    handleError(res, error, "Không thể thêm phòng ban");
  }
});

app.put("/api/departments/:id", async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ error: "Không tìm thấy phòng ban" });
    }
    
    await department.update(req.body);
    res.json(department);
  } catch (error) {
    handleError(res, error, "Không thể cập nhật phòng ban");
  }
});

app.delete("/api/departments/:id", async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) {
      return res.status(404).json({ error: "Không tìm thấy phòng ban" });
    }
    
    // Check if department has employees
    const employeeCount = await Employee.count({
      where: { department_id: req.params.id }
    });
    
    if (employeeCount > 0) {
      return res.status(400).json({
        error: "Không thể xóa phòng ban có nhân viên"
      });
    }
    
    await department.destroy();
    res.json({ message: "Xóa phòng ban thành công" });
  } catch (error) {
    handleError(res, error, "Không thể xóa phòng ban");
  }
});

// ---- Positions ---- (Similar pattern for other endpoints)
app.get("/api/positions", async (req, res) => {
  try {
    const positions = await Position.findAll({
      include: [{
        model: Department,
        attributes: ['id', 'name', 'code']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(positions);
  } catch (error) {
    handleError(res, error, "Không thể tải danh sách chức vụ");
  }
});

app.post("/api/positions", async (req, res) => {
  try {
    const position = await Position.create(req.body);
    res.status(201).json(position);
  } catch (error) {
    handleError(res, error, "Không thể thêm chức vụ");
  }
});

app.put("/api/positions/:id", async (req, res) => {
  try {
    const position = await Position.findByPk(req.params.id);
    if (!position) {
      return res.status(404).json({ error: "Không tìm thấy chức vụ" });
    }
    await position.update(req.body);
    res.json(position);
  } catch (error) {
    handleError(res, error, "Không thể cập nhật chức vụ");
  }
});

app.delete("/api/positions/:id", async (req, res) => {
  try {
    const position = await Position.findByPk(req.params.id);
    if (!position) {
      return res.status(404).json({ error: "Không tìm thấy chức vụ" });
    }
    await position.destroy();
    res.json({ message: "Xóa chức vụ thành công" });
  } catch (error) {
    handleError(res, error, "Không thể xóa chức vụ");
  }
});

// Continue with other routes (employees, courses, etc.) following same pattern...
// [Previous routes remain the same but with enhanced error handling]

// ---- Dashboard ----
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const [totalEmployees, totalDepartments, totalCourses, totalEnrollments] = await Promise.all([
      Employee.count(),
      Department.count(),
      Course.count(),
      Enrollment.count()
    ]);
    
    res.json({ 
      totalEmployees, 
      totalDepartments, 
      totalCourses, 
      totalEnrollments 
    });
  } catch (error) {
    handleError(res, error, "Không thể tải thống kê dashboard");
  }
});

// =======================
// Initialize and start server
// =======================
async function initializeServer() {
  // Test database connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error("❌ Không thể khởi động server do lỗi database");
    process.exit(1);
  }

  try {
    // Sync database
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables synced successfully");
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
      console.log(`📊 API endpoints: http://localhost:${PORT}/api/`);
      console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Lỗi khởi động server:", error);
    process.exit(1);
  }
}

// Thêm vào cuối file server.js, trước app.listen()
app.put("/api/positions/:id", async (req, res) => {
  try {
    const position = await Position.findByPk(req.params.id);
    if (!position) {
      return res.status(404).json({ error: "Không tìm thấy chức vụ" });
    }
    await position.update(req.body);
    res.json(position);
  } catch (error) {
    handleError(res, error, "Không thể cập nhật chức vụ");
  }
});

app.delete("/api/positions/:id", async (req, res) => {
  try {
    const position = await Position.findByPk(req.params.id);
    if (!position) {
      return res.status(404).json({ error: "Không tìm thấy chức vụ" });
    }
    await position.destroy();
    res.json({ message: "Xóa chức vụ thành công" });
  } catch (error) {
    handleError(res, error, "Không thể xóa chức vụ");
  }
});

// Start the server
initializeServer();