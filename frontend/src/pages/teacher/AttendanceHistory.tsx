import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  getTeacherAssignments,
  getAttendanceHistory,
  updateAttendance,
  TeacherAssignment,
  AttendanceRecord,
  AttendanceStatus,
} from "../../api/teacher";

export function AttendanceHistory() {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] =
    useState<number | null>(null);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD TEACHER ASSIGNMENTS
     ========================================================= */

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setLoadingAssignments(true);
        setError("");

        const data = await getTeacherAssignments();

        setAssignments(data);

        if (data.length > 0) {
          setSelectedAssignmentId(data[0].assignmentId);
        }
      } catch (err) {
        console.error("Failed to load assignments:", err);
        setError("Failed to load assignments.");
      } finally {
        setLoadingAssignments(false);
      }
    };

    loadAssignments();
  }, []);

  /* =========================================================
     LOAD ATTENDANCE HISTORY
     ========================================================= */

  useEffect(() => {
    if (selectedAssignmentId === null) {
      setRecords([]);
      return;
    }

    const loadAttendance = async () => {
      try {
        setLoadingRecords(true);
        setError("");

        const data = await getAttendanceHistory(
          selectedAssignmentId,
          date
        );

        setRecords(data);
      } catch (err) {
        console.error("Failed to load attendance:", err);
        setError("Failed to load attendance records.");
        setRecords([]);
      } finally {
        setLoadingRecords(false);
      }
    };

    loadAttendance();
  }, [selectedAssignmentId, date]);

  /* =========================================================
     UPDATE ATTENDANCE
     ========================================================= */

  const handleStatusChange = async (
    attendanceId: number,
    status: AttendanceStatus
  ) => {
    try {
      setUpdatingId(attendanceId);

      const updated = await updateAttendance(
        attendanceId,
        { status }
      );

      setRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.attendanceId === attendanceId
            ? updated
            : record
        )
      );
    } catch (err) {
      console.error("Failed to update attendance:", err);
      alert("Failed to update attendance.");
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     SELECTED ASSIGNMENT
     ========================================================= */

  const selectedAssignment = assignments.find(
    (assignment) =>
      assignment.assignmentId === selectedAssignmentId
  );

  /* =========================================================
     CALCULATE SUMMARY
     ========================================================= */

  const presentCount = records.filter(
    (record) => record.status === "PRESENT"
  ).length;

  const absentCount = records.filter(
    (record) => record.status === "ABSENT"
  ).length;

  const totalRecords = records.length;

  const presentPercentage =
    totalRecords > 0
      ? ((presentCount / totalRecords) * 100).toFixed(1)
      : "0.0";

  /* =========================================================
     UI
     ========================================================= */

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Attendance History
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          View and manage attendance records for your assigned classes.
        </p>
      </div>

      {/* FILTER CARD */}

      <Card>
        <CardHeader>
          <CardTitle>Select Assignment</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ASSIGNMENT */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment
              </label>

              <select
                value={selectedAssignmentId ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setSelectedAssignmentId(
                    value ? Number(value) : null
                  );
                }}
                disabled={loadingAssignments}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">
                  {loadingAssignments
                    ? "Loading assignments..."
                    : "Select Assignment"}
                </option>

                {assignments.map((assignment) => (
                  <option
                    key={assignment.assignmentId}
                    value={assignment.assignmentId}
                  >
                    {assignment.subjectCode} -{" "}
                    {assignment.subjectName} -{" "}
                    {assignment.classSection}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* ASSIGNMENT INFORMATION */}

          {selectedAssignment && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Subject
                </p>

                <p className="font-semibold mt-1">
                  {selectedAssignment.subjectName}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Subject Code
                </p>

                <p className="font-semibold mt-1">
                  {selectedAssignment.subjectCode}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Semester
                </p>

                <p className="font-semibold mt-1">
                  {selectedAssignment.semester}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Class Section
                </p>

                <p className="font-semibold mt-1">
                  {selectedAssignment.classSection}
                </p>
              </div>

            </div>
          )}
        </CardContent>
      </Card>

      {/* ERROR */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* SUMMARY */}

      {selectedAssignment && !loadingRecords && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">
                Total Students
              </p>

              <p className="text-2xl font-bold mt-1">
                {totalRecords}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">
                Present
              </p>

              <p className="text-2xl font-bold text-green-600 mt-1">
                {presentCount}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-gray-500">
                Attendance
              </p>

              <p className="text-2xl font-bold mt-1">
                {presentPercentage}%
              </p>
            </CardContent>
          </Card>

        </div>
      )}

      {/* ATTENDANCE TABLE */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Attendance Records
          </CardTitle>

          <Button
            variant="outline"
            onClick={async () => {
              if (selectedAssignmentId === null) {
                return;
              }

              try {
                setLoadingRecords(true);

                const data =
                  await getAttendanceHistory(
                    selectedAssignmentId,
                    date
                  );

                setRecords(data);
              } catch (err) {
                console.error(err);
                setError(
                  "Failed to refresh attendance records."
                );
              } finally {
                setLoadingRecords(false);
              }
            }}
          >
            Refresh
          </Button>
        </CardHeader>

        <CardContent>

          {loadingRecords ? (
            <div className="py-10 text-center text-gray-500">
              Loading attendance records...
            </div>
          ) : selectedAssignmentId === null ? (
            <div className="py-10 text-center text-gray-500">
              Select an assignment to view attendance.
            </div>
          ) : records.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No attendance records found for this date.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-gray-100">

                    <th className="text-left py-4 px-3 text-sm font-medium text-gray-500">
                      Student
                    </th>

                    <th className="text-left py-4 px-3 text-sm font-medium text-gray-500">
                      Roll Number
                    </th>

                    <th className="text-left py-4 px-3 text-sm font-medium text-gray-500">
                      Date
                    </th>

                    <th className="text-left py-4 px-3 text-sm font-medium text-gray-500">
                      Status
                    </th>

                    <th className="text-left py-4 px-3 text-sm font-medium text-gray-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {records.map((record) => (

                    <tr
                      key={record.attendanceId}
                      className="border-b border-gray-50"
                    >

                      <td className="py-4 px-3 font-medium text-text">
                        {record.studentName}
                      </td>

                      <td className="py-4 px-3 text-gray-600">
                        {record.rollNumber}
                      </td>

                      <td className="py-4 px-3 text-gray-600">
                        {record.attendanceDate}
                      </td>

                      <td className="py-4 px-3">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            record.status === "PRESENT"
                              ? "bg-green-100 text-green-700"
                              : record.status === "ABSENT"
                              ? "bg-red-100 text-red-700"
                              : record.status === "LATE"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {record.status}
                        </span>

                      </td>

                      <td className="py-4 px-3">

                        <div className="flex gap-2">

                          <button
                            disabled={
                              updatingId ===
                              record.attendanceId
                            }
                            onClick={() =>
                              handleStatusChange(
                                record.attendanceId,
                                "PRESENT"
                              )
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                          >
                            Present
                          </button>

                          <button
                            disabled={
                              updatingId ===
                              record.attendanceId
                            }
                            onClick={() =>
                              handleStatusChange(
                                record.attendanceId,
                                "ABSENT"
                              )
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                          >
                            Absent
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </CardContent>
      </Card>

    </div>
  );
}