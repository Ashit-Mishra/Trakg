import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getTeachers } from '../../api/teachers';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export function Teachers() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  });

  const columns = [
    { key: 'employeeId', header: 'Employee ID' },
    { key: 'name', header: 'Name', render: (t: any) => t.user?.name || 'N/A' },
    { key: 'email', header: 'Email', render: (t: any) => t.user?.email || 'N/A' },
    { key: 'departmentId', header: 'Department' },
    { 
      key: 'actions', 
      header: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Delete</Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Teachers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage teaching staff and their assignments.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <Plus size={18} /> Add Teacher
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <div className="max-w-md mb-6">
          <SearchBar />
        </div>
        <DataTable 
          columns={columns} 
          data={teachers || []} 
          isLoading={isLoading} 
        />
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Teacher"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Teacher creation form will go here.</p>
          <div className="flex justify-end gap-3 mt-8">
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button>Save Teacher</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}