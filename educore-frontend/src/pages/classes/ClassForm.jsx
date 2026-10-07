import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const initialFormData = {
  grade_id: "",
  academic_year_id: "",
  name: "",
  homeroom_teacher_id: "",
  capacity: "40",
};

function ClassForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(isEditMode);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [grades, setGrades] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [gradesResponse, academicYearsResponse, teachersResponse] =
          await Promise.all([
            api.get("/grades"),
            api.get("/academic-years"),
            api.get("/teachers"),
          ]);

        setGrades(gradesResponse.data.grades);
        setAcademicYears(academicYearsResponse.data.academicYears);
        setTeachers(teachersResponse.data.teachers);
      } catch (requestError) {
        setError(requestError.message || "Failed to load class options.");
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

    async function loadClass() {
      try {
        const response = await api.get(`/classes/${id}`);
        const classRecord = response.data.class;

        setFormData({
          grade_id: toSelectValue(classRecord.grade_id),
          academic_year_id: toSelectValue(classRecord.academic_year_id),
          name: classRecord.name || "",
          homeroom_teacher_id: toSelectValue(classRecord.homeroom_teacher_id),
          capacity: toSelectValue(classRecord.capacity) || "40",
        });
      } catch (requestError) {
        setError(requestError.message || "Failed to load class.");
      } finally {
        setLoading(false);
      }
    }

    loadClass();
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

    if (!formData.grade_id || !formData.academic_year_id || !formData.name) {
      setError("Grade ID, academic year ID, and name are required.");
      return;
    }

    setLoading(true);

    const payload = {
      grade_id: Number(formData.grade_id),
      academic_year_id: Number(formData.academic_year_id),
      name: formData.name,
      capacity: Number(formData.capacity || 40),
      homeroom_teacher_id: formData.homeroom_teacher_id
        ? Number(formData.homeroom_teacher_id)
        : null,
    };

    try {
      if (isEditMode) {
        await api.put(`/classes/${id}`, payload);
      } else {
        await api.post("/classes", payload);
      }

      navigate("/classes");
    } catch (requestError) {
      setError(
        requestError.message ||
          (isEditMode ? "Failed to update class." : "Failed to add class.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>{isEditMode ? "Edit Class" : "Add Class"}</h2>
          <p>
            {isEditMode
              ? "Update the class record."
              : "Create a class record for your school."}
          </p>
        </div>
      </div>

      <section className="dashboard-card">
        {loading && isEditMode ? (
          <p>Loading class...</p>
        ) : (
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="grade_id">Grade</label>
            <select
              id="grade_id"
              name="grade_id"
              value={formData.grade_id}
              onChange={handleChange}
              required
              disabled={optionsLoading}
            >
              <option value="">
                {optionsLoading ? "Loading grades..." : "Select grade"}
              </option>
              {grades.map((grade) => (
                <option key={grade.grade_id} value={grade.grade_id}>
                  {grade.name}
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
              disabled={optionsLoading}
            >
              <option value="">
                {optionsLoading
                  ? "Loading academic years..."
                  : "Select academic year"}
              </option>
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
            <label htmlFor="name">Class name</label>
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
            <label htmlFor="homeroom_teacher_id">Homeroom teacher</label>
            <select
              id="homeroom_teacher_id"
              name="homeroom_teacher_id"
              value={formData.homeroom_teacher_id}
              onChange={handleChange}
              disabled={optionsLoading}
            >
              <option value="">
                {optionsLoading
                  ? "Loading teachers..."
                  : "No homeroom teacher"}
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.teacher_id} value={teacher.teacher_id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

            <button type="submit" disabled={loading || optionsLoading}>
              {loading
                ? isEditMode
                  ? "Saving class..."
                  : "Adding class..."
                : isEditMode
                  ? "Save changes"
                  : "Add class"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/classes")}
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

export default ClassForm;
