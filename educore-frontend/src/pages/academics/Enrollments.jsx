import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Enrollments() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadEnrollmentData() {
      setLoading(true);
      setError("");

      try {
        const [enrollmentsResponse, studentsResponse, classesResponse, yearsResponse] =
          await Promise.all([
            api.get("/enrollments"),
            api.get("/students"),
            api.get("/classes"),
            api.get("/academic-years"),
          ]);

        setEnrollments(enrollmentsResponse.data.enrollments);
        setStudents(studentsResponse.data.students);
        setClasses(classesResponse.data.classes);
        setAcademicYears(yearsResponse.data.academicYears);
      } catch (requestError) {
        setError(requestError.message || "Failed to load enrollments.");
      } finally {
        setLoading(false);
      }
    }

    loadEnrollmentData();
  }, []);

  async function handleDelete(enrollment) {
    const confirmed = window.confirm(
      "Delete this enrollment? This deletion is permanent."
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(enrollment.enrollment_id);

    try {
      await api.delete(`/enrollments/${enrollment.enrollment_id}`);
      const response = await api.get("/enrollments");
      setEnrollments(response.data.enrollments);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete enrollment.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Enrollments</h2>
          <p>Manage student enrollment records.</p>
        </div>
        <button type="button" onClick={() => navigate("/enrollments/new")}>
          Add Enrollment
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="enrollments-table-title">
        <div className="card-header">
          <div>
            <h3 id="enrollments-table-title">Enrollment Directory</h3>
            <p>Student, class, and academic year assignments</p>
          </div>
        </div>

        {loading && <p>Loading enrollments...</p>}

        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {!loading && !error && enrollments.length === 0 && (
          <p>No enrollments found.</p>
        )}

        {!loading && !error && enrollments.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr>
                  <th style={headerCellStyle}>Student</th>
                  <th style={headerCellStyle}>Class</th>
                  <th style={headerCellStyle}>Academic year</th>
                  <th style={headerCellStyle}>Enrollment date</th>
                  <th style={headerCellStyle}>Status</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.enrollment_id}>
                    <td style={bodyCellStyle}>
                      {getStudentName(students, enrollment.student_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {getClassName(classes, enrollment.class_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {getAcademicYearName(
                        academicYears,
                        enrollment.academic_year_id
                      )}
                    </td>
                    <td style={bodyCellStyle}>{enrollment.enrollment_date}</td>
                    <td style={bodyCellStyle}>{enrollment.status}</td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/enrollments/${enrollment.enrollment_id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(enrollment)}
                        disabled={deletingId === enrollment.enrollment_id}
                      >
                        {deletingId === enrollment.enrollment_id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function getStudentName(students, studentId) {
  const student = students.find(
    (item) => String(item.student_id) === String(studentId)
  );

  return student ? `${student.first_name} ${student.last_name}` : studentId;
}

function getClassName(classes, classId) {
  const classRecord = classes.find(
    (item) => String(item.class_id) === String(classId)
  );

  return classRecord?.name || classId;
}

function getAcademicYearName(academicYears, academicYearId) {
  const academicYear = academicYears.find(
    (item) => String(item.academic_year_id) === String(academicYearId)
  );

  return academicYear?.name || academicYearId;
}

const headerCellStyle = {
  padding: "12px 10px",
  borderBottom: "1px solid #e5e7eb",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
};

const bodyCellStyle = {
  padding: "14px 10px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: "14px",
};

export default Enrollments;
