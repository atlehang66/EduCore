import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const statusOptions = ["present", "absent", "late", "excused"];

const initialFormData = {
  session_id: "",
  student_id: "",
  status: "present",
  remarks: "",
};

function AttendanceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [sessionsResponse, studentsResponse, classesResponse, subjectsResponse] =
          await Promise.all([
            api.get("/attendance-sessions"),
            api.get("/students"),
            api.get("/classes"),
            api.get("/subjects"),
          ]);

        setSessions(sessionsResponse.data.sessions);
        setStudents(studentsResponse.data.students);
        setClasses(classesResponse.data.classes);
        setSubjects(subjectsResponse.data.subjects);
      } catch (requestError) {
        setError(requestError.message || "Failed to load attendance options.");
      } finally {
        setOptionsLoading(false);
      }
    }

    loadOptions();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadAttendance() {
      try {
        const response = await api.get(`/attendance/${id}`);
        const record = response.data.attendance;

        setFormData({
          session_id: toSelectValue(record.session_id),
          student_id: toSelectValue(record.student_id),
          status: record.status || "present",
          remarks: record.remarks || "",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load attendance record.");
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.session_id || !formData.student_id || !formData.status) {
      setError("Attendance session, student, and status are required.");
      return;
    }

    if (!statusOptions.includes(formData.status)) {
      setError("Status must be present, absent, late, or excused.");
      return;
    }

    setLoading(true);

    const payload = {
      session_id: Number(formData.session_id),
      student_id: Number(formData.student_id),
      status: formData.status,
    };

    if (formData.remarks) {
      payload.remarks = formData.remarks;
    }

    try {
      if (isEditMode) {
        await api.put(`/attendance/${id}`, payload);
      } else {
        await api.post("/attendance", payload);
      }

      navigate("/attendance");
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode
            ? "Failed to update attendance record."
            : "Failed to add attendance record.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Attendance" : "Add Attendance"}</h2>
          <p>Record attendance for a student and session.</p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading attendance record...</p>
        ) : optionsLoading ? (
          <p>Loading attendance options...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="session_id">Attendance session</label>
              <select
                id="session_id"
                name="session_id"
                value={formData.session_id}
                onChange={handleChange}
                required
              >
                <option value="">Select session</option>
                {sessions.map((session) => (
                  <option key={session.session_id} value={session.session_id}>
                    {getSessionLabel(session, classes, subjects)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="student_id">Student</label>
              <select
                id="student_id"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
              >
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="remarks">Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading
                ? isEditMode
                  ? "Saving attendance..."
                  : "Adding attendance..."
                : isEditMode
                  ? "Save changes"
                  : "Add attendance"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/attendance")}
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function toSelectValue(value) {
  return value === null || value === undefined ? "" : String(value);
}

function getSessionLabel(session, classes, subjects) {
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

export default AttendanceForm;
