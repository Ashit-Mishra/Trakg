import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

import { DataTable } from "../../components/ui/DataTable";
import { Badge } from "../../components/ui/Badge";

import {
  getMyAttendance,
  AttendanceRecord,
} from "../../api/student";

export function AttendanceDetails() {
  /* =========================================================
     FETCH MY ATTENDANCE
     ========================================================= */

  const {
    data: attendance = [],
    isLoading,
    isError,
  } = useQuery<AttendanceRecord[]>({
    queryKey: ["student-my-attendance"],
    queryFn: getMyAttendance,
  });

  /* =========================================================
     TABLE COLUMNS
     ========================================================= */

  const columns = [
    {
      key: "date",
      header: "Date",
      render: (record: AttendanceRecord) =>
        record.attendanceDate,
    },

    {
      key: "subject",
      header: "Subject",
      render: (record: AttendanceRecord) => (
        <div>
          <p className="font-medium text-text">
            {record.subjectName}
          </p>

          <p className="text-xs text-gray-500">
            {record.subjectCode}
          </p>
        </div>
      ),
    },

    {
      key: "status",
      header: "Status",
      render: (record: AttendanceRecord) => (
        <Badge
          variant={
            record.status === "PRESENT"
              ? "success"
              : "danger"
          }
        >
          {record.status}
        </Badge>
      ),
    },

    {
      key: "markedBy",
      header: "Marked By",
      render: (record: AttendanceRecord) =>
        record.teacherName,
    },
  ];

  /* =========================================================
     LOADING
     ========================================================= */

  if (isLoading) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Attendance Details
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View your complete attendance records.
          </p>
        </div>

        <Card>
          <CardContent className="py-10">
            <p className="text-center text-gray-500">
              Loading attendance records...
            </p>
          </CardContent>
        </Card>

      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (isError) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            Attendance Details
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View your complete attendance records.
          </p>
        </div>

        <Card>
          <CardContent className="py-10">
            <p className="text-center text-red-500">
              Failed to load attendance records.
            </p>
          </CardContent>
        </Card>

      </div>
    );
  }

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Attendance Details
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          View your complete attendance records.
        </p>
      </div>

      <Card>

        <CardHeader>
          <CardTitle>
            Detailed Records
          </CardTitle>
        </CardHeader>

        <CardContent>

          {attendance.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">
                No attendance records found.
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={attendance.map((record) => ({
                ...record,
                id: record.attendanceId,
              }))}
            />
          )}

        </CardContent>

      </Card>

    </div>
  );
}