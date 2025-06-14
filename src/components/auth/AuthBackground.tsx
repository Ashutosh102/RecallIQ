
import React from 'react';

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/4 -right-32 w-80 h-80 bg-teal-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-blue-neon/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
      {/* Floating particles */}
      <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-purple-primary rounded-full animate-ping"></div>
      <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-teal-accent rounded-full animate-ping delay-500"></div>
      <div className="absolute top-1/2 left-2/3 w-1.5 h-1.5 bg-blue-neon rounded-full animate-ping delay-1000"></div>
      
      {/* Background Image */}
      <div className="absolute right-10 top-1/4 hidden lg:block opacity-10 animate-fade-in">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
          alt="AI Memory Assistant" 
          className="w-96 h-96 object-cover rounded-2xl"
        />
      </div>
    </div>
  );
};

export default AuthBackground;
