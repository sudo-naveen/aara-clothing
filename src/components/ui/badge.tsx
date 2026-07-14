import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/12 text-primary shadow-sm",
        secondary:
          "border-transparent bg-muted text-muted-foreground shadow-sm",
        destructive:
          "border-transparent bg-destructive/12 text-destructive shadow-sm",
        outline:
          "border-border text-foreground",
        success:
          "border-transparent bg-success/12 text-success shadow-sm",
        warning:
          "border-transparent bg-warning/12 text-warning shadow-sm",
        info:
          "border-transparent bg-info/12 text-info shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
