import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getAcademicSessions } from '../../api/academic-sessions';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';

export function AcademicSessions() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['academic-sessions'],
    queryFn: getAcademicSessions,
  });

  const columns = [
    { key: 'name', header: 'Session Name' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (s: any) => (
        <Badge variant={s.isActive ? 'success' : 'default'}>
          {s.isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
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
        <h1 className="text-2xl font-bold tracking-tight text-text">Academic Sessions</h1>
        <Button className="gap-2"><Plus size={18} /> Add Session</Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <DataTable columns={columns} data={sessions || []} isLoading={isLoading} />
      </div>
    </div>
  );
}