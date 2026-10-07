import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        const response = await api.get("/subjects");
        setSubjects(response.data.subjects);
      } catch (requestError) {
        setError(requestError.message || "Failed to load subjects.");
      } finally {
        setLoading(false);
      }
    }

    loadSubjects();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Subjects</h2>
          <p>View subjects at your school.</p>
        </div>
        <button type="button" onClick={() => navigate("/subjects/new")}>
          Add Subject
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="subjects-table-title">
        <div className="card-header">
          <div>
            <h3 id="subjects-table-title">Subject Directory</h3>
            <p>Subject records</p>
          </div>
        </div>

        {loading && <p>Loading subjects...</p>}

        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {!loading && !error && subjects.length === 0 && (
          <p>No subjects found.</p>
        )}

        {!loading && !error && subjects.length > 0 && (
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
                  <th style={headerCellStyle}>Subject name</th>
                  <th style={headerCellStyle}>Code</th>
                  <th style={headerCellStyle}>Department</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.subject_id}>
                    <td style={bodyCellStyle}>{subject.name}</td>
                    <td style={bodyCellStyle}>{subject.code}</td>
                    <td style={bodyCellStyle}>{subject.department || "-"}</td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/subjects/${subject.subject_id}/edit`)
                        }
                      >
                        Edit
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

export default Subjects;
