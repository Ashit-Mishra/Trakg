import { apiClient } from './client';
import { Semester } from '../types';

export const getSemesters = async (): Promise<Semester[]> => {
  const { data } = await apiClient.get('/api/semesters');
  return data;
};

export const createSemester = async (semester: Partial<Semester>): Promise<Semester> => {
  const { data } = await apiClient.post('/api/semesters', semester);
  return data;
};

export const updateSemester = async (id: string, semester: Partial<Semester>): Promise<Semester> => {
  const { data } = await apiClient.put(`/api/semesters/${id}`, semester);
  return data;
};

export const deleteSemester = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/semesters/${id}`);
};
