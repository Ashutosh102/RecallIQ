
import { Plus, Search, User, Circle } from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features = () => {
  const features = [
    {
      icon: <Plus className="h-6 w-6 text-white" />,
      title: "Add Memories Easily",
      description: "Quickly capture people, conversations, and moments with our intuitive interface. Upload images, add context, and tag important details.",
      gradient: "bg-gradient-purple"
    },
    {
      icon: <Search className="h-6 w-6 text-white" />,
      title: "Smart Search",
      description: "Find anyone or anything with natural language queries. Ask 'Who was the React developer from the conference?' and get instant results.",
      gradient: "bg-gradient-teal"
    },
    {
      icon: <Circle className="h-6 w-6 text-white" />,
      title: "AI-Powered Insights",
      description: "Our advanced AI analyzes your memories to provide intelligent summaries, connections, and reminders about important people and events.",
      gradient: "bg-gradient-to-r from-blue-neon to-purple-primary"
    },
    {
      icon: <User className="h-6 w-6 text-white" />,
      title: "Organized and Secure",
      description: "Your memories are encrypted and organized automatically. Access them from anywhere while keeping your personal information completely private.",
      gradient: "bg-gradient-to-r from-teal-accent to-blue-neon"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-dark-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold mb-6 gradient-text">
            Powerful Features for Your Memory
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            RecallIQ combines cutting-edge AI with intuitive design to help you never forget important people and moments.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
