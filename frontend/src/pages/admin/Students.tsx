import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getStudents } from '../../api/students';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/ui/Badge';

export function Students() {
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const columns = [
    { key: 'rollNumber', header: 'Roll No.' },
    { key: 'name', header: 'Name', render: (s: any) => s.user?.name || 'N/A' },
    { key: 'semesterId', header: 'Semester' },
    { 
      key: 'status', 
      header: 'Status',
      render: (s: any) => (
        <Badge variant={s.user?.isActive ? 'success' : 'danger'}>
          {s.user?.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Edit</Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Students</h1>
          <p className="text-sm text-gray-500 mt-1">Manage student records.</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} /> Add Student
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <div className="max-w-md mb-6">
          <SearchBar />
        </div>
        <DataTable columns={columns} data={students || []} isLoading={isLoading} />
      </div>
    </div>
  );
}