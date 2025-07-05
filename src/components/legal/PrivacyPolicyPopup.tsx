
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PrivacyPolicyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyPopup = ({ isOpen, onClose }: PrivacyPolicyPopupProps) => {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, add memories, or contact us. This includes your name, email address, memories content, and any files you upload."
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: "We use your information to provide and improve RecallIQ services, including AI-powered memory enhancement, search functionality, and personalized insights. We never sell your personal data to third parties."
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: "We do not share your personal information with third parties except as described in this policy. We may share aggregated, anonymized data for research and development purposes."
    },
    {
      icon: Database,
      title: "Data Security",
      content: "We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest."
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information. You can also opt out of certain communications and data processing activities."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-transparent border-none p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 sm:p-8 m-4 relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full glass-card hover:bg-white/10 transition-colors duration-200 z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Header */}
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl sm:text-3xl font-bold gradient-text text-center">
              Privacy Policy
            </DialogTitle>
            <p className="text-gray-300 text-center mt-2">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </DialogHeader>

          {/* Content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-4 sm:p-6"
            >
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                <strong>Effective Date:</strong> July 6, 2025
                <br />
                <strong>Last Updated:</strong> July 6, 2025
              </p>
            </motion.div>

            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass-card p-4 sm:p-6 hover:bg-white/5 transition-colors duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <section.icon className="w-6 h-6 text-purple-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                      {section.title}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card p-4 sm:p-6 bg-gradient-to-r from-purple-primary/10 to-teal-accent/10"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                Contact Us
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:{' '}
                <a 
                  href="mailto:privacy@recalliq.com" 
                  className="text-purple-primary hover:text-teal-accent transition-colors duration-200"
                >
                  gotodevashu@gmail.com
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyPopup;
