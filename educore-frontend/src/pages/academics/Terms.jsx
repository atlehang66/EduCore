import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function Terms() {
  const navigate = useNavigate();
  const { academicYearId } = useParams();
  const [academicYear, setAcademicYear] = useState(null);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadTerms() {
      setLoading(true);
      setError("");

      try {
        const [academicYearResponse, termsResponse] = await Promise.all([
          api.get(`/academic-years/${academicYearId}`),
          api.get(`/academic-years/${academicYearId}/terms`),
        ]);

        setAcademicYear(academicYearResponse.data.academicYear);
        setTerms(termsResponse.data.terms);
      } catch (requestError) {
        setError(requestError.message || "Failed to load terms.");
      } finally {
        setLoading(false);
      }
    }

    loadTerms();
  }, [academicYearId]);

  async function handleDelete(term) {
    const confirmed = window.confirm(
      `Delete ${term.name}? This deletion is permanent.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(term.term_id);

    try {
      await api.delete(
        `/academic-years/${academicYearId}/terms/${term.term_id}`
      );
      const response = await api.get(
        `/academic-years/${academicYearId}/terms`
      );
      setTerms(response.data.terms);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete term.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Terms</h2>
          <p>
            {academicYear
              ? `Terms for ${academicYear.name}.`
              : "Manage terms for the selected academic year."}
          </p>
        </div>
        <div>
          <button type="button" onClick={() => navigate("/academic-years")}>
            Academic Years
          </button>
          <button
            type="button"
            onClick={() =>
              navigate(`/academic-years/${academicYearId}/terms/new`)
            }
            disabled={loading || Boolean(error)}
          >
            Add Term
          </button>
        </div>
      </div>

      <section className="dashboard-card" aria-labelledby="terms-table-title">
        <div className="card-header">
          <div>
            <h3 id="terms-table-title">Term Directory</h3>
            <p>Terms belonging to the selected academic year</p>
          </div>
        </div>

        {loading && <p>Loading terms...</p>}

        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {!loading && !error && terms.length === 0 && (
          <p>No terms found.</p>
        )}

        {!loading && !error && terms.length > 0 && (
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
                  <th style={headerCellStyle}>Term name</th>
                  <th style={headerCellStyle}>Start date</th>
                  <th style={headerCellStyle}>End date</th>
                  <th style={headerCellStyle}>Term order</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((term) => (
                  <tr key={term.term_id}>
                    <td style={bodyCellStyle}>{term.name}</td>
                    <td style={bodyCellStyle}>{term.start_date}</td>
                    <td style={bodyCellStyle}>{term.end_date}</td>
                    <td style={bodyCellStyle}>{term.term_order}</td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/academic-years/${academicYearId}/terms/${term.term_id}/edit`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(term)}
                        disabled={deletingId === term.term_id}
                      >
                        {deletingId === term.term_id
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

export default Terms;
