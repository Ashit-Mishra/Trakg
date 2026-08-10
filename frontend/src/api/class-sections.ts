import { apiClient } from "./client";

export interface ClassSection {
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
}

export interface ClassSectionRequest {
  sectionName: string;
  semesterId: number;
}

export interface ImportResponse {
  success?: boolean;
  message?: string;
  totalRows?: number;
  importedRows?: number;
  failedRows?: number;
  errors?: {
    row: number;
    message: string;
  }[];
}

export const getClassSections =
  async (): Promise<ClassSection[]> => {
    const response = await apiClient.get(
      "/api/admin/class-sections"
    );

    console.log(
      "CLASS SECTIONS RESPONSE:",
      response.data
    );

    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  };

export const getClassSection = async (
  id: number
): Promise<ClassSection> => {
  const { data } =
    await apiClient.get<ClassSection>(
      `/api/admin/class-sections/${id}`
    );

  return data;
};

export const getClassSectionsBySemester =
  async (
    semesterId: number
  ): Promise<ClassSection[]> => {
    const response = await apiClient.get(
      `/api/admin/class-sections/semester/${semesterId}`
    );

    return Array.isArray(response.data)
      ? response.data
      : [];
  };

export const createClassSection = async (
  request: ClassSectionRequest
): Promise<ClassSection> => {
  const { data } =
    await apiClient.post<ClassSection>(
      "/api/admin/class-sections",
      request
    );

  return data;
};

export const importClassSections = async (
  file: File
): Promise<ImportResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } =
    await apiClient.post<ImportResponse>(
      "/api/admin/class-sections/import",
      formData
    );

  return data;
};

export const downloadClassSectionTemplate =
  async (): Promise<Blob> => {
    const { data } = await apiClient.get(
      "/api/admin/class-sections/template",
      {
        responseType: "blob",
      }
    );

    return data;
  };

export const downloadClassSectionTemplateFile =
  async (): Promise<void> => {
    const blob =
      await downloadClassSectionTemplate();

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "class-sections-template.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };