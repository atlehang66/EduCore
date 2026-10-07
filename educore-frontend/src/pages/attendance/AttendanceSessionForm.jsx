import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialFormData = {
  class_id: "",
  subject_id: "",
  teacher_id: "",
  session_date: "",
  period: "",
};

function AttendanceSessionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [classesResponse, subjectsResponse, teachersResponse] =
          await Promise.all([
            api.get("/classes"),
            api.get("/subjects"),
            api.get("/teachers"),
          ]);

        setClasses(classesResponse.data.classes);
        setSubjects(subjectsResponse.data.subjects);
        setTeachers(teachersResponse.data.teachers);
      } catch (requestError) {
        setError(requestError.message || "Failed to load session options.");
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

    async function loadSession() {
      try {
        const response = await api.get(`/attendance-sessions/${id}`);
        const session = response.data.session;

        setFormData({
          class_id: toSelectValue(session.class_id),
          subject_id: toSelectValue(session.subject_id),
          teacher_id: toSelectValue(session.teacher_id),
          session_date: formatDateForInput(session.session_date),
          period: session.period || "",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load attendance session.");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.class_id || !formData.teacher_id || !formData.session_date) {
      setError("Class, teacher, and session date are required.");
      return;
    }

    if (!isValidDate(formData.session_date)) {
      setError("Session date must use YYYY-MM-DD format.");
      return;
    }

    if (formData.period.length > 20) {
      setError("Period must be 20 characters or fewer.");
      return;
    }

    setLoading(true);

    const payload = {
      class_id: Number(formData.class_id),
      teacher_id: Number(formData.teacher_id),
      session_date: formData.session_date,
    };

    if (formData.subject_id) {
      payload.subject_id = Number(formData.subject_id);
    }

    if (formData.period) {
      payload.period = formData.period;
    }

    try {
      if (isEditMode) {
        await api.put(`/attendance-sessions/${id}`, payload);
      } else {
        await api.post("/attendance-sessions", payload);
      }

      navigate("/attendance-sessions");
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode
            ? "Failed to update attendance session."
            : "Failed to add attendance session.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Attendance Session" : "Add Attendance Session"}</h2>
          <p>Record a class attendance session.</p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading attendance session...</p>
        ) : optionsLoading ? (
          <p>Loading session options...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="class_id">Class</label>
              <select
                id="class_id"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                required
              >
                <option value="">Select class</option>
                {classes.map((classRecord) => (
                  <option key={classRecord.class_id} value={classRecord.class_id}>
                    {classRecord.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject_id">Subject</label>
              <select
                id="subject_id"
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
              >
                <option value="">No subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="teacher_id">Teacher</label>
              <select
                id="teacher_id"
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                required
              >
                <option value="">Select teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.teacher_id} value={teacher.teacher_id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="session_date">Session date</label>
              <input
                id="session_date"
                name="session_date"
                type="date"
                value={formData.session_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="period">Period</label>
              <input
                id="period"
                name="period"
                type="text"
                maxLength="20"
                value={formData.period}
                onChange={handleChange}
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
                  ? "Saving session..."
                  : "Adding session..."
                : isEditMode
                  ? "Save changes"
                  : "Add session"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/attendance-sessions")}
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

function formatDateForInput(value) {
  return value ? String(value).slice(0, 10) : "";
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export default AttendanceSessionForm;
