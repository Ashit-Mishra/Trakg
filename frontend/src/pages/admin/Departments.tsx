import React, { useRef, useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    Plus,
    Upload,
    Download,
    AlertCircle,
} from "lucide-react";

import {
    getDepartments,
    createDepartment,
    importDepartments,
    downloadDepartmentTemplateFile,
    DepartmentRequest,
} from "../../api/departments";

import { Department } from "../../types";

import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { SearchBar } from "../../components/ui/SearchBar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import {
    getAcademicSessions,
} from "../../api/academic-sessions";

export function Departments() {
    const queryClient = useQueryClient();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showForm, setShowForm] = useState(false);

    const [departmentCode, setDepartmentCode] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [academicSessionId, setAcademicSessionId] =
        useState("");

    const [createError, setCreateError] = useState("");
    const [importError, setImportError] = useState("");
    const {
        data: academicSessions = [],
        isLoading: sessionsLoading,
    } = useQuery({
        queryKey: ["academic-sessions"],
        queryFn: getAcademicSessions,
    });

    /*
     * =========================
     * GET DEPARTMENTS
     * =========================
     */

    const {
        data: departments = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["departments"],
        queryFn: getDepartments,
    });

    /*
     * =========================
     * CREATE DEPARTMENT
     * =========================
     */

    const createMutation = useMutation({
        mutationFn: (request: DepartmentRequest) =>
            createDepartment(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });

            setDepartmentCode("");
            setDepartmentName("");
            setAcademicSessionId("");

            setCreateError("");
            setShowForm(false);
        },

        onError: (error: any) => {
            setCreateError(
                error.response?.data?.message ||
                    "Failed to create department."
            );
        },
    });

    /*
     * =========================
     * IMPORT DEPARTMENTS
     * =========================
     */

    const importMutation = useMutation({
        mutationFn: (file: File) =>
            importDepartments(file),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["departments"],
            });

            setImportError("");
        },

        onError: (error: any) => {
            setImportError(
                error.response?.data?.message ||
                    "Failed to import departments."
            );
        },
    });

    /*
     * =========================
     * CREATE HANDLER
     * =========================
     */

    const handleCreateDepartment = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setCreateError("");

        if (!departmentCode.trim()) {
            setCreateError(
                "Department code is required."
            );
            return;
        }

        if (!departmentName.trim()) {
            setCreateError(
                "Department name is required."
            );
            return;
        }

        if (!academicSessionId) {
            setCreateError(
                "Academic session is required."
            );
            return;
        }

        createMutation.mutate({
            departmentCode: departmentCode.trim(),
            departmentName: departmentName.trim(),
            academicSessionId: Number(
                academicSessionId
            ),
        });
    };

    /*
     * =========================
     * EXCEL IMPORT
     * =========================
     */

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setImportError("");

        importMutation.mutate(file);

        event.target.value = "";
    };

    /*
     * =========================
     * TABLE COLUMNS
     * =========================
     */

const columns = [
    {
        key: "departmentCode",
        header: "Code",
        render: (department: Department) =>
            department.departmentCode,
    },

    {
        key: "departmentName",
        header: "Department",
        render: (department: Department) =>
            department.departmentName,
    },

    {
        key: "academicSession",
        header: "Academic Session",
        render: (department: Department) =>
            department.academicSession?.sessionName || "N/A"
    },
];

    return (
        <div className="space-y-6">

            {/* =========================
                HEADER
            ========================= */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-semibold text-text">
                        Departments
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage academic departments.
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    {/* TEMPLATE */}

                    <Button
                        type="button"
                        onClick={
                            downloadDepartmentTemplateFile
                        }
                    >
                        <Download
                            size={18}
                            className="mr-2"
                        />

                        Template
                    </Button>

                    {/* IMPORT */}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <Button
                        type="button"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        isLoading={
                            importMutation.isPending
                        }
                    >
                        <Upload
                            size={18}
                            className="mr-2"
                        />

                        Import
                    </Button>

                    {/* ADD */}

                    <Button
                        type="button"
                        onClick={() =>
                            setShowForm(!showForm)
                        }
                    >
                        <Plus
                            size={18}
                            className="mr-2"
                        />

                        Add Department
                    </Button>

                </div>

            </div>

            {/* =========================
                IMPORT ERROR
            ========================= */}

            {importError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle size={18} />

                    {importError}
                </div>
            )}

            {/* =========================
                CREATE FORM
            ========================= */}

            {showForm && (
                <Card>

                    <CardHeader>
                        <CardTitle>
                            Add Department
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <form
                            onSubmit={
                                handleCreateDepartment
                            }
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >

                            <Input
                                label="Department Code"
                                type="text"
                                value={departmentCode}
                                onChange={(event) =>
                                    setDepartmentCode(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. CSE"
                            />

                            <Input
                                label="Department Name"
                                type="text"
                                value={departmentName}
                                onChange={(event) =>
                                    setDepartmentName(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. Computer Science and Engineering"
                            />

                            <div className="flex flex-col gap-2">
                                          <label className="text-sm font-medium text-gray-700">
                                              Academic Session
                                          </label>

                                          <select
                                              value={academicSessionId}
                                              onChange={(event) =>
                                                  setAcademicSessionId(event.target.value)
                                              }
                                              disabled={sessionsLoading}
                                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                          >
                                              <option value="">
                                                  {sessionsLoading
                                                      ? "Loading sessions..."
                                                      : "Select academic session"}
                                              </option>

                                              {academicSessions.map((session) => (
                                                  <option
                                                      key={session.id}
                                                      value={session.id}
                                                  >
                                                      {session.sessionName}
                                                      {session.active ? " (Active)" : ""}
                                                  </option>
                                              ))}
                                          </select>
                            </div>

                            {createError && (
                                <div className="md:col-span-2 flex items-center gap-2 text-sm text-red-600">
                                    <AlertCircle
                                        size={18}
                                    />

                                    {createError}
                                </div>
                            )}

                            <div className="md:col-span-2 flex gap-3">

                                <Button
                                    type="submit"
                                    isLoading={
                                        createMutation.isPending
                                    }
                                >
                                    Create Department
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setCreateError("");
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
                DEPARTMENT TABLE
            ========================= */}

            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">

                <div className="max-w-md mb-6">
                    <SearchBar />
                </div>

                {isError ? (
                    <div className="py-12 text-center text-red-600">
                        Failed to load departments.
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={departments}
                        isLoading={isLoading}
                    />
                )}

            </div>

        </div>
    );
}