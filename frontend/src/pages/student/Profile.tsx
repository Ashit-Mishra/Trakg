import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function StudentProfile() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight text-text">Student Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Full Name" defaultValue="Alex Rivera" disabled />
          <Input label="Email" defaultValue="alex.r@example.com" disabled />
          <Input label="Roll Number" defaultValue="CS-2021-045" disabled />
          <Input label="Department" defaultValue="Computer Science" disabled />
          <Input label="Semester" defaultValue="Semester 5" disabled />
          <Input label="Class Section" defaultValue="5A" disabled />
          
          <div className="pt-4 flex justify-end">
            <Button>Request Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
