import { apiClient } from "./client";

/* =========================================================
   OVERALL ATTENDANCE
   ========================================================= */

export interface OverallAttendanceResponse {
  presentClasses: number;
  totalClasses: number;
  attendancePercentage: number;
}

export const getOverallAttendance =
  async (): Promise<OverallAttendanceResponse> => {
    const { data } =
      await apiClient.get<OverallAttendanceResponse>(
        "/api/attendance/overall"
      );

    return data;
  };

/* =========================================================
   SUBJECT-WISE ATTENDANCE
   ========================================================= */

export interface SubjectAttendanceResponse {
  subjectCode: string;
  subjectName: string;
  presentClasses: number;
  totalClasses: number;
  attendancePercentage: number;
}

export const getSubjectWiseAttendance =
  async (): Promise<SubjectAttendanceResponse[]> => {
    const { data } =
      await apiClient.get<SubjectAttendanceResponse[]>(
        "/api/attendance/subjects"
      );

    return data;
  };

/* =========================================================
   MY ATTENDANCE
   ========================================================= */

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "LEAVE";

export interface AttendanceRecord {
  attendanceId: number;
  studentName: string;
  rollNumber: string;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  status: AttendanceStatus;
  attendanceDate: string;
}

export const getMyAttendance =
  async (): Promise<AttendanceRecord[]> => {
    const { data } =
      await apiClient.get<AttendanceRecord[]>(
        "/api/attendance/my"
      );

    return data;
  };