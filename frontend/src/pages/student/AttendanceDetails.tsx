import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';

export function AttendanceDetails() {
  const columns = [
    { key: 'date', header: 'Date' },
    { key: 'subject', header: 'Subject' },
    { 
      key: 'status', 
      header: 'Status',
      render: (r: any) => (
        <Badge variant={r.status === 'PRESENT' ? 'success' : 'danger'}>
          {r.status}
        </Badge>
      )
    },
    { key: 'markedBy', header: 'Marked By' },
  ];

  const data = [
    { id: 1, date: '2023-10-27', subject: 'Mathematics', status: 'PRESENT', markedBy: 'Sarah Jenkins' },
    { id: 2, date: '2023-10-27', subject: 'Physics', status: 'ABSENT', markedBy: 'Robert Fox' },
    { id: 3, date: '2023-10-26', subject: 'Mathematics', status: 'PRESENT', markedBy: 'Sarah Jenkins' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-text">Attendance Details</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Detailed Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
