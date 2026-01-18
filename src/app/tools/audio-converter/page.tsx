"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { 
  Upload, 
  Download, 
  Play,
  Pause,
  Settings,
  Scissors,
  RefreshCw,
  Eye,
  EyeOff,
  Music,
  FileAudio,
  Clock,
  Zap,
  Shield,
  AlertCircle,
  Info,
  Check,
  X,
  Grid,
  List,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  RotateCw,
  Filter,
  Gauge,
  FileUp,
  Loader2,
  Activity,
  Headphones,
  Mic,
  Disc,
  Music2,
  Volume1,
  Volume,
  SkipBack,
  SkipForward
} from "lucide-react";

type AudioFormat = 'mp3' | 'wav' | 'flac' | 'aac' | 'ogg' | 'wma' | 'm4a';
type QualityPreset = 'low' | 'medium' | 'high' | 'lossless';
type ConversionSpeed = 'fast' | 'balanced' | 'best';
type Bitrate = '64k' | '128k' | '192k' | '256k' | '320k' | 'lossless';

interface AudioFile {
  id: string;
  name: string;
  size: number;
  duration: number;
  format: string;
  waveform: number[];
  url: string;
  status: 'uploaded' | 'processing' | 'converted' | 'error';
  progress: number;
}

interface ConversionSettings {
  format: AudioFormat;
  quality: QualityPreset;
  speed: ConversionSpeed;
  bitrate: Bitrate;
  sampleRate: string;
  channels: string;
  trimStart: number;
  trimEnd: number;
  normalize: boolean;
  removeSilence: boolean;
  addMetadata: boolean;
}

interface FormatOption {
  id: AudioFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface QualityOption {
  id: QualityPreset;
  label: string;
  description: string;
  bitrate: Bitrate;
  sampleRate: string;
}

export default function AudioConverter() {
  // Audio files state
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Conversion settings
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'mp3',
    quality: 'medium',
    speed: 'balanced',
    bitrate: '192k',
    sampleRate: '44.1kHz',
    channels: 'Stereo',
    trimStart: 0,
    trimEnd: 0,
    normalize: true,
    removeSilence: false,
    addMetadata: true
  });
  
  // Preview states
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [showTrimTool, setShowTrimTool] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Conversion states
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [conversionTime, setConversionTime] = useState<number | null>(null);
  const [convertedFiles, setConvertedFiles] = useState<AudioFile[]>([]);
  
  // UI refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Available formats
  const formatOptions: FormatOption[] = [
    {
      id: 'mp3',
      label: 'MP3',
      description: 'Most compatible, good quality',
      icon: <Music className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      id: 'wav',
      label: 'WAV',
      description: 'Lossless, professional quality',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    },
    {
      id: 'flac',
      label: 'FLAC',
      description: 'Lossless compression',
      icon: <Headphones className="w-5 h-5" />,
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    },
    {
      id: 'aac',
      label: 'AAC',
      description: 'Apple format, high quality',
      icon: <Music2 className="w-5 h-5" />,
      color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    },
    {
      id: 'ogg',
      label: 'OGG',
      description: 'Open source, web compatible',
      icon: <Disc className="w-5 h-5" />,
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
    },
    {
      id: 'wma',
      label: 'WMA',
      description: 'Windows Media Audio',
      icon: <FileAudio className="w-5 h-5" />,
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
    },
    {
      id: 'm4a',
      label: 'M4A',
      description: 'Apple iTunes format',
      icon: <Music className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    }
  ];

  // Quality presets
  const qualityOptions: QualityOption[] = [
    {
      id: 'low',
      label: 'Low Quality',
      description: 'Smallest file size',
      bitrate: '64k',
      sampleRate: '22.05kHz'
    },
    {
      id: 'medium',
      label: 'Medium Quality',
      description: 'Good balance of quality and size',
      bitrate: '192k',
      sampleRate: '44.1kHz'
    },
    {
      id: 'high',
      label: 'High Quality',
      description: 'High quality, larger file',
      bitrate: '320k',
      sampleRate: '48kHz'
    },
    {
      id: 'lossless',
      label: 'Lossless',
      description: 'Best quality, largest file',
      bitrate: 'lossless',
      sampleRate: '96kHz'
    }
  ];

  // Speed options
  const speedOptions = [
    { id: 'fast', label: 'Fast', description: 'Faster conversion, lower quality' },
    { id: 'balanced', label: 'Balanced', description: 'Good speed and quality balance' },
    { id: 'best', label: 'Best Quality', description: 'Slower conversion, best quality' }
  ];

  // Bitrate options
  const bitrateOptions: Bitrate[] = ['64k', '128k', '192k', '256k', '320k', 'lossless'];

  // Sample rate options
  const sampleRateOptions = ['8kHz', '16kHz', '22.05kHz', '44.1kHz', '48kHz', '96kHz', '192kHz'];

  // Channel options
  const channelOptions = ['Mono', 'Stereo', '5.1', '7.1'];

  // Playback speed options
  const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle drag and drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        handleFileSelect(files);
      }
    };

    const dropZone = dropZoneRef.current;
    if (dropZone) {
      dropZone.addEventListener('dragover', handleDragOver);
      dropZone.addEventListener('dragleave', handleDragLeave);
      dropZone.addEventListener('drop', handleDrop);
    }

    return () => {
      if (dropZone) {
        dropZone.removeEventListener('dragover', handleDragOver);
        dropZone.removeEventListener('dragleave', handleDragLeave);
        dropZone.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  // Handle file selection
  const handleFileSelect = async (files: File[]) => {
    const audioFilesArray: AudioFile[] = [];
    let totalSize = 0;
    
    // Filter for audio files
    const audioFiles = files.filter(file => 
      file.type.startsWith('audio/') || 
      ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'].some(ext => 
        file.name.toLowerCase().endsWith(ext)
      )
    );
    
    if (audioFiles.length === 0) {
      setUploadError('Please select audio files (MP3, WAV, FLAC, AAC, OGG, WMA, M4A)');
      return;
    }
    
    // Check total size
    totalSize = audioFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 200 * 1024 * 1024) { // 200MB limit
      setUploadError('Total file size must be less than 200MB');
      return;
    }
    
    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsUploading(false);
          
          // Process uploaded files
          audioFiles.forEach((file, index) => {
            const duration = Math.floor(Math.random() * 300) + 30; // 30-330 seconds
            const format = file.name.split('.').pop()?.toLowerCase() || 'mp3';
            
            // Generate waveform data
            const waveform = Array.from({ length: 100 }, () => Math.random() * 100);
            
            audioFilesArray.push({
              id: Date.now().toString() + index,
              name: file.name,
              size: file.size,
              duration,
              format,
              waveform,
              url: URL.createObjectURL(file),
              status: 'uploaded',
              progress: 100
            });
          });
          
          setAudioFiles(prev => [...prev, ...audioFilesArray]);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Remove audio file
  const handleRemoveFile = (id: string) => {
    setAudioFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== id);
    });
    
    if (audioFiles.length === 1) {
      setCurrentAudioIndex(0);
    } else if (currentAudioIndex >= audioFiles.length - 1) {
      setCurrentAudioIndex(audioFiles.length - 2);
    }
  };

  // Clear all files
  const handleClearAll = () => {
    audioFiles.forEach(file => {
      if (file.url) {
        URL.revokeObjectURL(file.url);
      }
    });
    setAudioFiles([]);
    setCurrentAudioIndex(0);
    setConvertedFiles([]);
    setConversionProgress(0);
    setConversionError(null);
    setConversionTime(null);
  };

  // Get current audio
  const currentAudio = audioFiles[currentAudioIndex];

  // Audio controls
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(80);
      }
    }
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  // Handle conversion
  const handleConvert = async () => {
    if (audioFiles.length === 0) {
      setConversionError('Please upload audio files first');
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    setConversionError(null);
    setConversionTime(null);
    setConvertedFiles([]);

    const startTime = Date.now();
    const totalFiles = audioFiles.length;
    let convertedCount = 0;

    // Simulate conversion progress
    const progressInterval = setInterval(() => {
      setConversionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Create converted files
          const newConvertedFiles: AudioFile[] = audioFiles.map((file, index) => ({
            ...file,
            id: `converted_${file.id}`,
            name: file.name.replace(/\.[^/.]+$/, '') + `_converted.${settings.format}`,
            format: settings.format,
            status: 'converted',
            progress: 100,
            url: URL.createObjectURL(new Blob(['Simulated converted audio'], { type: 'audio/mpeg' }))
          }));
          
          setConvertedFiles(newConvertedFiles);
          
          const endTime = Date.now();
          setConversionTime((endTime - startTime) / 1000);
          setIsConverting(false);
          
          return 100;
        }
        
        // Update progress based on files processed
        convertedCount = Math.floor((prev / 100) * totalFiles);
        return prev + (100 / (totalFiles * 10)); // 10 steps per file
      });
    }, 300);
  };

  // Handle download
  const handleDownload = (file: AudioFile) => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle download all
  const handleDownloadAll = () => {
    convertedFiles.forEach(file => {
      handleDownload(file);
    });
  };

  // Reset converter
  const handleReset = () => {
    handleClearAll();
    setSettings({
      format: 'mp3',
      quality: 'medium',
      speed: 'balanced',
      bitrate: '192k',
      sampleRate: '44.1kHz',
      channels: 'Stereo',
      trimStart: 0,
      trimEnd: 0,
      normalize: true,
      removeSilence: false,
      addMetadata: true
    });
    setShowSettings(true);
    setShowTrimTool(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setVolume(80);
    setIsMuted(false);
    setPlaybackSpeed(1);
  };

  // Sample audios for demo
  const sampleAudios = [
    { name: 'Sample Song 1.mp3', size: '4.5 MB', duration: '3:30', bitrate: '192k' },
    { name: 'Podcast Episode.wav', size: '48.2 MB', duration: '45:20', bitrate: 'lossless' },
    { name: 'Sound Effect.flac', size: '8.7 MB', duration: '0:15', bitrate: 'lossless' },
    { name: 'Interview Recording.m4a', size: '25.3 MB', duration: '22:45', bitrate: '256k' }
  ];

  // Update settings
  const updateSettings = (key: keyof ConversionSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Calculate output file size (estimated)
  const calculateOutputSize = () => {
    if (audioFiles.length === 0) return '0 MB';
    
    const totalSize = audioFiles.reduce((sum, file) => sum + file.size, 0);
    let multiplier = 1;
    
    // Adjust based on quality and bitrate
    switch (settings.bitrate) {
      case '64k': multiplier = 0.2; break;
      case '128k': multiplier = 0.4; break;
      case '192k': multiplier = 0.6; break;
      case '256k': multiplier = 0.8; break;
      case '320k': multiplier = 1; break;
      case 'lossless': multiplier = 2; break;
    }
    
    // Adjust based on format
    switch (settings.format) {
      case 'mp3': multiplier *= 1; break;
      case 'aac': multiplier *= 0.9; break;
      case 'ogg': multiplier *= 0.85; break;
      case 'wma': multiplier *= 0.95; break;
      case 'm4a': multiplier *= 0.9; break;
      case 'wav': multiplier *= 3; break;
      case 'flac': multiplier *= 2.5; break;
    }
    
    const estimatedSize = totalSize * multiplier;
    return formatFileSize(estimatedSize);
  };

  // Generate waveform visualization
  const renderWaveform = (waveform: number[], width: number = 300, height: number = 60) => {
    return (
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <svg
          width="100%"
          height={height}
          className="absolute inset-0"
        >
          {waveform.map((value, index) => {
            const x = (index / waveform.length) * 100 + '%';
            const barHeight = (value / 100) * height;
            const y = (height - barHeight) / 2;
            
            return (
              <rect
                key={index}
                x={x}
                y={y}
                width="2"
                height={barHeight}
                fill="currentColor"
                className="text-blue-500 dark:text-blue-400 opacity-70"
              />
            );
          })}
          
          {/* Progress indicator */}
          {currentAudio && duration > 0 && (
            <rect
              x={`${(currentTime / duration) * 100}%`}
              y="0"
              width="2"
              height={height}
              fill="currentColor"
              className="text-red-500 dark:text-red-400"
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <ToolLayout
      title="Audio Converter"
      description="Convert audio between MP3, WAV, FLAC, AAC, OGG, WMA, and M4A formats. Adjust quality, bitrate, sample rate, and edit audio before conversion."
      keywords="audio converter, convert audio, mp3 converter, wav to mp3, flac to mp3, audio format converter, audio compressor, trim audio"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Audio Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Convert audio between 7+ formats with quality control and editing options
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <FileUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Upload Audio
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Upload audio to convert (max 200MB total)
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  title="Reset converter"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* Drag & Drop Zone */}
              {audioFiles.length === 0 ? (
                <div
                  ref={dropZoneRef}
                  onClick={handleFileInputClick}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Drop your audio files here
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Supports MP3, WAV, FLAC, AAC, OGG, WMA, M4A
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav,.flac,.aac,.ogg,.wma,.m4a"
                    multiple
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileSelect(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Uploaded Files */
                <div className="space-y-6">
                  {/* File List */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Uploaded Audio ({audioFiles.length})
                      </h4>
                      <button
                        onClick={handleClearAll}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </button>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {audioFiles.map((file, index) => (
                        <div
                          key={file.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                            currentAudioIndex === index
                              ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => setCurrentAudioIndex(index)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                file.format === 'mp3' ? 'bg-blue-100 dark:bg-blue-900' :
                                file.format === 'wav' ? 'bg-purple-100 dark:bg-purple-900' :
                                file.format === 'flac' ? 'bg-green-100 dark:bg-green-900' :
                                'bg-gray-100 dark:bg-gray-700'
                              }`}>
                                <Music className={`w-6 h-6 ${
                                  file.format === 'mp3' ? 'text-blue-600 dark:text-blue-400' :
                                  file.format === 'wav' ? 'text-purple-600 dark:text-purple-400' :
                                  file.format === 'flac' ? 'text-green-600 dark:text-green-400' :
                                  'text-gray-600 dark:text-gray-400'
                                }`} />
                              </div>
                              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-gray-900/80 text-white text-xs rounded">
                                {file.format.toUpperCase()}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white truncate max-w-50">
                                {file.name}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <span>{formatFileSize(file.size)}</span>
                                <span>•</span>
                                <span>{formatTime(file.duration)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {file.status === 'converted' && (
                                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                  <Check className="w-4 h-4" />
                                  Converted
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(file.id);
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Uploading audio files...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Error */}
              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{uploadError}</span>
                  </div>
                </div>
              )}

              {/* Sample Audios */}
              {audioFiles.length === 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Try with sample audio
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {sampleAudios.map((audio, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          // Simulate file upload
                          const fakeFile = new File([''], audio.name, { type: 'audio/mpeg' });
                          Object.defineProperty(fakeFile, 'size', { value: 4500000 });
                          handleFileSelect([fakeFile]);
                        }}
                        className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Music className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {audio.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{audio.size}</span>
                          <span>•</span>
                          <span>{audio.duration}</span>
                          <span>•</span>
                          <span>{audio.bitrate}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Preview & Player */}
            {currentAudio && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                      <Headphones className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Audio Preview
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentAudio.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowTrimTool(!showTrimTool)}
                      className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${
                        showTrimTool
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Scissors className="w-4 h-4" />
                      Trim Tool
                    </button>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Audio Player */}
                <div className="space-y-4">
                  {/* Waveform Visualization */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    {renderWaveform(currentAudio.waveform)}
                  </div>

                  {/* Audio Controls */}
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => handleSeek(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMute}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          ) : volume < 50 ? (
                            <Volume1 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                          className="w-24 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={skipBackward}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <SkipBack className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={togglePlay}
                          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </button>
                        <button
                          onClick={skipForward}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <SkipForward className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
                        <select
                          value={playbackSpeed}
                          onChange={(e) => handlePlaybackSpeedChange(parseFloat(e.target.value))}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
                        >
                          {playbackSpeedOptions.map((speed) => (
                            <option key={speed} value={speed}>
                              {speed}x
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Hidden audio element */}
                  <audio
                    ref={audioRef}
                    src={currentAudio.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => {
                      if (audioRef.current) {
                        setDuration(audioRef.current.duration);
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>

                {/* Trim Tool */}
                {showTrimTool && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Scissors className="w-4 h-4" />
                      Trim Audio
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Start: {formatTime(settings.trimStart)}</span>
                          <span>End: {formatTime(settings.trimEnd || duration)}</span>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            step="1"
                            value={settings.trimStart}
                            onChange={(e) => updateSettings('trimStart', parseFloat(e.target.value))}
                            className="absolute top-0 left-0 w-full h-2 bg-transparent appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer z-10"
                          />
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            step="1"
                            value={settings.trimEnd || duration}
                            onChange={(e) => updateSettings('trimEnd', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            updateSettings('trimStart', currentTime);
                          }}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                        >
                          Set Start
                        </button>
                        <button
                          onClick={() => {
                            updateSettings('trimEnd', currentTime);
                          }}
                          className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                        >
                          Set End
                        </button>
                        <button
                          onClick={() => {
                            updateSettings('trimStart', 0);
                            updateSettings('trimEnd', 0);
                          }}
                          className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Conversion Settings
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Customize output format and quality
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Output: ~{calculateOutputSize()}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Format Selection */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Output Format
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {formatOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => updateSettings('format', option.id)}
                          className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center gap-1 ${
                            settings.format === option.id
                              ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${option.color.split(' ')[0]}`}>
                            {option.icon}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {option.label}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            {option.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality & Speed */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Quality Preset
                      </h4>
                      <div className="space-y-2">
                        {qualityOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              updateSettings('quality', option.id);
                              updateSettings('bitrate', option.bitrate);
                              updateSettings('sampleRate', option.sampleRate);
                            }}
                            className={`w-full px-4 py-3 rounded-lg border text-left ${
                              settings.quality === option.id
                                ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {option.label}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {option.bitrate} • {option.sampleRate}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Conversion Speed
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {speedOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => updateSettings('speed', option.id)}
                            className={`py-2 rounded-lg ${
                              settings.speed === option.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bitrate
                      </h4>
                      <select
                        value={settings.bitrate}
                        onChange={(e) => updateSettings('bitrate', e.target.value as Bitrate)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                      >
                        {bitrateOptions.map((bitrate) => (
                          <option key={bitrate} value={bitrate}>
                            {bitrate === 'lossless' ? 'Lossless' : `${bitrate}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sample Rate
                      </h4>
                      <select
                        value={settings.sampleRate}
                        onChange={(e) => updateSettings('sampleRate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                      >
                        {sampleRateOptions.map((rate) => (
                          <option key={rate} value={rate}>
                            {rate}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Channels
                      </h4>
                      <select
                        value={settings.channels}
                        onChange={(e) => updateSettings('channels', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                      >
                        {channelOptions.map((channel) => (
                          <option key={channel} value={channel}>
                            {channel}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Volume className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Normalize Volume
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Balance audio levels
                            </div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.normalize}
                          onChange={(e) => updateSettings('normalize', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mic className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Remove Silence
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Auto-remove silent parts
                            </div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.removeSilence}
                          onChange={(e) => updateSettings('removeSilence', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Music2 className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Add Metadata
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Include ID3 tags
                            </div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.addMetadata}
                          onChange={(e) => updateSettings('addMetadata', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Conversion & Results */}
          <div className="space-y-6">
            {/* Convert Button & Progress */}
            <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-emerald-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                    <Music className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Convert Audio
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start conversion process
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {audioFiles.length} file{audioFiles.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Conversion Progress */}
              {isConverting && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Converting audio to {settings.format.toUpperCase()}...</span>
                    <span>{Math.round(conversionProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${conversionProgress}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {['Processing', 'Encoding', 'Finalizing'].map((step, index) => (
                      <div
                        key={step}
                        className={`text-center p-2 rounded-lg text-xs ${
                          conversionProgress > (index * 33)
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Convert Button */}
              {!isConverting && audioFiles.length > 0 && (
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-6 h-6" />
                  Convert {audioFiles.length} Audio{audioFiles.length !== 1 ? 's' : ''} to {settings.format.toUpperCase()}
                </button>
              )}

              {/* Ready State */}
              {!isConverting && audioFiles.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Music className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Audio Uploaded
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload audio to begin conversion
                  </p>
                </div>
              )}

              {/* Conversion Time */}
              {conversionTime && (
                <div className="mt-4 p-3 bg-white dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      Conversion completed in
                    </div>
                    <div className="font-medium text-emerald-600 dark:text-emerald-400">
                      {conversionTime.toFixed(1)} seconds
                    </div>
                  </div>
                </div>
              )}

              {/* Conversion Error */}
              {conversionError && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{conversionError}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Converted Files */}
            {convertedFiles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                      <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Converted Audio
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Ready to download
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadAll}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download All
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {convertedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900 dark:text-white truncate max-w-45">
                            {file.name}
                          </span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          file.format === 'mp3' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                          file.format === 'wav' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
                          file.format === 'flac' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {file.format.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </div>
                        <button
                          onClick={() => handleDownload(file)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center gap-2"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features & Info */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Key Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">7+ Formats</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      MP3, WAV, FLAC, AAC, OGG, WMA, M4A
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">Audio Quality</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Adjust bitrate, sample rate, channels
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center shrink-0">
                    <Scissors className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">Audio Editing</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Trim, normalize, remove silence
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">Waveform Preview</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Visual audio preview with playback
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Audio Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">1</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Use <strong>MP3 format</strong> for universal compatibility
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">2</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Choose <strong>FLAC/WAV</strong> for lossless audio quality
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">3</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>320kbps bitrate</strong> for best MP3 quality
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">4</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Enable <strong>normalization</strong> for consistent volume
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-purple-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Complete Audio Converter Features
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Music className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                7+ Audio Formats
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Convert between MP3, WAV, FLAC, AAC, OGG, WMA, M4A
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Headphones className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Quality Control
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Adjust bitrate, sample rate, channels, and quality
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Waveform Preview
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Visual audio preview with playback controls
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Audio Editing
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Trim, normalize, remove silence, add metadata
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}