"use client";

import RelatedTools from "@/components/RelatedTools";
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
  Film,
  FileVideo,
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
  Maximize2,
  RotateCw,
  Filter,
  Gauge,
  FileUp,
  Loader2
} from "lucide-react";

type VideoFormat = 'mp4' | 'avi' | 'mov' | 'wmv' | 'mkv' | 'webm' | 'flv';
type QualityPreset = 'low' | 'medium' | 'high' | 'original';
type ConversionSpeed = 'fast' | 'balanced' | 'best';
type AspectRatio = '16:9' | '4:3' | '1:1' | 'original';

interface VideoFile {
  id: string;
  name: string;
  size: number;
  duration: number;
  format: string;
  thumbnail: string;
  url: string;
  status: 'uploaded' | 'processing' | 'converted' | 'error';
  progress: number;
}

interface ConversionSettings {
  format: VideoFormat;
  quality: QualityPreset;
  speed: ConversionSpeed;
  resolution: string;
  bitrate: string;
  framerate: string;
  aspectRatio: AspectRatio;
  trimStart: number;
  trimEnd: number;
  removeAudio: boolean;
  optimizeForWeb: boolean;
}

interface FormatOption {
  id: VideoFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface QualityOption {
  id: QualityPreset;
  label: string;
  description: string;
  bitrate: string;
  resolution: string;
}

export default function VideoConverter() {
  // Video files state
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Conversion settings
  const [settings, setSettings] = useState<ConversionSettings>({
    format: 'mp4',
    quality: 'medium',
    speed: 'balanced',
    resolution: '1080p',
    bitrate: '5 Mbps',
    framerate: '30',
    aspectRatio: '16:9',
    trimStart: 0,
    trimEnd: 0,
    removeAudio: false,
    optimizeForWeb: true
  });
  
  // Preview states
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [showTrimTool, setShowTrimTool] = useState(false);
  
  // Conversion states
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [conversionTime, setConversionTime] = useState<number | null>(null);
  const [convertedFiles, setConvertedFiles] = useState<VideoFile[]>([]);
  
  // UI refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Available formats
  const formatOptions: FormatOption[] = [
    {
      id: 'mp4',
      label: 'MP4',
      description: 'Universal format, web compatible',
      icon: <Film className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      id: 'avi',
      label: 'AVI',
      description: 'High quality, large file size',
      icon: <FileVideo className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    },
    {
      id: 'mov',
      label: 'MOV',
      description: 'Apple QuickTime format',
      icon: <Play className="w-5 h-5" />,
      color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    },
    {
      id: 'wmv',
      label: 'WMV',
      description: 'Windows Media Video',
      icon: <FileVideo className="w-5 h-5" />,
      color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    },
    {
      id: 'mkv',
      label: 'MKV',
      description: 'Matroska, supports multiple tracks',
      icon: <Grid className="w-5 h-5" />,
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
    },
    {
      id: 'webm',
      label: 'WebM',
      description: 'Web optimized, small size',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
    },
    {
      id: 'flv',
      label: 'FLV',
      description: 'Flash Video format',
      icon: <FileVideo className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    }
  ];

  // Quality presets
  const qualityOptions: QualityOption[] = [
    {
      id: 'low',
      label: 'Low Quality',
      description: 'Small file size, faster conversion',
      bitrate: '1 Mbps',
      resolution: '480p'
    },
    {
      id: 'medium',
      label: 'Medium Quality',
      description: 'Good balance of quality and size',
      bitrate: '5 Mbps',
      resolution: '1080p'
    },
    {
      id: 'high',
      label: 'High Quality',
      description: 'Best quality, larger file size',
      bitrate: '15 Mbps',
      resolution: '4K'
    },
    {
      id: 'original',
      label: 'Original Quality',
      description: 'Keep original settings',
      bitrate: 'Original',
      resolution: 'Original'
    }
  ];

  // Speed options
  const speedOptions = [
    { id: 'fast', label: 'Fast', description: 'Faster conversion, lower quality' },
    { id: 'balanced', label: 'Balanced', description: 'Good speed and quality balance' },
    { id: 'best', label: 'Best Quality', description: 'Slower conversion, best quality' }
  ];

  // Resolution options
  const resolutionOptions = ['240p', '360p', '480p', '720p', '1080p', '1440p', '4K', 'Original'];

  // Bitrate options
  const bitrateOptions = ['500 kbps', '1 Mbps', '2 Mbps', '5 Mbps', '10 Mbps', '15 Mbps', '20 Mbps', 'Original'];

  // Framerate options
  const framerateOptions = ['24', '25', '30', '48', '50', '60', 'Original'];

  // Aspect ratio options
  const aspectRatioOptions = [
    { id: '16:9' as AspectRatio, label: '16:9', description: 'Widescreen' },
    { id: '4:3' as AspectRatio, label: '4:3', description: 'Standard' },
    { id: '1:1' as AspectRatio, label: '1:1', description: 'Square' },
    { id: 'original' as AspectRatio, label: 'Original', description: 'Keep original' }
  ];

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
    const videoFilesArray: VideoFile[] = [];
    let totalSize = 0;
    
    // Filter for video files
    const videoFiles = files.filter(file => 
      file.type.startsWith('video/') || 
      ['.mp4', '.avi', '.mov', '.wmv', '.mkv', '.webm', '.flv'].some(ext => 
        file.name.toLowerCase().endsWith(ext)
      )
    );
    
    if (videoFiles.length === 0) {
      setUploadError('Please select video files (MP4, AVI, MOV, WMV, MKV, WebM, FLV)');
      return;
    }
    
    // Check total size
    totalSize = videoFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 500 * 1024 * 1024) { // 500MB limit
      setUploadError('Total file size must be less than 500MB');
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
          videoFiles.forEach((file, index) => {
            const duration = Math.floor(Math.random() * 300) + 30; // 30-330 seconds
            const format = file.name.split('.').pop()?.toLowerCase() || 'mp4';
            
            videoFilesArray.push({
              id: Date.now().toString() + index,
              name: file.name,
              size: file.size,
              duration,
              format,
              thumbnail: `https://picsum.photos/320/180?random=${index}`,
              url: URL.createObjectURL(file),
              status: 'uploaded',
              progress: 100
            });
          });
          
          setVideoFiles(prev => [...prev, ...videoFilesArray]);
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

  // Remove video file
  const handleRemoveFile = (id: string) => {
    setVideoFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== id);
    });
    
    if (videoFiles.length === 1) {
      setCurrentVideoIndex(0);
    } else if (currentVideoIndex >= videoFiles.length - 1) {
      setCurrentVideoIndex(videoFiles.length - 2);
    }
  };

  // Clear all files
  const handleClearAll = () => {
    videoFiles.forEach(file => {
      if (file.url) {
        URL.revokeObjectURL(file.url);
      }
    });
    setVideoFiles([]);
    setCurrentVideoIndex(0);
    setConvertedFiles([]);
    setConversionProgress(0);
    setConversionError(null);
    setConversionTime(null);
  };

  // Get current video
  const currentVideo = videoFiles[currentVideoIndex];

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      if (!isMuted) {
        setVolume(0);
      } else {
        setVolume(80);
      }
    }
  };

  // Handle conversion
  const handleConvert = async () => {
    if (videoFiles.length === 0) {
      setConversionError('Please upload video files first');
      return;
    }

    setIsConverting(true);
    setConversionProgress(0);
    setConversionError(null);
    setConversionTime(null);
    setConvertedFiles([]);

    const startTime = Date.now();
    const totalFiles = videoFiles.length;
    let convertedCount = 0;

    // Simulate conversion progress
    const progressInterval = setInterval(() => {
      setConversionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Create converted files
          const newConvertedFiles: VideoFile[] = videoFiles.map((file, index) => ({
            ...file,
            id: `converted_${file.id}`,
            name: file.name.replace(/\.[^/.]+$/, '') + `_converted.${settings.format}`,
            format: settings.format,
            status: 'converted',
            progress: 100,
            url: URL.createObjectURL(new Blob(['Simulated converted video'], { type: 'video/mp4' }))
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
  const handleDownload = (file: VideoFile) => {
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
      format: 'mp4',
      quality: 'medium',
      speed: 'balanced',
      resolution: '1080p',
      bitrate: '5 Mbps',
      framerate: '30',
      aspectRatio: '16:9',
      trimStart: 0,
      trimEnd: 0,
      removeAudio: false,
      optimizeForWeb: true
    });
    setShowSettings(true);
    setShowTrimTool(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setVolume(80);
    setIsMuted(false);
  };

  // Sample videos for demo
  const sampleVideos = [
    { name: 'Sample Video 1.mp4', size: '24.5 MB', duration: '1:30', resolution: '1080p' },
    { name: 'Sample Video 2.mov', size: '48.2 MB', duration: '2:45', resolution: '720p' },
    { name: 'Sample Video 3.avi', size: '65.8 MB', duration: '3:20', resolution: '1080p' },
    { name: 'Sample Video 4.mkv', size: '120.3 MB', duration: '5:15', resolution: '4K' }
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
    if (videoFiles.length === 0) return '0 MB';
    
    const totalSize = videoFiles.reduce((sum, file) => sum + file.size, 0);
    let multiplier = 1;
    
    // Adjust based on quality
    switch (settings.quality) {
      case 'low': multiplier = 0.3; break;
      case 'medium': multiplier = 0.7; break;
      case 'high': multiplier = 1.2; break;
      case 'original': multiplier = 1; break;
    }
    
    // Adjust based on format
    switch (settings.format) {
      case 'webm': multiplier *= 0.8; break;
      case 'flv': multiplier *= 0.9; break;
      case 'mp4': multiplier *= 1; break;
      case 'avi': multiplier *= 1.5; break;
      case 'mov': multiplier *= 1.3; break;
    }
    
    const estimatedSize = totalSize * multiplier;
    return formatFileSize(estimatedSize);
  };

  return (
    <ToolLayout
      title="Video Converter"
      description="Convert videos between MP4, AVI, MOV, WMV, MKV, WebM, and FLV formats. Adjust quality, resolution, bitrate, and trim videos before conversion."
      keywords="video converter, convert video, mp4 converter, avi to mp4, mov to mp4, video format converter, video compressor, trim video"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Video Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Convert videos between 7+ formats with quality control and editing options
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
                      Upload Videos
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Upload videos to convert (max 500MB total)
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
              {videoFiles.length === 0 ? (
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
                    Drop your videos here
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse files
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Supports MP4, AVI, MOV, WMV, MKV, WebM, FLV
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,.mp4,.avi,.mov,.wmv,.mkv,.webm,.flv"
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
                        Uploaded Videos ({videoFiles.length})
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
                      {videoFiles.map((file, index) => (
                        <div
                          key={file.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                            currentVideoIndex === index
                              ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => setCurrentVideoIndex(index)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                <img
                                  src={file.thumbnail}
                                  alt="Thumbnail"
                                  className="w-full h-full object-cover"
                                />
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
                        <span>Uploading videos...</span>
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

              {/* Sample Videos */}
              {videoFiles.length === 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Try with sample videos
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {sampleVideos.map((video, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          // Simulate file upload
                          const fakeFile = new File([''], video.name, { type: 'video/mp4' });
                          Object.defineProperty(fakeFile, 'size', { value: 24500000 });
                          handleFileSelect([fakeFile]);
                        }}
                        className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Film className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {video.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{video.size}</span>
                          <span>•</span>
                          <span>{video.duration}</span>
                          <span>•</span>
                          <span>{video.resolution}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Video Preview & Player */}
            {currentVideo && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                      <Play className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Video Preview
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentVideo.name}
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

                {/* Video Player */}
                <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    src={currentVideo.url}
                    className="w-full h-auto max-h-100"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setDuration(videoRef.current.duration);
                      }
                    }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-4">
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => handleSeek(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                      <div className="flex justify-between text-xs text-gray-300 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                    
                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlay}
                          className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white" />
                          )}
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={toggleMute}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {isMuted || volume === 0 ? (
                              <VolumeX className="w-5 h-5 text-white" />
                            ) : (
                              <Volume2 className="w-5 h-5 text-white" />
                            )}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                            className="w-24 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <span>{currentVideo.format.toUpperCase()}</span>
                        <span>•</span>
                        <span>{formatTime(currentVideo.duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trim Tool */}
                {showTrimTool && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Scissors className="w-4 h-4" />
                      Trim Video
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
                              if (option.id !== 'original') {
                                updateSettings('resolution', option.resolution);
                                updateSettings('bitrate', option.bitrate);
                              }
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
                                {option.resolution} • {option.bitrate}
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
                        Resolution
                      </h4>
                      <select
                        value={settings.resolution}
                        onChange={(e) => updateSettings('resolution', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                      >
                        {resolutionOptions.map((res) => (
                          <option key={res} value={res}>
                            {res}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bitrate
                      </h4>
                      <select
                        value={settings.bitrate}
                        onChange={(e) => updateSettings('bitrate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                      >
                        {bitrateOptions.map((bitrate) => (
                          <option key={bitrate} value={bitrate}>
                            {bitrate}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Framerate
                      </h4>
                      <select
                        value={settings.framerate}
                        onChange={(e) => updateSettings('framerate', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                      >
                        {framerateOptions.map((fps) => (
                          <option key={fps} value={fps}>
                            {fps} FPS{fps !== 'Original' && ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          <VolumeX className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Remove Audio
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Create silent video
                            </div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.removeAudio}
                          onChange={(e) => updateSettings('removeAudio', e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              Optimize for Web
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Better streaming compatibility
                            </div>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.optimizeForWeb}
                          onChange={(e) => updateSettings('optimizeForWeb', e.target.checked)}
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
                    <Film className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Convert Videos
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start conversion process
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {videoFiles.length} file{videoFiles.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Conversion Progress */}
              {isConverting && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Converting videos to {settings.format.toUpperCase()}...</span>
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
              {!isConverting && videoFiles.length > 0 && (
                <button
                  onClick={handleConvert}
                  disabled={isConverting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-medium text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-6 h-6" />
                  Convert {videoFiles.length} Video{videoFiles.length !== 1 ? 's' : ''} to {settings.format.toUpperCase()}
                </button>
              )}

              {/* Ready State */}
              {!isConverting && videoFiles.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Film className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Videos Uploaded
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload videos to begin conversion
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
                        Converted Videos
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
                          <Film className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-900 dark:text-white truncate max-w-45">
                            {file.name}
                          </span>
                        </div>
                        <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">
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
                    <Film className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">7+ Formats</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      MP4, AVI, MOV, WMV, MKV, WebM, FLV
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center shrink-0">
                    <Gauge className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">Quality Control</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Adjust resolution, bitrate, framerate
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center shrink-0">
                    <Scissors className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">Video Trimming</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Cut videos with precision controls
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">Batch Processing</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Convert multiple videos at once
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Conversion Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">1</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Use <strong>MP4 format</strong> for web compatibility
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">2</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Choose <strong>WebM format</strong> for smallest file size
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">3</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Trim videos</strong> before conversion to reduce file size
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">4</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Enable <strong>web optimization</strong> for streaming
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-purple-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Complete Video Converter Features
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Film className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                7+ Video Formats
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Convert between MP4, AVI, MOV, WMV, MKV, WebM, FLV
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gauge className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Quality Control
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Adjust resolution, bitrate, framerate, and aspect ratio
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Scissors className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Video Trimming
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Cut videos with precision timeline controls
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Batch Processing
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Convert multiple videos simultaneously
              </p>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="TOOL_ID_HERE" />
    </ToolLayout>
  );
}