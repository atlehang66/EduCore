import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialFormData = {
  student_number: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  gender: "",
  enrollment_date: "",
  current_grade_id: "",
  status: "active",
};

function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadStudent() {
      try {
        const response = await api.get(`/students/${id}`);
        const student = response.data.student;

        setFormData({
          student_number: student.student_number || "",
          first_name: normalizeName(student.first_name || ""),
          last_name: normalizeName(student.last_name || ""),
          date_of_birth: formatDateForInput(student.date_of_birth),
          gender: student.gender || "",
          enrollment_date: formatDateForInput(student.enrollment_date),
          current_grade_id: student.current_grade_id || "",
          status: student.status || "active",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load student.");
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValue =
      name === "first_name" || name === "last_name"
        ? normalizeName(value)
        : value;

    setFormData((current) => ({
      ...current,
      [name]: nextValue,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      student_number: formData.student_number,
      first_name: formData.first_name,
      last_name: formData.last_name,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      enrollment_date: formData.enrollment_date,
      current_grade_id: formData.current_grade_id
        ? Number(formData.current_grade_id)
        : null,
      status: formData.status || "active",
    };

    try {
      if (isEditMode) {
        await api.put(`/students/${id}`, payload);
        navigate("/students");
      } else {
        await api.post("/students", payload);
        setFormData(initialFormData);
        setSuccess("Student added successfully.");
      }
    } catch (requestError) {
      setError(requestError.message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Student" : "Add Student"}</h2>
          <p>
            {isEditMode
              ? "Update the student record."
              : "Create a student record for your school."}
          </p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading student...</p>
        ) : (
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="student_number">Student number</label>
            <input
              id="student_number"
              name="student_number"
              type="text"
              value={formData.student_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="first_name">First name</label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last name</label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date_of_birth">Date of birth</label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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
            <label htmlFor="current_grade_id">Current grade ID</label>
            <input
              id="current_grade_id"
              name="current_grade_id"
              type="number"
              min="1"
              value={formData.current_grade_id}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <input
              id="status"
              name="status"
              type="text"
              value={formData.status}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {success && <p role="status">{success}</p>}

            <button type="submit" disabled={loading}>
              {loading
                ? isEditMode
                  ? "Saving student..."
                  : "Adding student..."
                : isEditMode
                  ? "Save changes"
                  : "Add student"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function formatDateForInput(value) {
  return value ? String(value).slice(0, 10) : "";
}

function normalizeName(value) {
  return value.replace(/\S+/g, (part) =>
    `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`
  );
}

export default StudentForm;
