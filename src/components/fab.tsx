"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export function FloatingActionButton({
  icon,
  label,
  onClick,
  href,
  className,
}: FloatingActionButtonProps) {
  const content = (
    <Button
      size="icon-lg"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "size-14 rounded-full shadow-elevated",
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90 hover:shadow-glow",
        "active:scale-95",
        "transition-all duration-200"
      )}
    >
      {icon}
    </Button>
  );

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 sm:hidden", "pb-[env(safe-area-inset-bottom)]", className)}>
      {href ? <Link href={href}>{content}</Link> : content}
    </div>
  );
}
