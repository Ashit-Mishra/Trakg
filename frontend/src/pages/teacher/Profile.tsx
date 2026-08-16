import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  getTeacherProfile,
  TeacherProfile as TeacherProfileData,
} from "../../api/teacher";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";

export function Profile() {
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<TeacherProfileData>({
    queryKey: ["teacher-profile"],
    queryFn: getTeacherProfile,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          My Profile
        </h1>

        <Card>
          <CardContent>
            <p className="text-gray-500">
              Loading profile...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-text">
          My Profile
        </h1>

        <Card>
          <CardContent>
            <p className="text-red-500">
              Failed to load your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          My Profile
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          View your teacher account information.
        </p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-medium text-text mt-1">
                {profile.name}
              </p>
            </div>

            {/* User ID */}
            <div>
              <p className="text-sm text-gray-500">
                User ID
              </p>

              <p className="font-medium text-text mt-1">
                {profile.userId}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-medium text-text mt-1">
                {profile.email}
              </p>
            </div>

            {/* Designation */}
            <div>
              <p className="text-sm text-gray-500">
                Designation
              </p>

              <p className="font-medium text-text mt-1">
                {profile.designation}
              </p>
            </div>

            {/* Department */}
            <div>
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="font-medium text-text mt-1">
                {profile.department}
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  );
}