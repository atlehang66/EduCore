require("./config/env");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const pool = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const gradeRoutes = require("./routes/grade.routes");
const classRoutes = require("./routes/class.routes");
const subjectRoutes = require("./routes/subject.routes");
const academicYearRoutes = require("./routes/academicYear.routes");
const termRoutes = require("./routes/term.routes");
const teacherRoutes = require("./routes/teacher.routes");
const parentRoutes = require("./routes/parent.routes");
const studentParentRoutes = require("./routes/studentParent.routes");
const staffRoutes = require("./routes/staff.routes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const attendanceSessionRoutes = require("./routes/attendanceSession.routes");
const examRoutes = require("./routes/exam.routes");
const marksRoutes = require("./routes/marks.routes");
const reportCardRoutes = require("./routes/reportCard.routes");
const classSubjectTeacherRoutes = require("./routes/classSubjectTeacher.routes");
const schoolRoutes = require("./routes/school.routes");
const settingRoutes = require("./routes/setting.routes");
const roleRoutes = require("./routes/role.routes");
const permissionRoutes = require("./routes/permission.routes");
const rolePermissionRoutes = require("./routes/rolePermission.routes");
const apiKeyRoutes = require("./routes/apiKey.routes");
const paymentMethodRoutes = require("./routes/paymentMethod.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const paymentRoutes = require("./routes/payment.routes");
const discountRoutes = require("./routes/discount.routes");
const assetRoutes = require("./routes/asset.routes");
const transportRoutes = require("./routes/transport.routes");
const studentTransportRoutes = require("./routes/studentTransport.routes");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/grades", gradeRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/academic-years", academicYearRoutes);
app.use("/api/v1/academic-years", termRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/parents", parentRoutes);
app.use("/api/v1", studentParentRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/assignments",assignmentRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/attendance-sessions", attendanceSessionRoutes);
app.use("/api/v1/exams", examRoutes);
app.use("/api/v1/marks", marksRoutes);
app.use("/api/v1/report-cards", reportCardRoutes);
app.use("/api/v1", classSubjectTeacherRoutes);
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/branding", require("./routes/branding.routes"));
app.use("/api/v1/settings", settingRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/permissions", permissionRoutes);
app.use("/api/v1/api-keys", apiKeyRoutes);
app.use("/api/v1/payment-methods", paymentMethodRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/discounts", discountRoutes);
app.use("/api/v1/assets", assetRoutes);
app.use("/api/v1/transports", transportRoutes);
app.use("/api/v1/student-transports", studentTransportRoutes);
app.use("/api/v1", rolePermissionRoutes);
const userRoleRoutes = require("./routes/userRole.routes");
app.use("/api/v1", userRoleRoutes);


// Health check
app.get("/api/v1/health", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT 1 AS database_connected"
        );

        res.status(200).json({
            success: true,
            message: "EduCore API is running",
            database: rows[0].database_connected === 1
        });

    } catch (error) {
        console.error("Database health check failed:", error);

        res.status(500).json({
            success: false,
            message: "API is running but database connection failed"
        });
    }
});

// Student routes
app.use("/api/v1/students", studentRoutes);

module.exports = app;