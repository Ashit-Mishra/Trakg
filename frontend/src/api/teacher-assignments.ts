import { apiClient } from './client';
import { TeacherAssignment } from '../types';

export const getTeacherAssignments = async (): Promise<TeacherAssignment[]> => {
  const { data } = await apiClient.get('/api/teacher-assignments');
  return data;
};

export const getTeacherAssignmentsByTeacher = async (teacherId: string): Promise<TeacherAssignment[]> => {
  const { data } = await apiClient.get(`/api/teacher-assignments/teacher/${teacherId}`);
  return data;
};

export const getTeacherAssignmentsBySubject = async (subjectId: string): Promise<TeacherAssignment[]> => {
  const { data } = await apiClient.get(`/api/teacher-assignments/subject/${subjectId}`);
  return data;
};

export const createTeacherAssignment = async (assignment: Partial<TeacherAssignment>): Promise<TeacherAssignment> => {
  const { data } = await apiClient.post('/api/teacher-assignments', assignment);
  return data;
};

export const updateTeacherAssignment = async (id: string, assignment: Partial<TeacherAssignment>): Promise<TeacherAssignment> => {
  const { data } = await apiClient.put(`/api/teacher-assignments/${id}`, assignment);
  return data;
};

export const deleteTeacherAssignment = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/teacher-assignments/${id}`);
};
