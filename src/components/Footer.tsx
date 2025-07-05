
import { useState } from 'react';
import PrivacyPolicyPopup from './legal/PrivacyPolicyPopup';
import TermsOfServicePopup from './legal/TermsOfServicePopup';

const Footer = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="bg-dark-secondary border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-poppins font-bold gradient-text">RecallIQ</span>
              </div>
              <p className="text-gray-300 max-w-md">
                Your AI-powered memory assistant that helps you remember important people and interactions effortlessly.
              </p>
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
            <p className="text-gray-400">© 2024 RecallIQ. All rights reserved.</p>
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
