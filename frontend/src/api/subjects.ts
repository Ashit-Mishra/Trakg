import { apiClient } from "./client";

export interface Subject {
  id: number;
  subjectCode: string;
  subjectName: string;

  semester?: {
    id: number;
    semesterNumber: number;
  };

  department?: {
    id: number;
    departmentCode: string;
    departmentName: string;
  };
}

export interface SubjectRequest {
  subjectCode: string;
  subjectName: string;
  semesterId: number;
  departmentCode: string;
}

export const getSubjects = async (): Promise<Subject[]> => {
  const response = await apiClient.get("/api/admin/subjects");
  return response.data;
};

export const getSubjectsBySemester = async (
  semesterId: number
): Promise<Subject[]> => {
  const response = await apiClient.get(
    `/api/admin/subjects/semester/${semesterId}`
  );

  return response.data;
};

export const createSubject = async (
  request: SubjectRequest
): Promise<Subject> => {
  const response = await apiClient.post(
    "/api/admin/subjects",
    request
  );

  return response.data;
};

export const downloadSubjectTemplate = async () => {
  const response = await apiClient.get(
    "/api/admin/subjects/template",
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = "subjects-template.xlsx";

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};

export const importSubjects = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await apiClient.post(
    "/api/admin/subjects/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};