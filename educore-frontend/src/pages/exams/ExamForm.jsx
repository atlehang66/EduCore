import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialFormData = {
  academic_year_id: "",
  term_id: "",
  subject_id: "",
  class_id: "",
  name: "",
  exam_date: "",
  max_score: "",
  weight_percentage: "",
};

function ExamForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [academicYears, setAcademicYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [yearsResponse, classesResponse, subjectsResponse] =
          await Promise.all([
            api.get("/academic-years"),
            api.get("/classes"),
            api.get("/subjects"),
          ]);

        const loadedAcademicYears = yearsResponse.data.academicYears;
        const termResponses = await Promise.all(
          loadedAcademicYears.map((academicYear) =>
            api.get(`/academic-years/${academicYear.academic_year_id}/terms`)
          )
        );
        const loadedTerms = termResponses.flatMap(
          (response) => response.data.terms
        );

        setAcademicYears(loadedAcademicYears);
        setTerms(loadedTerms);
        setClasses(classesResponse.data.classes);
        setSubjects(subjectsResponse.data.subjects);
      } catch (requestError) {
        setError(requestError.message || "Failed to load exam options.");
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

    async function loadExam() {
      try {
        const response = await api.get(`/exams/${id}`);
        const exam = response.data.exam;

        setFormData({
          academic_year_id: "",
          term_id: toSelectValue(exam.term_id),
          subject_id: toSelectValue(exam.subject_id),
          class_id: toSelectValue(exam.class_id),
          name: exam.name || "",
          exam_date: formatDateForInput(exam.exam_date),
          max_score: toOptionalValue(exam.max_score),
          weight_percentage: toOptionalValue(exam.weight_percentage),
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load exam.");
      } finally {
        setLoading(false);
      }
    }

    loadExam();
  }, [id, isEditMode]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      !formData.term_id ||
      !formData.subject_id ||
      !formData.class_id ||
      !formData.name
    ) {
      setError("Term, subject, class, and name are required.");
      return;
    }

    if (formData.exam_date && !isValidDate(formData.exam_date)) {
      setError("Exam date must use YYYY-MM-DD format.");
      return;
    }

    const maxScore = parseOptionalNumber(formData.max_score);
    const weightPercentage = parseOptionalNumber(formData.weight_percentage);

    if (maxScore.error) {
      setError("Max score must be greater than 0.");
      return;
    }

    if (weightPercentage.error) {
      setError("Weight percentage must be greater than 0 and no more than 100.");
      return;
    }

    setLoading(true);

    const payload = {
      term_id: Number(formData.term_id),
      subject_id: Number(formData.subject_id),
      class_id: Number(formData.class_id),
      name: formData.name,
    };

    if (formData.exam_date) {
      payload.exam_date = formData.exam_date;
    }
    if (!maxScore.empty) {
      payload.max_score = maxScore.value;
    }
    if (!weightPercentage.empty) {
      payload.weight_percentage = weightPercentage.value;
    }

    try {
      if (isEditMode) {
        await api.put(`/exams/${id}`, payload);
      } else {
        await api.post("/exams", payload);
      }

      navigate("/exams");
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode ? "Failed to update exam." : "Failed to add exam.")
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedAcademicYearId =
    formData.academic_year_id ||
    getAcademicYearIdForTerm(terms, formData.term_id);
  const availableTerms = academicYears.length
    ? terms.filter(
        (term) =>
          String(term.academic_year_id) === String(selectedAcademicYearId)
      )
    : [];

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Exam" : "Add Exam"}</h2>
          <p>{isEditMode ? "Update the exam record." : "Create an exam record."}</p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading exam...</p>
        ) : optionsLoading ? (
          <p>Loading exam options...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="academic_year_id">Academic year</label>
              <select
                id="academic_year_id"
                name="academic_year_id"
                value={selectedAcademicYearId}
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
              <label htmlFor="term_id">Term</label>
              <select
                id="term_id"
                name="term_id"
                value={formData.term_id}
                onChange={handleChange}
                required
                disabled={!formData.academic_year_id}
              >
                <option value="">
                  {formData.academic_year_id
                    ? "Select term"
                    : "Select academic year first"}
                </option>
                {availableTerms.map((term) => (
                  <option key={term.term_id} value={term.term_id}>
                    {term.name}
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
                required
              >
                <option value="">Select subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.name} ({subject.code})
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
              <label htmlFor="name">Exam name</label>
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
              <label htmlFor="exam_date">Exam date</label>
              <input
                id="exam_date"
                name="exam_date"
                type="date"
                value={formData.exam_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="max_score">Max score</label>
              <input
                id="max_score"
                name="max_score"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.max_score}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight_percentage">Weight percentage</label>
              <input
                id="weight_percentage"
                name="weight_percentage"
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                value={formData.weight_percentage}
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
                  ? "Saving exam..."
                  : "Adding exam..."
                : isEditMode
                  ? "Save changes"
                  : "Add exam"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/exams")}
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

function getAcademicYearIdForTerm(terms, termId) {
  const term = terms.find(
    (item) => String(item.term_id) === String(termId)
  );

  return term ? toSelectValue(term.academic_year_id) : "";
}

function toOptionalValue(value) {
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

function parseOptionalNumber(value) {
  if (value === "") {
    return { empty: true, value: undefined, error: false };
  }

  const numericValue = Number(value);
  return {
    empty: false,
    value: numericValue,
    error: !Number.isFinite(numericValue) || numericValue <= 0,
  };
}

export default ExamForm;
