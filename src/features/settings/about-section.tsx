import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const APP_VERSION = "0.1.0";
const BUILD_VERSION = "1";
const ENVIRONMENT = process.env.NODE_ENV === "production" ? "Production" : "Development";

export function AboutSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-aara-highlight/15">
            <Info className="size-5 text-aara-highlight" />
          </div>
          <div>
            <CardTitle>About</CardTitle>
            <CardDescription>Application information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border/40">
          <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <dt className="text-sm text-muted-foreground">Application Name</dt>
            <dd className="text-sm font-medium">{APP_NAME}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-muted-foreground">Current Version</dt>
            <dd className="text-sm font-medium">{APP_VERSION}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-muted-foreground">Build Version</dt>
            <dd className="text-sm font-medium">{BUILD_VERSION}</dd>
          </div>
          <div className="flex items-center justify-between py-3 last:pb-0">
            <dt className="text-sm text-muted-foreground">Environment</dt>
            <dd className="text-sm font-medium">{ENVIRONMENT}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
