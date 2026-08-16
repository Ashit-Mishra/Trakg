import { apiClient } from "./client";
import { User } from "../types";

/* =========================================================
   GET ALL USERS
   ========================================================= */

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>(
    "/api/admin/users"
  );

  return data;
};


/* =========================================================
   GET USER
   ========================================================= */

export const getUser = async (
  userId: string
): Promise<User> => {
  const { data } = await apiClient.get<User>(
    `/api/admin/users/${userId}`
  );

  return data;
};


/* =========================================================
   ENABLE USER
   ========================================================= */

export const enableUser = async (
  userId: string
): Promise<void> => {
  await apiClient.put(
    `/api/admin/users/${userId}/enable`
  );
};


/* =========================================================
   DISABLE USER
   ========================================================= */

export const disableUser = async (
  userId: string
): Promise<void> => {
  await apiClient.put(
    `/api/admin/users/${userId}/disable`
  );
};