import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getClassSections } from '../../api/class-sections';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';

export function ClassSections() {
  const { data: sections, isLoading } = useQuery({
    queryKey: ['class-sections'],
    queryFn: getClassSections,
  });

  const columns = [
    { key: 'name', header: 'Section Name' },
    { key: 'capacity', header: 'Capacity' },
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-text">Class Sections</h1>
        <Button className="gap-2"><Plus size={18} /> Add Section</Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <div className="max-w-md mb-6"><SearchBar /></div>
        <DataTable columns={columns} data={sections || []} isLoading={isLoading} />
      </div>
    </div>
  );
}