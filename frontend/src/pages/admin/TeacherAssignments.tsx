import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getTeacherAssignments } from '../../api/teacher-assignments';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';

export function TeacherAssignments() {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['teacher-assignments'],
    queryFn: getTeacherAssignments,
  });

  const columns = [
    { key: 'teacherId', header: 'Teacher', render: (a: any) => a.teacher?.user?.name || a.teacherId },
    { key: 'subjectId', header: 'Subject', render: (a: any) => a.subject?.name || a.subjectId },
    { key: 'classSectionId', header: 'Class Section', render: (a: any) => a.classSection?.name || a.classSectionId },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-text">Teacher Assignments</h1>
        <Button className="gap-2"><Plus size={18} /> Assign New</Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <div className="max-w-md mb-6"><SearchBar /></div>
        <DataTable columns={columns} data={assignments || []} isLoading={isLoading} />
      </div>
    </div>
  );
}