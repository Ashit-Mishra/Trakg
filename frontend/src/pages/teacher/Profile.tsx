import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function TeacherProfile() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight text-text">Profile Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Full Name" defaultValue="Sarah Jenkins" disabled />
          <Input label="Email" defaultValue="sarah.j@example.com" disabled />
          <Input label="Employee ID" defaultValue="EMP-2023-04" disabled />
          <Input label="Department" defaultValue="Mathematics" disabled />
          
          <div className="pt-4 flex justify-end">
            <Button>Request Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
