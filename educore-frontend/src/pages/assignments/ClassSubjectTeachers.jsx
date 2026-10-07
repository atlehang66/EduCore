import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function ClassSubjectTeachers() {
  const { hasPermission } = useAuth();
  const canManageAssignments = hasPermission("academics.manage");
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [editingAcademicYearId, setEditingAcademicYearId] = useState("");
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [optionsError, setOptionsError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!canManageAssignments) {
      return;
    }

    async function loadOptions() {
      try {
        const [classesResponse, subjectsResponse, teachersResponse, yearsResponse] =
          await Promise.all([
            api.get("/classes"),
            api.get("/subjects"),
            api.get("/teachers"),
            api.get("/academic-years"),
          ]);

        setClasses(classesResponse.data.classes);
        setSubjects(subjectsResponse.data.subjects);
        setTeachers(teachersResponse.data.teachers);
        setAcademicYears(yearsResponse.data.academicYears);
      } catch (requestError) {
        setOptionsError(requestError.message || "Failed to load assignment options.");
      } finally {
        setOptionsLoading(false);
      }
    }

    loadOptions();
  }, [canManageAssignments]);

  useEffect(() => {
    if (!canManageAssignments || !selectedClassId || !selectedSubjectId) {
      return;
    }

    async function loadAssignments() {
      setAssignmentsLoading(true);

      try {
        const response = await api.get(
          `/classes/${selectedClassId}/subjects/${selectedSubjectId}/teachers`
        );
        setAssignments(response.data.teachers);
      } catch (requestError) {
        setAssignmentError(
          requestError.message || "Failed to load assigned teachers."
        );
      } finally {
        setAssignmentsLoading(false);
      }
    }

    loadAssignments();
  }, [canManageAssignments, selectedClassId, selectedSubjectId]);

  function handleClassChange(event) {
    setSelectedClassId(event.target.value);
    setAssignments([]);
    setAssignmentError("");
    setEditingAssignmentId(null);
  }

  function handleSubjectChange(event) {
    setSelectedSubjectId(event.target.value);
    setAssignments([]);
    setAssignmentError("");
    setEditingAssignmentId(null);
  }

  async function refreshAssignments() {
    const response = await api.get(
      `/classes/${selectedClassId}/subjects/${selectedSubjectId}/teachers`
    );
    setAssignments(response.data.teachers);
  }

  async function handleAssignTeacher(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!selectedTeacherId || !academicYearId) {
      setFormError("Teacher and academic year are required.");
      return;
    }

    setSaving(true);

    try {
      await api.post(
        `/classes/${selectedClassId}/subjects/${selectedSubjectId}/teachers`,
        {
          teacher_id: Number(selectedTeacherId),
          academic_year_id: Number(academicYearId),
        }
      );
      await refreshAssignments();
      setSelectedTeacherId("");
      setAcademicYearId("");
      setSuccessMessage("Teacher assigned successfully.");
    } catch (requestError) {
      setFormError(requestError.message || "Failed to assign teacher.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateAssignment(assignment) {
    setFormError("");
    setSuccessMessage("");

    if (!editingAcademicYearId) {
      setFormError("Academic year is required.");
      return;
    }

    setSaving(true);

    try {
      await api.put(
        `/classes/${selectedClassId}/subjects/${selectedSubjectId}/teachers/${assignment.teacher_id}`,
        { academic_year_id: Number(editingAcademicYearId) }
      );
      await refreshAssignments();
      setEditingAssignmentId(null);
      setEditingAcademicYearId("");
      setSuccessMessage("Assignment updated successfully.");
    } catch (requestError) {
      setFormError(requestError.message || "Failed to update assignment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAssignment(assignment) {
    const confirmed = window.confirm(
      `Remove ${assignment.first_name} ${assignment.last_name} from this subject? This deletion is permanent.`
    );

    if (!confirmed) {
      return;
    }

    setAssignmentError("");
    setSuccessMessage("");
    setDeletingId(assignment.teacher_id);

    try {
      await api.delete(
        `/classes/${selectedClassId}/subjects/${selectedSubjectId}/teachers/${assignment.teacher_id}`
      );
      await refreshAssignments();
      setSuccessMessage("Assignment deleted successfully.");
    } catch (requestError) {
      setAssignmentError(
        requestError.message || "Failed to delete assignment."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function startEditing(assignment) {
    setFormError("");
    setSuccessMessage("");
    setEditingAssignmentId(assignment.id);
    setEditingAcademicYearId(String(assignment.academic_year_id));
  }

  if (!canManageAssignments) {
    return (
      <div className="dashboard">
        <section className="dashboard-card">
          <p role="alert">You do not have permission to manage assignments.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>Class Subject Teachers</h2>
          <p>Manage teachers assigned to each class subject.</p>
        </div>
      </div>

      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h3>Assignment Selection</h3>
            <p>Choose a class and subject to view assignments.</p>
          </div>
        </div>

        {optionsLoading && <p>Loading assignment options...</p>}
        {!optionsLoading && optionsError && (
          <p role="alert" style={{ color: "#b91c1c" }}>
            {optionsError}
          </p>
        )}

        {!optionsLoading && !optionsError && (
          <div className="form-group">
            <label htmlFor="class_id">Class</label>
            <select
              id="class_id"
              value={selectedClassId}
              onChange={handleClassChange}
            >
              <option value="">Select class</option>
              {classes.map((classRecord) => (
                <option key={classRecord.class_id} value={classRecord.class_id}>
                  {classRecord.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {!optionsLoading && !optionsError && (
          <div className="form-group">
            <label htmlFor="subject_id">Subject</label>
            <select
              id="subject_id"
              value={selectedSubjectId}
              onChange={handleSubjectChange}
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.subject_id} value={subject.subject_id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {selectedClassId && selectedSubjectId && (
        <>
          <section className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Assigned Teachers</h3>
                <p>Teachers currently assigned to this class subject.</p>
              </div>
            </div>

            {assignmentsLoading && <p>Loading assigned teachers...</p>}
            {!assignmentsLoading && assignmentError && (
              <p role="alert" style={{ color: "#b91c1c" }}>
                {assignmentError}
              </p>
            )}
            {!assignmentsLoading && !assignmentError && assignments.length === 0 && (
              <p>No teachers are assigned yet.</p>
            )}

            {!assignmentsLoading && !assignmentError && assignments.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={headerCellStyle}>Teacher</th>
                      <th style={headerCellStyle}>Academic year</th>
                      <th style={headerCellStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td style={bodyCellStyle}>
                          {assignment.first_name} {assignment.last_name}
                        </td>
                        <td style={bodyCellStyle}>
                          {editingAssignmentId === assignment.id ? (
                            <select
                              value={editingAcademicYearId}
                              onChange={(event) =>
                                setEditingAcademicYearId(event.target.value)
                              }
                              disabled={saving}
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
                          ) : (
                            getAcademicYearName(
                              academicYears,
                              assignment.academic_year_id
                            )
                          )}
                        </td>
                        <td style={bodyCellStyle}>
                          {editingAssignmentId === assignment.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateAssignment(assignment)}
                                disabled={saving}
                              >
                                {saving ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingAssignmentId(null)}
                                disabled={saving}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditing(assignment)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAssignment(assignment)}
                                disabled={deletingId === assignment.teacher_id}
                              >
                                {deletingId === assignment.teacher_id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="dashboard-card">
            <div className="card-header">
              <div>
                <h3>Assign Teacher</h3>
                <p>Add a teacher to the selected class subject.</p>
              </div>
            </div>

            <form onSubmit={handleAssignTeacher}>
              <div className="form-group">
                <label htmlFor="teacher_id">Teacher</label>
                <select
                  id="teacher_id"
                  value={selectedTeacherId}
                  onChange={(event) => setSelectedTeacherId(event.target.value)}
                  disabled={saving}
                  required
                >
                  <option value="">Select teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.teacher_id} value={teacher.teacher_id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="academic_year_id">Academic year</label>
                <select
                  id="academic_year_id"
                  value={academicYearId}
                  onChange={(event) => setAcademicYearId(event.target.value)}
                  disabled={saving}
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

              {formError && (
                <p role="alert" style={{ color: "#b91c1c" }}>
                  {formError}
                </p>
              )}
              {successMessage && <p role="status">{successMessage}</p>}

              <button type="submit" disabled={saving}>
                {saving ? "Assigning..." : "Assign Teacher"}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}

function getAcademicYearName(academicYears, academicYearId) {
  const academicYear = academicYears.find(
    (item) => String(item.academic_year_id) === String(academicYearId)
  );

  return academicYear?.name || academicYearId;
}

const headerCellStyle = {
  padding: "12px 10px",
  borderBottom: "1px solid #e5e7eb",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
};

const bodyCellStyle = {
  padding: "14px 10px",
  borderBottom: "1px solid #f0f0f0",
  fontSize: "14px",
};

export default ClassSubjectTeachers;
