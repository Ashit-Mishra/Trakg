import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getTeacherAssignments,
  getAttendanceHistory,
  updateAttendance,
  TeacherAssignment,
  AttendanceRecord,
  AttendanceStatus,
} from "../../api/teacher";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

import { Button } from "../../components/ui/Button";

export function MyAssignments() {
  const queryClient = useQueryClient();

  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState<number | null>(null);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  /*
   * =========================================================
   * GET TEACHER ASSIGNMENTS
   * =========================================================
   */

  const {
    data: assignments = [],
    isLoading: assignmentsLoading,
    isError: assignmentsError,
  } = useQuery<TeacherAssignment[]>({
    queryKey: ["teacher-assignments"],
    queryFn: getTeacherAssignments,
  });

  /*
   * =========================================================
   * SELECT FIRST ASSIGNMENT
   * =========================================================
   */

  useEffect(() => {
    if (
      assignments.length > 0 &&
      selectedAssignmentId === null
    ) {
      setSelectedAssignmentId(
        assignments[0].assignmentId
      );
    }
  }, [assignments, selectedAssignmentId]);

  /*
   * =========================================================
   * GET ATTENDANCE
   * =========================================================
   */

  const {
    data: attendanceData = [],
    isLoading: attendanceLoading,
    isError: attendanceError,
    refetch,
  } = useQuery<AttendanceRecord[]>({
    queryKey: [
      "teacher-attendance",
      selectedAssignmentId,
      date,
    ],

    queryFn: () =>
      getAttendanceHistory(
        selectedAssignmentId!,
        date
      ),

    enabled: selectedAssignmentId !== null,
  });

  /*
   * =========================================================
   * UPDATE ATTENDANCE
   * =========================================================
   */

  const updateMutation = useMutation({
    mutationFn: ({
      attendanceId,
      status,
    }: {
      attendanceId: number;
      status: AttendanceStatus;
    }) =>
      updateAttendance(attendanceId, {
        status,
      }),

    onSuccess: (updatedRecord) => {
      queryClient.setQueryData<AttendanceRecord[]>(
        [
          "teacher-attendance",
          selectedAssignmentId,
          date,
        ],
        (current = []) =>
          current.map((record) =>
            record.attendanceId ===
            updatedRecord.attendanceId
              ? updatedRecord
              : record
          )
      );
    },

    onError: (error: any) => {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to update attendance."
      );
    },
  });

  /*
   * =========================================================
   * CHANGE STATUS
   * =========================================================
   */

  const handleStatusChange = (
    attendanceId: number,
    status: AttendanceStatus
  ) => {
    updateMutation.mutate({
      attendanceId,
      status,
    });
  };

  /*
   * =========================================================
   * SELECTED ASSIGNMENT
   * =========================================================
   */

  const selectedAssignment =
    assignments.find(
      (assignment) =>
        assignment.assignmentId ===
        selectedAssignmentId
    );

  /*
   * =========================================================
   * TAKE ATTENDANCE
   * =========================================================
   */

  const handleTakeAttendance = () => {
    if (selectedAssignmentId === null) {
      alert("Please select an assignment.");
      return;
    }

    window.location.href =
      `/teacher/attendance?assignmentId=${selectedAssignmentId}`;
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (assignmentsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          My Attendance
        </h1>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <p className="text-gray-500">
            Loading assignments...
          </p>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (assignmentsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          My Attendance
        </h1>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <p className="text-red-500">
            Failed to load your assignments.
          </p>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * NO ASSIGNMENTS
   * =========================================================
   */

  if (assignments.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          My Attendance
        </h1>

        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
          <p className="text-gray-500">
            You currently have no assignments.
          </p>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * MAIN UI
   * =========================================================
   */

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          My Attendance
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          View and manage attendance for your assigned
          classes.
        </p>
      </div>

      {/* =====================================================
          SELECT ASSIGNMENT
          ===================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>
            Select Assignment
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Assignment */}

            <div className="flex flex-col gap-2">

              <label className="text-sm font-medium text-text">
                Assignment
              </label>

              <select
                value={
                  selectedAssignmentId ?? ""
                }
                onChange={(e) =>
                  setSelectedAssignmentId(
                    Number(e.target.value)
                  )
                }
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >

                {assignments.map(
                  (assignment) => (
                    <option
                      key={
                        assignment.assignmentId
                      }
                      value={
                        assignment.assignmentId
                      }
                    >
                      {assignment.subjectCode} -{" "}
                      {assignment.subjectName} -{" "}
                      {assignment.classSection}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* Date */}

            <div className="flex flex-col gap-2">

              <label className="text-sm font-medium text-text">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />

            </div>

          </div>

          {/* Take Attendance Button */}

          <div className="mt-4 flex justify-end">

            <Button
              onClick={handleTakeAttendance}
            >
              Take Attendance
            </Button>

          </div>

        </CardContent>
      </Card>

      {/* =====================================================
          ASSIGNMENT INFORMATION
          ===================================================== */}

      {selectedAssignment && (
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">

          <div className="flex flex-wrap gap-8">

            <div>
              <p className="text-xs text-gray-500">
                Subject
              </p>

              <p className="font-semibold text-text mt-1">
                {selectedAssignment.subjectName}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Subject Code
              </p>

              <p className="font-semibold text-text mt-1">
                {selectedAssignment.subjectCode}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Semester
              </p>

              <p className="font-semibold text-text mt-1">
                {selectedAssignment.semester}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Class Section
              </p>

              <p className="font-semibold text-text mt-1">
                {selectedAssignment.classSection}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          ATTENDANCE RECORDS
          ===================================================== */}

      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle>
            Attendance Records
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            Refresh
          </Button>

        </CardHeader>

        <CardContent>

          {attendanceLoading ? (

            <p className="text-gray-500 py-6">
              Loading attendance...
            </p>

          ) : attendanceError ? (

            <p className="text-red-500 py-6">
              Failed to load attendance.
            </p>

          ) : attendanceData.length === 0 ? (

            <div className="py-10 text-center">

              <p className="text-gray-500">
                No attendance records found.
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Attendance has not been marked for
                this assignment on this date.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {attendanceData.map(
                (record) => (

                  <div
                    key={record.attendanceId}
                    className="flex items-center justify-between py-4"
                  >

                    {/* Student */}

                    <div className="flex flex-col">

                      <span className="font-medium text-text">
                        {record.studentName}
                      </span>

                      <span className="text-xs text-gray-500">
                        Roll No:{" "}
                        {record.rollNumber}
                      </span>

                    </div>

                    {/* Status */}

                    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">

                      <button
                        type="button"
                        disabled={
                          updateMutation.isPending
                        }
                        onClick={() =>
                          handleStatusChange(
                            record.attendanceId,
                            "PRESENT"
                          )
                        }
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          record.status ===
                          "PRESENT"
                            ? "bg-white shadow-sm text-green-600"
                            : "text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        Present
                      </button>

                      <button
                        type="button"
                        disabled={
                          updateMutation.isPending
                        }
                        onClick={() =>
                          handleStatusChange(
                            record.attendanceId,
                            "ABSENT"
                          )
                        }
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          record.status ===
                          "ABSENT"
                            ? "bg-white shadow-sm text-red-600"
                            : "text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        Absent
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
}