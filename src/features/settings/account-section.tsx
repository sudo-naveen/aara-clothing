"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "./settings-validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Loader2, Save, KeyRound, LogOut } from "lucide-react";

interface AccountSectionProps {
  name: string | null;
  username: string;
}

export function AccountSection({ name, username }: AccountSectionProps) {
  const { update } = useSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const nameForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: name ?? "" },
  });

  const passwordForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onNameSubmit(data: UpdateProfileInput) {
    try {
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setIsEditingName(false);
      nameForm.reset({ name: data.name });
      await update({ name: data.name });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  async function onPasswordSubmit(data: ChangePasswordInput) {
    try {
      const response = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to change password");
      }

      toast.success("Password changed successfully");
      setIsChangingPassword(false);
      passwordForm.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-aara-primary/10">
            <User className="size-5 text-aara-primary" />
          </div>
          <div>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your account information and security</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input value={username} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground">Username cannot be changed</p>
          </div>

          {isEditingName ? (
            <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...nameForm.register("name")}
                  placeholder="Enter your full name"
                />
                {nameForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {nameForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditingName(false);
                    nameForm.reset({ name: name ?? "" });
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={nameForm.formState.isSubmitting} className="w-full sm:w-auto">
                  {nameForm.formState.isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input value={name ?? "Not set"} disabled className="opacity-60" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingName(true)}
                  className="w-full sm:w-auto"
                >
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="border-t border-border/40 pt-6">
          <h4 className="text-sm font-medium mb-4">Password</h4>
          {isChangingPassword ? (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                  placeholder="Enter current password"
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword")}
                  placeholder="Enter new password"
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                  placeholder="Confirm new password"
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsChangingPassword(false);
                    passwordForm.reset();
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={passwordForm.formState.isSubmitting} className="w-full sm:w-auto">
                  {passwordForm.formState.isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <KeyRound className="size-4" />
                  )}
                  Change Password
                </Button>
              </div>
            </form>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
            >
              <KeyRound className="size-4" />
              Change Password
            </Button>
          )}
        </div>

        {/* Logout */}
        <div className="border-t border-border/40 pt-6">
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}