"use client";

import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, KeyRound } from "lucide-react";

interface SecuritySectionProps {
  onChangePasswordClick: () => void;
}

export function SecuritySection({ onChangePasswordClick }: SecuritySectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-destructive/10">
            <Shield className="size-5 text-destructive" />
          </div>
          <div>
            <CardTitle>Security</CardTitle>
            <CardDescription>Security actions for your account</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={onChangePasswordClick}>
            <KeyRound className="size-4" />
            Change Password
          </Button>
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
