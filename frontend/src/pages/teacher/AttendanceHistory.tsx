import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';

export function AttendanceHistory() {
  const columns = [
    { key: 'date', header: 'Date' },
    { key: 'subject', header: 'Subject' },
    { key: 'section', header: 'Class Section' },
    { key: 'present', header: 'Present %' },
  ];

  const data = [
    { id: 1, date: '2023-10-27', subject: 'Mathematics', section: '10A', present: '92%' },
    { id: 2, date: '2023-10-26', subject: 'Mathematics', section: '10A', present: '95%' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-text">Attendance History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Past Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
