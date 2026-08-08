import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, enableUser, disableUser } from '../../api/users';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { Badge } from '../../components/ui/Badge';

export function Users() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (user: any) => user.isActive ? disableUser(user.id) : enableUser(user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      render: (u: any) => (
        <Badge variant={u.role === 'ADMIN' ? 'warning' : u.role === 'TEACHER' ? 'info' : 'default'}>
          {u.role}
        </Badge>
      )
    },
    { 
      key: 'isActive', 
      header: 'Status',
      render: (u: any) => (
        <Badge variant={u.isActive ? 'success' : 'danger'}>
          {u.isActive ? 'Active' : 'Disabled'}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (u: any) => (
        <Button 
          variant={u.isActive ? 'danger' : 'secondary'} 
          size="sm"
          onClick={() => toggleStatusMutation.mutate(u)}
          isLoading={toggleStatusMutation.isPending}
        >
          {u.isActive ? 'Disable' : 'Enable'}
        </Button>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-text">System Users</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
        <div className="max-w-md mb-6"><SearchBar /></div>
        <DataTable columns={columns} data={users || []} isLoading={isLoading} />
      </div>
    </div>
  );
}