import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const sourceOptions = ["assignment", "exam"];

const initialFormData = {
  sourceType: "assignment",
  student_id: "",
  assignment_id: "",
  exam_id: "",
  score: "",
  max_score: "",
  comments: "",
};

function MarkForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [studentsResponse, assignmentsResponse, examsResponse] =
          await Promise.all([
            api.get("/students"),
            api.get("/assignments"),
            api.get("/exams"),
          ]);

        setStudents(studentsResponse.data.students);
        setAssignments(assignmentsResponse.data.assignments);
        setExams(examsResponse.data.exams);
      } catch (requestError) {
        setError(requestError.message || "Failed to load mark options.");
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

    async function loadMark() {
      try {
        const response = await api.get(`/marks/${id}`);
        const mark = response.data.mark;
        const hasAssignment = mark.assignment_id != null;
        const hasExam = mark.exam_id != null;

        if (hasAssignment === hasExam) {
          setError("The mark has an invalid source configuration.");
        }

        setFormData({
          sourceType: hasAssignment ? "assignment" : "exam",
          student_id: toSelectValue(mark.student_id),
          assignment_id: hasAssignment ? toSelectValue(mark.assignment_id) : "",
          exam_id: hasExam ? toSelectValue(mark.exam_id) : "",
          score: toOptionalValue(mark.score),
          max_score: toOptionalValue(mark.max_score),
          comments: mark.comments || "",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load mark.");
      } finally {
        setLoading(false);
      }
    }

    loadMark();
  }, [id, isEditMode]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSourceChange(event) {
    const sourceType = event.target.value;

    setFormData((current) => ({
      ...current,
      sourceType,
      assignment_id: sourceType === "assignment" ? current.assignment_id : "",
      exam_id: sourceType === "exam" ? current.exam_id : "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!formData.student_id || !formData.score) {
      setError("Student and score are required.");
      return;
    }

    const sourceId =
      formData.sourceType === "assignment"
        ? formData.assignment_id
        : formData.exam_id;

    if (!sourceId || !sourceOptions.includes(formData.sourceType)) {
      setError("Select exactly one assignment or exam source.");
      return;
    }

    const score = Number(formData.score);
    const maxScore = parseOptionalNumber(formData.max_score);

    if (!Number.isFinite(score) || score < 0) {
      setError("Score must be a number greater than or equal to 0.");
      return;
    }

    if (maxScore.error) {
      setError("Max score must be a number greater than 0.");
      return;
    }

    const effectiveMaxScore = maxScore.empty ? 100 : maxScore.value;
    if (score > effectiveMaxScore) {
      setError("Score must not exceed max score.");
      return;
    }

    setLoading(true);

    const payload = {
      student_id: Number(formData.student_id),
      score,
    };

    if (formData.sourceType === "assignment") {
      payload.assignment_id = Number(formData.assignment_id);
    } else {
      payload.exam_id = Number(formData.exam_id);
    }

    if (!maxScore.empty) {
      payload.max_score = maxScore.value;
    }
    if (formData.comments) {
      payload.comments = formData.comments;
    }

    try {
      if (isEditMode) {
        await api.put(`/marks/${id}`, payload);
      } else {
        await api.post("/marks", payload);
      }

      navigate("/marks");
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode ? "Failed to update mark." : "Failed to add mark.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Mark" : "Add Mark"}</h2>
          <p>{isEditMode ? "Update the mark record." : "Record a student mark."}</p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading mark...</p>
        ) : optionsLoading ? (
          <p>Loading mark options...</p>
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
              <label htmlFor="sourceType">Source type</label>
              <select
                id="sourceType"
                name="sourceType"
                value={formData.sourceType}
                onChange={handleSourceChange}
                required
              >
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
              </select>
            </div>

            {formData.sourceType === "assignment" ? (
              <div className="form-group">
                <label htmlFor="assignment_id">Assignment</label>
                <select
                  id="assignment_id"
                  name="assignment_id"
                  value={formData.assignment_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select assignment</option>
                  {assignments.map((assignment) => (
                    <option
                      key={assignment.assignment_id}
                      value={assignment.assignment_id}
                    >
                      {getAssignmentLabel(assignment)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="exam_id">Exam</label>
                <select
                  id="exam_id"
                  name="exam_id"
                  value={formData.exam_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select exam</option>
                  {exams.map((exam) => (
                    <option key={exam.exam_id} value={exam.exam_id}>
                      {getExamLabel(exam)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="score">Score</label>
              <input
                id="score"
                name="score"
                type="number"
                min="0"
                step="0.01"
                value={formData.score}
                onChange={handleChange}
                required
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
              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
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
                  ? "Saving mark..."
                  : "Adding mark..."
                : isEditMode
                  ? "Save changes"
                  : "Add mark"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/marks")}
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

function getAssignmentLabel(assignment) {
  const details = [
    assignment.class_id ? `Class ${assignment.class_id}` : null,
    assignment.subject_id ? `Subject ${assignment.subject_id}` : null,
    assignment.due_date ? `Due ${assignment.due_date}` : null,
  ].filter(Boolean);

  return details.length > 0
    ? `${assignment.title} (${details.join(" - ")})`
    : assignment.title;
}

function getExamLabel(exam) {
  const details = [
    exam.exam_date || null,
    exam.class_id ? `Class ${exam.class_id}` : null,
    exam.subject_id ? `Subject ${exam.subject_id}` : null,
    exam.max_score != null ? `Max ${exam.max_score}` : null,
  ].filter(Boolean);

  return details.length > 0 ? `${exam.name} (${details.join(" - ")})` : exam.name;
}

export default MarkForm;
