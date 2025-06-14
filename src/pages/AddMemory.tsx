
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, User, Calendar } from 'lucide-react';

const AddMemory = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    people: '',
    tags: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Memory submitted:', formData);
    // Here you would typically save to your database
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <div className="bg-dark-bg/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-poppins font-bold gradient-text">RecallIQ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-poppins font-bold text-white mb-2">
            Add New Memory
          </h1>
          <p className="text-gray-300">
            Capture important people, conversations, and moments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Memory Input */}
          <div className="glass-card p-8">
            <label className="block text-lg font-semibold text-white mb-4">
              What do you want to remember?
            </label>
            <Textarea
              placeholder="Describe the person, conversation, or event you want to remember. Include as much context as possible..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-32 bg-white/5 border-white/10 text-white placeholder-gray-400 text-lg resize-none focus:border-purple-primary/50 focus:ring-purple-primary/20"
            />
          </div>

          {/* File Upload */}
          <div className="glass-card p-6">
            <label className="block text-lg font-semibold text-white mb-4">
              Add Files (Optional)
            </label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300 mb-2">Upload images, audio, or screenshots</p>
              <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <label className="block text-lg font-semibold text-white mb-4">
                <User className="h-5 w-5 inline mr-2" />
                People Involved
              </label>
              <Input
                placeholder="John, Sarah, Mike..."
                value={formData.people}
                onChange={(e) => handleInputChange('people', e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-primary/50 focus:ring-purple-primary/20"
              />
            </div>

            <div className="glass-card p-6">
              <label className="block text-lg font-semibold text-white mb-4">
                Tags
              </label>
              <Input
                placeholder="tech, conference, work..."
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-primary/50 focus:ring-purple-primary/20"
              />
            </div>
          </div>

          <div className="glass-card p-6">
            <label className="block text-lg font-semibold text-white mb-4">
              <Calendar className="h-5 w-5 inline mr-2" />
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="bg-white/5 border-white/10 text-white focus:border-purple-primary/50 focus:ring-purple-primary/20 md:w-1/2"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              className="bg-gradient-purple hover:opacity-90 text-white font-semibold px-12 py-4 text-lg rounded-xl glow-effect animate-glow"
            >
              Save Memory
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemory;
