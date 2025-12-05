// import * as React from 'react';
// import { Slot } from '@radix-ui/react-slot';
// import { cva, type VariantProps } from 'class-variance-authority';

// import { cn } from '@/lib/utils';
// import Link from 'next/link';

// const buttonVariants = cva(
//   'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
//   {
//     variants: {
//       variant: {
//         default: 'bg-primary text-primary-foreground hover:bg-primary/90',
//         destructive:
//           'bg-destructive text-destructive-foreground hover:bg-destructive/90',
//         outline:
//           'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
//         secondary:
//           'bg-secondary text-secondary-foreground hover:bg-secondary/80',
//         ghost: 'hover:bg-accent hover:text-accent-foreground',
//         link: 'text-primary underline-offset-4 hover:underline',
//       },
//       size: {
//         default: 'h-10 px-4 py-2',
//         sm: 'h-9 rounded-md px-3',
//         lg: 'h-11 rounded-md px-8',
//         icon: 'h-10 w-10',
//       },
//     },
//     defaultVariants: {
//       variant: 'default',
//       size: 'default',
//     },
//   }
// );

// export interface LinkButtonProps
//   extends React.LinkHTMLAttributes<HTMLLinkElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
// }

// const LinkButton = React.forwardRef<HTMLLinkElement, LinkButtonProps>(
//   ({ href= '#', className, variant, size, asChild = false, ...props }, ref) => {
//     // const Comp = asChild ? Slot : 'button';
//     // const url = new URL(href);
//     return (
//       <Link
//         className={cn(buttonVariants({ variant, size, className }))}
//         href={new URL(href)}
//         {...props}
//       />
//     );
//   }
// );
// LinkButton.displayName = 'LinkButton';

// export { LinkButton, buttonVariants };

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import NextLink from 'next/link';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

const linkVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// interface ExtendedLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps, VariantProps<typeof linkVariants> {}

interface ExtendedLinkProps
  extends ComponentPropsWithoutRef<typeof NextLink>,
    VariantProps<typeof linkVariants> {}

const LinkButton = forwardRef<HTMLAnchorElement, ExtendedLinkProps>(
  ({ className, variant, ...restProps }: ExtendedLinkProps, ref) => {
    return (
      <NextLink
        ref={ref}
        className={cn(linkVariants({ variant, className }))}
        {...restProps}
      />
    );
  }
);

LinkButton.displayName = 'LinkButton';

export { LinkButton, linkVariants };
