import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AttendanceSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [sessionsResponse, classesResponse, subjectsResponse, teachersResponse] =
          await Promise.all([
            api.get("/attendance-sessions"),
            api.get("/classes"),
            api.get("/subjects"),
            api.get("/teachers"),
          ]);

        setSessions(sessionsResponse.data.sessions);
        setClasses(classesResponse.data.classes);
        setSubjects(subjectsResponse.data.subjects);
        setTeachers(teachersResponse.data.teachers);
      } catch (requestError) {
        setError(requestError.message || "Failed to load attendance sessions.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleDelete(session) {
    const confirmed = window.confirm(
      "Delete this attendance session? This deletion is permanent."
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(session.session_id);

    try {
      await api.delete(`/attendance-sessions/${session.session_id}`);
      const response = await api.get("/attendance-sessions");
      setSessions(response.data.sessions);
    } catch (requestError) {
      setError(
        requestError.message || "Failed to delete attendance session."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Attendance Sessions</h2>
          <p>Manage class attendance sessions.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/attendance-sessions/new")}
        >
          Add Session
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="sessions-table-title">
        <div className="card-header">
          <div>
            <h3 id="sessions-table-title">Session Directory</h3>
            <p>Attendance session records</p>
          </div>
        </div>

        {loading && <p>Loading attendance sessions...</p>}
        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}
        {!loading && !error && sessions.length === 0 && (
          <p>No attendance sessions found.</p>
        )}

        {!loading && !error && sessions.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Session date</th>
                  <th style={headerCellStyle}>Class</th>
                  <th style={headerCellStyle}>Subject</th>
                  <th style={headerCellStyle}>Teacher</th>
                  <th style={headerCellStyle}>Period</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.session_id}>
                    <td style={bodyCellStyle}>{session.session_date}</td>
                    <td style={bodyCellStyle}>
                      {getName(classes, "class_id", session.class_id, "name")}
                    </td>
                    <td style={bodyCellStyle}>
                      {getSubjectName(subjects, session.subject_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {getTeacherName(teachers, session.teacher_id)}
                    </td>
                    <td style={bodyCellStyle}>{session.period || "-"}</td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/attendance-sessions/${session.session_id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(session)}
                        disabled={deletingId === session.session_id}
                      >
                        {deletingId === session.session_id
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

function getName(items, idField, id, nameField) {
  const item = items.find((entry) => String(entry[idField]) === String(id));
  return item?.[nameField] || id;
}

function getSubjectName(subjects, subjectId) {
  if (!subjectId) {
    return "-";
  }

  const subject = subjects.find(
    (item) => String(item.subject_id) === String(subjectId)
  );
  return subject ? `${subject.name} (${subject.code})` : subjectId;
}

function getTeacherName(teachers, teacherId) {
  const teacher = teachers.find(
    (item) => String(item.teacher_id) === String(teacherId)
  );
  return teacher ? `${teacher.first_name} ${teacher.last_name}` : teacherId;
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

export default AttendanceSessions;
