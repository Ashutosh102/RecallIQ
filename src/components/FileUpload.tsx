
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Image, Music, Video } from 'lucide-react';
import { useFileUpload, UploadedFile } from '@/hooks/useFileUpload';

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
  onFileRemove: (fileId: string) => void;
}

const FileUpload = ({ onFilesUploaded, uploadedFiles, onFileRemove }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { uploadFile, uploading } = useFileUpload();

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map(file => uploadFile(file));
    const uploadedFiles = await Promise.all(uploadPromises);
    const successfulUploads = uploadedFiles.filter(file => file !== null) as UploadedFile[];
    
    if (successfulUploads.length > 0) {
      onFilesUploaded(successfulUploads);
    }
  }, [uploadFile, onFilesUploaded]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragActive 
            ? 'border-purple-primary/50 bg-purple-primary/10' 
            : 'border-white/20 hover:border-purple-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload-input')?.click()}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-300 mb-2">
          {uploading ? 'Uploading files...' : 'Upload images, screenshots, or documents'}
        </p>
        <p className="text-sm text-gray-500">
          Drag & drop files here or click to browse
        </p>
        <input
          id="file-upload-input"
          type="file"
          multiple
          accept="image/*,application/pdf,text/plain"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-white">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm text-white truncate max-w-48">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                onClick={() => onFileRemove(file.id)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
