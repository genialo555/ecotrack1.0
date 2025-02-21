import Image from 'next/image';
import { FC } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

export const FeatureCard: FC<FeatureCardProps> = ({ title, description, icon, image }) => {
  const isItineraryCard = title === "Trouvez n'importe quel itinéraire";
  
  return (
    <div className={`group relative p-8 rounded-2xl bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden 
      ${isItineraryCard ? 'hover:scale-105 hover:z-50' : ''}`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-secondary/5 blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -left-8 -top-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl transform group-hover:scale-150 transition-transform duration-700"></div>
      
      {/* Background Image with Overlay */}
      {image && (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={image} 
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500
              ${isItineraryCard ? 'opacity-20 group-hover:opacity-30' : 'opacity-10 group-hover:opacity-20'}`}
          />
          <div className={`absolute inset-0 bg-gradient-to-br from-base-100 to-base-100/95 
            ${isItineraryCard ? 'opacity-80' : 'opacity-90'}`}></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon container with gradient background */}
        <div className="mb-6 relative">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300
            ${isItineraryCard ? 'scale-110' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
              {icon}
            </div>
          </div>
        </div>

        {/* Title with gradient text on hover */}
        <h3 className={`text-xl font-bold mb-3 ${title === 'Planning Intelligent' ? '!text-white' : 'text-white/90'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300
          ${isItineraryCard ? 'text-2xl' : ''}`}>
          {title}
        </h3>

        {/* Description with subtle animation */}
        <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
          {description}
        </p>

        {/* Animated arrow */}
        <div className="mt-6 flex items-center text-primary opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <span className="text-sm font-medium mr-2">En savoir plus</span>
          <svg 
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};
