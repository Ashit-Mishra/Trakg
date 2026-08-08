export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface LoginRequest {
    userId: string;
    password: string;
}

export interface AuthUser {
    userId: string;
    role: Role;
}

export interface AuthResponse {
  token: string;
  userId: string;
  role: Role;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
}


export interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Semester {
  id: string;
  name: string;
  number: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  semesterId: string;
}

export interface ClassSection {
  id: string;
  name: string;
  capacity: number;
}

export interface Teacher {
  id: string;
  userId: string;
  departmentId: string;
  employeeId: string;
  user?: User;
}

export interface Student {
  id: string;
  userId: string;
  departmentId: string;
  semesterId: string;
  classSectionId: string;
  rollNumber: string;
  user?: User;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  subjectId: string;
  classSectionId: string;
  academicSessionId: string;
  subject?: Subject;
  classSection?: ClassSection;
  teacher?: Teacher;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  teacherAssignmentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
  student?: Student;
}