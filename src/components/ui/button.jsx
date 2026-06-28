import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const ButtonForms = React.forwardRef(({ className, variant = "primary", children, asChild = false, ...props }, ref) => {
  const variants = {
    primary: "bg-[#2F646C] text-[#F0F4F8] hover:bg-[#1A535C]",
    danger: "bg-[#FF6B6B] text-[#F0F4F8] hover:bg-[#ef5555]",
    subtle: "bg-[#CAEBEC] text-[#2D2D2D]/90 hover:bg-[#b5dfe1]",
  };

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      className={cn(
        "h-8 gap-[10px] rounded-[9px] px-5 font-normal shadow-[0_-1px_6.1px_0_rgba(0,0,0,0.31)] transition-all duration-200 hover:-translate-y-0.5 sm:text-[16px]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
})
ButtonForms.displayName = "ButtonForms"

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"


export { Button, ButtonForms, buttonVariants }
