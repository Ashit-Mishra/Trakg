import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getOverallAttendance,
  getSubjectWiseAttendance,
  OverallAttendanceResponse,
  SubjectAttendanceResponse,
} from "../../api/student";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

import { AttendanceRing } from "../../components/charts/AttendanceRing";

export function StudentDashboard() {
  /* =========================================================
     OVERALL ATTENDANCE
     ========================================================= */

  const {
    data: overall,
    isLoading: overallLoading,
    isError: overallError,
  } = useQuery<OverallAttendanceResponse>({
    queryKey: ["student-overall-attendance"],
    queryFn: getOverallAttendance,
  });

  /* =========================================================
     SUBJECT-WISE ATTENDANCE
     ========================================================= */

  const {
    data: subjects = [],
    isLoading: subjectsLoading,
    isError: subjectsError,
  } = useQuery<SubjectAttendanceResponse[]>({
    queryKey: ["student-subject-attendance"],
    queryFn: getSubjectWiseAttendance,
  });

  /* =========================================================
     LOADING
     ========================================================= */

  if (overallLoading || subjectsLoading) {
    return (
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">
            Student Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Loading your attendance summary...
          </p>
        </div>

      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (overallError || subjectsError || !overall) {
    return (
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">
            Student Dashboard
          </h1>

          <p className="text-red-500 mt-2">
            Failed to load attendance data.
          </p>

        </div>

      </div>
    );
  }

  /* =========================================================
     VALUES
     ========================================================= */

  const attendancePercentage =
    Number(overall.attendancePercentage) || 0;

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">
          Welcome back
        </h1>

        <p className="text-gray-500 mt-1">
          Here is your attendance summary for the current semester.
        </p>
      </div>


      {/* =====================================================
          ATTENDANCE SUMMARY
          ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ---------------------------------------------------
            OVERALL ATTENDANCE
            --------------------------------------------------- */}

        <Card className="md:col-span-1 flex flex-col justify-center items-center py-8">

          <AttendanceRing
            percentage={attendancePercentage}
            size={220}
          />

          <p className="mt-6 text-sm font-medium text-gray-500">
            Overall Attendance
          </p>

          <p className="text-sm text-gray-400 mt-2">
            {overall.presentClasses} present out of{" "}
            {overall.totalClasses} classes
          </p>

        </Card>


        {/* ---------------------------------------------------
            SUBJECT-WISE ATTENDANCE
            --------------------------------------------------- */}

        <Card className="md:col-span-2">

          <CardHeader>
            <CardTitle>
              Subject-wise Attendance
            </CardTitle>
          </CardHeader>

          <CardContent>

            {subjects.length === 0 ? (

              <div className="py-8 text-center">
                <p className="text-gray-500">
                  No attendance records found.
                </p>
              </div>

            ) : (

              <div className="space-y-6">

                {subjects.map((subject) => {

                  const percentage =
                    Number(
                      subject.attendancePercentage
                    ) || 0;

                  return (
                    <div
                      key={subject.subjectCode}
                    >

                      {/* Subject name + percentage */}

                      <div className="flex justify-between text-sm mb-2">

                        <div>
                          <span className="font-medium text-text">
                            {subject.subjectName}
                          </span>

                          <span className="text-xs text-gray-400 ml-2">
                            {subject.subjectCode}
                          </span>
                        </div>

                        <span
                          className={`font-medium ${
                            percentage < 75
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {percentage.toFixed(1)}%
                        </span>

                      </div>


                      {/* Progress bar */}

                      <div className="w-full bg-gray-100 rounded-full h-2.5">

                        <div
                          className={`h-2.5 rounded-full ${
                            percentage < 75
                              ? "bg-red-500"
                              : "bg-primary"
                          }`}
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />

                      </div>


                      {/* Classes */}

                      <p className="text-xs text-gray-400 mt-1">
                        {subject.presentClasses} present
                        {" / "}
                        {subject.totalClasses} classes
                      </p>

                    </div>
                  );
                })}

              </div>

            )}

          </CardContent>

        </Card>

      </div>


      {/* =====================================================
          ATTENDANCE WARNING
          ===================================================== */}

      {attendancePercentage < 75 && (
        <Card className="border-red-200 bg-red-50">

          <CardContent className="py-5">

            <p className="font-semibold text-red-700">
              Attendance Warning
            </p>

            <p className="text-sm text-red-600 mt-1">
              Your overall attendance is below 75%.
              Please attend more classes to improve
              your attendance.
            </p>

          </CardContent>

        </Card>
      )}

    </div>
  );
}