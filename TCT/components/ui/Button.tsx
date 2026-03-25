import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1C3A2E] text-white hover:bg-[#2D6A4F] focus-visible:ring-[#1C3A2E]",
  secondary:
    "bg-[#F4EFE8] text-[#1C3A2E] hover:bg-[#EAE2D6] focus-visible:ring-[#1C3A2E]",
  outline:
    "border border-[#1C3A2E] text-[#1C3A2E] hover:bg-[#1C3A2E] hover:text-white focus-visible:ring-[#1C3A2E]",
  ghost:
    "text-[#1C3A2E] hover:bg-[#1C3A2E]/8 focus-visible:ring-[#1C3A2E]",
  gold:
    "bg-[#C9A845] text-white hover:bg-[#A8892E] focus-visible:ring-[#C9A845]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide";

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, ...props },
    ref
  ) {
    const cls = cn(base, variants[variant], sizes[size], className);

    if ("href" in props && props.href !== undefined) {
      const { href, ...anchorProps } = props;
      return (
        <Link
          href={href}
          className={cls}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(anchorProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }

    return (
      <button
        className={cls}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  }
);
