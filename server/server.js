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
    "http://localhost:3002", // Additional port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${req.method}] ${req.url} - IP: ${req.ip || req.connection.remoteAddress}`);
  next();
});

// =======================
// Database Connection - MySQL Configuration
// =======================
const sequelize = new Sequelize("training_management", "root", "123456", {
  host: "127.0.0.1",          // ép dùng TCP thay vì socket
  port: 3306,
  dialect: "mysql",
  dialectOptions: {
    connectTimeout: 60000,    // timeout connect 60s
  },
  logging: (msg) => console.log(`[DB] ${msg}`),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  }
});





// Test database connection
async function testConnection() {
  try {
    console.log("[DB] Attempting to connect to MySQL database...")
    await sequelize.authenticate();
    console.log("✅ [DB] MySQL connection established successfully!");

    // await sequelize.sync({ force: true });
    const [results] = await sequelize.query("DESCRIBE course_categories;");
    console.log("📋 [DB] Fields in table course_categories:");



    return true;
  } catch (error) {
    console.error("❌ [DB] MySQL connection failed:", error.message);
    return false;
  }
}

// Load sample data if tables are empty
async function loadSampleData() {
  try {
    console.log("[DB] Checking for sample data...");

    // Check if we already have data
    const departmentCount = await Department.count();
    if (departmentCount > 0) {
      console.log("[DB] Sample data already exists, skipping...");
      return;
    }

    console.log("[DB] Loading sample data...");

    // Create course categories
    const courseCategories = await CourseCategory.bulkCreate([
      { category_code: 'TECH', category_name: 'Công nghệ thông tin', description: 'Các khóa học về công nghệ thông tin và lập trình' },
      { category_code: 'MANAGE', category_name: 'Quản lý', description: 'Các khóa học về kỹ năng quản lý và lãnh đạo' },
      { category_code: 'SOFT', category_name: 'Kỹ năng mềm', description: 'Các khóa học về kỹ năng giao tiếp và làm việc nhóm' },
      { category_code: 'LANG', category_name: 'Ngoại ngữ', description: 'Các khóa học về ngoại ngữ' }
    ]);

    // Create departments
    const departments = await Department.bulkCreate([
      { department_code: 'IT', department_name: 'Phòng Công nghệ thông tin', description: 'Phòng phụ trách về công nghệ thông tin' },
      { department_code: 'HR', department_name: 'Phòng Nhân sự', description: 'Phòng phụ trách về quản lý nhân sự' },
      { department_code: 'FIN', department_name: 'Phòng Tài chính', description: 'Phòng phụ trách về tài chính kế toán' },
      { department_code: 'MKT', department_name: 'Phòng Marketing', description: 'Phòng phụ trách về marketing và bán hàng' }
    ]);

    // Create positions
    const positions = await Position.bulkCreate([
      { position_code: 'DEV', position_name: 'Lập trình viên', level: 3, description: 'Phát triển phần mềm', department_id: 1 },
      { position_code: 'PM', position_name: 'Quản lý dự án', level: 4, description: 'Quản lý các dự án công nghệ', department_id: 1 },
      { position_code: 'HR_MGR', position_name: 'Trưởng phòng nhân sự', level: 5, description: 'Quản lý phòng nhân sự', department_id: 2 },
      { position_code: 'HR_SPEC', position_name: 'Chuyên viên nhân sự', level: 3, description: 'Chuyên viên phụ trách nhân sự', department_id: 2 },
      { position_code: 'ACCOUNTANT', position_name: 'Kế toán', level: 3, description: 'Kế toán viên', department_id: 3 },
      { position_code: 'MKT_MGR', position_name: 'Trưởng phòng marketing', level: 5, description: 'Quản lý phòng marketing', department_id: 4 }
    ]);

    // Create employees
    const employees = await Employee.bulkCreate([
      { employee_code: 'EMP001', first_name: 'Nguyễn Văn', last_name: 'An', email: 'an.nguyen@company.com', phone: '0123456789', position_id: 1, department_id: 1, hire_date: '2023-01-15', salary: 15000000 },
      { employee_code: 'EMP002', first_name: 'Trần Thị', last_name: 'Bình', email: 'binh.tran@company.com', phone: '0123456790', position_id: 2, department_id: 1, hire_date: '2022-06-01', salary: 20000000 },
      { employee_code: 'EMP003', first_name: 'Lê Văn', last_name: 'Cường', email: 'cuong.le@company.com', phone: '0123456791', position_id: 3, department_id: 2, hire_date: '2021-03-10', salary: 25000000 },
      { employee_code: 'EMP004', first_name: 'Phạm Thị', last_name: 'Dung', email: 'dung.pham@company.com', phone: '0123456792', position_id: 4, department_id: 2, hire_date: '2023-02-20', salary: 12000000 },
      { employee_code: 'EMP005', first_name: 'Hoàng Văn', last_name: 'Em', email: 'em.hoang@company.com', phone: '0123456793', position_id: 5, department_id: 3, hire_date: '2022-11-05', salary: 13000000 },
      { employee_code: 'EMP006', first_name: 'Vũ Thị', last_name: 'Phương', email: 'phuong.vu@company.com', phone: '0123456794', position_id: 6, department_id: 4, hire_date: '2021-08-15', salary: 22000000 }
    ]);

    // Update department managers
    await Department.update({ manager_id: 2 }, { where: { id: 1 } });
    await Department.update({ manager_id: 3 }, { where: { id: 2 } });
    await Department.update({ manager_id: 5 }, { where: { id: 3 } });
    await Department.update({ manager_id: 6 }, { where: { id: 4 } });

    console.log("✅ [DB] Sample data loaded successfully!");
  } catch (error) {
    console.error("❌ [DB] Failed to load sample data:", error.message);
  }
}

// =======================
// Models - ENHANCED WITH STATUS
// =======================
const Department = sequelize.define("Department", {
  department_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 20]
    }
  },
  department_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parent_department_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "departments",
  timestamps: true,
  underscored: true
});

const Position = sequelize.define("Position", {
  position_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  position_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "positions",
  timestamps: true,
  underscored: true
});

const Employee = sequelize.define("Employee", {
  employee_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  address: {
    type: DataTypes.TEXT
  },
  date_of_birth: {
    type: DataTypes.DATEONLY
  },
  gender: {
    type: DataTypes.STRING(10),
    defaultValue: 'Other'
  },
  id_card: {
    type: DataTypes.STRING(20),
    unique: true
  },
  position_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  manager_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  hire_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  salary: {
    type: DataTypes.DECIMAL(12, 2)
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Active'
  }
}, {
  tableName: "employees",
  timestamps: true,
  underscored: true
});

const CourseCategory = sequelize.define("CourseCategory", {
  category_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { notEmpty: true, len: [1, 20] },
  },

  // Tên danh mục (NOT NULL)
  category_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { notEmpty: true, len: [1, 255] },
  },

  // Mô tả
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // Trạng thái hoạt động (bảng của bạn dùng is_active BOOLEAN)
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "course_categories",
  timestamps: true,
  underscored: true
});

const Course = sequelize.define("Course", {
  course_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  course_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: DataTypes.TEXT,
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duration_hours: DataTypes.INTEGER,
  total_credits: DataTypes.INTEGER,
  level: {
    type: DataTypes.STRING(50),
    defaultValue: 'Beginner'
  },
  prerequisite_course_ids: DataTypes.TEXT,
  learning_objectives: DataTypes.TEXT,
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // status: {
  //   type: DataTypes.ENUM('draft', 'active', 'completed', 'cancelled'),
  //   defaultValue: 'draft'
  // }
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

CourseCategory.hasMany(Course, { foreignKey: 'category_id' });
Course.belongsTo(CourseCategory, { foreignKey: 'category_id', as: 'CourseCategory' });
Course.belongsTo(Employee, { foreignKey: 'created_by', as: 'CreatedBy' });

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
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [API Error] ${error.name}:`, error.message);

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
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [HEALTH] Health check requested`);

  res.json({
    success: true,
    message: "Server is running",
    timestamp,
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
    const { department_code, department_name, description, parent_department_id, manager_id, is_active = true } = req.body;

    console.log(req.body);

    if (!department_code || !department_name) {
      return res.status(400).json({
        error: "Mã phòng ban và tên phòng ban là bắt buộc"
      });
    }

    // Convert empty strings to null for integer fields
    const cleanParentDepartmentId = parent_department_id === '' ? null : parent_department_id;
    const cleanManagerId = manager_id === '' ? null : manager_id;

    const department = await Department.create({
      department_code,
      department_name,
      description,
      parent_department_id: cleanParentDepartmentId,
      manager_id: cleanManagerId,
      is_active
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

    // Convert empty strings to null for integer fields
    const updateData = { ...req.body };
    if (updateData.parent_department_id === '') {
      updateData.parent_department_id = null;
    }
    if (updateData.manager_id === '') {
      updateData.manager_id = null;
    }

    await department.update(updateData);
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
        attributes: ['id', 'department_name', 'department_code']
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
    const { position_code, position_name, level, description, department_id, is_active = true } = req.body;

    // Convert empty string to null for department_id
    const cleanDepartmentId = department_id === '' ? null : department_id;

    if (!position_code || !position_name || !cleanDepartmentId) {
      return res.status(400).json({
        error: "Mã chức vụ, tên chức vụ và phòng ban là bắt buộc"
      });
    }

    const position = await Position.create({
      position_code,
      position_name,
      level,
      description,
      department_id: cleanDepartmentId,
      is_active
    });

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

app.post("/api/courses", async (req, res) => {
  try {
    let {
      course_code, course_name, description, category_id,
      duration_hours, credits, level, prerequisites,
      learning_objectives, created_by, is_active = true
    } = req.body;

    if (!course_code || !course_name) {
      return res.status(400).json({ error: "Mã học phần và tên học phần là bắt buộc" });
    }

    // Nếu frontend gửi "" thì convert thành null
    if (category_id === "" || category_id === undefined) category_id = null;
    if (created_by === "" || created_by === undefined) created_by = null;

    const course = await Course.create({
      course_code,
      course_name,
      description,
      category_id,
      duration_hours,
      credits,
      level,
      prerequisites,
      learning_objectives,
      created_by,
      is_active
    });

    res.status(201).json(course);
  } catch (error) {
    handleError(res, error, "Không thể thêm học phần");
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: CourseCategory, as: "CourseCategory", required: false, attributes: ["id", "category_name"] },
        { model: Employee, as: "CreatedBy", required: false, attributes: ["id", "first_name", "last_name"] }
      ],
      order: [["created_at", "DESC"]]
    });
    res.json(courses);
  } catch (error) {
    handleError(res, error, "Không thể tải danh sách học phần");
  }
});

app.get("/api/course-categories", async (req, res) => {
  try {
    const categories = await CourseCategory.findAll({
      order: [["created_at", "DESC"]],
    });
    res.json(categories);
  } catch (error) {
    handleError(res, error, "Không thể tải danh sách danh mục học phần");
  }
});

// GET 1 course category by id
app.get("/api/course-categories/:id", async (req, res) => {
  try {
    const category = await CourseCategory.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Không tìm thấy danh mục học phần" });
    }
    res.json(category);
  } catch (error) {
    handleError(res, error, "Không thể tải thông tin danh mục học phần");
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
  console.log("[SERVER] Initializing server...")
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error("❌ [SERVER] Cannot start server due to database connection failure");
    process.exit(1);
  }

  try {
    // Sync database tables (this will create tables based on Sequelize models)
    console.log("[DB] Syncing database tables...");
    await sequelize.sync(); // { force: true } to drop & recreate tables
    console.log("✅ [DB] Database tables synced successfully");

    // Load sample data if tables are empty
    await loadSampleData();

    // Start server
    app.listen(PORT, () => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] 🚀 [SERVER] Server started successfully`);
      console.log(`[${timestamp}] 📍 [SERVER] Running at http://localhost:${PORT}`);
      console.log(`[${timestamp}] 📊 [API] Endpoints available at http://localhost:${PORT}/api/`);
      console.log(`[${timestamp}] 🔧 [HEALTH] Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ [SERVER] Server startup failed:", error.message);
    process.exit(1);
  }
}

// Start the server
initializeServer();