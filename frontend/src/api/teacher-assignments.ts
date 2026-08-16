import { apiClient } from "./client";

export interface TeacherAssignment {
  id?: number;
  assignmentId?: number;

  teacher?: {
    id: number;
    user?: {
      id: number;
      userId: string;
      name: string;
      email?: string;
    };
    designation?: string;
  };

  subject?: {
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

  // Support your TeacherAssignmentResponse DTO too
  subjectCode?: string;
  subjectName?: string;
  semester?: number;
  classSectionName?: string;
  teacherName?: string;
  department?: string;
}

export interface AssignTeacherRequest {
  teacherId: number;
  subjectId: number;
  classSectionId: number;
}

/**
 * Get all assignments
 */
export const getAllAssignments = async (): Promise<
  TeacherAssignment[]
> => {
  const { data } = await apiClient.get(
    "/api/admin/teacher-subject-assignments"
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
};

/**
 * Get assignment by ID
 */
export const getAssignment = async (
  id: number
): Promise<TeacherAssignment> => {
  const { data } =
    await apiClient.get<TeacherAssignment>(
      `/api/admin/teacher-subject-assignments/${id}`
    );

  return data;
};

/**
 * Assign teacher
 */
export const assignTeacher = async (
  request: AssignTeacherRequest
): Promise<TeacherAssignment> => {
  const { data } =
    await apiClient.post<TeacherAssignment>(
      "/api/admin/teacher-subject-assignments",
      request
    );

  return data;
};

/**
 * Get assignments by teacher
 */
export const getAssignmentsByTeacher = async (
  teacherId: number
): Promise<TeacherAssignment[]> => {
  const { data } = await apiClient.get(
    `/api/admin/teacher-subject-assignments/teacher/${teacherId}`
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

/**
 * Get assignments by subject
 */
export const getAssignmentsBySubject = async (
  subjectId: number
): Promise<TeacherAssignment[]> => {
  const { data } = await apiClient.get(
    `/api/admin/teacher-subject-assignments/subject/${subjectId}`
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

/**
 * Get assignments by class section
 */
export const getAssignmentsByClassSection = async (
  classSectionId: number
): Promise<TeacherAssignment[]> => {
  const { data } = await apiClient.get(
    `/api/admin/teacher-subject-assignments/class-section/${classSectionId}`
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

/**
 * Import assignments
 */
export const importTeacherAssignments = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  const { data } = await apiClient.post(
    "/api/admin/teacher-subject-assignments/import",
    formData
  );

  return data;
};

/**
 * Download template
 */
export const downloadTeacherAssignmentTemplate =
  async (): Promise<Blob> => {
    const { data } = await apiClient.get(
      "/api/admin/teacher-subject-assignments/template",
      {
        responseType: "blob",
      }
    );

    return data;
  };

/**
 * Download template file
 */
export const downloadTeacherAssignmentTemplateFile =
  async (): Promise<void> => {
    const blob =
      await downloadTeacherAssignmentTemplate();

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "assignments-template.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };