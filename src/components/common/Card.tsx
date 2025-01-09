import { ReactNode } from 'react';

interface CardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isVisible?: boolean;
  delay?: number;
  className?: string;
  children?: ReactNode;
}

export const Card = ({
  title,
  description,
  icon,
  isVisible = true,
  delay = 0,
  className = '',
  children,
}: CardProps) => {
  return (
    <div
      className={`group bg-base-100 rounded-xl p-8 shadow-lg hover:shadow-xl transform transition-all duration-[1000ms] ease-out hover:-translate-y-2 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-80 translate-y-2'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        {title}
      </h3>
      <p className="text-base-content/70 mb-6">
        {description}
      </p>
      {children}
    </div>
  );
};
