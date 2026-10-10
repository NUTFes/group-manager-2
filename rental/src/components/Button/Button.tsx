import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonProps = {
  // main: 塗り（主要な操作） / sub: 白地に紫枠（補助的な操作）
  variant?: "main" | "sub";
  icon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

// Figma: メインボタン(Mobile) (node-id=5-2183) / サブボタン(Mobile) (node-id=11-145)
const VARIANTS = {
  main: "bg-main text-white border-main disabled:bg-sub disabled:border-sub",
  sub: "bg-white text-main border-main disabled:text-sub disabled:border-sub",
} as const;

const Button: FC<ButtonProps> = ({
  variant = "main",
  icon,
  fullWidth = false,
  children,
  className = "",
  type = "button",
  ...rest
}) => (
  <button
    type={type}
    className={`inline-flex h-10 items-center justify-center gap-2 rounded-full border px-6 text-body font-bold transition-opacity active:opacity-80 disabled:cursor-not-allowed ${VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    {...rest}
  >
    {icon}
    {children}
  </button>
);

export default Button;
