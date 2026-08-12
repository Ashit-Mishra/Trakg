import { apiClient } from "./client";


/* =========================================================
   STUDENT
   ========================================================= */

export interface Student {
  id: number;
  rollNumber: string;

  user?: {
    id: number;
    userId?: string;
    name: string;
    email: string;
    isActive: boolean;
  };

  classSection?: {
    id: number;
    sectionName: string;

    semester?: {
      id: number;
      semesterNumber: number;
    };

    department?: {
      id: number;
      departmentCode: string;
      departmentName: string;
    };
  };
}


/* =========================================================
   CREATE STUDENT REQUEST
   ========================================================= */

export interface StudentRequest {
  userId: string;
  name: string;
  email: string;
  rollNumber: string;
  classSectionId: number;
  password: string;
}


/* =========================================================
   GET ALL STUDENTS
   ========================================================= */

export const getStudents = async (): Promise<Student[]> => {
  const response = await apiClient.get<Student[]>(
    "/api/admin/students"
  );

  return response.data;
};


/* =========================================================
   GET STUDENT
   ========================================================= */

export const getStudent = async (
  id: number
): Promise<Student> => {
  const response = await apiClient.get<Student>(
    `/api/admin/students/${id}`
  );

  return response.data;
};


/* =========================================================
   GET STUDENTS BY CLASS SECTION
   ========================================================= */

export const getStudentsByClassSection = async (
  classSectionId: number
): Promise<Student[]> => {
  const response = await apiClient.get<Student[]>(
    `/api/admin/students/class-section/${classSectionId}`
  );

  return response.data;
};


/* =========================================================
   CREATE STUDENT
   ========================================================= */

export const createStudent = async (
  request: StudentRequest
): Promise<Student> => {
  const response = await apiClient.post<Student>(
    "/api/admin/students",
    request
  );

  return response.data;
};


/* =========================================================
   DOWNLOAD STUDENT TEMPLATE
   ========================================================= */

export const downloadStudentTemplate = async () => {
  const response = await apiClient.get(
    "/api/admin/students/template",
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");

  link.href = url;
  link.download = "students-template.xlsx";

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};


/* =========================================================
   IMPORT STUDENTS
   ========================================================= */

export const importStudents = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post(
    "/api/admin/students/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};