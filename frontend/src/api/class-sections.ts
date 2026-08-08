import { apiClient } from './client';
import { ClassSection } from '../types';

export const getClassSections = async (): Promise<ClassSection[]> => {
  const { data } = await apiClient.get('/api/class-sections');
  return data;
};

export const createClassSection = async (section: Partial<ClassSection>): Promise<ClassSection> => {
  const { data } = await apiClient.post('/api/class-sections', section);
  return data;
};

export const updateClassSection = async (id: string, section: Partial<ClassSection>): Promise<ClassSection> => {
  const { data } = await apiClient.put(`/api/class-sections/${id}`, section);
  return data;
};

export const deleteClassSection = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/class-sections/${id}`);
};
