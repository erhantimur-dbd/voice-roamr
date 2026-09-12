import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,background-image] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 grain-hover",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:bg-ink",
        secondary: "bg-paper text-ink border border-ink hover:bg-paper",
        ghost: "text-fg hover:bg-zinc",
        danger: "bg-ink text-paper hover:bg-ink",
        link: "text-ink underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        sm: "h-9 rounded-[4px] px-3 text-sm",
        md: "h-11 rounded-[4px] px-4 text-sm",
        lg: "h-12 rounded-[4px] px-5 text-base",
        icon: "size-11 rounded-[4px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & { asChild?: boolean }
>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
