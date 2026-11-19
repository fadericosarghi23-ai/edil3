import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Bottone in stile shadcn. La variante default è il bottone navy #102542 del sito attuale;
 * all'hover una "lastra" azzurra scorre da sinistra a destra (il fronte di bonifica dell'hero).
 */
const buttonVariants = cva(
  'group/btn relative isolate inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-[var(--radius)] font-display font-medium uppercase tracking-[0.12em] transition-[color,translate,scale] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.15em] [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-500 hover:[&_svg]:translate-x-1 before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.16,1,0.3,1)] hover:before:scale-x-100',
  {
    variants: {
      variant: {
        default: 'bg-navy text-white before:bg-sky hover:text-navy',
        sky: 'bg-sky text-navy before:bg-navy hover:text-white',
        outline: 'border-2 border-navy text-navy before:bg-navy hover:text-white',
        light: 'border-2 border-white/80 text-white before:bg-white hover:text-navy',
        ghost: 'text-navy before:bg-sky-soft',
      },
      size: {
        sm: 'h-10 px-5 text-[0.8rem]',
        default: 'h-13 px-7 text-[0.9rem]',
        lg: 'h-16 px-9 text-base',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = 'Button';

export { Button, buttonVariants };
