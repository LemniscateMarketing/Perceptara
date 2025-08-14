import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        therapeutic:
          "border-therapeutic-blue/30 bg-therapeutic-blue/20 text-sage-800 hover:bg-therapeutic-blue/30 hover:text-sage-900",
        warm: "border-warm-200 bg-warm-100 text-warm-800 hover:bg-warm-200 hover:text-warm-900",
        sage: "border-sage-200 bg-sage-50 text-sage-700 hover:bg-sage-100 hover:text-sage-800",
        lavender:
          "border-therapeutic-lavender/30 bg-therapeutic-lavender/20 text-sage-800 hover:bg-therapeutic-lavender/30 hover:text-sage-900",
        green:
          "border-therapeutic-green/30 bg-therapeutic-green/20 text-sage-800 hover:bg-therapeutic-green/30 hover:text-sage-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
