import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Download,
  Upload,
  Plus,
  X,
  Search,
  AlertCircle,
} from "lucide-react";

import {
  getTeachers,
  Teacher,
} from "../../api/teachers";

import {
  getSubjects,
} from "../../api/subjects";

import {
  getClassSections,
  ClassSection,
} from "../../api/class-sections";

import {
  getAllAssignments,
  assignTeacher,
  importTeacherAssignments,
  downloadTeacherAssignmentTemplateFile,
  TeacherAssignment,
} from "../../api/teacher-assignments";

import { Button } from "../../components/ui/Button";


export function Assignments() {
  const queryClient = useQueryClient();

  // ============================================================
  // FORM STATE
  // ============================================================

  const [showForm, setShowForm] = useState(false);

  const [teacherId, setTeacherId] =
    useState<number | "">("");

  const [subjectId, setSubjectId] =
    useState<number | "">("");

  const [classSectionId, setClassSectionId] =
    useState<number | "">("");

  const [search, setSearch] = useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  // ============================================================
  // GET TEACHERS
  // ============================================================

  const {
    data: teachersData,
    isLoading: teachersLoading,
    isError: teachersError,
  } = useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const teachers: Teacher[] =
    Array.isArray(teachersData)
      ? teachersData
      : [];


  // ============================================================
  // GET SUBJECTS
  // ============================================================

  const {
    data: subjectsData,
    isLoading: subjectsLoading,
    isError: subjectsError,
  } = useQuery<any[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const subjects: any[] =
    Array.isArray(subjectsData)
      ? subjectsData
      : [];


  // ============================================================
  // GET CLASS SECTIONS
  // ============================================================

  const {
    data: classSectionsData,
    isLoading: classSectionsLoading,
    isError: classSectionsError,
  } = useQuery<ClassSection[]>({
    queryKey: ["class-sections"],
    queryFn: getClassSections,
  });

  const classSections: ClassSection[] =
    Array.isArray(classSectionsData)
      ? classSectionsData
      : [];


  // ============================================================
  // GET ASSIGNMENTS
  // ============================================================

  const {
    data: assignmentsData,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
  } = useQuery<TeacherAssignment[]>({
    queryKey: ["teacher-assignments"],
    queryFn: getAllAssignments,
  });

  const assignments: TeacherAssignment[] =
    Array.isArray(assignmentsData)
      ? assignmentsData
      : [];


  // ============================================================
  // DEBUG
  // ============================================================

  console.log("Teachers:", teachers);
  console.log("Subjects:", subjects);
  console.log("Class Sections:", classSections);
  console.log("Assignments:", assignments);


  // ============================================================
  // CREATE ASSIGNMENT
  // ============================================================

  const assignMutation = useMutation({
    mutationFn: assignTeacher,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });

      setTeacherId("");
      setSubjectId("");
      setClassSectionId("");

      setSuccessMessage(
        "Teacher assigned successfully."
      );

      setErrorMessage("");

      setShowForm(false);
    },

    onError: (error: any) => {
      setSuccessMessage("");

      setErrorMessage(
        error?.response?.data?.message ||
        "Failed to assign teacher."
      );
    },
  });


  // ============================================================
  // IMPORT
  // ============================================================

  const importMutation = useMutation({
    mutationFn: importTeacherAssignments,

    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-assignments"],
      });

      setSuccessMessage(
        `Import completed. ${
          response?.importedRows ?? 0
        } row(s) imported.`
      );

      setErrorMessage("");
    },

    onError: (error: any) => {
      setSuccessMessage("");

      setErrorMessage(
        error?.response?.data?.message ||
        "Failed to import assignments."
      );
    },
  });


  // ============================================================
  // SEARCH ASSIGNMENTS
  // ============================================================

  const filteredAssignments = useMemo(() => {
    if (!search.trim()) {
      return assignments;
    }

    const query =
      search.toLowerCase().trim();

    return assignments.filter(
      (assignment: any) => {

        const teacherName =
          assignment?.teacher?.user?.name ||
          assignment?.teacherName ||
          "";

        const teacherUserId =
          assignment?.teacher?.user?.userId ||
          "";

        const subjectCode =
          assignment?.subject?.subjectCode ||
          assignment?.subjectCode ||
          "";

        const subjectName =
          assignment?.subject?.subjectName ||
          assignment?.subjectName ||
          "";

        const sectionName =
          assignment?.classSection?.sectionName ||
          assignment?.classSectionName ||
          "";

        const department =
          assignment?.subject?.department?.departmentCode ||
          assignment?.department ||
          "";

        const semester =
          assignment?.subject?.semester?.semesterNumber ||
          assignment?.semester ||
          "";

        const text = `
          ${teacherName}
          ${teacherUserId}
          ${subjectCode}
          ${subjectName}
          ${sectionName}
          ${department}
          ${semester}
        `.toLowerCase();

        return text.includes(query);
      }
    );
  }, [assignments, search]);


  // ============================================================
  // SUBMIT ASSIGNMENT
  // ============================================================

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      teacherId === "" ||
      subjectId === "" ||
      classSectionId === ""
    ) {
      setErrorMessage(
        "Please select a teacher, subject and class section."
      );

      return;
    }

    assignMutation.mutate({
      teacherId: Number(teacherId),
      subjectId: Number(subjectId),
      classSectionId: Number(classSectionId),
    });
  };


  // ============================================================
  // IMPORT FILE
  // ============================================================

  const handleImport = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.name
        .toLowerCase()
        .endsWith(".xlsx")
    ) {
      setErrorMessage(
        "Please select an .xlsx file."
      );

      e.target.value = "";
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    importMutation.mutate(file);

    e.target.value = "";
  };


  // ============================================================
  // CLOSE FORM
  // ============================================================

  const closeForm = () => {
    setShowForm(false);

    setTeacherId("");
    setSubjectId("");
    setClassSectionId("");

    setErrorMessage("");
    setSuccessMessage("");
  };


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Teacher Assignments
          </h1>

          <p className="mt-2 text-lg text-slate-500">
            Assign teachers to subjects and class sections.
          </p>
        </div>


        <div className="flex flex-wrap gap-3">

          {/* TEMPLATE */}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              downloadTeacherAssignmentTemplateFile()
            }
          >
            <Download size={18} />

            Template
          </Button>


          {/* IMPORT */}

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">

            <Upload size={18} />

            Import

            <input
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={handleImport}
            />

          </label>


          {/* ASSIGN */}

          <Button
            type="button"
            onClick={() => {
              setShowForm(true);
              setErrorMessage("");
              setSuccessMessage("");
            }}
          >
            <Plus size={18} />

            Assign Teacher
          </Button>

        </div>
      </div>


      {/* ======================================================
          SUCCESS MESSAGE
      ====================================================== */}

      {successMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {successMessage}
        </div>
      )}


      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">

          <AlertCircle size={18} />

          {errorMessage}

        </div>
      )}


      {/* ======================================================
          ASSIGN FORM
      ====================================================== */}

      {showForm && (
        <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">

          {/* FORM HEADER */}

          <div className="mb-6 flex items-start justify-between">

            <div>

              <h2 className="text-2xl font-semibold text-slate-900">
                Assign Teacher
              </h2>

              <p className="mt-1 text-slate-500">
                Select a teacher, subject and class section.
              </p>

            </div>


            <button
              type="button"
              onClick={closeForm}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={22} />
            </button>

          </div>


          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
          >

            {/* ==================================================
                TEACHER
            ================================================== */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Teacher
              </label>

              <select
                value={teacherId}
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setTeacherId(
                    value
                      ? Number(value)
                      : ""
                  );
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-500"
              >

                <option value="">
                  {teachersLoading
                    ? "Loading teachers..."
                    : "Select Teacher"}
                </option>


                {teachers.map(
                  (teacher) => (
                    <option
                      key={teacher.id}
                      value={teacher.id}
                    >
                      {teacher.user?.name ||
                        teacher.user?.userId ||
                        `Teacher ${teacher.id}`}
                    </option>
                  )
                )}

              </select>


              {!teachersLoading &&
                teachers.length === 0 && (
                  <p className="mt-2 text-sm text-red-500">
                    No teachers found.
                  </p>
                )}


              {teachersError && (
                <p className="mt-2 text-sm text-red-500">
                  Failed to load teachers.
                </p>
              )}

            </div>


            {/* ==================================================
                SUBJECT
            ================================================== */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Subject
              </label>

              <select
                value={subjectId}
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setSubjectId(
                    value
                      ? Number(value)
                      : ""
                  );
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-500"
              >

                <option value="">
                  {subjectsLoading
                    ? "Loading subjects..."
                    : "Select Subject"}
                </option>


                {subjects.map(
                  (subject: any) => (
                    <option
                      key={subject.id}
                      value={subject.id}
                    >
                      {subject.subjectCode}
                      {" - "}
                      {subject.subjectName}
                    </option>
                  )
                )}

              </select>


              {!subjectsLoading &&
                subjects.length === 0 && (
                  <p className="mt-2 text-sm text-red-500">
                    No subjects found.
                  </p>
                )}


              {subjectsError && (
                <p className="mt-2 text-sm text-red-500">
                  Failed to load subjects.
                </p>
              )}

            </div>


            {/* ==================================================
                CLASS SECTION
            ================================================== */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Class Section
              </label>

              <select
                value={classSectionId}
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setClassSectionId(
                    value
                      ? Number(value)
                      : ""
                  );
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-500"
              >

                <option value="">
                  {classSectionsLoading
                    ? "Loading class sections..."
                    : "Select Class Section"}
                </option>


                {classSections.map(
                  (section) => (
                    <option
                      key={section.id}
                      value={section.id}
                    >
                      {section.sectionName}

                      {section.department?.departmentCode
                        ? ` - ${section.department.departmentCode}`
                        : ""}

                      {section.semester?.semesterNumber
                        ? ` - Sem ${section.semester.semesterNumber}`
                        : ""}
                    </option>
                  )
                )}

              </select>


              {!classSectionsLoading &&
                classSections.length === 0 && (
                  <p className="mt-2 text-sm text-red-500">
                    No class sections found.
                  </p>
                )}


              {classSectionsError && (
                <p className="mt-2 text-sm text-red-500">
                  Failed to load class sections.
                </p>
              )}

            </div>


            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="flex gap-3 md:col-span-3">

              <Button
                type="submit"
                disabled={
                  assignMutation.isPending
                }
              >
                {assignMutation.isPending
                  ? "Assigning..."
                  : "Assign Teacher"}
              </Button>


              <Button
                type="button"
                variant="outline"
                onClick={closeForm}
              >
                Cancel
              </Button>

            </div>

          </form>
        </div>
      )}


      {/* ======================================================
          ASSIGNMENTS LIST
      ====================================================== */}

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

        {/* SEARCH */}

        <div className="relative mb-6 max-w-xl">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search assignments..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
          />

        </div>


        {/* LOADING */}

        {assignmentsLoading && (
          <div className="py-12 text-center text-slate-500">
            Loading assignments...
          </div>
        )}


        {/* ERROR */}

        {!assignmentsLoading &&
          assignmentsError && (
            <div className="py-12 text-center text-red-500">
              Failed to load assignments.
            </div>
          )}


        {/* TABLE */}

        {!assignmentsLoading &&
          !assignmentsError && (
            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="border-b border-slate-100 text-left">

                    <th className="px-4 py-4 text-sm font-semibold text-slate-500">
                      TEACHER
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-slate-500">
                      SUBJECT
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-slate-500">
                      SEMESTER
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-slate-500">
                      CLASS SECTION
                    </th>

                    <th className="px-4 py-4 text-sm font-semibold text-slate-500">
                      DEPARTMENT
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredAssignments.length ===
                    0 ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-slate-500"
                      >
                        No assignments found.
                      </td>

                    </tr>

                  ) : (

                    filteredAssignments.map(
                      (assignment: any) => {

                        const teacherName =
                          assignment?.teacher?.user?.name ||
                          assignment?.teacherName ||
                          "N/A";

                        const subjectCode =
                          assignment?.subject?.subjectCode ||
                          assignment?.subjectCode ||
                          "N/A";

                        const subjectName =
                          assignment?.subject?.subjectName ||
                          assignment?.subjectName ||
                          "";

                        const semester =
                          assignment?.subject?.semester?.semesterNumber ||
                          assignment?.semester ||
                          "N/A";

                        const sectionName =
                          assignment?.classSection?.sectionName ||
                          assignment?.classSectionName ||
                          "N/A";

                        const department =
                          assignment?.subject?.department?.departmentCode ||
                          assignment?.department ||
                          assignment?.classSection?.department?.departmentCode ||
                          "N/A";

                        return (
                          <tr
                            key={
                              assignment.id ??
                              assignment.assignmentId
                            }
                            className="border-b border-slate-50 hover:bg-slate-50"
                          >

                            <td className="px-4 py-4 font-medium text-slate-800">
                              {teacherName}
                            </td>


                            <td className="px-4 py-4 text-slate-700">

                              <div>
                                {subjectCode}
                              </div>

                              {subjectName && (
                                <div className="text-sm text-slate-400">
                                  {subjectName}
                                </div>
                              )}

                            </td>


                            <td className="px-4 py-4 text-slate-700">
                              {semester}
                            </td>


                            <td className="px-4 py-4 text-slate-700">
                              {sectionName}
                            </td>


                            <td className="px-4 py-4 text-slate-700">
                              {department}
                            </td>

                          </tr>
                        );
                      }
                    )

                  )}

                </tbody>

              </table>

            </div>
          )}

      </div>

    </div>
  );
}