import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import Students from "../pages/students/Students";
import Teachers from "../pages/teachers/Teachers";
import Classes from "../pages/classes/Classes";
import Subjects from "../pages/subjects/Subjects";
import ClassSubjectTeachers from "../pages/assignments/ClassSubjectTeachers";
import AcademicYears from "../pages/academics/AcademicYears";
import AcademicYearForm from "../pages/academics/AcademicYearForm";
import Terms from "../pages/academics/Terms";
import TermForm from "../pages/academics/TermForm";
import Enrollments from "../pages/academics/Enrollments";
import EnrollmentForm from "../pages/academics/EnrollmentForm";
import Exams from "../pages/exams/Exams";
import ExamForm from "../pages/exams/ExamForm";
import Marks from "../pages/marks/Marks";
import MarkForm from "../pages/marks/MarkForm";
import ReportCards from "../pages/reportCards/ReportCards";
import ReportCardForm from "../pages/reportCards/ReportCardForm";
import AttendanceSessions from "../pages/attendance/AttendanceSessions";
import AttendanceSessionForm from "../pages/attendance/AttendanceSessionForm";
import Attendance from "../pages/attendance/Attendance";
import AttendanceForm from "../pages/attendance/AttendanceForm";
import SubjectForm from "../pages/subjects/SubjectForm";
import ClassForm from "../pages/classes/ClassForm";
import TeacherForm from "../pages/teachers/TeacherForm";
import StudentForm from "../pages/students/StudentForm";
import Login from "../pages/auth/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/academic-years" element={<AcademicYears />} />
            <Route path="/enrollments" element={<Enrollments />} />
            <Route path="/enrollments/new" element={<EnrollmentForm />} />
            <Route path="/enrollments/:id/edit" element={<EnrollmentForm />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/exams/new" element={<ExamForm />} />
            <Route path="/exams/:id/edit" element={<ExamForm />} />
            <Route path="/marks" element={<Marks />} />
            <Route path="/marks/new" element={<MarkForm />} />
            <Route path="/marks/:id/edit" element={<MarkForm />} />
            <Route path="/report-cards" element={<ReportCards />} />
            <Route path="/report-cards/new" element={<ReportCardForm />} />
            <Route path="/report-cards/:id/edit" element={<ReportCardForm />} />
            <Route path="/attendance-sessions" element={<AttendanceSessions />} />
            <Route
              path="/attendance-sessions/new"
              element={<AttendanceSessionForm />}
            />
            <Route
              path="/attendance-sessions/:id/edit"
              element={<AttendanceSessionForm />}
            />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/attendance/new" element={<AttendanceForm />} />
            <Route path="/attendance/:id/edit" element={<AttendanceForm />} />
            <Route path="/academic-years/new" element={<AcademicYearForm />} />
            <Route
              path="/academic-years/:id/edit"
              element={<AcademicYearForm />}
            />
            <Route
              path="/academic-years/:academicYearId/terms"
              element={<Terms />}
            />
            <Route
              path="/academic-years/:academicYearId/terms/new"
              element={<TermForm />}
            />
            <Route
              path="/academic-years/:academicYearId/terms/:id/edit"
              element={<TermForm />}
            />
            <Route
              path="/class-subject-teachers"
              element={<ClassSubjectTeachers />}
            />
            <Route path="/subjects/new" element={<SubjectForm />} />
            <Route path="/subjects/:id/edit" element={<SubjectForm />} />
            <Route path="/academics" element={<Navigate to="/classes" replace />} />
            <Route path="/classes/new" element={<ClassForm />} />
            <Route path="/classes/:id/edit" element={<ClassForm />} />
            <Route path="/teachers/new" element={<TeacherForm />} />
            <Route path="/teachers/:id/edit" element={<TeacherForm />} />
            <Route path="/students/new" element={<StudentForm />} />
            <Route path="/students/:id/edit" element={<StudentForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;