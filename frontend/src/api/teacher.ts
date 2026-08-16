import { apiClient } from "./client";

/* =========================================================
   TEACHER PROFILE
   ========================================================= */

export interface TeacherProfile {
  userId: string;
  name: string;
  email: string;
  designation: string;
  department: string;
}

export const getTeacherProfile = async (): Promise<TeacherProfile> => {
  const { data } = await apiClient.get<TeacherProfile>(
    "/api/teacher/profile"
  );

  return data;
};


/* =========================================================
   TEACHER ASSIGNMENTS
   ========================================================= */

export interface TeacherAssignment {
  assignmentId: number;
  subjectCode: string;
  subjectName: string;
  semester: number;
  classSection: string;
}

export const getTeacherAssignments = async (): Promise<
  TeacherAssignment[]
> => {
  const { data } = await apiClient.get<TeacherAssignment[]>(
    "/api/teacher/assignments"
  );

  return data;
};


/* =========================================================
   STUDENTS FOR AN ASSIGNMENT
   ========================================================= */

export interface TeacherStudent {
  id: number;
  rollNumber: string;

  user: {
    id: number;
    userId: string;
    name: string;
    email?: string;
  };
}

export const getAssignmentStudents = async (
  assignmentId: number
): Promise<TeacherStudent[]> => {
  const { data } = await apiClient.get<TeacherStudent[]>(
    `/api/teacher/assignments/${assignmentId}/students`
  );

  return data;
};


/* =========================================================
   ATTENDANCE
   ========================================================= */

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "LEAVE";

export interface StudentAttendanceRequest {
  studentId: number;
  status: AttendanceStatus;
}

export interface AttendanceRequest {
  assignmentId: number;
  attendanceDate: string;
  students: StudentAttendanceRequest[];
}

export const markAttendance = async (
  request: AttendanceRequest
): Promise<void> => {
  await apiClient.post(
    "/api/attendance",
    request
  );
};


/* =========================================================
   ATTENDANCE HISTORY
   ========================================================= */

export interface AttendanceRecord {
  attendanceId: number;
  studentName: string;
  rollNumber: string;
  status: AttendanceStatus;
  attendanceDate: string;
}

export const getAttendanceHistory = async (
  assignmentId: number,
  date: string
): Promise<AttendanceRecord[]> => {
  const { data } = await apiClient.get<AttendanceRecord[]>(
    `/api/teacher/assignments/${assignmentId}/attendance`,
    {
      params: {
        date,
      },
    }
  );

  return data;
};


/* =========================================================
   UPDATE ATTENDANCE
   ========================================================= */

export interface UpdateAttendanceRequest {
  status: AttendanceStatus;
}

export const updateAttendance = async (
  attendanceId: number,
  request: UpdateAttendanceRequest
): Promise<AttendanceRecord> => {
  const { data } = await apiClient.put<AttendanceRecord>(
    `/api/teacher/attendance/${attendanceId}`,
    request
  );

  return data;
};