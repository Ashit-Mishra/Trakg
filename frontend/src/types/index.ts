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
    id: number;
    sessionName: string;
    startDate: string;
    active: boolean;
}

export interface Department {
    id: number;
    departmentCode: string;
    departmentName: string;
    academicSession: AcademicSession;
}

export interface Semester {
    id: number;
    semesterNumber: number;
    semesterName: string;
    department: {
        id: number;
        departmentCode: string;
        departmentName: string;
    };
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  semesterId: string;
}

export interface ClassSection {
    id: number;
    sectionName: string;
    semester: Semester;
    department: Department;
}

export interface Teacher {
  id: string;
  userId: string;
  departmentId: string;
  employeeId: string;
  user?: User;
}

export interface Student {
    id: number;
    rollNumber: string;
    user: User;
    classSection: ClassSection;
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