import { apiClient } from './client';
import { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/api/admin/users');
  return data;
};

export const getUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get(`/api/admin/users/${userId}`);
  return data;
};

export const enableUser = async (userId: string): Promise<void> => {
  await apiClient.put(`/api/admin/users/${userId}/enable`);
};

export const disableUser = async (userId: string): Promise<void> => {
  await apiClient.put(`/api/admin/users/${userId}/disable`);
};
