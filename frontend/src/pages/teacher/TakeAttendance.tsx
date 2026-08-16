import React, { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  getTeacherAssignments,
  getAssignmentStudents,
  markAttendance,
  TeacherAssignment,
  TeacherStudent,
  AttendanceStatus,
} from "../../api/teacher";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

import { Button } from "../../components/ui/Button";

interface StudentAttendance {
  studentId: number;
  name: string;
  rollNumber: string;
  status: AttendanceStatus;
}

export function TakeAttendance() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  /*
   * =========================================================
   * ASSIGNMENT ID
   * =========================================================
   */

  const assignmentIdParam =
    searchParams.get("assignmentId");

  const numericAssignmentId =
    assignmentIdParam
      ? Number(assignmentIdParam)
      : NaN;

  /*
   * =========================================================
   * DATE
   * =========================================================
   */

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  /*
   * =========================================================
   * ATTENDANCE STATE
   * =========================================================
   */

  const [attendance, setAttendance] =
    useState<StudentAttendance[]>([]);

  /*
   * Used to make sure students are initialized only once
   * for the current assignment.
   *
   * This prevents:
   *
   * Maximum update depth exceeded
   */

  const initializedAssignment =
    useRef<number | null>(null);

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
   * FIND CURRENT ASSIGNMENT
   * =========================================================
   */

  const assignment = assignments.find(
    (item) =>
      item.assignmentId === numericAssignmentId
  );

  /*
   * =========================================================
   * GET STUDENTS
   * =========================================================
   */

  const {
    data: students = [],
    isLoading: studentsLoading,
    isError: studentsError,
    error: studentsErrorObject,
  } = useQuery<TeacherStudent[]>({
    queryKey: [
      "assignment-students",
      numericAssignmentId,
    ],

    queryFn: () =>
      getAssignmentStudents(
        numericAssignmentId
      ),

    enabled:
      Number.isFinite(numericAssignmentId) &&
      numericAssignmentId > 0,
  });

  /*
   * =========================================================
   * INITIALIZE ATTENDANCE
   * =========================================================
   *
   * IMPORTANT:
   * Do NOT blindly call setAttendance whenever
   * students changes.
   *
   * We initialize only once per assignment.
   */

  useEffect(() => {
    if (
      students.length === 0 ||
      !Number.isFinite(numericAssignmentId) ||
      numericAssignmentId <= 0
    ) {
      return;
    }

    if (
      initializedAssignment.current ===
      numericAssignmentId
    ) {
      return;
    }

    initializedAssignment.current =
      numericAssignmentId;

    setAttendance(
      students.map((student) => ({
        studentId: student.id,

        name:
          student.user?.name ??
          "Unknown Student",

        rollNumber:
          student.rollNumber,

        // Default everyone to PRESENT
        status: "PRESENT",
      }))
    );
  }, [
    students,
    numericAssignmentId,
  ]);

  /*
   * =========================================================
   * UPDATE STUDENT STATUS
   * =========================================================
   */

  const updateStatus = (
    studentId: number,
    status: AttendanceStatus
  ) => {
    setAttendance((current) =>
      current.map((student) =>
        student.studentId === studentId
          ? {
              ...student,
              status,
            }
          : student
      )
    );
  };

  /*
   * =========================================================
   * SAVE ATTENDANCE
   * =========================================================
   */

  const saveAttendanceMutation =
    useMutation({
      mutationFn: () =>
        markAttendance({
          assignmentId:
            numericAssignmentId,

          attendanceDate: date,

          students:
            attendance.map((student) => ({
              studentId:
                student.studentId,

              status:
                student.status,
            })),
        }),

      onSuccess: () => {
        alert(
          "Attendance saved successfully!"
        );

        /*
         * Go back to My Assignments
         */
        navigate("/teacher/assignments");
      },

      onError: (error: any) => {
        console.error(
          "Attendance error:",
          error
        );

        const message =
          error?.response?.data?.message ??
          "Failed to save attendance.";

        alert(message);
      },
    });

  /*
   * =========================================================
   * SAVE BUTTON
   * =========================================================
   */

  const handleSave = () => {
    if (
      !Number.isFinite(
        numericAssignmentId
      ) ||
      numericAssignmentId <= 0
    ) {
      alert("Invalid assignment.");
      return;
    }

    if (attendance.length === 0) {
      alert("No students found.");
      return;
    }

    saveAttendanceMutation.mutate();
  };

  /*
   * =========================================================
   * INVALID ASSIGNMENT
   * =========================================================
   */

  if (
    !assignmentIdParam ||
    !Number.isFinite(
      numericAssignmentId
    ) ||
    numericAssignmentId <= 0
  ) {
    return (
      <div className="space-y-6">

        <h1 className="text-2xl font-bold tracking-tight text-text">
          Take Attendance
        </h1>

        <Card>
          <CardContent>

            <p className="text-red-500 py-6">
              No valid assignment was selected.
            </p>

            <Button
              onClick={() =>
                navigate(
                  "/teacher/assignments"
                )
              }
            >
              Back to Assignments
            </Button>

          </CardContent>
        </Card>

      </div>
    );
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (
    assignmentsLoading ||
    studentsLoading
  ) {
    return (
      <div className="space-y-6">

        <h1 className="text-2xl font-bold tracking-tight text-text">
          Take Attendance
        </h1>

        <Card>
          <CardContent>

            <p className="text-gray-500 py-6">
              Loading students...
            </p>

          </CardContent>
        </Card>

      </div>
    );
  }

  /*
   * =========================================================
   * ASSIGNMENTS ERROR
   * =========================================================
   */

  if (assignmentsError) {
    return (
      <div className="space-y-6">

        <h1 className="text-2xl font-bold tracking-tight text-text">
          Take Attendance
        </h1>

        <Card>
          <CardContent>

            <p className="text-red-500 py-6">
              Failed to load teacher assignments.
            </p>

            <Button
              onClick={() =>
                navigate(
                  "/teacher/assignments"
                )
              }
            >
              Back to Assignments
            </Button>

          </CardContent>
        </Card>

      </div>
    );
  }

  /*
   * =========================================================
   * ASSIGNMENT NOT FOUND
   * =========================================================
   */

  if (!assignment) {
    return (
      <div className="space-y-6">

        <h1 className="text-2xl font-bold tracking-tight text-text">
          Take Attendance
        </h1>

        <Card>
          <CardContent>

            <p className="text-red-500 py-6">
              Assignment not found.
            </p>

            <p className="text-gray-500 text-sm mb-4">
              Assignment ID:{" "}
              {numericAssignmentId}
            </p>

            <Button
              onClick={() =>
                navigate(
                  "/teacher/assignments"
                )
              }
            >
              Back to Assignments
            </Button>

          </CardContent>
        </Card>

      </div>
    );
  }

  /*
   * =========================================================
   * STUDENT ERROR
   * =========================================================
   */

  if (studentsError) {
    console.error(
      "Failed to load assignment students:",
      studentsErrorObject
    );

    return (
      <div className="space-y-6">

        <h1 className="text-2xl font-bold tracking-tight text-text">
          Take Attendance
        </h1>

        <Card>
          <CardContent>

            <p className="text-red-500 py-6">
              Failed to load students.
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Assignment ID:{" "}
              {numericAssignmentId}
            </p>

            <Button
              onClick={() =>
                navigate(
                  "/teacher/assignments"
                )
              }
            >
              Back to Assignments
            </Button>

          </CardContent>
        </Card>

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

      {/* HEADER */}

      <div className="flex justify-between items-end">

        <div>

          <h1 className="text-2xl font-bold tracking-tight text-text">
            Take Attendance
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {assignment.subjectName}
            {" "}
            ({assignment.subjectCode})
            {" • "}
            Semester {assignment.semester}
            {" • "}
            {assignment.classSection}
          </p>

        </div>

        <Button
          onClick={handleSave}
          disabled={
            saveAttendanceMutation.isPending ||
            attendance.length === 0
          }
        >
          {saveAttendanceMutation.isPending
            ? "Saving..."
            : "Save Attendance"}
        </Button>

      </div>

      {/* ATTENDANCE CARD */}

      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <div>

            <CardTitle>
              Student List
            </CardTitle>

            <p className="text-sm text-gray-500 mt-1">
              {attendance.length}{" "}
              {attendance.length === 1
                ? "student"
                : "students"}
            </p>

          </div>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary px-3 py-1.5 border"
          />

        </CardHeader>

        <CardContent>

          {attendance.length === 0 ? (

            <div className="py-10 text-center">

              <p className="text-gray-500">
                No students found in this
                class section.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {attendance.map(
                (student) => (

                  <div
                    key={student.studentId}
                    className="flex items-center justify-between py-4"
                  >

                    {/* STUDENT */}

                    <div className="flex flex-col">

                      <span className="font-medium text-text">
                        {student.name}
                      </span>

                      <span className="text-xs text-gray-500">
                        Roll No:{" "}
                        {student.rollNumber}
                      </span>

                    </div>

                    {/* STATUS */}

                    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">

                      {/* PRESENT */}

                      <button
                        type="button"
                        disabled={
                          saveAttendanceMutation.isPending
                        }
                        onClick={() =>
                          updateStatus(
                            student.studentId,
                            "PRESENT"
                          )
                        }
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          student.status ===
                          "PRESENT"
                            ? "bg-white shadow-sm text-green-600"
                            : "text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        Present
                      </button>

                      {/* ABSENT */}

                      <button
                        type="button"
                        disabled={
                          saveAttendanceMutation.isPending
                        }
                        onClick={() =>
                          updateStatus(
                            student.studentId,
                            "ABSENT"
                          )
                        }
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          student.status ===
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