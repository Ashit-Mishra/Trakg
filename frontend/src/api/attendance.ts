import { apiClient } from './client';
import { AttendanceRecord } from '../types';

export const markAttendance = async (attendanceData: any): Promise<void> => {
  await apiClient.post('/api/attendance', attendanceData);
};

export const updateAttendance = async (id: string, data: any): Promise<void> => {
  await apiClient.put(`/api/attendance/${id}`, data);
};

export const getAttendanceByTeacher = async (teacherId: string): Promise<AttendanceRecord[]> => {
  const { data } = await apiClient.get(`/api/attendance/teacher/${teacherId}`);
  return data;
};

export const getAttendanceByStudent = async (studentId: string): Promise<AttendanceRecord[]> => {
  const { data } = await apiClient.get(`/api/attendance/student/${studentId}`);
  return data;
};

export const getAttendanceBySubject = async (subjectId: string): Promise<AttendanceRecord[]> => {
  const { data } = await apiClient.get(`/api/attendance/subject/${subjectId}`);
  return data;
};

export const getAttendanceByDate = async (date: string): Promise<AttendanceRecord[]> => {
  const { data } = await apiClient.get(`/api/attendance/date`, { params: { date } });
  return data;
};
