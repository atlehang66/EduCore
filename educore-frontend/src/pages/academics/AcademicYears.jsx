import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AcademicYears() {
  const navigate = useNavigate();
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadAcademicYears() {
      try {
        const response = await api.get("/academic-years");
        setAcademicYears(response.data.academicYears);
      } catch (requestError) {
        setError(requestError.message || "Failed to load academic years.");
      } finally {
        setLoading(false);
      }
    }

    loadAcademicYears();
  }, []);

  async function handleDelete(academicYear) {
    const confirmed = window.confirm(
      `Delete ${academicYear.name}? This deletion is permanent.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(academicYear.academic_year_id);

    try {
      await api.delete(`/academic-years/${academicYear.academic_year_id}`);
      const response = await api.get("/academic-years");
      setAcademicYears(response.data.academicYears);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete academic year.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Academic Years</h2>
          <p>Manage academic years and their terms.</p>
        </div>
        <button type="button" onClick={() => navigate("/academic-years/new")}>
          Add Academic Year
        </button>
      </div>

      <section
        className="dashboard-card"
        aria-labelledby="academic-years-table-title"
      >
        <div className="card-header">
          <div>
            <h3 id="academic-years-table-title">Academic Year Directory</h3>
            <p>Academic year records</p>
          </div>
        </div>

        {loading && <p>Loading academic years...</p>}

        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {!loading && !error && academicYears.length === 0 && (
          <p>No academic years found.</p>
        )}

        {!loading && !error && academicYears.length > 0 && (
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
                  <th style={headerCellStyle}>Name</th>
                  <th style={headerCellStyle}>Start date</th>
                  <th style={headerCellStyle}>End date</th>
                  <th style={headerCellStyle}>Current</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {academicYears.map((academicYear) => (
                  <tr key={academicYear.academic_year_id}>
                    <td style={bodyCellStyle}>{academicYear.name}</td>
                    <td style={bodyCellStyle}>{academicYear.start_date}</td>
                    <td style={bodyCellStyle}>{academicYear.end_date}</td>
                    <td style={bodyCellStyle}>
                      <span style={academicYear.is_current ? currentStyle : inactiveStyle}>
                        {academicYear.is_current ? "Current year" : "Not current"}
                      </span>
                    </td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/academic-years/${academicYear.academic_year_id}/terms`
                          )
                        }
                      >
                        Terms
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/academic-years/${academicYear.academic_year_id}/edit`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(academicYear)}
                        disabled={deletingId === academicYear.academic_year_id}
                      >
                        {deletingId === academicYear.academic_year_id
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

const currentStyle = {
  color: "#166534",
  fontWeight: 600,
};

const inactiveStyle = {
  color: "#6b7280",
};

export default AcademicYears;
