
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Trash2, Download } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useFileUpload } from '@/hooks/useFileUpload';

interface AudioRecorderProps {
  onAudioUploaded: (file: { id: string; name: string; url: string; type: string; size: number }) => void;
}

const AudioRecorder = ({ onAudioUploaded }: AudioRecorderProps) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { uploadFile, uploading } = useFileUpload();
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    startRecording,
    stopRecording,
    pauseRecording,
    resetRecording,
    formatTime
  } = useAudioRecorder();

  const handleStartRecording = async () => {
    resetRecording();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    await startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleUploadRecording = async () => {
    if (!audioBlob) return;

    const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
      type: 'audio/webm'
    });

    const uploadedFile = await uploadFile(file);
    if (uploadedFile) {
      onAudioUploaded(uploadedFile);
      resetRecording();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
  };

  const handlePlayRecording = () => {
    if (audioBlob && !audioUrl) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    }
  };

  const handleDeleteRecording = () => {
    resetRecording();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Voice Recording</h3>
        {isRecording && (
          <div className="flex items-center text-red-400">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isRecording && !audioBlob && (
          <Button
            onClick={handleStartRecording}
            className="bg-red-500 hover:bg-red-600 text-white"
            size="sm"
          >
            <Mic className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <>
            <Button
              onClick={pauseRecording}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button
              onClick={handleStopRecording}
              className="bg-gray-600 hover:bg-gray-700 text-white"
              size="sm"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </>
        )}

        {audioBlob && (
          <>
            <Button
              onClick={handlePlayRecording}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Play className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleUploadRecording}
              disabled={uploading}
              className="bg-gradient-purple hover:opacity-90 text-white"
              size="sm"
            >
              {uploading ? (
                <>
                  <Download className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Upload Recording
                </>
              )}
            </Button>
            <Button
              onClick={handleDeleteRecording}
              variant="outline"
              size="sm"
              className="border-red-400/20 text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4">
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {recordingTime > 0 && !isRecording && audioBlob && (
        <div className="mt-2 text-sm text-gray-400">
          Recording duration: {formatTime(recordingTime)}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
