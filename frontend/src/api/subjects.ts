import { apiClient } from './client';
import { Subject } from '../types';

export const getSubjects = async (): Promise<Subject[]> => {
  const { data } = await apiClient.get('/api/subjects');
  return data;
};

export const createSubject = async (subject: Partial<Subject>): Promise<Subject> => {
  const { data } = await apiClient.post('/api/subjects', subject);
  return data;
};

export const updateSubject = async (id: string, subject: Partial<Subject>): Promise<Subject> => {
  const { data } = await apiClient.put(`/api/subjects/${id}`, subject);
  return data;
};

export const deleteSubject = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/subjects/${id}`);
};
