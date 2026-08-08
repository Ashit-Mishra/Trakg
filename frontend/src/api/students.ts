import { apiClient } from './client';
import { Student } from '../types';

export const getStudents = async (): Promise<Student[]> => {
  const { data } = await apiClient.get('/api/students');
  return data;
};

export const createStudent = async (student: Partial<Student>): Promise<Student> => {
  const { data } = await apiClient.post('/api/students', student);
  return data;
};

export const updateStudent = async (id: string, student: Partial<Student>): Promise<Student> => {
  const { data } = await apiClient.put(`/api/students/${id}`, student);
  return data;
};

export const deleteStudent = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/students/${id}`);
};
