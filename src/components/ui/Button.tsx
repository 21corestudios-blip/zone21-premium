import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "gold" | "ghost";
type ButtonSize = "md" | "lg";

interface SharedButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type LinkButtonProps = SharedButtonProps & {
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;

type NativeButtonProps = SharedButtonProps & Omit<
  ComponentPropsWithoutRef<"button">,
  "className" | "children"
>;

type ButtonProps = LinkButtonProps | NativeButtonProps;

function getVariantClass(variant: ButtonVariant) {
  switch (variant) {
    case "ghost":
      return "border-white/12 bg-transparent text-white hover:border-white/25 hover:text-white";
    case "gold":
    default:
      return "border-[#C5B39B]/55 bg-[#C5B39B]/12 text-[#F7F5F0] hover:bg-[#C5B39B]/20";
  }
}

function getSizeClass(size: ButtonSize) {
  switch (size) {
    case "lg":
      return "px-6 py-4 text-[0.68rem]";
    case "md":
    default:
      return "px-5 py-3 text-[0.64rem]";
  }
}

function getButtonClass({
  variant = "gold",
  size = "md",
  className = "",
}: SharedButtonProps) {
  return [
    "inline-flex items-center justify-center rounded-full border font-sans uppercase tracking-[0.22em] transition-colors duration-500",
    getVariantClass(variant),
    getSizeClass(size),
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Button(props: ButtonProps) {
  const className = getButtonClass(props);

  if ("href" in props) {
    const { href, children, ...rest } = props;

    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  const { children, type = "button", ...rest } = props;

  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  );
}
