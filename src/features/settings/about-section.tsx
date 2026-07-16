import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const APP_VERSION = "0.1.0";
const BUILD_VERSION = "1";
const ENVIRONMENT = process.env.NODE_ENV === "production" ? "Production" : "Development";

const DEVELOPERS = [
  { name: "Feroan Mothy", github: "https://github.com/Feroan101" },
  { name: "Alwin Johith", github: "https://github.com/alwinjohith" },
] as const;

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
      <CardContent className="space-y-6">
        <dl className="divide-y divide-border/40">
          <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <dt className="text-sm text-muted-foreground shrink-0">Application Name</dt>
            <dd className="text-sm font-medium text-right">{APP_NAME}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground shrink-0">Current Version</dt>
            <dd className="text-sm font-medium text-right">{APP_VERSION}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-muted-foreground shrink-0">Build Version</dt>
            <dd className="text-sm font-medium text-right">{BUILD_VERSION}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
            <dt className="text-sm text-muted-foreground shrink-0">Environment</dt>
            <dd className="text-sm font-medium text-right">{ENVIRONMENT}</dd>
          </div>
        </dl>

        <div className="rounded-xl border border-border/40 p-4 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Developed By
          </p>
          <ul className="space-y-1.5">
            {DEVELOPERS.map((dev) => (
              <li key={dev.github}>
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  <GithubIcon className="size-3.5" />
                  {dev.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground/70">
            Designed and developed for Aara Clothing&apos;s internal inventory
            management system.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
