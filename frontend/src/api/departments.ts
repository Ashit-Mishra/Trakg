import { apiClient } from './client';
import { Department } from '../types';

export const getDepartments = async (): Promise<Department[]> => {
  const { data } = await apiClient.get('/api/departments');
  return data;
};

export const createDepartment = async (department: Partial<Department>): Promise<Department> => {
  const { data } = await apiClient.post('/api/departments', department);
  return data;
};

export const updateDepartment = async (id: string, department: Partial<Department>): Promise<Department> => {
  const { data } = await apiClient.put(`/api/departments/${id}`, department);
  return data;
};

export const deleteDepartment = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/departments/${id}`);
};
