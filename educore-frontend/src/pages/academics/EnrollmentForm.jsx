import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const statusOptions = [
  "active",
  "transferred",
  "completed",
  "withdrawn",
];

const initialFormData = {
  student_id: "",
  class_id: "",
  academic_year_id: "",
  enrollment_date: "",
  status: "active",
};

function EnrollmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [studentsResponse, classesResponse, yearsResponse] =
          await Promise.all([
            api.get("/students"),
            api.get("/classes"),
            api.get("/academic-years"),
          ]);

        setStudents(studentsResponse.data.students);
        setClasses(classesResponse.data.classes);
        setAcademicYears(yearsResponse.data.academicYears);
      } catch (requestError) {
        setError(requestError.message || "Failed to load enrollment options.");
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

    async function loadEnrollment() {
      try {
        const response = await api.get(`/enrollments/${id}`);
        const enrollment = response.data.enrollment;

        setFormData({
          student_id: toSelectValue(enrollment.student_id),
          class_id: toSelectValue(enrollment.class_id),
          academic_year_id: toSelectValue(enrollment.academic_year_id),
          enrollment_date: formatDateForInput(enrollment.enrollment_date),
          status: enrollment.status || "active",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load enrollment.");
      } finally {
        setLoading(false);
      }
    }

    loadEnrollment();
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !formData.student_id ||
      !formData.class_id ||
      !formData.academic_year_id
    ) {
      setError("Student, class, and academic year are required.");
      return;
    }

    if (
      formData.enrollment_date &&
      !isValidDate(formData.enrollment_date)
    ) {
      setError("Enrollment date must use YYYY-MM-DD format.");
      return;
    }

    if (!statusOptions.includes(formData.status)) {
      setError("Status must be active, transferred, completed, or withdrawn.");
      return;
    }

    setLoading(true);

    const payload = {
      student_id: Number(formData.student_id),
      class_id: Number(formData.class_id),
      academic_year_id: Number(formData.academic_year_id),
      status: formData.status,
    };

    if (formData.enrollment_date) {
      payload.enrollment_date = formData.enrollment_date;
    }

    try {
      if (isEditMode) {
        await api.put(`/enrollments/${id}`, payload);
      } else {
        await api.post("/enrollments", payload);
      }

      navigate("/enrollments");
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode
            ? "Failed to update enrollment."
            : "Failed to add enrollment.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Enrollment" : "Add Enrollment"}</h2>
          <p>
            {isEditMode
              ? "Update the enrollment record."
              : "Create an enrollment record."}
          </p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading enrollment...</p>
        ) : optionsLoading ? (
          <p>Loading enrollment options...</p>
        ) : (
          <form onSubmit={handleSubmit}>
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
              <label htmlFor="academic_year_id">Academic year</label>
              <select
                id="academic_year_id"
                name="academic_year_id"
                value={formData.academic_year_id}
                onChange={handleChange}
                required
              >
                <option value="">Select academic year</option>
                {academicYears.map((academicYear) => (
                  <option
                    key={academicYear.academic_year_id}
                    value={academicYear.academic_year_id}
                  >
                    {academicYear.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="enrollment_date">Enrollment date</label>
              <input
                id="enrollment_date"
                name="enrollment_date"
                type="date"
                value={formData.enrollment_date}
                onChange={handleChange}
              />
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

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading
                ? isEditMode
                  ? "Saving enrollment..."
                  : "Adding enrollment..."
                : isEditMode
                  ? "Save changes"
                  : "Add enrollment"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/enrollments")}
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

export default EnrollmentForm;
