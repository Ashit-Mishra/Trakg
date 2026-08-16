import React from "react";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getUsers,
  enableUser,
  disableUser,
} from "../../api/users";

import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { SearchBar } from "../../components/ui/SearchBar";
import { Badge } from "../../components/ui/Badge";

import { User } from "../../types";


export function Users() {
  const queryClient = useQueryClient();


  /* =========================================================
     GET USERS
     ========================================================= */

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });


  /* =========================================================
     ENABLE / DISABLE USER
     ========================================================= */

  const toggleStatusMutation = useMutation({
    mutationFn: async (user: User) => {

      if (user.enabled) {
        await disableUser(user.userId);
      } else {
        await enableUser(user.userId);
      }

    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error: any) => {
      console.error(
        "ENABLE/DISABLE USER ERROR:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update user status."
      );
    },
  });


  /* =========================================================
     TABLE COLUMNS
     ========================================================= */

  const columns = [

    {
      key: "name",
      header: "Name",

      render: (user: User) => (
        <span className="font-medium text-text">
          {user.name}
        </span>
      ),
    },


    {
      key: "userId",
      header: "User ID",

      render: (user: User) => (
        <span>
          {user.userId}
        </span>
      ),
    },


    {
      key: "email",
      header: "Email",

      render: (user: User) => (
        <span>
          {user.email}
        </span>
      ),
    },


    {
      key: "role",
      header: "Role",

      render: (user: User) => (
        <Badge
          variant={
            user.role === "ADMIN"
              ? "warning"
              : user.role === "TEACHER"
              ? "info"
              : "default"
          }
        >
          {user.role}
        </Badge>
      ),
    },


    {
      key: "enabled",
      header: "Status",

      render: (user: User) => (
        <Badge
          variant={
            user.enabled
              ? "success"
              : "danger"
          }
        >
          {user.enabled
            ? "Active"
            : "Disabled"}
        </Badge>
      ),
    },


    {
      key: "actions",
      header: "Actions",

      render: (user: User) => (
        <Button
          variant={
            user.enabled
              ? "danger"
              : "secondary"
          }
          size="sm"
          onClick={() =>
            toggleStatusMutation.mutate(user)
          }
          isLoading={
            toggleStatusMutation.isPending
          }
          disabled={
            user.role === "ADMIN"
          }
        >
          {user.enabled
            ? "Disable"
            : "Enable"}
        </Button>
      ),
    },

  ];


  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="space-y-6">


      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            System Users
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage user access and account status.
          </p>
        </div>

      </div>


      {/* USERS TABLE */}

      <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">

        <div className="max-w-md mb-6">
          <SearchBar />
        </div>


        {isError ? (
          <div className="py-10 text-center text-red-500">
            Failed to load users.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
          />
        )}

      </div>

    </div>
  );
}