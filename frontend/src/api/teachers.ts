import { apiClient } from './client';
import { Teacher } from '../types';

export const getTeachers = async (): Promise<Teacher[]> => {
  const { data } = await apiClient.get('/api/teachers');
  return data;
};

export const createTeacher = async (teacher: Partial<Teacher>): Promise<Teacher> => {
  const { data } = await apiClient.post('/api/teachers', teacher);
  return data;
};

export const updateTeacher = async (id: string, teacher: Partial<Teacher>): Promise<Teacher> => {
  const { data } = await apiClient.put(`/api/teachers/${id}`, teacher);
  return data;
};

export const deleteTeacher = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/teachers/${id}`);
};
