import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialFormData = {
  student_id: "",
  academic_year_id: "",
  term_id: "",
  overall_average: "",
  class_rank: "",
  teacher_comments: "",
  principal_comments: "",
  generated_at: "",
  published_at: "",
};

function ReportCardForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [students, setStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [termsLoading, setTermsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [studentsResponse, yearsResponse] = await Promise.all([
          api.get("/students"),
          api.get("/academic-years"),
        ]);

        const loadedAcademicYears = yearsResponse.data.academicYears;
        setStudents(studentsResponse.data.students);
        setAcademicYears(loadedAcademicYears);

        if (isEditMode) {
          const termResponses = await Promise.all(
            loadedAcademicYears.map((academicYear) =>
              api.get(`/academic-years/${academicYear.academic_year_id}/terms`)
            )
          );
          setTerms(
            termResponses.flatMap((response) => response.data.terms)
          );
        }
      } catch (requestError) {
        setError(requestError.message || "Failed to load report card options.");
      } finally {
        setOptionsLoading(false);
      }
    }

    loadOptions();
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadReportCard() {
      try {
        const response = await api.get(`/report-cards/${id}`);
        const reportCard = response.data.report_card;

        setFormData({
          student_id: toSelectValue(reportCard.student_id),
          academic_year_id: "",
          term_id: toSelectValue(reportCard.term_id),
          overall_average: toOptionalValue(reportCard.overall_average),
          class_rank: toOptionalValue(reportCard.class_rank),
          teacher_comments: reportCard.teacher_comments || "",
          principal_comments: reportCard.principal_comments || "",
          generated_at: formatDateTimeForInput(reportCard.generated_at),
          published_at: formatDateTimeForInput(reportCard.published_at),
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load report card.");
      } finally {
        setLoading(false);
      }
    }

    loadReportCard();
  }, [id, isEditMode]);

  const selectedAcademicYearId =
    formData.academic_year_id ||
    getAcademicYearIdForTerm(terms, formData.term_id);
  const availableTerms = terms.filter(
    (term) =>
      String(term.academic_year_id) === String(selectedAcademicYearId)
  );

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "academic_year_id") {
      setFormData((current) => ({
        ...current,
        academic_year_id: value,
        term_id: "",
      }));
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleAcademicYearChange(event) {
    const academicYearId = event.target.value;
    setFormData((current) => ({
      ...current,
      academic_year_id: academicYearId,
      term_id: "",
    }));

    if (!academicYearId) {
      setTerms([]);
      return;
    }

    setTermsLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/academic-years/${academicYearId}/terms`
      );
      setTerms((current) => [
        ...current.filter(
          (term) => String(term.academic_year_id) !== String(academicYearId)
        ),
        ...response.data.terms,
      ]);
    } catch (requestError) {
      setError(requestError.message || "Failed to load terms.");
    } finally {
      setTermsLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.student_id || !formData.term_id) {
      setError("Student and term are required.");
      return;
    }

    const overallAverage = parseOptionalNumber(formData.overall_average);
    const classRank = parseOptionalRank(formData.class_rank);

    if (overallAverage.error) {
      setError("Overall average must be between 0 and 100.");
      return;
    }

    if (classRank.error) {
      setError("Class rank must be an integer greater than or equal to 1.");
      return;
    }

    const payload = {
      student_id: Number(formData.student_id),
      term_id: Number(formData.term_id),
    };

    if (!overallAverage.empty) {
      payload.overall_average = overallAverage.value;
    }
    if (!classRank.empty) {
      payload.class_rank = classRank.value;
    }
    if (formData.teacher_comments) {
      payload.teacher_comments = formData.teacher_comments;
    }
    if (formData.principal_comments) {
      payload.principal_comments = formData.principal_comments;
    }
    if (formData.generated_at) {
      payload.generated_at = formatDateTimeForApi(formData.generated_at);
    }
    if (formData.published_at) {
      payload.published_at = formatDateTimeForApi(formData.published_at);
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await api.put(`/report-cards/${id}`, payload);
      } else {
        await api.post("/report-cards", payload);
      }

      navigate("/report-cards");
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode
            ? "Failed to update report card."
            : "Failed to add report card.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Report Card" : "Add Report Card"}</h2>
          <p>Store a manual report card record.</p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading report card...</p>
        ) : optionsLoading ? (
          <p>Loading report card options...</p>
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
              <label htmlFor="academic_year_id">Academic year</label>
              <select
                id="academic_year_id"
                name="academic_year_id"
                value={selectedAcademicYearId}
                onChange={handleAcademicYearChange}
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
              <label htmlFor="term_id">Term</label>
              <select
                id="term_id"
                name="term_id"
                value={formData.term_id}
                onChange={handleChange}
                required
                disabled={!selectedAcademicYearId || termsLoading}
              >
                <option value="">
                  {termsLoading ? "Loading terms..." : "Select term"}
                </option>
                {availableTerms.map((term) => (
                  <option key={term.term_id} value={term.term_id}>
                    {term.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="overall_average">Overall average</label>
              <input
                id="overall_average"
                name="overall_average"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.overall_average}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="class_rank">Class rank</label>
              <input
                id="class_rank"
                name="class_rank"
                type="number"
                min="1"
                step="1"
                value={formData.class_rank}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="teacher_comments">Teacher comments</label>
              <textarea
                id="teacher_comments"
                name="teacher_comments"
                rows="4"
                value={formData.teacher_comments}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="principal_comments">Principal comments</label>
              <textarea
                id="principal_comments"
                name="principal_comments"
                rows="4"
                value={formData.principal_comments}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="generated_at">Generated at</label>
              <input
                id="generated_at"
                name="generated_at"
                type="datetime-local"
                value={formData.generated_at}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="published_at">Published at</label>
              <input
                id="published_at"
                name="published_at"
                type="datetime-local"
                value={formData.published_at}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading || termsLoading}>
              {loading
                ? isEditMode
                  ? "Saving report card..."
                  : "Adding report card..."
                : isEditMode
                  ? "Save changes"
                  : "Add report card"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/report-cards")}
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

function toOptionalValue(value) {
  return value === null || value === undefined ? "" : String(value);
}

function getAcademicYearIdForTerm(terms, termId) {
  const term = terms.find(
    (item) => String(item.term_id) === String(termId)
  );
  return term ? toSelectValue(term.academic_year_id) : "";
}

function parseOptionalNumber(value) {
  if (value === "") {
    return { empty: true, value: undefined, error: false };
  }

  const numericValue = Number(value);
  return {
    empty: false,
    value: numericValue,
    error: !Number.isFinite(numericValue) || numericValue < 0 || numericValue > 100,
  };
}

function parseOptionalRank(value) {
  if (value === "") {
    return { empty: true, value: undefined, error: false };
  }

  const numericValue = Number(value);
  return {
    empty: false,
    value: numericValue,
    error: !Number.isInteger(numericValue) || numericValue < 1,
  };
}

function formatDateTimeForInput(value) {
  if (!value) {
    return "";
  }

  return String(value).replace(" ", "T").slice(0, 16);
}

function formatDateTimeForApi(value) {
  return `${value.replace("T", " ")}:00`;
}

export default ReportCardForm;
