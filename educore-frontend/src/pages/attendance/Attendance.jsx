import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Attendance() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [attendanceResponse, sessionsResponse, studentsResponse, classesResponse, subjectsResponse] =
          await Promise.all([
            api.get("/attendance"),
            api.get("/attendance-sessions"),
            api.get("/students"),
            api.get("/classes"),
            api.get("/subjects"),
          ]);

        setAttendance(attendanceResponse.data.attendance);
        setSessions(sessionsResponse.data.sessions);
        setStudents(studentsResponse.data.students);
        setClasses(classesResponse.data.classes);
        setSubjects(subjectsResponse.data.subjects);
      } catch (requestError) {
        setError(requestError.message || "Failed to load attendance.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleDelete(record) {
    const confirmed = window.confirm(
      "Delete this attendance record? This deletion is permanent."
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(record.attendance_id);

    try {
      await api.delete(`/attendance/${record.attendance_id}`);
      const response = await api.get("/attendance");
      setAttendance(response.data.attendance);
    } catch (requestError) {
      setError(requestError.message || "Failed to delete attendance record.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Attendance</h2>
          <p>Manage student attendance records.</p>
        </div>
        <button type="button" onClick={() => navigate("/attendance/new")}>
          Add Attendance
        </button>
      </div>

      <section className="dashboard-card" aria-labelledby="attendance-table-title">
        <div className="card-header">
          <div>
            <h3 id="attendance-table-title">Attendance Directory</h3>
            <p>Recorded student attendance</p>
          </div>
        </div>

        {loading && <p>Loading attendance...</p>}
        {!loading && error && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}
        {!loading && !error && attendance.length === 0 && (
          <p>No attendance records found.</p>
        )}

        {!loading && !error && attendance.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Student</th>
                  <th style={headerCellStyle}>Session</th>
                  <th style={headerCellStyle}>Status</th>
                  <th style={headerCellStyle}>Remarks</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.attendance_id}>
                    <td style={bodyCellStyle}>
                      {getStudentName(students, record.student_id)}
                    </td>
                    <td style={bodyCellStyle}>
                      {getSessionLabel(
                        sessions,
                        classes,
                        subjects,
                        record.session_id
                      )}
                    </td>
                    <td style={bodyCellStyle}>{record.status}</td>
                    <td style={bodyCellStyle}>{record.remarks || "-"}</td>
                    <td style={bodyCellStyle}>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/attendance/${record.attendance_id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(record)}
                        disabled={deletingId === record.attendance_id}
                      >
                        {deletingId === record.attendance_id
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

function getSessionLabel(sessions, classes, subjects, sessionId) {
  const session = sessions.find(
    (item) => String(item.session_id) === String(sessionId)
  );

  if (!session) {
    return sessionId;
  }

  const classRecord = classes.find(
    (item) => String(item.class_id) === String(session.class_id)
  );
  const subject = subjects.find(
    (item) => String(item.subject_id) === String(session.subject_id)
  );
  const classLabel = classRecord?.name || `Class ${session.class_id}`;
  const subjectLabel = subject ? ` - ${subject.name} (${subject.code})` : "";

  return `${session.session_date} - ${classLabel}${subjectLabel}${
    session.period ? ` - ${session.period}` : ""
  }`;
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

export default Attendance;
