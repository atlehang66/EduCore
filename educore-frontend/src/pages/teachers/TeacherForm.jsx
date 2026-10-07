import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialFormData = {
  staff_number: "",
  first_name: "",
  last_name: "",
  user_id: "",
  email: "",
  phone: "",
  hire_date: "",
  specialization: "",
  employment_status: "active",
};

function TeacherForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadTeacher() {
      try {
        const response = await api.get(`/teachers/${id}`);
        const teacher = response.data.teacher;

        setFormData({
          staff_number: teacher.staff_number || "",
          first_name: normalizeName(teacher.first_name || ""),
          last_name: normalizeName(teacher.last_name || ""),
          user_id: teacher.user_id || "",
          email: teacher.email || "",
          phone: teacher.phone || "",
          hire_date: formatDateForInput(teacher.hire_date),
          specialization: teacher.specialization || "",
          employment_status: teacher.employment_status || "active",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load teacher.");
      } finally {
        setLoading(false);
      }
    }

    loadTeacher();
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
    setLoading(true);

    const payload = {
      staff_number: formData.staff_number,
      first_name: formData.first_name,
      last_name: formData.last_name,
      user_id: formData.user_id ? Number(formData.user_id) : null,
      email: formData.email,
      phone: formData.phone,
      hire_date: formData.hire_date,
      specialization: formData.specialization,
      employment_status: formData.employment_status || "active",
    };

    try {
      if (isEditMode) {
        await api.put(`/teachers/${id}`, payload);
        navigate("/teachers");
      } else {
        await api.post("/teachers", payload);
        navigate("/teachers");
      }
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode ? "Failed to update teacher." : "Failed to add teacher.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Teacher" : "Add Teacher"}</h2>
          <p>
            {isEditMode
              ? "Update the teacher record."
              : "Create a teacher record for your school."}
          </p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading teacher...</p>
        ) : (
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="staff_number">Staff number</label>
            <input
              id="staff_number"
              name="staff_number"
              type="text"
              value={formData.staff_number}
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
            <label htmlFor="user_id">User ID</label>
            <input
              id="user_id"
              name="user_id"
              type="number"
              min="1"
              value={formData.user_id}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="hire_date">Hire date</label>
            <input
              id="hire_date"
              name="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <input
              id="specialization"
              name="specialization"
              type="text"
              value={formData.specialization}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="employment_status">Employment status</label>
            <input
              id="employment_status"
              name="employment_status"
              type="text"
              value={formData.employment_status}
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
                  ? "Saving teacher..."
                  : "Adding teacher..."
                : isEditMode
                  ? "Save changes"
                  : "Add teacher"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/teachers")}
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

function normalizeName(value) {
  return value.replace(/\S+/g, (part) =>
    `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`
  );
}

function formatDateForInput(value) {
  return value ? String(value).slice(0, 10) : "";
}

export default TeacherForm;
