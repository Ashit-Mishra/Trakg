import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { AttendanceRing } from '../../components/charts/AttendanceRing';

export function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">Welcome back, Alex</h1>
        <p className="text-gray-500 mt-1">Here is your attendance summary for the current semester.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 flex flex-col justify-center items-center py-8">
          <AttendanceRing percentage={85} size={220} />
          <p className="mt-6 text-sm font-medium text-gray-500">Overall Attendance</p>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Subject-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { subject: 'Mathematics', present: 90, total: 100 },
                { subject: 'Physics', present: 75, total: 100 },
                { subject: 'Computer Science', present: 95, total: 100 },
                { subject: 'Chemistry', present: 80, total: 100 },
              ].map((s) => (
                <div key={s.subject}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-text">{s.subject}</span>
                    <span className="text-gray-500">{s.present}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${s.present < 75 ? 'bg-red-500' : 'bg-primary'}`} 
                      style={{ width: `${s.present}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}