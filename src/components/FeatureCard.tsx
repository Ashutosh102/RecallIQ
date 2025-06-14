
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: string;
}

const FeatureCard = ({ icon, title, description, gradient = "bg-gradient-purple" }: FeatureCardProps) => {
  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300 group cursor-pointer">
      <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:animate-glow`}>
        {icon}
      </div>
      <h3 className="text-xl font-poppins font-semibold mb-3 text-white group-hover:gradient-text transition-colors">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
