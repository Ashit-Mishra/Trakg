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
    getStudents,
    createStudent,
    importStudents,
    downloadStudentTemplateFile,
    StudentRequest,
} from "../../api/students";

import { Student } from "../../types";

import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { SearchBar } from "../../components/ui/SearchBar";
import { Badge } from "../../components/ui/Badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function Students() {
    const queryClient = useQueryClient();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showForm, setShowForm] = useState(false);

    const [userId, setUserId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [classSectionId, setClassSectionId] = useState("");

    const [createError, setCreateError] = useState("");
    const [importError, setImportError] = useState("");

    /*
     * =========================
     * GET STUDENTS
     * =========================
     */

    const {
        data: students = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["students"],
        queryFn: getStudents,
    });

    /*
     * =========================
     * CREATE STUDENT
     * =========================
     */

    const createMutation = useMutation({
        mutationFn: (request: StudentRequest) =>
            createStudent(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["students"],
            });

            setUserId("");
            setName("");
            setEmail("");
            setRollNumber("");
            setClassSectionId("");

            setCreateError("");
            setShowForm(false);
        },

        onError: (error: any) => {
            setCreateError(
                error.response?.data?.message ||
                    "Failed to create student."
            );
        },
    });

    /*
     * =========================
     * IMPORT STUDENTS
     * =========================
     */

    const importMutation = useMutation({
        mutationFn: (file: File) =>
            importStudents(file),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["students"],
            });

            setImportError("");
        },

        onError: (error: any) => {
            setImportError(
                error.response?.data?.message ||
                    "Failed to import students."
            );
        },
    });

    /*
     * =========================
     * CREATE HANDLER
     * =========================
     */

    const handleCreateStudent = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setCreateError("");

        if (!userId.trim()) {
            setCreateError("User ID is required.");
            return;
        }

        if (userId.trim().length < 4) {
            setCreateError(
                "User ID must be at least 4 characters."
            );
            return;
        }

        if (userId.trim().length > 30) {
            setCreateError(
                "User ID cannot exceed 30 characters."
            );
            return;
        }

        if (!name.trim()) {
            setCreateError("Name is required.");
            return;
        }

        if (name.trim().length < 3) {
            setCreateError(
                "Name must be at least 3 characters."
            );
            return;
        }

        if (name.trim().length > 100) {
            setCreateError(
                "Name cannot exceed 100 characters."
            );
            return;
        }

        if (!email.trim()) {
            setCreateError("Email is required.");
            return;
        }

        if (!rollNumber.trim()) {
            setCreateError("Roll number is required.");
            return;
        }

        if (!classSectionId) {
            setCreateError(
                "Class section ID is required."
            );
            return;
        }

        createMutation.mutate({
            userId: userId.trim(),
            name: name.trim(),
            email: email.trim(),
            rollNumber: rollNumber.trim(),
            classSectionId: Number(classSectionId),
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
            key: "rollNumber",
            header: "Roll No.",
        },

        {
            key: "name",
            header: "Name",
            render: (student: Student) =>
                student.user?.name || "N/A",
        },

        {
            key: "email",
            header: "Email",
            render: (student: Student) =>
                student.user?.email || "N/A",
        },

        {
            key: "classSection",
            header: "Class Section",
            render: (student: Student) =>
                student.classSection?.sectionName || "N/A",
        },

        {
            key: "status",
            header: "Status",

            render: (student: Student) => (
                <Badge
                    variant={
                        student.user?.isActive
                            ? "success"
                            : "danger"
                    }
                >
                    {student.user?.isActive
                        ? "Active"
                        : "Inactive"}
                </Badge>
            ),
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
                        Students
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage student records.
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    {/* DOWNLOAD TEMPLATE */}

                    <Button
                        type="button"
                        onClick={
                            downloadStudentTemplateFile
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

                    {/* ADD STUDENT */}

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

                        Add Student
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
                            Add Student
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <form
                            onSubmit={
                                handleCreateStudent
                            }
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >

                            <Input
                                label="User ID"
                                type="text"
                                value={userId}
                                onChange={(event) =>
                                    setUserId(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter user ID"
                            />

                            <Input
                                label="Name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter student name"
                            />

                            <Input
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter email"
                            />

                            <Input
                                label="Roll Number"
                                type="text"
                                value={rollNumber}
                                onChange={(event) =>
                                    setRollNumber(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter roll number"
                            />

                            <Input
                                label="Class Section ID"
                                type="number"
                                value={classSectionId}
                                onChange={(event) =>
                                    setClassSectionId(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter class section ID"
                            />

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
                                    Create Student
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
                STUDENT TABLE
            ========================= */}

            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">

                <div className="max-w-md mb-6">
                    <SearchBar />
                </div>

                {isError ? (
                    <div className="py-12 text-center text-red-600">
                        Failed to load students.
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={students}
                        isLoading={isLoading}
                    />
                )}

            </div>

        </div>
    );
}