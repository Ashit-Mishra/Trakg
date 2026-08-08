import { apiClient } from './client';
import { AcademicSession } from '../types';

export const getAcademicSessions = async (): Promise<AcademicSession[]> => {
  const { data } = await apiClient.get('/api/academic-sessions');
  return data;
};

export const createAcademicSession = async (session: Partial<AcademicSession>): Promise<AcademicSession> => {
  const { data } = await apiClient.post('/api/academic-sessions', session);
  return data;
};

export const updateAcademicSession = async (id: string, session: Partial<AcademicSession>): Promise<AcademicSession> => {
  const { data } = await apiClient.put(`/api/academic-sessions/${id}`, session);
  return data;
};

export const deleteAcademicSession = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/academic-sessions/${id}`);
};
