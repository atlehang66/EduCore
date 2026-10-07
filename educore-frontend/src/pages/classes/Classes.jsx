import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Classes() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadClasses() {
      try {
        const response = await api.get("/classes");
        setClasses(response.data.classes);
      } catch (requestError) {
        setError(requestError.message || "Failed to load classes.");
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, []);

  async function handleDelete(classRecord) {
    const confirmed = window.confirm(
      `Delete ${classRecord.name}? This deletion is permanent.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(classRecord.class_id);

    try {
      await api.delete(`/classes/${classRecord.class_id}`);
      const response = await api.get("/classes");
      setClasses(response.data.classes);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete class.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Classes</h2>
          <p>View classes at your school.</p>
        </div>
        <button type="button" onClick={() => navigate("/classes/new")}>
          Add Class
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="classes-table-title">
        <div className="card-header">
          <div>
            <h3 id="classes-table-title">Class Directory</h3>
            <p>Class records</p>
          </div>
        </div>

        {loading && <p>Loading classes...</p>}

        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {!loading && !error && classes.length === 0 && (
          <p>No classes found.</p>
        )}

        {!loading && !error && classes.length > 0 && (
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
                  <th style={headerCellStyle}>Class name</th>
                  <th style={headerCellStyle}>Grade ID</th>
                  <th style={headerCellStyle}>Academic year ID</th>
                  <th style={headerCellStyle}>Homeroom teacher ID</th>
                  <th style={headerCellStyle}>Capacity</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classRecord) => (
                  <tr key={classRecord.class_id}>
                    <td style={bodyCellStyle}>{classRecord.name}</td>
                    <td style={bodyCellStyle}>{classRecord.grade_id}</td>
                    <td style={bodyCellStyle}>
                      {classRecord.academic_year_id}
                    </td>
                    <td style={bodyCellStyle}>
                      {classRecord.homeroom_teacher_id ?? "-"}
                    </td>
                    <td style={bodyCellStyle}>
                      {classRecord.capacity ?? "-"}
                    </td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/classes/${classRecord.class_id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(classRecord)}
                        disabled={deletingId === classRecord.class_id}
                      >
                        {deletingId === classRecord.class_id
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

export default Classes;
