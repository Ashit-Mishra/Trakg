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
  getStudents,
  createStudent,
  downloadStudentTemplate,
  importStudents,
  Student,
} from "../../api/students";

import { getClassSections } from "../../api/class-sections";

import { Button } from "../../components/ui/Button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

import { DataTable } from "../../components/ui/DataTable";


export function Students() {
  const queryClient = useQueryClient();


  // =========================
  // FORM STATE
  // =========================

  const [showForm, setShowForm] = useState(false);

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classSectionId, setClassSectionId] = useState("");

  // NEW: PASSWORD
  const [password, setPassword] = useState("");

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");


  // =========================
  // GET STUDENTS
  // =========================

  const {
    data: students = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });


  // =========================
  // GET CLASS SECTIONS
  // =========================

  const {
    data: classSections = [],
    isLoading: classSectionsLoading,
  } = useQuery({
    queryKey: ["class-sections"],
    queryFn: getClassSections,
  });


  // =========================
  // CREATE STUDENT
  // =========================

  const createMutation = useMutation({
    mutationFn: createStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      // Clear form
      setUserId("");
      setName("");
      setEmail("");
      setRollNumber("");
      setClassSectionId("");
      setPassword("");

      setError("");
      setShowForm(false);
    },

    onError: (err: any) => {
      console.error("Create student error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create student."
      );
    },
  });


  // =========================
  // CREATE STUDENT
  // =========================

  const handleCreate = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");


    if (!userId.trim()) {
      setError("User ID is required.");
      return;
    }


    if (userId.trim().length < 4) {
      setError(
        "User ID must be at least 4 characters."
      );
      return;
    }


    if (!name.trim()) {
      setError("Name is required.");
      return;
    }


    if (!email.trim()) {
      setError("Email is required.");
      return;
    }


    if (!rollNumber.trim()) {
      setError("Roll number is required.");
      return;
    }


    if (!classSectionId) {
      setError(
        "Please select a class section."
      );
      return;
    }


    // NEW: PASSWORD VALIDATION
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }


    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }


    createMutation.mutate({
      userId: userId.trim(),
      name: name.trim(),
      email: email.trim(),
      rollNumber: rollNumber.trim(),
      classSectionId: Number(classSectionId),

      // NEW
      password: password,
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
      const result = await importStudents(file);

      console.log(
        "Student import result:",
        result
      );

      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      if (
        result?.failedRows &&
        result.failedRows > 0
      ) {
        setError(
          `${result.failedRows} student(s) failed to import.`
        );
      }
    } catch (err: any) {
      console.error(
        "Student import error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to import students."
      );
    }

    // Allow the same file to be selected again
    event.target.value = "";
  };


  // =========================
  // SEARCH
  // =========================

  const filteredStudents = Array.isArray(
    students
  )
    ? students.filter(
        (student: Student) => {
          const query =
            search.toLowerCase();

          return (
            student.rollNumber
              ?.toLowerCase()
              .includes(query) ||

            student.user?.name
              ?.toLowerCase()
              .includes(query) ||

            student.user?.email
              ?.toLowerCase()
              .includes(query) ||

            student.classSection?.sectionName
              ?.toLowerCase()
              .includes(query) ||

            student.classSection?.department
              ?.departmentCode
              ?.toLowerCase()
              .includes(query)
          );
        }
      )
    : [];


  // =========================
  // TABLE COLUMNS
  // =========================

  const columns = [
    {
      key: "rollNumber",
      header: "Roll No.",

      render: (student: Student) => (
        <span className="font-medium">
          {student.rollNumber}
        </span>
      ),
    },

    {
      key: "name",
      header: "Name",

      render: (student: Student) => (
        <span>
          {student.user?.name || "N/A"}
        </span>
      ),
    },

    {
      key: "email",
      header: "Email",

      render: (student: Student) => (
        <span>
          {student.user?.email || "N/A"}
        </span>
      ),
    },

    {
      key: "department",
      header: "Department",

      render: (student: Student) => (
        <span>
          {student.classSection?.department
            ?.departmentCode || "N/A"}
        </span>
      ),
    },

    {
      key: "classSection",
      header: "Class Section",

      render: (student: Student) => (
        <span>
          {student.classSection
            ?.sectionName || "N/A"}
        </span>
      ),
    },

    {
      key: "semester",
      header: "Semester",

      render: (student: Student) => (
        <span>
          {student.classSection?.semester
            ?.semesterNumber
            ? `Semester ${student.classSection.semester.semesterNumber}`
            : "N/A"}
        </span>
      ),
    },

    {
      key: "status",
      header: "Status",

      render: (student: Student) => (
        <span
          className={
            student.user?.isActive
              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
              : "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
          }
        >
          {student.user?.isActive
            ? "Active"
            : "Inactive"}
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
            Students
          </h1>

          <p className="mt-1 text-gray-500">
            Manage student records.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          {/* DOWNLOAD TEMPLATE */}

          <Button
            type="button"
            onClick={
              downloadStudentTemplate
            }
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


          {/* ADD STUDENT */}

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

                Add Student
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
              Create Student
            </CardTitle>
          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleCreate}
              className="space-y-5"
            >

              {/* USER ID */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  User ID
                </label>

                <input
                  type="text"
                  value={userId}
                  onChange={(event) =>
                    setUserId(
                      event.target.value
                    )
                  }
                  placeholder="e.g. STU001"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Must be between 4 and
                  30 characters.
                </p>
              </div>


              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Rahul Kumar"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>


              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="e.g. rahul@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>


              {/* ROLL NUMBER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Roll Number
                </label>

                <input
                  type="text"
                  value={rollNumber}
                  onChange={(event) =>
                    setRollNumber(
                      event.target.value
                    )
                  }
                  placeholder="e.g. 23IT001"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm uppercase outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>


              {/* CLASS SECTION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Class Section
                </label>

                <select
                  value={classSectionId}
                  onChange={(event) =>
                    setClassSectionId(
                      event.target.value
                    )
                  }
                  disabled={
                    classSectionsLoading
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
                >
                  <option value="">
                    {classSectionsLoading
                      ? "Loading class sections..."
                      : "Select class section"}
                  </option>

                  {classSections.map(
                    (section) => (
                      <option
                        key={section.id}
                        value={section.id}
                      >
                        {section.department
                          ?.departmentCode
                          ? `${section.department.departmentCode} - `
                          : ""}

                        {section.sectionName}

                        {section.semester
                          ?.semesterNumber
                          ? ` (Semester ${section.semester.semesterNumber})`
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </div>


              {/* PASSWORD */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter login password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <p className="mt-1 text-xs text-gray-500">
                  This password will be used by the
                  student to log in.
                </p>
              </div>


              {/* FORM BUTTONS */}

              <div className="flex gap-3">

                <Button
                  type="submit"
                  isLoading={
                    createMutation.isPending
                  }
                >
                  Create Student
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);

                    setUserId("");
                    setName("");
                    setEmail("");
                    setRollNumber("");
                    setClassSectionId("");
                    setPassword("");

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
          STUDENTS TABLE
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
              placeholder="Search students..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>


          {/* TABLE */}

          {isError ? (
            <div className="py-12 text-center text-red-600">
              Failed to load students.
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredStudents}
              isLoading={isLoading}
            />
          )}

        </CardContent>

      </Card>

    </div>
  );
}