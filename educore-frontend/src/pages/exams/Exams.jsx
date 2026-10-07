import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadExamData() {
      try {
        const [examsResponse, yearsResponse, classesResponse, subjectsResponse] =
          await Promise.all([
            api.get("/exams"),
            api.get("/academic-years"),
            api.get("/classes"),
            api.get("/subjects"),
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

        setExams(examsResponse.data.exams);
        setTerms(loadedTerms);
        setClasses(classesResponse.data.classes);
        setSubjects(subjectsResponse.data.subjects);
      } catch (requestError) {
        setError(requestError.message || "Failed to load exams.");
      } finally {
        setLoading(false);
      }
    }

    loadExamData();
  }, []);

  async function handleDelete(exam) {
    const confirmed = window.confirm(
      `Delete ${exam.name}? This deletion is permanent.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(exam.exam_id);

    try {
      await api.delete(`/exams/${exam.exam_id}`);
      const response = await api.get("/exams");
      setExams(response.data.exams);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete exam.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Exams</h2>
          <p>Manage exams for your classes and subjects.</p>
        </div>
        <button type="button" onClick={() => navigate("/exams/new")}>
          Add Exam
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="exams-table-title">
        <div className="card-header">
          <div>
            <h3 id="exams-table-title">Exam Directory</h3>
            <p>Exam records</p>
          </div>
        </div>

        {loading && <p>Loading exams...</p>}
        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}
        {!loading && !error && exams.length === 0 && (
          <p>No exams found.</p>
        )}

        {!loading && !error && exams.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Exam name</th>
                  <th style={headerCellStyle}>Date</th>
                  <th style={headerCellStyle}>Term</th>
                  <th style={headerCellStyle}>Subject</th>
                  <th style={headerCellStyle}>Class</th>
                  <th style={headerCellStyle}>Max score</th>
                  <th style={headerCellStyle}>Weight %</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.exam_id}>
                    <td style={bodyCellStyle}>{exam.name}</td>
                    <td style={bodyCellStyle}>{exam.exam_date || "-"}</td>
                    <td style={bodyCellStyle}>
                      {getTermName(terms, exam.term_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {getSubjectName(subjects, exam.subject_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {getClassName(classes, exam.class_id)}
                    </td>
                    <td style={bodyCellStyle}>{exam.max_score}</td>
                    <td style={bodyCellStyle}>{exam.weight_percentage}</td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() => navigate(`/exams/${exam.exam_id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(exam)}
                        disabled={deletingId === exam.exam_id}
                      >
                        {deletingId === exam.exam_id ? "Deleting..." : "Delete"}
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

function getTermName(terms, termId) {
  const term = terms.find(
    (item) => String(item.term_id) === String(termId)
  );
  return term?.name || termId;
}

function getSubjectName(subjects, subjectId) {
  const subject = subjects.find(
    (item) => String(item.subject_id) === String(subjectId)
  );
  return subject ? `${subject.name} (${subject.code})` : subjectId;
}

function getClassName(classes, classId) {
  const classRecord = classes.find(
    (item) => String(item.class_id) === String(classId)
  );
  return classRecord?.name || classId;
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

export default Exams;
