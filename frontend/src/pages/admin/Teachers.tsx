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
  getTeachers,
  createTeacher,
  importTeachers,
  downloadTeacherTemplateFile,
  Teacher,
} from "../../api/teachers";

import { getDepartments } from "../../api/departments";

import { Button } from "../../components/ui/Button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

import { DataTable } from "../../components/ui/DataTable";

export function Teachers() {
  const queryClient = useQueryClient();

  // =========================
  // FORM STATE
  // =========================

  const [showForm, setShowForm] =
    useState(false);

  const [userId, setUserId] =
    useState("");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [departmentId, setDepartmentId] =
    useState("");

  const [designation, setDesignation] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================
  // GET TEACHERS
  // =========================

  const {
    data: teachers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
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
  // CREATE TEACHER
  // =========================

  const createMutation =
    useMutation({
      mutationFn: createTeacher,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["teachers"],
        });

        setUserId("");
        setName("");
        setEmail("");
        setDepartmentId("");
        setDesignation("");

        setError("");
        setShowForm(false);
      },

      onError: (err: any) => {
        console.error(
          "Create teacher error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to create teacher."
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

    if (!userId.trim()) {
      setError(
        "User ID is required."
      );
      return;
    }

    if (userId.trim().length < 4) {
      setError(
        "User ID must be at least 4 characters."
      );
      return;
    }

    if (!name.trim()) {
      setError(
        "Name is required."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Email is required."
      );
      return;
    }

    if (!departmentId) {
      setError(
        "Please select a department."
      );
      return;
    }

    if (!designation.trim()) {
      setError(
        "Designation is required."
      );
      return;
    }

    createMutation.mutate({
      userId: userId.trim(),
      name: name.trim(),
      email: email.trim(),
      departmentId:
        Number(departmentId),
      designation:
        designation.trim(),
    });
  };

  // =========================
  // IMPORT EXCEL
  // =========================

  const handleImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    try {
      const result =
        await importTeachers(file);

      console.log(
        "Teacher import result:",
        result
      );

      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      if (
        result?.failedRows &&
        result.failedRows > 0
      ) {
        setError(
          `${result.failedRows} teacher(s) failed to import.`
        );

        console.log(
          "Import errors:",
          result.errors
        );
      }
    } catch (err: any) {
      console.error(
        "Teacher import error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to import teachers."
      );
    }

    event.target.value = "";
  };

  // =========================
  // SEARCH
  // =========================

  const filteredTeachers =
    Array.isArray(teachers)
      ? teachers.filter(
          (teacher: Teacher) => {
            const query =
              search.toLowerCase();

            return (
              teacher.user?.name
                ?.toLowerCase()
                .includes(query) ||

              teacher.user?.email
                ?.toLowerCase()
                .includes(query) ||

              teacher.user?.userId
                ?.toLowerCase()
                .includes(query) ||

              teacher.department
                ?.departmentCode
                ?.toLowerCase()
                .includes(query) ||

              teacher.department
                ?.departmentName
                ?.toLowerCase()
                .includes(query) ||

              teacher.designation
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
      key: "userId",
      header: "User ID",

      render: (
        teacher: Teacher
      ) => (
        <span className="font-medium">
          {teacher.user?.userId ||
            "N/A"}
        </span>
      ),
    },

    {
      key: "name",
      header: "Name",

      render: (
        teacher: Teacher
      ) => (
        <span>
          {teacher.user?.name ||
            "N/A"}
        </span>
      ),
    },

    {
      key: "email",
      header: "Email",

      render: (
        teacher: Teacher
      ) => (
        <span>
          {teacher.user?.email ||
            "N/A"}
        </span>
      ),
    },

    {
      key: "department",
      header: "Department",

      render: (
        teacher: Teacher
      ) => (
        <span>
          {teacher.department
            ?.departmentCode ||
            "N/A"}
        </span>
      ),
    },

    {
      key: "designation",
      header: "Designation",

      render: (
        teacher: Teacher
      ) => (
        <span>
          {teacher.designation ||
            "N/A"}
        </span>
      ),
    },

    {
      key: "status",
      header: "Status",

      render: (
        teacher: Teacher
      ) => (
        <span
          className={
            teacher.user?.enabled
              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
              : "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
          }
        >
          {teacher.user?.enabled
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

      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-text">
            Teachers
          </h1>

          <p className="mt-1 text-gray-500">
            Manage teacher records.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          {/* TEMPLATE */}

          <Button
            type="button"
            onClick={
              downloadTeacherTemplateFile
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
              onChange={
                handleImport
              }
            />

          </label>

          {/* ADD */}

          <Button
            type="button"
            onClick={() => {
              setShowForm(
                !showForm
              );

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

                Add Teacher
              </>
            )}
          </Button>

        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">

          <AlertCircle
            size={18}
          />

          {error}

        </div>
      )}

      {/* CREATE FORM */}

      {showForm && (
        <Card>

          <CardHeader>
            <CardTitle>
              Create Teacher
            </CardTitle>
          </CardHeader>

          <CardContent>

            <form
              onSubmit={
                handleCreate
              }
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
                  placeholder="e.g. TCH001"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
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
                  placeholder="e.g. John Doe"
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
                  placeholder="e.g. john@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* DEPARTMENT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Department
                </label>

                <select
                  value={
                    departmentId
                  }
                  onChange={(event) =>
                    setDepartmentId(
                      event.target.value
                    )
                  }
                  disabled={
                    departmentsLoading
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
                >

                  <option value="">
                    {departmentsLoading
                      ? "Loading departments..."
                      : "Select department"}
                  </option>

                  {departments.map(
                    (
                      department: any
                    ) => (
                      <option
                        key={
                          department.id
                        }
                        value={
                          department.id
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

              {/* DESIGNATION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Designation
                </label>

                <input
                  type="text"
                  value={
                    designation
                  }
                  onChange={(event) =>
                    setDesignation(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Assistant Professor"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">

                <Button
                  type="submit"
                  isLoading={
                    createMutation.isPending
                  }
                >
                  Create Teacher
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(
                      false
                    );

                    setUserId("");
                    setName("");
                    setEmail("");
                    setDepartmentId("");
                    setDesignation("");

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

      {/* TEACHERS TABLE */}

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
              placeholder="Search teachers..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

          </div>

          {/* TABLE */}

          {isError ? (
            <div className="py-12 text-center text-red-600">
              Failed to load teachers.
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={
                filteredTeachers
              }
              isLoading={
                isLoading
              }
            />
          )}

        </CardContent>

      </Card>

    </div>
  );
}