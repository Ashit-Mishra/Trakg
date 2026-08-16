import { apiClient } from "./client";

export interface Teacher {
  id: number;
  user?: {
    id: number;
    userId: string;
    name: string;
    email?: string;
    role?: string;
    enabled?: boolean;
  };
  department?: {
    id: number;
    departmentCode: string;
    departmentName: string;
  };
  designation: string;
}

export interface TeacherRequest {
  userId: string;
  name: string;
  email?: string;
  departmentId: number;
  designation: string;
  password: string;
}

export const getTeachers = async (): Promise<Teacher[]> => {
  const response = await apiClient.get("/api/admin/teachers");

  console.log("TEACHERS RESPONSE:", response.data);

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

export const getTeacher = async (
  id: number
): Promise<Teacher> => {
  const { data } = await apiClient.get<Teacher>(
    `/api/admin/teachers/${id}`
  );

  return data;
};

export const getTeachersByDepartment = async (
  departmentId: number
): Promise<Teacher[]> => {
  const response = await apiClient.get(
    `/api/admin/teachers/department/${departmentId}`
  );

  console.log(
    "TEACHERS BY DEPARTMENT:",
    response.data
  );

  return Array.isArray(response.data)
    ? response.data
    : [];
};

export const createTeacher = async (
  request: TeacherRequest
): Promise<Teacher> => {
  const { data } = await apiClient.post<Teacher>(
    "/api/admin/teachers",
    request
  );

  return data;
};

export const importTeachers = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await apiClient.post(
    "/api/admin/teachers/import",
    formData
  );

  return data;
};

export const downloadTeacherTemplate = async (): Promise<Blob> => {
  const { data } = await apiClient.get(
    "/api/admin/teachers/template",
    {
      responseType: "blob",
    }
  );

  return data;
};

export const downloadTeacherTemplateFile =
  async (): Promise<void> => {
    const blob =
      await downloadTeacherTemplate();

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "teachers-template.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };