import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  ClipboardList,
  CheckCircle,
} from "lucide-react";

import { StatTile } from "../../components/ui/StatTile";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

import {
  getTeacherProfile,
  getTeacherAssignments,
  getAssignmentStudents,
  getAttendanceHistory,
  TeacherProfile,
  TeacherAssignment,
} from "../../api/teacher";

export function TeacherDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceTaken, setAttendanceTaken] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get today's date in local timezone
  const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // --------------------------------------------------
        // 1. Get teacher profile
        // --------------------------------------------------

        const profileData = await getTeacherProfile();
        setProfile(profileData);

        // --------------------------------------------------
        // 2. Get teacher assignments
        // --------------------------------------------------

        const assignmentData = await getTeacherAssignments();

        setAssignments(assignmentData);

        // --------------------------------------------------
        // 3. Get students for every assignment
        // --------------------------------------------------

        const studentResponses = await Promise.all(
          assignmentData.map((assignment) =>
            getAssignmentStudents(assignment.assignmentId)
          )
        );

        // Remove duplicate students
        const uniqueStudentIds = new Set<number>();

        studentResponses.forEach((students) => {
          students.forEach((student) => {
            uniqueStudentIds.add(student.id);
          });
        });

        setTotalStudents(uniqueStudentIds.size);

        // --------------------------------------------------
        // 4. Check today's attendance
        // --------------------------------------------------

        const today = getToday();

        const attendanceResponses = await Promise.all(
          assignmentData.map((assignment) =>
            getAttendanceHistory(
              assignment.assignmentId,
              today
            )
          )
        );

        // An assignment is considered "attendance taken"
        // if at least one attendance record exists for today.
        const takenCount = attendanceResponses.filter(
          (records) => records.length > 0
        ).length;

        setAttendanceTaken(takenCount);
      } catch (err) {
        console.error("Failed to load teacher dashboard:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">
            Loading dashboard...
          </h1>

          <p className="text-gray-500 mt-1">
            Fetching your teaching information.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">
            Teacher Dashboard
          </h1>

          <p className="text-red-500 mt-2">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
          ================================================= */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">
          Welcome back, {profile?.name || "Teacher"}
        </h1>

        <p className="text-gray-500 mt-1">
          Here is your teaching overview for today.
        </p>
      </div>


      {/* =================================================
          STATISTICS
          ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatTile
          title="My Classes"
          value={assignments.length}
          icon={BookOpen}
          iconClassName="bg-blue-100 text-blue-700"
        />

        <StatTile
          title="Total Students"
          value={totalStudents}
          icon={Users}
          iconClassName="bg-green-100 text-green-700"
        />

        <StatTile
          title="Assignments"
          value={assignments.length}
          icon={ClipboardList}
          iconClassName="bg-purple-100 text-purple-700"
        />

        <StatTile
          title="Attendance Taken"
          value={`${attendanceTaken}/${assignments.length}`}
          icon={CheckCircle}
          iconClassName="bg-orange-100 text-orange-700"
        />

      </div>


      {/* =================================================
          ASSIGNMENTS + NOTIFICATIONS
          ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* -------------------------------------------------
            TODAY'S CLASSES
            ------------------------------------------------- */}

        <Card>

          <CardHeader>
            <CardTitle>
              Today's Classes
            </CardTitle>
          </CardHeader>

          <CardContent>

            {assignments.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No assignments found.
              </p>
            ) : (

              <div className="space-y-4">

                {assignments.map((assignment) => (

                  <div
                    key={assignment.assignmentId}
                    className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-100 transition-colors"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-700">
                        <BookOpen size={22} />
                      </div>

                      <div>

                        <p className="font-semibold text-text">
                          {assignment.subjectName}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {assignment.subjectCode}
                          {" • "}
                          Semester {assignment.semester}
                          {" • "}
                          {assignment.classSection}
                        </p>

                      </div>

                    </div>


                    {/* ------------------------------------------------
                        TAKE ATTENDANCE
                        ------------------------------------------------ */}

                    <button
                      onClick={() =>
                        navigate(
                          `/teacher/attendance?assignmentId=${assignment.assignmentId}`
                        )
                      }
                      className="text-sm font-medium text-primary hover:text-blue-700"
                    >
                      Take Attendance
                    </button>

                  </div>

                ))}

              </div>

            )}

          </CardContent>

        </Card>


        {/* -------------------------------------------------
            RECENT NOTIFICATIONS
            ------------------------------------------------- */}

        <Card>

          <CardHeader>
            <CardTitle>
              Recent Notifications
            </CardTitle>
          </CardHeader>

          <CardContent>

            <p className="text-gray-500 text-sm">
              No new notifications.
            </p>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}