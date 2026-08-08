import React, { useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    Plus,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import {
    getAcademicSessions,
    createAcademicSession,
    activateAcademicSession,
    AcademicSessionRequest,
} from "../../api/academic-sessions";

import { AcademicSession } from "../../types";

import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";

export function AcademicSessions() {
    const queryClient = useQueryClient();

    const [showForm, setShowForm] = useState(false);

    const [sessionName, setSessionName] = useState("");
    const [startDate, setStartDate] = useState("");

    const [createError, setCreateError] = useState("");

    /*
     * =========================
     * GET SESSIONS
     * =========================
     */

    const {
        data: sessions = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["academic-sessions"],
        queryFn: getAcademicSessions,
    });

    /*
     * =========================
     * CREATE SESSION
     * =========================
     */

    const createMutation = useMutation({
        mutationFn: (
            request: AcademicSessionRequest
        ) => createAcademicSession(request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["academic-sessions"],
            });

            setSessionName("");
            setStartDate("");
            setCreateError("");
            setShowForm(false);
        },

        onError: (error: any) => {
            setCreateError(
                error.response?.data?.message ||
                    "Failed to create academic session."
            );
        },
    });

    /*
     * =========================
     * ACTIVATE SESSION
     * =========================
     */

    const activateMutation = useMutation({
        mutationFn: (id: number) =>
            activateAcademicSession(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["academic-sessions"],
            });
        },

        onError: (error: any) => {
            alert(
                error.response?.data?.message ||
                    "Failed to activate academic session."
            );
        },
    });

    /*
     * =========================
     * CREATE HANDLER
     * =========================
     */

    const handleCreateSession = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setCreateError("");

        if (!sessionName.trim()) {
            setCreateError(
                "Session name is required."
            );
            return;
        }

        if (!startDate) {
            setCreateError(
                "Start date is required."
            );
            return;
        }

        createMutation.mutate({
            sessionName: sessionName.trim(),
            startDate,
        });
    };

    /*
     * =========================
     * TABLE COLUMNS
     * =========================
     */

    const columns = [
        {
            key: "sessionName",
            header: "Session",
            render: (
                session: AcademicSession
            ) => session.sessionName,
        },

        {
            key: "startDate",
            header: "Start Date",
            render: (
                session: AcademicSession
            ) => session.startDate,
        },

        {
            key: "active",
            header: "Status",

            render: (
                session: AcademicSession
            ) => (
                <Badge
                    variant={
                        session.active
                            ? "success"
                            : "danger"
                    }
                >
                    {session.active
                        ? "Active"
                        : "Inactive"}
                </Badge>
            ),
        },

        {
            key: "actions",
            header: "Actions",

            render: (
                session: AcademicSession
            ) => (
                session.active ? (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle size={16} />
                        Active
                    </span>
                ) : (
                    <Button
                        type="button"
                        onClick={() =>
                            activateMutation.mutate(
                                session.id
                            )
                        }
                        isLoading={
                            activateMutation.isPending &&
                            activateMutation.variables ===
                                session.id
                        }
                    >
                        Activate
                    </Button>
                )
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
                        Academic Sessions
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage academic sessions.
                    </p>
                </div>

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

                    Add Session
                </Button>

            </div>

            {/* =========================
                CREATE FORM
            ========================= */}

            {showForm && (
                <Card>

                    <CardHeader>
                        <CardTitle>
                            Create Academic Session
                        </CardTitle>
                    </CardHeader>

                    <CardContent>

                        <form
                            onSubmit={
                                handleCreateSession
                            }
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >

                            <Input
                                label="Session Name"
                                type="text"
                                value={sessionName}
                                onChange={(event) =>
                                    setSessionName(
                                        event.target.value
                                    )
                                }
                                placeholder="e.g. 2025-26"
                            />

                            <Input
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(event) =>
                                    setStartDate(
                                        event.target.value
                                    )
                                }
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
                                    Create Session
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
                SESSION TABLE
            ========================= */}

            <Card>

                <CardHeader>
                    <CardTitle>
                        All Academic Sessions
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    {isError ? (
                        <div className="py-12 text-center text-red-600">
                            Failed to load academic
                            sessions.
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={sessions}
                            isLoading={isLoading}
                        />
                    )}

                </CardContent>

            </Card>

        </div>
    );
}