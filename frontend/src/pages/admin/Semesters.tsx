import React, { useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Plus, AlertCircle } from "lucide-react";

import {
    getSemesters,
    createSemester,
} from "../../api/semesters";

import { getDepartments } from "../../api/departments";

import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { DataTable } from "../../components/ui/DataTable";
import { SearchBar } from "../../components/ui/SearchBar";

interface Department {
    id: number;
    departmentCode: string;
    departmentName: string;
}

interface Semester {
    id: number;
    semesterNumber: number;
    department?: Department;
}

interface SemesterRequest {
    semesterNumber: number;
    departmentId: number;
}

export function Semesters() {

    const queryClient = useQueryClient();

    const [showForm, setShowForm] = useState(false);

    const [semesterNumber, setSemesterNumber] =
        useState("");

    const [departmentId, setDepartmentId] =
        useState("");

    const [error, setError] =
        useState("");

    /*
     * ==========================
     * GET SEMESTERS
     * ==========================
     */

    const {
        data: semesters = [],
        isLoading,
        isError,
    } = useQuery<Semester[]>({
        queryKey: ["semesters"],
        queryFn: getSemesters,
    });

    /*
     * ==========================
     * GET DEPARTMENTS
     * ==========================
     */

    const {
        data: departments = [],
        isLoading: departmentsLoading,
    } = useQuery<Department[]>({
        queryKey: ["departments"],
        queryFn: getDepartments,
    });

    /*
     * ==========================
     * CREATE SEMESTER
     * ==========================
     */

    const createMutation = useMutation({
        mutationFn: (request: SemesterRequest) =>
            createSemester(request),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["semesters"],
            });

            setSemesterNumber("");
            setDepartmentId("");
            setError("");
            setShowForm(false);
        },

        onError: (error: any) => {

            console.error(
                "Create semester error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create semester."
            );
        },
    });

    /*
     * ==========================
     * CREATE HANDLER
     * ==========================
     */

    const handleCreateSemester = (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setError("");

        /*
         * Validate semester number
         */

        if (!semesterNumber) {

            setError(
                "Semester number is required."
            );

            return;
        }

        const number =
            Number(semesterNumber);

        if (
            !Number.isInteger(number) ||
            number < 1 ||
            number > 8
        ) {

            setError(
                "Semester number must be between 1 and 8."
            );

            return;
        }

        /*
         * Validate department
         */

        if (!departmentId) {

            setError(
                "Please select a department."
            );

            return;
        }

        /*
         * Send request
         */

        createMutation.mutate({
            semesterNumber: number,
            departmentId: Number(departmentId),
        });
    };

    /*
     * ==========================
     * TABLE COLUMNS
     * ==========================
     */

    const columns = [
        {
            key: "semesterNumber",
            header: "Semester",

            render: (
                semester: Semester
            ) => (
                <span className="font-medium">
                    Semester {semester.semesterNumber}
                </span>
            ),
        },

        {
            key: "department",
            header: "Department",

            render: (
                semester: Semester
            ) => (
                <div>
                    <p className="font-medium">
                        {semester.department?.departmentName ||
                            "N/A"}
                    </p>

                    {semester.department?.departmentCode && (
                        <p className="text-xs text-gray-500">
                            {
                                semester.department
                                    .departmentCode
                            }
                        </p>
                    )}
                </div>
            ),
        },

        {
            key: "id",
            header: "ID",

            render: (
                semester: Semester
            ) => semester.id,
        },
    ];

    /*
     * ==========================
     * UI
     * ==========================
     */

    return (
        <div className="space-y-6">

            {/* ==========================
                HEADER
            ========================== */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-semibold text-text">
                        Semesters
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage academic semesters.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() => {

                        setShowForm(
                            !showForm
                        );

                        setError("");
                    }}
                >
                    <Plus
                        size={18}
                        className="mr-2"
                    />

                    Add Semester
                </Button>

            </div>

            {/* ==========================
                CREATE FORM
            ========================== */}

            {showForm && (

                <Card>

                    <CardHeader>
                        <CardTitle>
                            Create Semester
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <form
                            onSubmit={
                                handleCreateSemester
                            }
                            className="space-y-5"
                        >

                            {/* SEMESTER NUMBER */}

                            <Input
                                label="Semester Number"
                                type="number"
                                min={1}
                                max={8}
                                value={
                                    semesterNumber
                                }
                                onChange={(event) =>
                                    setSemesterNumber(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter semester number (1-8)"
                            />

                            {/* DEPARTMENT */}

                            <div className="flex flex-col gap-2">

                                <label className="text-sm font-medium text-gray-700">
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
                                            department
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

                            {/* ERROR */}

                            {error && (

                                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">

                                    <AlertCircle
                                        size={18}
                                    />

                                    {error}

                                </div>

                            )}

                            {/* BUTTONS */}

                            <div className="flex gap-3">

                                <Button
                                    type="submit"
                                    isLoading={
                                        createMutation.isPending
                                    }
                                >
                                    Create Semester
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => {

                                        setShowForm(
                                            false
                                        );

                                        setSemesterNumber(
                                            ""
                                        );

                                        setDepartmentId(
                                            ""
                                        );

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

            {/* ==========================
                SEMESTER TABLE
            ========================== */}

            <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">

                <div className="max-w-md mb-6">
                    <SearchBar />
                </div>

                {isError ? (

                    <div className="py-12 text-center text-red-600">
                        Failed to load semesters.
                    </div>

                ) : (

                    <DataTable
                        columns={columns}
                        data={semesters}
                        isLoading={isLoading}
                    />

                )}

            </div>

        </div>
    );
}