import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Dashboard", path: "/" },
  { label: "Students", path: "/students" },
  { label: "Teachers", path: "/teachers" },
  { label: "Academics", path: "/academics" },
  { label: "Academic Years", path: "/academic-years" },
  { label: "Enrollments", path: "/enrollments" },
  { label: "Attendance Sessions", path: "/attendance-sessions" },
  { label: "Attendance", path: "/attendance" },
  { label: "Exams", path: "/exams" },
  { label: "Marks", path: "/marks" },
  { label: "Report Cards", path: "/report-cards" },
  { label: "Subjects", path: "/subjects" },
  { label: "Class Assignments", path: "/class-subject-teachers" },
  { label: "Finance", path: "/finance" },
  { label: "Communications", path: "/communications" },
  { label: "Documents", path: "/documents" },
  { label: "Events", path: "/events" },
  { label: "Library", path: "/library" },
  { label: "Operations", path: "/operations" },
  { label: "Reports", path: "/reports" },
  { label: "Users", path: "/users" },
  { label: "Audit", path: "/audit" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>EduCore</h2>
        <span>School Management System</span>
      </div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;