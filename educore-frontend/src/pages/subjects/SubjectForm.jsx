import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialFormData = {
  name: "",
  code: "",
  department: "",
};

function SubjectForm() {
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

    async function loadSubject() {
      try {
        const response = await api.get(`/subjects/${id}`);
        const subject = response.data.subject;

        setFormData({
          name: subject.name || "",
          code: subject.code || "",
          department: subject.department || "",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load subject.");
      } finally {
        setLoading(false);
      }
    }

    loadSubject();
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

    if (!formData.name || !formData.code) {
      setError("Name and code are required.");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      code: formData.code,
      department: formData.department,
    };

    try {
      if (isEditMode) {
        await api.put(`/subjects/${id}`, payload);
      } else {
        await api.post("/subjects", payload);
      }

      navigate("/subjects");
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode ? "Failed to update subject." : "Failed to add subject.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Subject" : "Add Subject"}</h2>
          <p>
            {isEditMode
              ? "Update the subject record."
              : "Create a subject record for your school."}
          </p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading subject...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Subject name</label>
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
              <label htmlFor="code">Code</label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                value={formData.department}
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
                  ? "Saving subject..."
                  : "Adding subject..."
                : isEditMode
                  ? "Save changes"
                  : "Add subject"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/subjects")}
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

export default SubjectForm;
