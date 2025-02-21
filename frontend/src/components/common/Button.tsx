import { ReactNode, useRef, useEffect } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'shiny' | 'primary' | 'secondary' | 'ghost' | 'halo' | 'halo-outline';
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
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || variant !== 'shiny') return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      button.style.setProperty('--mouse-x', `${x}%`);
      button.style.setProperty('--mouse-y', `${y}%`);
    };

    button.addEventListener('mousemove', handleMouseMove);
    return () => button.removeEventListener('mousemove', handleMouseMove);
  }, [variant]);

  // Handle halo variants
  if (variant === 'halo' || variant === 'halo-outline') {
    const haloClass = variant === 'halo' ? styles.haloButton : styles.haloButtonOutline;
    return (
      <button
        ref={buttonRef}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${haloClass} ${fullWidth ? 'w-full' : ''} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span />
        {children}
      </button>
    );
  }

  // Handle shiny variant
  if (variant === 'shiny') {
    return (
      <button
        ref={buttonRef}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${styles.shinyCta} ${fullWidth ? 'w-full' : ''} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className={styles.shinyCtaContent}>{children}</span>
      </button>
    );
  }

  const baseStyles = "group relative px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 overflow-hidden";
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
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${widthStyles} ${variantStyles[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <span className="relative z-10">{children}</span>
      <div 
        className={`absolute inset-0 ${gradientStyles[variant]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </button>
  );
};