"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "./settings-validation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  Loader2,
  Plus,
  Pencil,
  X,
  Check,
  Shield,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  username: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
}

export function UserManagementSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [, startTransition] = useTransition();

  const createUserForm = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const updateUserForm = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/settings/users");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to fetch users");
      }

      setUsers(result.data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      fetchUsers();
    });
  }, [fetchUsers, startTransition]);

  async function onCreateUser(data: CreateUserInput) {
    try {
      const response = await fetch("/api/settings/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to create user");
      }

      toast.success("User created successfully");
      setIsAddingUser(false);
      createUserForm.reset();
      fetchUsers();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function onUpdateUser(data: UpdateUserInput) {
    try {
      const response = await fetch("/api/settings/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to update user");
      }

      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  function startEditing(user: User) {
    setEditingUser(user);
    updateUserForm.reset({
      id: user.id,
      name: user.name ?? "",
      username: user.username,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
    });
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-aara-primary/10">
              <Users className="size-5 text-aara-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate">User Management</CardTitle>
              <CardDescription className="truncate">Manage employee accounts</CardDescription>
            </div>
          </div>
          {!isAddingUser && !editingUser && (
            <Button
              size="sm"
              onClick={() => setIsAddingUser(true)}
              className="shrink-0"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Add User</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingUser && (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium">New User</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingUser(false);
                  createUserForm.reset();
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
            <form
              onSubmit={createUserForm.handleSubmit(onCreateUser)}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Full Name</Label>
                  <Input
                    id="create-name"
                    {...createUserForm.register("name")}
                    placeholder="Enter full name"
                  />
                  {createUserForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {createUserForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-username">Username</Label>
                  <Input
                    id="create-username"
                    {...createUserForm.register("username")}
                    placeholder="Enter username"
                  />
                  {createUserForm.formState.errors.username && (
                    <p className="text-sm text-destructive">
                      {createUserForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-password">Password</Label>
                  <Input
                    id="create-password"
                    type="password"
                    {...createUserForm.register("password")}
                    placeholder="Enter password"
                  />
                  {createUserForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {createUserForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-confirm">Confirm Password</Label>
                  <Input
                    id="create-confirm"
                    type="password"
                    {...createUserForm.register("confirmPassword")}
                    placeholder="Confirm password"
                  />
                  {createUserForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {createUserForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingUser(false);
                    createUserForm.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={createUserForm.formState.isSubmitting}
                >
                  {createUserForm.formState.isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  Create User
                </Button>
              </div>
            </form>
          </div>
        )}

        {editingUser && (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium">Edit User</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingUser(null)}
              >
                <X className="size-4" />
              </Button>
            </div>
            <form
              onSubmit={updateUserForm.handleSubmit(onUpdateUser)}
              className="space-y-4"
            >
              <input type="hidden" {...updateUserForm.register("id")} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    {...updateUserForm.register("name")}
                    placeholder="Enter full name"
                  />
                  {updateUserForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {updateUserForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    {...updateUserForm.register("username")}
                    placeholder="Enter username"
                  />
                  {updateUserForm.formState.errors.username && (
                    <p className="text-sm text-destructive">
                      {updateUserForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...updateUserForm.register("isAdmin")}
                    className="size-4 rounded border-border"
                  />
                  <Shield className="size-4" />
                  Administrator
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...updateUserForm.register("isActive")}
                    className="size-4 rounded border-border"
                  />
                  <Check className="size-4" />
                  Active
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={updateUserForm.formState.isSubmitting}
                >
                  {updateUserForm.formState.isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Desktop: Table view */}
        <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/30 last:border-0 table-row-hover"
                >
                  <td className="px-4 py-3 text-sm font-medium">
                    {user.name ?? "Not set"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.username}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        user.isActive
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      )}
                    >
                      {user.isActive ? (
                        <Check className="size-3" />
                      ) : (
                        <UserX className="size-3" />
                      )}
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        user.isAdmin
                          ? "bg-aara-primary/10 text-aara-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {user.isAdmin && <Shield className="size-3" />}
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(user)}
                      disabled={editingUser?.id === user.id}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card view */}
        <div className="md:hidden space-y-3">
          {users.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No users found</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-border/50 bg-muted/20 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{user.name ?? "Not set"}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.username}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          user.isActive
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                        )}
                      >
                        {user.isActive ? <Check className="size-3" /> : <UserX className="size-3" />}
                        {user.isActive ? "Active" : "Disabled"}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                          user.isAdmin
                            ? "bg-aara-primary/10 text-aara-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {user.isAdmin && <Shield className="size-3" />}
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => startEditing(user)}
                    disabled={editingUser?.id === user.id}
                    className="shrink-0"
                  >
                    <Pencil className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
