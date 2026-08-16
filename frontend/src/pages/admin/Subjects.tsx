import React, { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Plus,
  Download,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";

import {
  getSubjects,
  createSubject,
  downloadSubjectTemplate,
  importSubjects,
  Subject,
} from "../../api/subjects";

import { getSemesters } from "../../api/semesters";
import { getDepartments } from "../../api/departments";

import { Button } from "../../components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

import { DataTable } from "../../components/ui/DataTable";

export function Subjects() {
  const queryClient = useQueryClient();

  // =========================
  // FORM STATE
  // =========================

  const [showForm, setShowForm] = useState(false);

  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [semesterId, setSemesterId] = useState("");

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // =========================
  // GET SUBJECTS
  // =========================

  const {
    data: subjects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  // =========================
  // GET SEMESTERS
  // =========================

  const {
    data: semesters = [],
    isLoading: semestersLoading,
  } = useQuery({
    queryKey: ["semesters"],
    queryFn: getSemesters,
  });

  // =========================
  // GET DEPARTMENTS
  // =========================

  const {
    data: departments = [],
    isLoading: departmentsLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  // =========================
  // CREATE SUBJECT
  // =========================

  const createMutation = useMutation({
    mutationFn: createSubject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });

      setSubjectCode("");
      setSubjectName("");
      setDepartmentCode("");
      setSemesterId("");

      setError("");
      setShowForm(false);
    },

    onError: (err: any) => {
      console.error("Create subject error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create subject."
      );
    },
  });

  // =========================
  // CREATE HANDLER
  // =========================

  const handleCreate = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (!subjectCode.trim()) {
      setError("Subject code is required.");
      return;
    }

    if (!subjectName.trim()) {
      setError("Subject name is required.");
      return;
    }

    if (!departmentCode) {
      setError("Please select a department.");
      return;
    }

    if (!semesterId) {
      setError("Please select a semester.");
      return;
    }

    createMutation.mutate({
      subjectCode: subjectCode.trim(),
      subjectName: subjectName.trim(),
      departmentCode: departmentCode,
      semesterId: Number(semesterId),
    });
  };

  // =========================
  // IMPORT EXCEL
  // =========================

  const handleImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    try {
      const result = await importSubjects(file);

      console.log(
        "Subject import result:",
        result
      );

      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
    } catch (err: any) {
      console.error(
        "Subject import error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to import subjects."
      );
    }

    event.target.value = "";
  };

  // =========================
  // SEARCH
  // =========================

  const filteredSubjects = Array.isArray(subjects)
    ? subjects.filter((subject: Subject) => {
        const query = search.toLowerCase();

        return (
          subject.subjectCode
            ?.toLowerCase()
            .includes(query) ||
          subject.subjectName
            ?.toLowerCase()
            .includes(query) ||
          subject.department?.departmentCode
            ?.toLowerCase()
            .includes(query) ||
          String(
            subject.semester?.semesterNumber ?? ""
          ).includes(query)
        );
      })
    : [];

  // =========================
  // TABLE COLUMNS
  // =========================

  const columns = [
    {
      key: "subjectCode",
      header: "Code",

      render: (subject: Subject) => (
        <span className="font-medium">
          {subject.subjectCode}
        </span>
      ),
    },

    {
      key: "subjectName",
      header: "Subject",

      render: (subject: Subject) => (
        <span>
          {subject.subjectName}
        </span>
      ),
    },

    {
      key: "department",
      header: "Department",

      render: (subject: Subject) => (
        <span>
          {subject.department?.departmentCode ||
            "N/A"}
        </span>
      ),
    },

    {
      key: "semester",
      header: "Semester",

      render: (subject: Subject) => (
        <span>
          {subject.semester?.semesterNumber
            ? `Semester ${subject.semester.semesterNumber}`
            : "N/A"}
        </span>
      ),
    },
  ];

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-text">
            Subjects
          </h1>

          <p className="mt-1 text-gray-500">
            Manage subjects and their academic
            structure.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          {/* TEMPLATE */}

          <Button
            type="button"
            onClick={downloadSubjectTemplate}
          >
            <Download
              size={18}
              className="mr-2"
            />

            Template
          </Button>

          {/* IMPORT */}

          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">

            <Upload
              size={18}
              className="mr-2"
            />

            Import

            <input
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={handleImport}
            />

          </label>

          {/* ADD SUBJECT */}

          <Button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              setError("");
            }}
          >
            {showForm ? (
              <>
                <X
                  size={18}
                  className="mr-2"
                />

                Cancel
              </>
            ) : (
              <>
                <Plus
                  size={18}
                  className="mr-2"
                />

                Add Subject
              </>
            )}
          </Button>

        </div>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">

          <AlertCircle size={18} />

          {error}

        </div>
      )}

      {/* =========================
          CREATE FORM
      ========================= */}

      {showForm && (
        <Card>

          <CardHeader>
            <CardTitle>
              Create Subject
            </CardTitle>
          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleCreate}
              className="space-y-5"
            >

              {/* SUBJECT CODE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject Code
                </label>

                <input
                  type="text"
                  value={subjectCode}
                  onChange={(event) =>
                    setSubjectCode(
                      event.target.value.toUpperCase()
                    )
                  }
                  placeholder="e.g. KCS301"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* SUBJECT NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject Name
                </label>

                <input
                  type="text"
                  value={subjectName}
                  onChange={(event) =>
                    setSubjectName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Data Structures"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* DEPARTMENT DROPDOWN */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Department
                </label>

                <select
                  value={departmentCode}
                  onChange={(event) =>
                    setDepartmentCode(
                      event.target.value
                    )
                  }
                  disabled={departmentsLoading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
                >

                  <option value="">
                    {departmentsLoading
                      ? "Loading departments..."
                      : "Select department"}
                  </option>

                  {Array.isArray(departments) &&
                    departments.map(
                      (department: any) => (
                        <option
                          key={department.id}
                          value={
                            department.departmentCode
                          }
                        >
                          {
                            department.departmentCode
                          }{" "}
                          -{" "}
                          {
                            department.departmentName
                          }
                        </option>
                      )
                    )}

                </select>
              </div>

              {/* SEMESTER DROPDOWN */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Semester
                </label>

                <select
                  value={semesterId}
                  onChange={(event) =>
                    setSemesterId(
                      event.target.value
                    )
                  }
                  disabled={semestersLoading}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
                >

                  <option value="">
                    {semestersLoading
                      ? "Loading semesters..."
                      : "Select semester"}
                  </option>

                  {Array.isArray(semesters) &&
                    semesters.map(
                      (semester: any) => (
                        <option
                          key={semester.id}
                          value={semester.id}
                        >
                          Semester{" "}
                          {
                            semester.semesterNumber
                          }

                          {semester.department
                            ?.departmentCode
                            ? ` - ${semester.department.departmentCode}`
                            : ""}
                        </option>
                      )
                    )}

                </select>
              </div>

              {/* FORM BUTTONS */}

              <div className="flex gap-3">

                <Button
                  type="submit"
                  isLoading={
                    createMutation.isPending
                  }
                >
                  Create Subject
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);

                    setSubjectCode("");
                    setSubjectName("");
                    setDepartmentCode("");
                    setSemesterId("");

                    setError("");
                  }}
                >
                  Cancel
                </Button>

              </div>

            </form>

          </CardContent>

        </Card>
      )}

      {/* =========================
          SUBJECT TABLE
      ========================= */}

      <Card>

        <CardContent className="p-6">

          {/* SEARCH */}

          <div className="mb-6 max-w-md">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search subjects..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

          </div>

          {/* TABLE */}

          {isError ? (
            <div className="py-12 text-center text-red-600">
              Failed to load subjects.
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredSubjects}
              isLoading={isLoading}
            />
          )}

        </CardContent>

      </Card>

    </div>
  );
}