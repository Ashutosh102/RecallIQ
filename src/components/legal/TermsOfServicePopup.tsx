
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CreditCard, Shield, AlertCircle, Gavel } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TermsOfServicePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfServicePopup = ({ isOpen, onClose }: TermsOfServicePopupProps) => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: "By accessing and using RecallIQ, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all visitors, users, and others who access the service."
    },
    {
      icon: Shield,
      title: "Use of Service",
      content: "RecallIQ is designed to help you store, organize, and recall personal memories using AI technology. You may use the service for personal, non-commercial purposes only. You are responsible for maintaining the confidentiality of your account."
    },
    {
      icon: CreditCard,
      title: "Payment and Credits",
      content: "Our service operates on a credit-based system. Credits are required for AI-enhanced features, media processing, and advanced search. All payments are processed securely through Razorpay. Credits are non-refundable except as required by law."
    },
    {
      icon: AlertCircle,
      title: "User Responsibilities",
      content: "You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service. You are solely responsible for the content you upload and must ensure you have the right to share it."
    },
    {
      icon: Gavel,
      title: "Limitation of Liability",
      content: "RecallIQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our liability is limited to the amount you paid for the service in the 12 months preceding the claim."
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
              Terms of Service
            </DialogTitle>
            <p className="text-gray-300 text-center mt-2">
              Please read these terms carefully before using RecallIQ services.
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

            {/* Additional Terms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                Additional Terms
              </h3>
              <div className="space-y-3 text-gray-300 text-sm sm:text-base">
                <p><strong>Modifications:</strong> We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.</p>
                <p><strong>Termination:</strong> We may terminate or suspend your account immediately for any breach of these terms.</p>
                <p><strong>Governing Law:</strong> These terms are governed by the laws of India and disputes will be resolved in Indian courts.</p>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="glass-card p-4 sm:p-6 bg-gradient-to-r from-purple-primary/10 to-teal-accent/10"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                Contact Us
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:{' '}
                <a 
                  href="mailto:gotodevashu@gmail.com" 
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

export default TermsOfServicePopup;
