import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ReportCards() {
  const navigate = useNavigate();
  const [reportCards, setReportCards] = useState([]);
  const [students, setStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadReportCardData() {
      try {
        const [reportCardsResponse, studentsResponse, yearsResponse] =
          await Promise.all([
            api.get("/report-cards"),
            api.get("/students"),
            api.get("/academic-years"),
          ]);
        const loadedAcademicYears = yearsResponse.data.academicYears;
        const termResponses = await Promise.all(
          loadedAcademicYears.map((academicYear) =>
            api.get(`/academic-years/${academicYear.academic_year_id}/terms`)
          )
        );
        const loadedTerms = termResponses.flatMap(
          (response) => response.data.terms
        );

        setReportCards(reportCardsResponse.data.report_cards);
        setStudents(studentsResponse.data.students);
        setAcademicYears(loadedAcademicYears);
        setTerms(loadedTerms);
      } catch (requestError) {
        setError(requestError.message || "Failed to load report cards.");
      } finally {
        setLoading(false);
      }
    }

    loadReportCardData();
  }, []);

  async function handleDelete(reportCard) {
    const confirmed = window.confirm(
      "Delete this report card? This deletion is permanent."
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(reportCard.report_card_id);

    try {
      await api.delete(`/report-cards/${reportCard.report_card_id}`);
      const response = await api.get("/report-cards");
      setReportCards(response.data.report_cards);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete report card.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Report Cards</h2>
          <p>Manage stored student report card records.</p>
        </div>
        <button type="button" onClick={() => navigate("/report-cards/new")}>
          Add Report Card
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="report-cards-table-title">
        <div className="card-header">
          <div>
            <h3 id="report-cards-table-title">Report Card Directory</h3>
            <p>Manual report card records</p>
          </div>
        </div>

        {loading && <p>Loading report cards...</p>}
        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}
        {!loading && !error && reportCards.length === 0 && (
          <p>No report cards found.</p>
        )}

        {!loading && !error && reportCards.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Student</th>
                  <th style={headerCellStyle}>Academic year</th>
                  <th style={headerCellStyle}>Term</th>
                  <th style={headerCellStyle}>Overall average</th>
                  <th style={headerCellStyle}>Class rank</th>
                  <th style={headerCellStyle}>Teacher comments</th>
                  <th style={headerCellStyle}>Principal comments</th>
                  <th style={headerCellStyle}>Generated at</th>
                  <th style={headerCellStyle}>Published</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportCards.map((reportCard) => (
                  <tr key={reportCard.report_card_id}>
                    <td style={bodyCellStyle}>
                      {getStudentName(students, reportCard.student_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {getAcademicYearName(academicYears, terms, reportCard.term_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {getTermName(terms, reportCard.term_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {reportCard.overall_average ?? "-"}
                    </td>
                    <td style={bodyCellStyle}>{reportCard.class_rank ?? "-"}</td>
                    <td style={bodyCellStyle}>
                      {reportCard.teacher_comments || "-"}
                    </td>
                    <td style={bodyCellStyle}>
                      {reportCard.principal_comments || "-"}
                    </td>
                    <td style={bodyCellStyle}>
                      {reportCard.generated_at || "-"}
                    </td>
                    <td style={bodyCellStyle}>
                      {reportCard.published_at ? "Published" : "Not Published"}
                    </td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/report-cards/${reportCard.report_card_id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(reportCard)}
                        disabled={deletingId === reportCard.report_card_id}
                      >
                        {deletingId === reportCard.report_card_id
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

function getTermName(terms, termId) {
  const term = terms.find(
    (item) => String(item.term_id) === String(termId)
  );
  return term?.name || termId;
}

function getAcademicYearName(academicYears, terms, termId) {
  const term = terms.find(
    (item) => String(item.term_id) === String(termId)
  );
  const academicYear = academicYears.find(
    (item) => String(item.academic_year_id) === String(term?.academic_year_id)
  );
  return academicYear?.name || term?.academic_year_id || "-";
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

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

export default ReportCards;
