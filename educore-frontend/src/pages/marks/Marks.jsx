import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Marks() {
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadMarkData() {
      try {
        const [marksResponse, studentsResponse, assignmentsResponse, examsResponse] =
          await Promise.all([
            api.get("/marks"),
            api.get("/students"),
            api.get("/assignments"),
            api.get("/exams"),
          ]);

        setMarks(marksResponse.data.marks);
        setStudents(studentsResponse.data.students);
        setAssignments(assignmentsResponse.data.assignments);
        setExams(examsResponse.data.exams);
      } catch (requestError) {
        setError(requestError.message || "Failed to load marks.");
      } finally {
        setLoading(false);
      }
    }

    loadMarkData();
  }, []);

  async function handleDelete(mark) {
    const confirmed = window.confirm(
      "Delete this mark? This deletion is permanent."
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(mark.mark_id);

    try {
      await api.delete(`/marks/${mark.mark_id}`);
      const response = await api.get("/marks");
      setMarks(response.data.marks);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete mark.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Marks</h2>
          <p>Manage assignment and exam marks.</p>
        </div>
        <button type="button" onClick={() => navigate("/marks/new")}>
          Add Mark
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="marks-table-title">
        <div className="card-header">
          <div>
            <h3 id="marks-table-title">Marks Directory</h3>
            <p>Recorded student marks</p>
          </div>
        </div>

        {loading && <p>Loading marks...</p>}
        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}
        {!loading && !error && marks.length === 0 && (
          <p>No marks found.</p>
        )}

        {!loading && !error && marks.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Student</th>
                  <th style={headerCellStyle}>Source</th>
                  <th style={headerCellStyle}>Source name</th>
                  <th style={headerCellStyle}>Score</th>
                  <th style={headerCellStyle}>Max score</th>
                  <th style={headerCellStyle}>Percentage</th>
                  <th style={headerCellStyle}>Comments</th>
                  <th style={headerCellStyle}>Recorded at</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark) => (
                  <tr key={mark.mark_id}>
                    <td style={bodyCellStyle}>
                      {getStudentName(students, mark.student_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {mark.assignment_id != null ? "Assignment" : "Exam"}
                    </td>
                    <td style={bodyCellStyle}>
                      {getSourceName(assignments, exams, mark)}
                    </td>
                    <td style={bodyCellStyle}>{mark.score}</td>
                    <td style={bodyCellStyle}>{mark.max_score}</td>
                    <td style={bodyCellStyle}>{getPercentage(mark)}</td>
                    <td style={bodyCellStyle}>{mark.comments || "-"}</td>
                    <td style={bodyCellStyle}>{mark.recorded_at}</td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() => navigate(`/marks/${mark.mark_id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(mark)}
                        disabled={deletingId === mark.mark_id}
                      >
                        {deletingId === mark.mark_id ? "Deleting..." : "Delete"}
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

function getSourceName(assignments, exams, mark) {
  if (mark.assignment_id != null) {
    const assignment = assignments.find(
      (item) => String(item.assignment_id) === String(mark.assignment_id)
    );
    return assignment?.title || mark.assignment_id;
  }

  const exam = exams.find(
    (item) => String(item.exam_id) === String(mark.exam_id)
  );
  return exam?.name || mark.exam_id;
}

function getPercentage(mark) {
  const score = Number(mark.score);
  const maxScore = Number(mark.max_score);

  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0) {
    return "-";
  }

  return `${((score / maxScore) * 100).toFixed(1)}%`;
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

export default Marks;
