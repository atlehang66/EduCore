import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await api.get("/students");
        setStudents(response.data.students);
      } catch (requestError) {
        setError(requestError.message || "Failed to load students.");
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  async function handleDelete(student) {
    const confirmed = window.confirm(
      `Delete ${student.first_name} ${student.last_name}? This deletion is permanent.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(student.student_id);
    setLoading(true);

    try {
      await api.delete(`/students/${student.student_id}`);
      const response = await api.get("/students");
      setStudents(response.data.students);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete student.");
    } finally {
      setDeletingId(null);
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Students</h2>
          <p>View students enrolled at your school.</p>
        </div>
        <button type="button" onClick={() => navigate("/students/new")}>
          Add Student
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="students-table-title">
        <div className="card-header">
          <div>
            <h3 id="students-table-title">Student Directory</h3>
            <p>Student records</p>
          </div>
        </div>

        {loading && <p>Loading students...</p>}

        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {!loading && !error && students.length === 0 && (
          <p>No students found.</p>
        )}

        {!loading && !error && students.length > 0 && (
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
                  <th style={headerCellStyle}>Student number</th>
                  <th style={headerCellStyle}>Name</th>
                  <th style={headerCellStyle}>Date of birth</th>
                  <th style={headerCellStyle}>Gender</th>
                  <th style={headerCellStyle}>Grade</th>
                  <th style={headerCellStyle}>Status</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td style={bodyCellStyle}>{student.student_number}</td>
                    <td style={bodyCellStyle}>
                      {student.first_name} {student.last_name}
                    </td>
                    <td style={bodyCellStyle}>{student.date_of_birth}</td>
                    <td style={bodyCellStyle}>{student.gender || "-"}</td>
                    <td style={bodyCellStyle}>
                      {student.current_grade_id || "-"}
                    </td>
                    <td style={bodyCellStyle}>{student.status}</td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() => navigate(`/students/${student.student_id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(student)}
                        disabled={deletingId === student.student_id}
                      >
                        {deletingId === student.student_id
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

export default Students;
