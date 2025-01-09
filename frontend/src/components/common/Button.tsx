import { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  variant = 'primary',
  children,
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
  disabled = false,
}: ButtonProps) => {
  const baseStyles = "group relative px-8 py-3 rounded-full font-medium transition-all duration-500 overflow-hidden";
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const variantStyles = {
    primary: "bg-orange-500 text-white shadow-[0_2px_10px_rgba(249,115,22,0.3)] hover:shadow-[0_3px_15px_rgba(34,197,94,0.5)]",
    secondary: "bg-green-500 text-white shadow-[0_2px_10px_rgba(34,197,94,0.2)] hover:shadow-[0_3px_15px_rgba(249,115,22,0.4)]",
    ghost: "bg-transparent hover:bg-base-200/50 text-base-content",
  };

  const gradientStyles = {
    primary: "bg-gradient-to-r from-green-500 to-green-600",
    secondary: "bg-[linear-gradient(90deg,#f97316,#22c55e,#3b82f6)]",
    ghost: "",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${widthStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="relative z-10">{children}</span>
      <div className={`absolute inset-0 ${gradientStyles[variant]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </button>
  );
};
