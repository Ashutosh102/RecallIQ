
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, Calendar, Trash2, Paperclip, Image, Music, Video, FileText, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useMemoryAttachments, MemoryAttachment } from '@/hooks/useMemoryAttachments';
import { useFileUpload } from '@/hooks/useFileUpload';

interface MemoryCardProps {
  id: string;
  title: string;
  summary: string;
  people?: string[];
  tags?: string[];
  date: string;
  onDelete?: (id: string) => void;
}

const MemoryCard = ({ id, title, summary, people = [], tags = [], date, onDelete }: MemoryCardProps) => {
  const [showAttachments, setShowAttachments] = useState(false);
  const { attachments, fetchAttachments } = useMemoryAttachments();
  const { getSignedUrl } = useFileUpload();

  useEffect(() => {
    fetchAttachments(id);
  }, [id, fetchAttachments]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-3 w-3" />;
    if (type.startsWith('audio/')) return <Music className="h-3 w-3" />;
    if (type.startsWith('video/')) return <Video className="h-3 w-3" />;
    return <FileText className="h-3 w-3" />;
  };

  const getProcessingIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-400" />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-400" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-400 animate-spin" />;
      default:
        return null;
    }
  };

  const handleAttachmentClick = async (attachment: MemoryAttachment) => {
    try {
      // Extract the file path from the URL or use the file name
      const fileName = attachment.file_url.split('/').pop()?.split('?')[0] || attachment.file_name;
      const filePath = fileName.includes('/') ? fileName : `${attachment.memory_id}/${fileName}`;
      
      const signedUrl = await getSignedUrl(filePath);
      if (signedUrl) {
        window.open(signedUrl, '_blank');
      } else {
        // Fallback to original URL if signed URL generation fails
        window.open(attachment.file_url, '_blank');
      }
    } catch (error) {
      console.error('Failed to open attachment:', error);
      // Fallback to original URL
      window.open(attachment.file_url, '_blank');
    }
  };

  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:gradient-text transition-colors">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          {attachments.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAttachments(!showAttachments)}
              className="text-gray-400 hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Paperclip className="h-4 w-4" />
              <span className="text-xs ml-1">{attachments.length}</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(id)}
              className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed">
        {summary}
      </p>

      {/* Attachments */}
      {showAttachments && attachments.length > 0 && (
        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center">
            <Paperclip className="h-3 w-3 mr-1" />
            Attachments
          </h4>
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                onClick={() => handleAttachmentClick(attachment)}
              >
                <div className="flex items-center space-x-2">
                  {getFileIcon(attachment.file_type)}
                  <span className="truncate max-w-32">{attachment.file_name}</span>
                  {getProcessingIcon(attachment.processing_status)}
                </div>
                <ExternalLink className="h-3 w-3" />
              </div>
            ))}
          </div>
          
          {/* Show processing status summary */}
          {attachments.some(att => att.processing_status === 'pending') && (
            <div className="mt-2 text-xs text-yellow-400 flex items-center">
              <Clock className="h-3 w-3 mr-1 animate-spin" />
              Processing file content...
            </div>
          )}
          
          {/* Show content summary if available */}
          {attachments.some(att => att.extracted_text || att.transcription) && (
            <div className="mt-2 text-xs text-green-400">
              ✓ Content extracted and searchable
            </div>
          )}
        </div>
      )}
      
      {people && people.length > 0 && (
        <div className="flex items-center mb-3">
          <User className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-400">
            {people.join(', ')}
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tags && tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-primary/20 text-purple-300 text-xs rounded-full border border-purple-primary/30"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(date)}
        </div>
      </div>
    </div>
  );
};

export default MemoryCard;
