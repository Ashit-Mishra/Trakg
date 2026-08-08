import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getDepartments } from '../../api/departments';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';

export function Departments() {
  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const columns = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Department Name' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <Button variant="ghost" size="sm">Edit</Button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Departments</h1>
        </div>
        <Button className="gap-2"><Plus size={18} /> Add Department</Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <div className="max-w-md mb-6"><SearchBar /></div>
        <DataTable columns={columns} data={departments || []} isLoading={isLoading} />
      </div>
    </div>
  );
}