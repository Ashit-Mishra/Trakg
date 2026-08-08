import React from 'react';
import { BookOpen, Users, ClipboardList, CheckCircle } from 'lucide-react';
import { StatTile } from '../../components/ui/StatTile';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">Welcome back, Sarah</h1>
        <p className="text-gray-500 mt-1">Here is your teaching overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatTile 
          title="My Classes" 
          value={4} 
          icon={BookOpen} 
          iconClassName="bg-blue-100 text-blue-700"
        />
        <StatTile 
          title="Total Students" 
          value={120} 
          icon={Users} 
          iconClassName="bg-green-100 text-green-700"
        />
        <StatTile 
          title="Assignments" 
          value={6} 
          icon={ClipboardList} 
          iconClassName="bg-purple-100 text-purple-700"
        />
        <StatTile 
          title="Attendance Taken" 
          value="2/4" 
          icon={CheckCircle} 
          iconClassName="bg-orange-100 text-orange-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '09:00 AM', subject: 'Mathematics', section: 'Class 10A' },
                { time: '11:00 AM', subject: 'Physics', section: 'Class 11B' },
                { time: '02:00 PM', subject: 'Mathematics', section: 'Class 12A' }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="font-medium text-sm text-gray-500 w-20">{c.time}</div>
                    <div>
                      <p className="font-semibold text-text">{c.subject}</p>
                      <p className="text-xs text-gray-500">{c.section}</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-primary hover:text-blue-700">Take Attendance</button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">No new notifications.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}