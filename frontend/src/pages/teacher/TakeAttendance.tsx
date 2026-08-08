import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function TakeAttendance() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students] = useState([
    { id: '1', name: 'Alice Smith', rollNumber: '101', status: 'PRESENT' },
    { id: '2', name: 'Bob Johnson', rollNumber: '102', status: 'PRESENT' },
    { id: '3', name: 'Charlie Brown', rollNumber: '103', status: 'ABSENT' },
  ]);

  const handleSave = () => {
    alert('Attendance saved!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Take Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">Mathematics • Class 10A</p>
        </div>
        <Button onClick={handleSave}>Save Attendance</Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Student List</CardTitle>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary px-3 py-1.5 border"
          />
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {students.map(s => (
              <div key={s.id} className="flex items-center justify-between py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-text">{s.name}</span>
                  <span className="text-xs text-gray-500">Roll No: {s.rollNumber}</span>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                  <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${s.status === 'PRESENT' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:bg-gray-200'}`}>Present</button>
                  <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${s.status === 'ABSENT' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:bg-gray-200'}`}>Absent</button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
