import React, { useEffect, useRef } from 'react';

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const script = document.createElement('script');
            script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
            script.async = true;
            document.body.appendChild(script);

            // Disconnect observer after script is loaded
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      // Clean up script if component unmounts before script loads
      const script = document.querySelector('script[src="https://static-bundles.visme.co/forms/vismeforms-embed.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-dark-secondary/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
       <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold mb-6 gradient-text">Drop A Line !</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Leave your thoughts for future-us
        </p>
      </div>
      
         
          <div
             className="visme_d"
             data-title="Sample Custom Form"
             data-url="g7dd6zg0-sample-custom-form"
             data-domain="forms"
             data-full-page="false"
             data-min-height="500px"
             data-form-id="133080"
           ></div>
       
     </div>
    </section>
  );
};

export default ContactSection;
