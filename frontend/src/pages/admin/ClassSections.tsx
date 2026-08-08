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
    getClassSections,
    createClassSection,
    importClassSections,
    downloadClassSectionTemplateFile,
    ClassSectionRequest,
} from "../../api/class-sections";

import { getSemesters } from "../../api/semesters";

import { ClassSection } from "../../types";

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
import { Badge } from "../../components/ui/Badge";

export function ClassSections() {
    const queryClient = useQueryClient();

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    const [showForm, setShowForm] =
        useState(false);

    const [sectionName, setSectionName] =
        useState("");

    const [semesterId, setSemesterId] =
        useState("");

    const [createError, setCreateError] =
        useState("");

    const [importError, setImportError] =
        useState("");

    /*
     * =========================
     * GET CLASS SECTIONS
     * =========================
     */

    const {
        data: classSections = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["class-sections"],
        queryFn: getClassSections,
    });

    /*
     * =========================
     * GET SEMESTERS
     * =========================
     */

    const {
        data: semesters = [],
        isLoading: semestersLoading,
    } = useQuery({
        queryKey: ["semesters"],
        queryFn: getSemesters,
    });

    /*
     * =========================
     * CREATE CLASS SECTION
     * =========================
     */

    const createMutation = useMutation({
        mutationFn: (
            request: ClassSectionRequest
        ) => createClassSection(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["class-sections"],
            });

            setSectionName("");
            setSemesterId("");

            setCreateError("");
            setShowForm(false);
        },

        onError: (error: any) => {
            setCreateError(
                error.response?.data?.message ||
                    "Failed to create class section."
            );
        },
    });

    /*
     * =========================
     * IMPORT
     * =========================
     */

    const importMutation = useMutation({
        mutationFn: (file: File) =>
            importClassSections(file),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["class-sections"],
            });

            setImportError("");
        },

        onError: (error: any) => {
            setImportError(
                error.response?.data?.message ||
                    "Failed to import class sections."
            );
        },
    });

    /*
     * =========================
     * CREATE HANDLER
     * =========================
     */

    const handleCreateClassSection = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setCreateError("");

        if (!sectionName.trim()) {
            setCreateError(
                "Section name is required."
            );
            return;
        }

        if (!semesterId) {
            setCreateError(
                "Please select a semester."
            );
            return;
        }

        createMutation.mutate({
            sectionName: sectionName.trim(),
            semesterId: Number(semesterId),
        });
    };

    /*
     * =========================
     * FILE IMPORT
     * =========================
     */

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setImportError("");

        importMutation.mutate(file);

        event.target.value = "";
    };

    /*
     * =========================
     * TABLE
     * =========================
     */

    const columns = [
        {
            key: "sectionName",
            header: "Section",
            render: (
                section: ClassSection
            ) => section.sectionName,
        },

        {
            key: "semester",
            header: "Semester",
            render: (
                section: ClassSection
            ) =>
                section.semester?.semesterName ||
                `Semester ${section.semester?.semesterNumber}` ||
                "N/A",
        },

        {
            key: "department",
            header: "Department",
            render: (
                section: ClassSection
            ) =>
                section.department
                    ?.departmentName ||
                "N/A",
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
                        Class Sections
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage class sections.
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    {/* TEMPLATE */}

                    <Button
                        type="button"
                        onClick={
                            downloadClassSectionTemplateFile
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
                        onChange={
                            handleFileChange
                        }
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

                        Add Class Section
                    </Button>

                </div>

            </div>

            {/* =========================
                IMPORT ERROR
            ========================= */}

            {importError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle
                        size={18}
                    />

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
                            Add Class Section
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <form
                            onSubmit={
                                handleCreateClassSection
                            }
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >

                            {/* SECTION NAME */}

                            <Input
                                label="Section Name"
                                type="text"
                                value={sectionName}
                                onChange={(event) =>
                                    setSectionName(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. A"
                            />

                            {/* SEMESTER */}

                            <div className="flex flex-col gap-2">

                                <label className="text-sm font-medium text-gray-700">
                                    Semester
                                </label>

                                <select
                                    value={
                                        semesterId
                                    }
                                    onChange={(event) =>
                                        setSemesterId(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        semestersLoading
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                                >

                                    <option value="">
                                        {semestersLoading
                                            ? "Loading semesters..."
                                            : "Select semester"}
                                    </option>

                                    {semesters.map(
                                        (
                                            semester: any
                                        ) => (
                                            <option
                                                key={
                                                    semester.id
                                                }
                                                value={
                                                    semester.id
                                                }
                                            >
                                                {semester.name ||
                                                    `Semester ${semester.number}`}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* ERROR */}

                            {createError && (
                                <div className="md:col-span-2 flex items-center gap-2 text-sm text-red-600">

                                    <AlertCircle
                                        size={18}
                                    />

                                    {createError}

                                </div>
                            )}

                            {/* BUTTONS */}

                            <div className="md:col-span-2 flex gap-3">

                                <Button
                                    type="submit"
                                    isLoading={
                                        createMutation.isPending
                                    }
                                >
                                    Create Class Section
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(
                                            false
                                        );

                                        setCreateError(
                                            ""
                                        );
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
                TABLE
            ========================= */}

            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">

                <div className="max-w-md mb-6">
                    <SearchBar />
                </div>

                {isError ? (
                    <div className="py-12 text-center text-red-600">
                        Failed to load class
                        sections.
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={classSections}
                        isLoading={
                            isLoading
                        }
                    />
                )}

            </div>

        </div>
    );
}