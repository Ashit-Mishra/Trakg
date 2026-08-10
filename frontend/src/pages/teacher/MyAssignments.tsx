import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAssignmentsByTeacher } from '../../api/teacher-assignments';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';

export function MyAssignments() {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['my-assignments'],
    // Mock user ID for now
    queryFn: () => getAssignmentsByTeacher(1),
  });

  const columns = [
    { key: 'subjectId', header: 'Subject', render: (a: any) => a.subject?.name || 'Mathematics' },
    { key: 'classSectionId', header: 'Class Section', render: (a: any) => a.classSection?.name || '10A' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <Button variant="outline" size="sm">Take Attendance</Button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-text">My Assignments</h1>
      
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <DataTable columns={columns} data={assignments || [
          { id: 1, subject: { name: 'Mathematics' }, classSection: { name: '10A' } },
          { id: 2, subject: { name: 'Physics' }, classSection: { name: '11B' } }
        ]} isLoading={isLoading} />
      </div>
    </div>
  );
}