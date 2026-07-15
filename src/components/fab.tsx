import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  className?: string;
}

export function FloatingActionButton({
  icon,
  label,
  href,
  className,
}: FloatingActionButtonProps) {
  return (
    <div className={cn("fixed bottom-6 right-6 z-50 sm:hidden", "pb-[env(safe-area-inset-bottom)]", className)}>
      <Link href={href}>
        <Button
          size="icon-lg"
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
      </Link>
    </div>
  );
}
