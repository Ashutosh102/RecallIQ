
import { useState } from 'react';
import { Github, Instagram, Linkedin, Twitter, Mail } from 'lucide-react';
import PrivacyPolicyPopup from './legal/PrivacyPolicyPopup';
import TermsOfServicePopup from './legal/TermsOfServicePopup';

const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const socialLinks = [
    { 
      icon: Github, 
      href: 'https://github.com/Ashutosh102', 
      label: 'GitHub',
      color: 'hover:text-blue-400'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/recalliq', 
      label: 'Twitter',
      color: 'hover:text-sky-400'
    },
    { 
      icon: Instagram, 
      href: 'https://instagram.com/dev_ashu_102', 
      label: 'Instagram',
      color: 'hover:text-pink-400'
    },
    { 
      icon: Linkedin, 
      href: 'https://linkedin.com/in/devashu', 
      label: 'LinkedIn',
      color: 'hover:text-blue-500'
    },
    { 
      icon: Mail, 
      href: 'mailto:gotodevashu@gmail.com', 
      label: 'Gmail',
      color: 'hover:text-red-400'
    }
  ];

  return (
    <>
      <footer className="bg-dark-secondary border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo, Description and Social Media */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-poppins font-bold gradient-text">RecallIQ</span>
              </div>
              <p className="text-gray-300 max-w-md mb-6">
                Your AI-powered memory assistant that helps you remember important people and interactions effortlessly.
              </p>
              
              {/* Social Media Icons */}
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group glass-card p-3 sm:p-4 rounded-xl transition-all duration-300 
                      hover:scale-110 hover:bg-white/10 hover:-translate-y-1 
                      ${social.color} animate-slide-in-left
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    aria-label={social.label}
                  >
                    <social.icon 
                      className={`
                        w-5 h-5 sm:w-6 sm:h-6 text-gray-300 transition-all duration-300 
                        group-hover:scale-110 group-hover:drop-shadow-lg
                        group-hover:filter group-hover:brightness-125
                      `} 
                    />
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-primary/20 to-teal-accent/20 blur-xl -z-10"></div>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setIsPrivacyOpen(true)}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsTermsOpen(true)}
                    className="text-gray-300 hover:text-white transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2025 RecallIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Pop-ups */}
      <PrivacyPolicyPopup 
        isOpen={isPrivacyOpen} 
        onClose={() => setIsPrivacyOpen(false)} 
      />
      <TermsOfServicePopup 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
      />
    </>
  );
};

export default Footer;
