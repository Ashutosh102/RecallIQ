import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, User, Calendar, Brain, Sparkles } from 'lucide-react';
import { aiService, AIMemoryResponse } from '@/lib/ai';
import { useMemories } from '@/hooks/useMemories';
import { useMemoryAttachments } from '@/hooks/useMemoryAttachments';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from '@/components/FileUpload';
import AudioRecorder from '@/components/AudioRecorder';
import CreditsBanner from '@/components/credits/CreditsBanner';
import { useMemoriesWithCredits } from '@/hooks/useMemoriesWithCredits';
import { UploadedFile } from '@/hooks/useFileUpload';

const AddMemory = () => {
  const navigate = useNavigate();
  const { addMemory } = useMemories();
  const { addMemoryWithCredits } = useMemoriesWithCredits();
  const { addAttachment } = useMemoryAttachments();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    people: '',
    tags: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [aiEnhancement, setAiEnhancement] = useState<AIMemoryResponse | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleAudioUploaded = (file: UploadedFile) => {
    setUploadedFiles(prev => [...prev, file]);
    toast({
      title: "Audio recorded successfully!",
      description: "Your audio recording has been uploaded.",
    });
  };

  const handleAiEnhance = async () => {
    if (!formData.description.trim()) return;
    
    setIsEnhancing(true);
    try {
      const people = formData.people.split(',').map(p => p.trim()).filter(Boolean);
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const enhancement = await aiService.enhanceMemory(formData.description, people, tags);
      setAiEnhancement(enhancement);
      setShowAiSuggestions(true);
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const acceptAiSuggestions = () => {
    if (aiEnhancement) {
      setFormData(prev => ({
        ...prev,
        title: aiEnhancement.summary.substring(0, 100),
        tags: aiEnhancement.enhancedTags.join(', ')
      }));
      setShowAiSuggestions(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please provide both a title and description for your memory.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const memoryData = {
        title: formData.title.trim(),
        summary: formData.description.trim(),
        content: formData.description.trim(),
        people: formData.people ? formData.people.split(',').map(p => p.trim()).filter(Boolean) : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        date: formData.date,
        ai_enhanced: !!aiEnhancement,
        ai_insights: aiEnhancement ? {
          summary: aiEnhancement.summary,
          insights: aiEnhancement.insights,
          keyTopics: aiEnhancement.keyTopics,
          enhancedTags: aiEnhancement.enhancedTags
        } : {}
      };

      const hasMedia = uploadedFiles.length > 0;
      const { success, memory, error: creditError } = await addMemoryWithCredits(memoryData, hasMedia);

      if (!success) {
        toast({
          title: "Credit Deduction Failed",
          description: creditError || "Could not deduct credits for saving memory.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Upload attachments if any
      if (uploadedFiles.length > 0 && memory) {
        const attachmentPromises = uploadedFiles.map(file => 
          addAttachment(memory.id, file)
        );
        await Promise.all(attachmentPromises);
      }
      
      toast({
        title: "Memory saved successfully!",
        description: `Your memory${uploadedFiles.length > 0 ? ' and attachments have' : ' has'} been added to your personal database.`,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving memory:', error);
      toast({
        title: "Error saving memory",
        description: "There was a problem saving your memory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              onClick={handleBackToDashboard}
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
            Capture important people, conversations, and moments with AI enhancement
          </p>
        </div>
        
        {/* Credits Banner */}
        <CreditsBanner />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Input */}
          <div className="glass-card p-6">
            <label className="block text-lg font-semibold text-white mb-4">
              Memory Title *
            </label>
            <Input
              placeholder="Give your memory a descriptive title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder-gray-400 text-lg focus:border-purple-primary/50 focus:ring-purple-primary/20"
            />
          </div>

          {/* Main Memory Input */}
          <div className="glass-card p-8">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-lg font-semibold text-white">
                What do you want to remember? *
              </label>
              <Button
                type="button"
                onClick={handleAiEnhance}
                disabled={!formData.description.trim() || isEnhancing}
                className="bg-gradient-purple hover:opacity-90 text-white"
                size="sm"
              >
                {isEnhancing ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Enhance
                  </>
                )}
              </Button>
            </div>
            <Textarea
              placeholder="Describe the person, conversation, or event you want to remember. Include as much context as possible..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-32 bg-white/5 border-white/10 text-white placeholder-gray-400 text-lg resize-none focus:border-purple-primary/50 focus:ring-purple-primary/20"
            />
          </div>

          {/* AI Enhancement Results */}
          {showAiSuggestions && aiEnhancement && (
            <div className="glass-card p-6 border border-purple-primary/30">
              <div className="flex items-center mb-4">
                <Brain className="h-5 w-5 text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">AI Enhancement</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-2">Summary</h4>
                  <p className="text-gray-300 text-sm">{aiEnhancement.summary}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-2">Enhanced Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiEnhancement.enhancedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-primary/20 text-purple-300 text-xs rounded-full border border-purple-primary/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-2">AI Insights</h4>
                  <ul className="space-y-1">
                    {aiEnhancement.insights.map((insight, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-purple-400 mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4">
                <Button
                  type="button"
                  onClick={acceptAiSuggestions}
                  className="bg-gradient-purple hover:opacity-90 text-white"
                  size="sm"
                >
                  Accept Suggestions
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAiSuggestions(false)}
                  variant="outline"
                  className="bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60"
                  size="sm"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Audio Recording */}
          <div className="glass-card p-6">
            <label className="block text-lg font-semibold text-white mb-4">
              Voice Recording
            </label>
            <AudioRecorder onAudioUploaded={handleAudioUploaded} />
          </div>

          {/* File Upload */}
          <div className="glass-card p-6">
            <label className="block text-lg font-semibold text-white mb-4">
              Add Files (Optional)
            </label>
            <FileUpload 
              onFilesUploaded={handleFilesUploaded}
              uploadedFiles={uploadedFiles}
              onFileRemove={handleFileRemove}
            />
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
              disabled={isSubmitting}
              className="bg-gradient-purple hover:opacity-90 text-white font-semibold px-12 py-4 text-lg rounded-xl glow-effect animate-glow"
            >
              {isSubmitting ? 'Saving Memory...' : 'Save Memory'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemory;
