import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialFormData = {
  name: "",
  start_date: "",
  end_date: "",
  term_order: "",
};

function TermForm() {
  const navigate = useNavigate();
  const { academicYearId, id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadTerm() {
      try {
        const response = await api.get(
          `/academic-years/${academicYearId}/terms/${id}`
        );
        const term = response.data.term;

        setFormData({
          name: term.name || "",
          start_date: formatDateForInput(term.start_date),
          end_date: formatDateForInput(term.end_date),
          term_order: term.term_order ?? "",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load term.");
      } finally {
        setLoading(false);
      }
    }

    loadTerm();
  }, [academicYearId, id, isEditMode]);

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
      !formData.name ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.term_order
    ) {
      setError("Name, start date, end date, and term order are required.");
      return;
    }

    if (formData.start_date >= formData.end_date) {
      setError("Start date must be before end date.");
      return;
    }

    const termOrder = Number(formData.term_order);
    if (!Number.isInteger(termOrder) || termOrder <= 0) {
      setError("Term order must be a positive integer.");
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      start_date: formData.start_date,
      end_date: formData.end_date,
      term_order: termOrder,
    };

    try {
      if (isEditMode) {
        await api.put(
          `/academic-years/${academicYearId}/terms/${id}`,
          payload
        );
      } else {
        await api.post(`/academic-years/${academicYearId}/terms`, payload);
      }

      navigate(`/academic-years/${academicYearId}/terms`);
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode ? "Failed to update term." : "Failed to add term.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Term" : "Add Term"}</h2>
          <p>
            {isEditMode
              ? "Update the term record."
              : "Create a term for the selected academic year."}
          </p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading term...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Term name</label>
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
              <label htmlFor="term_order">Term order</label>
              <input
                id="term_order"
                name="term_order"
                type="number"
                min="1"
                step="1"
                value={formData.term_order}
                onChange={handleChange}
                required
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
                  ? "Saving term..."
                  : "Adding term..."
                : isEditMode
                  ? "Save changes"
                  : "Add term"}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(`/academic-years/${academicYearId}/terms`)
              }
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

export default TermForm;
