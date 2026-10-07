import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Teachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadTeachers() {
      try {
        const response = await api.get("/teachers");
        setTeachers(response.data.teachers);
      } catch (requestError) {
        setError(requestError.message || "Failed to load teachers.");
      } finally {
        setLoading(false);
      }
    }

    loadTeachers();
  }, []);

  async function handleDelete(teacher) {
    const confirmed = window.confirm(
      `Delete ${teacher.first_name} ${teacher.last_name}? This deletion is permanent.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(teacher.teacher_id);

    try {
      await api.delete(`/teachers/${teacher.teacher_id}`);
      const response = await api.get("/teachers");
      setTeachers(response.data.teachers);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete teacher.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Teachers</h2>
          <p>View teachers at your school.</p>
        </div>
        <button type="button" onClick={() => navigate("/teachers/new")}>
          Add Teacher
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="teachers-table-title">
        <div className="card-header">
          <div>
            <h3 id="teachers-table-title">Teacher Directory</h3>
            <p>Teacher records</p>
          </div>
        </div>

        {loading && <p>Loading teachers...</p>}

        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {!loading && !error && teachers.length === 0 && (
          <p>No teachers found.</p>
        )}

        {!loading && !error && teachers.length > 0 && (
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
                  <th style={headerCellStyle}>Staff number</th>
                  <th style={headerCellStyle}>Name</th>
                  <th style={headerCellStyle}>Email</th>
                  <th style={headerCellStyle}>Phone</th>
                  <th style={headerCellStyle}>Specialization</th>
                  <th style={headerCellStyle}>Employment status</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.teacher_id}>
                    <td style={bodyCellStyle}>{teacher.staff_number}</td>
                    <td style={bodyCellStyle}>
                      {teacher.first_name} {teacher.last_name}
                    </td>
                    <td style={bodyCellStyle}>{teacher.email || "-"}</td>
                    <td style={bodyCellStyle}>{teacher.phone || "-"}</td>
                    <td style={bodyCellStyle}>
                      {teacher.specialization || "-"}
                    </td>
                    <td style={bodyCellStyle}>
                      {teacher.employment_status}
                    </td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/teachers/${teacher.teacher_id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(teacher)}
                        disabled={deletingId === teacher.teacher_id}
                      >
                        {deletingId === teacher.teacher_id
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

export default Teachers;
