import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialFormData = {
  name: "",
  start_date: "",
  end_date: "",
  is_current: false,
};

function AcademicYearForm() {
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

    async function loadAcademicYear() {
      try {
        const response = await api.get(`/academic-years/${id}`);
        const academicYear = response.data.academicYear;

        setFormData({
          name: academicYear.name || "",
          start_date: formatDateForInput(academicYear.start_date),
          end_date: formatDateForInput(academicYear.end_date),
          is_current: Boolean(academicYear.is_current),
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load academic year.");
      } finally {
        setLoading(false);
      }
    }

    loadAcademicYear();
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.name || !formData.start_date || !formData.end_date) {
      setError("Name, start date, and end date are required.");
      return;
    }

    if (formData.start_date >= formData.end_date) {
      setError("Start date must be before end date.");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_current: formData.is_current ? 1 : 0,
    };

    try {
      if (isEditMode) {
        await api.put(`/academic-years/${id}`, payload);
      } else {
        await api.post("/academic-years", payload);
      }

      navigate("/academic-years");
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode
            ? "Failed to update academic year."
            : "Failed to add academic year.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Academic Year" : "Add Academic Year"}</h2>
          <p>
            {isEditMode
              ? "Update the academic year record."
              : "Create an academic year record."}
          </p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading academic year...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="start_date">Start date</label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End date</label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="is_current">
                <input
                  id="is_current"
                  name="is_current"
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={handleChange}
                />{" "}
                Current academic year
              </label>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading
                ? isEditMode
                  ? "Saving academic year..."
                  : "Adding academic year..."
                : isEditMode
                  ? "Save changes"
                  : "Add academic year"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/academic-years")}
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

function formatDateForInput(value) {
  return value ? String(value).slice(0, 10) : "";
}

export default AcademicYearForm;
