"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import {
  Code2,
  Copy,
  Download,
  Search,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Check,
  FileCode,
  Layout,
  Database,
  Lock,
  Users,
  ShoppingCart,
  MessageSquare,
  Calendar,
  Bell,
  Settings,
  Globe,
  Smartphone,
  Server,
  Terminal,
  Zap,
  Star,
  Filter,
  BookOpen,
  FolderOpen,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Type,
  Hash,
  Tag,
  Bold,
  Italic,
  List,
  Table,
  Image,
  Link,
  Mail,
  Phone,
  MapPin,
  User,
  Key,
  CreditCard,
  DollarSign,
  Percent,
  Clock,
  CalendarDays,
  FileText,
  BarChart,
  PieChart,
  LineChart,
  Activity,
  Cpu,
  HardDrive,
  Network,
  Shield,
  Cloud,
  Wifi,
  Bluetooth,
  Radio,
  Camera,
  Video,
  Music,
  Headphones,
  Mic,
  Volume2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Shuffle,
  Repeat,
  Heart,
  ThumbsUp,
  Share2,
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  AlertCircle,
  Info,
  HelpCircle,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Ban,
  Trash2,
  Edit,
  MoreVertical,
  MoreHorizontal,
  Grid,
  List as ListIcon,
  Sidebar,
  LayoutGrid,
  Columns,
  Rows,
  Maximize,
  Minimize,
  Expand,
  Shrink,
  Move,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crop,
  Scissors,
  Palette,
  Droplets,
  Sun,
  Moon,
  Contrast,
  Monitor,
  Smartphone as PhoneIcon,
  Tablet,
  Laptop,
  Tv,
  Watch,
  Printer,
  Keyboard,
  Mouse,
  Gamepad,
  Headset,
  Speaker,
  Battery,
  BatteryCharging,
  Power,
  Bluetooth as BluetoothIcon,
  Wifi as WifiIcon,
  Signal,
  Satellite,
  Navigation,
  Map,
  Compass,
  Flag,
  Home,
  Building,
  Store,
  Hotel,
  School,
  Hospital,
  Factory,
  Church,
  Castle,
  Tent,
  Car,
  Bike,
  Bus,
  Train,
  Plane,
  Rocket,
  Ship,
  Anchor,
  LifeBuoy,
  Umbrella,
  Briefcase,
  ShoppingBag,
  Gift,
  Award,
  Trophy,
  Crown,
  Star as StarIcon,
  Heart as HeartIcon,
  Diamond,
  Gem,
  Banknote,
  Wallet,
  CreditCard as CreditCardIcon,
  Receipt,
  Package,
  Box,
  Layers,
  Folder,
  FolderPlus,
  FolderMinus,
  FolderOpen as FolderOpenIcon,
  File,
  FilePlus,
  FileMinus,
  FileText as FileTextIcon,
  FileCode as FileCodeIcon,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FolderTree,
  Archive,
  Inbox,
  Trash,
  Upload,
  Download as DownloadIcon,
  Share,
  ExternalLink,
  Link2,
  Unlink,
  Lock as LockIcon,
  Unlock,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Shield as ShieldIcon,
  Key as KeyIcon,
  Bell as BellIcon,
  BellOff,
  Megaphone,
  Speaker as SpeakerIcon,
  VolumeX,
  Volume1,
  Volume2 as Volume2Icon,
  MicOff,
  VideoOff,
  Airplay,
  Cast,
  MonitorSpeaker,
  Projector,
  Tv as TvIcon,
  Radio as RadioIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Watch as WatchIcon,
  Camera as CameraIcon,
  CameraOff,
  Video as VideoIcon,
  Film,
  Image as ImageIcon,
  Music as MusicIcon,
  Headphones as HeadphonesIcon,
  Mic as MicIcon,
  Gamepad2,
  MousePointer,
  MousePointerClick,
  Touchpad,
  Keyboard as KeyboardIcon,
  Command,
  Cpu as CpuIcon,
  HardDrive as HardDriveIcon,
  MemoryStick,
  Server as ServerIcon,
  Database as DatabaseIcon,
  Network as NetworkIcon,
  Router,
  Cloud as CloudIcon,
  CloudOff,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudSun,
  CloudMoon,
  Wind,
  Thermometer,
  Droplet,
  Umbrella as UmbrellaIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Star as StarIcon2,
  Globe as GlobeIcon,
  Map as MapIcon,
  Navigation2,
  Compass as CompassIcon,
  Flag as FlagIcon,
  Home as HomeIcon,
  Building as BuildingIcon,
  Store as StoreIcon,
  Hotel as HotelIcon,
  School as SchoolIcon,
  Hospital as HospitalIcon,
  Factory as FactoryIcon,
  Church as ChurchIcon,
  Castle as CastleIcon,
  Tent as TentIcon,
  Car as CarIcon,
  Bike as BikeIcon,
  Bus as BusIcon,
  Train as TrainIcon,
  Plane as PlaneIcon,
  Rocket as RocketIcon,
  Ship as ShipIcon,
  Anchor as AnchorIcon,
  LifeBuoy as LifeBuoyIcon,
  Package as PackageIcon,
  Gift as GiftIcon,
  ShoppingBag as ShoppingBagIcon,
  ShoppingCart as ShoppingCartIcon,
  CreditCard as CreditCardIcon2,
  DollarSign as DollarSignIcon,
  Euro,
  PoundSterling,
  IndianRupee,
  Bitcoin,
  TrendingUp,
  TrendingDown,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity as ActivityIcon,
  Target,
  Award as AwardIcon,
  Trophy as TrophyIcon,
  Medal,
  Crown as CrownIcon,
  Star as StarIcon3,
  Heart as HeartIcon2,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown,
  Smile as SmileIcon,
  Frown as FrownIcon,
  Meh as MehIcon,
  Laugh as LaughIcon,
  Angry as AngryIcon,
  User as UserIcon,
  Users as UsersIcon,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Circle,
  Square,
  Triangle,
  Pentagon,
  Hexagon,
  Octagon,
  Cross,
  X,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Divide,
  Equal,
  Percent as PercentIcon,
  Infinity,
  Pi,
  Sigma,
  Omega,
  Copyright,
  AtSign,
  Hash as HashIcon,
  DollarSign as DollarSignIcon2,
  Euro as EuroIcon,
  PoundSterling as PoundSterlingIcon,
  IndianRupee as IndianRupeeIcon,
  Bitcoin as BitcoinIcon,
  Phone as PhoneIcon2,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  PhoneOff,
  Voicemail,
  Mail as MailIcon,
  MailOpen,
  Inbox as InboxIcon,
  Send as SendIcon,
  Paperclip as PaperclipIcon,
  Link as LinkIcon,
  Unlink as UnlinkIcon,
  MessageCircle as MessageCircleIcon,
  MessageSquare as MessageSquareIcon,
  MessageSquareDashed,
  MessageSquareText,
  MessagesSquare,
  PhoneCall as PhoneCallIcon,
  Video as VideoIcon2,
  Videotape,
  Webcam,
  RadioTower,
  SatelliteDish,
  Router as RouterIcon,
  Wifi as WifiIcon2,
  Bluetooth as BluetoothIcon2,
  Nfc,
  Usb,
  Cpu as CpuIcon2,
  HardDrive as HardDriveIcon2,
  MemoryStick as MemoryStickIcon,
  Server as ServerIcon2,
  Database as DatabaseIcon2,
  Cloud as CloudIcon2,
  CloudUpload,
  CloudDownload,
  CloudSync,
  Shield as ShieldIcon2,
  ShieldAlert,
  ShieldCheck,
  ShieldClose,
  ShieldOff,
  Lock as LockIcon2,
  Unlock as UnlockIcon2,
  Key as KeyIcon2,
  KeySquare,
  Fingerprint,
  Eye as EyeIcon2,
  EyeOff as EyeOffIcon2,
  Scan,
  ScanFace,
  QrCode,
  Barcode,
  Bell as BellIcon2,
  BellRing,
  Megaphone as MegaphoneIcon,
  Speaker as SpeakerIcon2,
  Volume as VolumeIcon,
  Mic as MicIcon2,
  Headphones as HeadphonesIcon2,
  Tv as TvIcon2,
  Radio as RadioIcon2,
  Camera as CameraIcon2,
  Video as VideoIcon3,
  Film as FilmIcon,
  Image as ImageIcon2,
  Music as MusicIcon2,
  Gamepad as GamepadIcon,
  Mouse as MouseIcon,
  Keyboard as KeyboardIcon2,
  Cpu as CpuIcon3,
  HardDrive as HardDriveIcon3,
  Database as DatabaseIcon3,
  Server as ServerIcon3,
  Router as RouterIcon2,
  Cloud as CloudIcon3,
  Shield as ShieldIcon3,
  Lock as LockIcon3,
  Key as KeyIcon3,
  Eye as EyeIcon3,
  EyeOff as EyeOffIcon3,
  Bell as BellIcon3,
  Volume2 as Volume2Icon2,
  Mic as MicIcon3,
  Headphones as HeadphonesIcon3,
  Tv as TvIcon3,
  Camera as CameraIcon3,
  Video as VideoIcon4,
  Film as FilmIcon2,
  Image as ImageIcon3,
  Music as MusicIcon3,
  Gamepad as GamepadIcon2,
  Mouse as MouseIcon2,
  Keyboard as KeyboardIcon3,
  Sparkles,
  Brain,
  MessageSquarePlus,
  FileQuestion,
  TestTube,
  Languages,
  Lightbulb,
  Target as TargetIcon,
  CheckSquare,
  XSquare,
  AlertOctagon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CornerDownLeft,
  CornerDownRight,
  CornerLeftDown,
  CornerLeftUp,
  CornerRightDown,
  CornerRightUp,
  CornerUpLeft,
  CornerUpRight,
  MoveHorizontal,
  MoveVertical,
  MoveDiagonal,
  MoveDiagonal2,
  Maximize2,
  Minimize2 as Minimize2Icon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  Expand as ExpandIcon,
  Shrink as ShrinkIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Crop as CropIcon,
  Scissors as ScissorsIcon,
  Palette as PaletteIcon,
  Droplets as DropletsIcon,
  Sun as SunIcon2,
  Moon as MoonIcon2,
  Contrast as ContrastIcon,
  Monitor as MonitorIcon,
} from "lucide-react";

// Import data and types
import { 
  codeTemplates, 
  programmingLanguages, 
  codeCategories,
  type CodeTemplate,
  type TemplateVariable 
} from "./data/codeTemplates";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import AIAssistant from "@/components/AIAssistant";
import AIChat from "@/components/AIChat";
import { useState as useStateHook } from "react";

// Helper function to replace variables in code
const replaceVariables = (code: string, variables: Record<string, any>): string => {
  let result = code;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value));
  });
  return result;
};

// Main component
export default function CodeGenerator() {
  // State management
  const [selectedLanguage, setSelectedLanguage] = useState<string>("javascript");
  const [selectedCategory, setSelectedCategory] = useState<string>("web");
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate>(codeTemplates[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [variableValues, setVariableValues] = useState<Record<string, any>>({});
  const { copied, copyToClipboard } = useCopyToClipboard();
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [fontSize, setFontSize] = useState<number>(14);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [wrapLines, setWrapLines] = useState<boolean>(false);
  const [recentTemplates, setRecentTemplates] = useState<string[]>(["js-fetch-api", "ts-react-component"]);
  const [favorites, setFavorites] = useState<string[]>(["js-fetch-api"]);
  const [activeAITab, setActiveAITab] = useState<'generator' | 'chat' | 'review'>('generator');
  const [aiModeEnabled, setAiModeEnabled] = useState<boolean>(true);

  // Initialize variable values
  useEffect(() => {
    if (selectedTemplate) {
      const initialValues: Record<string, any> = {};
      selectedTemplate.variables.forEach(variable => {
        initialValues[variable.id] = variable.defaultValue;
      });
      setVariableValues(initialValues);
    }
  }, [selectedTemplate]);

  // Filter templates based on selections
  const filteredTemplates = codeTemplates.filter(template => {
    const matchesLanguage = selectedLanguage === "all" || template.language === selectedLanguage;
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesLanguage && matchesCategory && matchesSearch;
  });

  // Generate final code
  const generatedCode = selectedTemplate 
    ? replaceVariables(selectedTemplate.code, variableValues)
    : "";

  // File download
  const handleDownload = () => {
    const language = selectedTemplate.language;
    const extensionMap: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      csharp: "cs",
      cpp: "cpp",
      php: "php",
      go: "go",
      ruby: "rb",
      rust: "rs",
      swift: "swift",
      kotlin: "kt",
      dart: "dart",
      sql: "sql",
      html: "html",
      css: "css",
      bash: "sh",
    };
    
    const extension = extensionMap[language] || "txt";
    const filename = `${selectedTemplate.name.replace(/\s+/g, '_').toLowerCase()}.${extension}`;
    
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add to favorites
  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  // Update variable value
  const handleVariableChange = (variableId: string, value: any) => {
    setVariableValues(prev => ({
      ...prev,
      [variableId]: value
    }));
  };

  // Reset variables
  const handleResetVariables = () => {
    const resetValues: Record<string, any> = {};
    selectedTemplate.variables.forEach(variable => {
      resetValues[variable.id] = variable.defaultValue;
    });
    setVariableValues(resetValues);
  };

  // Get language icon
  const getLanguageIcon = (langId: string) => {
    const lang = programmingLanguages.find(l => l.id === langId);
    return lang?.icon || "💻";
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // AI Enhanced generation
  const handleAIGenerate = async () => {
    try {
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: generatedCode,
          language: selectedLanguage,
          template: selectedTemplate.name,
          variables: variableValues
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle AI enhanced code
        console.log('AI Enhanced:', data);
      }
    } catch (error) {
      console.error('AI Generation error:', error);
    }
  };

  return (
    <ToolLayout
      title="AI Code Generator"
      description="Generate code snippets with AI assistance. Customize templates, get AI suggestions, and download production-ready code across multiple programming languages."
      keywords="AI code generator, code snippets, programming templates, AI coding assistant, javascript, python, java, react, AI programming, code completion"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with AI Badge */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl mb-4 relative">
            <Code2 className="w-10 h-10 text-white" />
            <div className="absolute -top-2 -right-2">
              <div className="bg-linear-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI-Powered
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            AI Code Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Generate production-ready code with AI assistance across 15+ languages
          </p>
          
          {/* AI Mode Toggle */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiModeEnabled
                  ? "bg-linear-to-r from-purple-600 to-blue-600"
                  : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                <button
                  onClick={() => setAiModeEnabled(!aiModeEnabled)}
                  className="absolute inset-0"
                />
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiModeEnabled
                    ? "translate-x-6"
                    : "translate-x-1"
                  }`} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI Assistant {aiModeEnabled ? "ON" : "OFF"}
              </span>
            </div>
            
            {aiModeEnabled && (
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveAITab('generator')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeAITab === 'generator'
                      ? "bg-linear-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  AI Generator
                </button>
                <button
                  onClick={() => setActiveAITab('chat')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${activeAITab === 'chat'
                      ? "bg-linear-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                >
                  AI Chat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {aiModeEnabled && activeAITab === 'chat' ? (
          // AI Chat Interface
          <div className="bg-linear-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden">
            <AIChat />
          </div>
        ) : aiModeEnabled ? (
          // AI Generator Interface
          <div className="space-y-6">
            <AIAssistant initialCode={generatedCode} language={selectedLanguage} />
            
            {/* Traditional Template Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <FileCode className="w-6 h-6 text-blue-500" />
                  Template Library
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  AI + {filteredTemplates.length} templates
                </div>
              </div>
              
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Language Filter */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Languages
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedLanguage("all")}
                        className={`w-full text-left px-3 py-2 rounded-lg ${selectedLanguage === "all"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                      >
                        All Languages
                      </button>
                      {programmingLanguages.slice(0, 5).map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${selectedLanguage === lang.id
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                          <span>{lang.icon}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Category Filter */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {codeCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${selectedCategory === category.id
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Templates Grid */}
                <div className="lg:col-span-3">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.slice(0, 6).map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedTemplate.id === template.id
                            ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{template.icon}</span>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {template.name}
                            </h4>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(template.id);
                            }}
                            className="text-gray-400 hover:text-yellow-500"
                          >
                            {favorites.includes(template.id) ? (
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <Star className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded text-xs ${programmingLanguages.find(l => l.id === template.language)?.color}`}>
                            {template.language.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(template.difficulty)}`}>
                            {template.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Traditional Interface (AI Disabled)
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Templates & Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search code templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Language Filter */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Programming Languages
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedLanguage("all")}
                    className={`p-2 rounded-lg border ${
                      selectedLanguage === "all"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      All
                    </div>
                  </button>
                  {programmingLanguages.slice(0, 6).map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`p-2 rounded-lg border flex flex-col items-center ${
                        selectedLanguage === lang.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <span className="text-lg mb-1">{lang.icon}</span>
                      <div className="text-xs font-medium text-gray-900 dark:text-white truncate w-full text-center">
                        {lang.name}
                      </div>
                    </button>
                  ))}
                </div>
                {programmingLanguages.length > 6 && (
                  <div className="mt-3">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                    >
                      <option value="all">All Languages</option>
                      {programmingLanguages.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.icon} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {codeCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full px-3 py-2 rounded-lg flex items-center justify-between ${
                        selectedCategory === category.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {codeTemplates.filter(t => t.category === category.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates List */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Code Templates
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredTemplates.length} templates found
                  </p>
                </div>
                
                <div className="max-h-100 overflow-y-auto p-2">
                  {filteredTemplates.length === 0 ? (
                    <div className="text-center py-8">
                      <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">
                        No templates found. Try a different search.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className={`w-full p-3 rounded-lg text-left transition-all cursor-pointer ${
                            selectedTemplate.id === template.id
                              ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{template.icon}</span>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {template.name}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(template.difficulty)}`}>
                                {template.difficulty}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(template.id);
                              }}
                              className="text-gray-400 hover:text-yellow-500 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {favorites.includes(template.id) ? (
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <Star className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {template.description}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${programmingLanguages.find(l => l.id === template.language)?.color}`}>
                              {getLanguageIcon(template.language)} {template.language.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {template.variables.length} params
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Code Preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Selected Template Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{selectedTemplate.icon}</span>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedTemplate.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                          {selectedTemplate.difficulty}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${programmingLanguages.find(l => l.id === selectedTemplate.language)?.color}`}>
                          {selectedTemplate.language.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedTemplate.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(selectedTemplate.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title={favorites.includes(selectedTemplate.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites.includes(selectedTemplate.id) ? (
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      title={showPreview ? "Hide preview" : "Show preview"}
                    >
                      {showPreview ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedTemplate.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Dependencies */}
                {selectedTemplate.dependencies && selectedTemplate.dependencies.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dependencies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.dependencies.map((dep) => (
                        <span
                          key={dep}
                          className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Variables Editor */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Customize Parameters
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Adjust variables to generate your custom code
                    </p>
                  </div>
                  <button
                    onClick={handleResetVariables}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset All
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {selectedTemplate.variables.map((variable) => (
                    <div key={variable.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        {variable.label}
                        {variable.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      
                      {variable.type === "text" && (
                        <input
                          type="text"
                          value={variableValues[variable.id] || ""}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                          placeholder={variable.description}
                        />
                      )}
                      
                      {variable.type === "number" && (
                        <input
                          type="number"
                          value={variableValues[variable.id] || ""}
                          onChange={(e) => handleVariableChange(variable.id, parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                          placeholder={variable.description}
                        />
                      )}
                      
                      {variable.type === "boolean" && (
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(variableValues[variable.id])}
                            onChange={(e) => handleVariableChange(variable.id, e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            {variable.description}
                          </span>
                        </label>
                      )}
                      
                      {variable.type === "select" && variable.options && (
                        <select
                          value={variableValues[variable.id] || ""}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                        >
                          {variable.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {variable.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Preview */}
              {showPreview && (
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {selectedTemplate.name}.{selectedTemplate.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {generatedCode.split('\n').length} lines
                        </span>
                        <span className="text-xs text-gray-500">
                          {generatedCode.length} characters
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Theme selector */}
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>
                      
                      {/* Font size */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setFontSize(f => Math.max(10, f - 1))}
                          className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
                        >
                          A-
                        </button>
                        <span className="text-sm text-gray-300">{fontSize}px</span>
                        <button
                          onClick={() => setFontSize(f => Math.min(24, f + 1))}
                          className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
                        >
                          A+
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Code Display */}
                  <div className="p-4 max-h-125 overflow-auto">
                    <SyntaxHighlighter
                      language={selectedTemplate.language}
                      style={vscDarkPlus}
                      showLineNumbers={showLineNumbers}
                      wrapLines={wrapLines}
                      customStyle={{
                        fontSize: `${fontSize}px`,
                        backgroundColor: 'transparent',
                        margin: 0,
                      }}
                    >
                      {generatedCode}
                    </SyntaxHighlighter>
                  </div>
                  
                  {/* Preview Controls */}
                  <div className="px-4 py-3 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={showLineNumbers}
                          onChange={(e) => setShowLineNumbers(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        Line Numbers
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={wrapLines}
                          onChange={(e) => setWrapLines(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        Wrap Lines
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => copyToClipboard(generatedCode)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Code
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>

                      {/* AI Enhance Button */}
                      <button
                        onClick={handleAIGenerate}
                        className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg flex items-center gap-2"
                        title="AI Enhance"
                      >
                        <Sparkles className="w-4 h-4" />
                        AI Enhance
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => copyToClipboard(generatedCode)}
                  className="col-span-2 py-4 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium flex items-center justify-center gap-3"
                >
                  <Copy className="w-5 h-5" />
                  {copied ? "Code Copied!" : "Copy Generated Code"}
                </button>              
                <button
                  onClick={handleDownload}
                  className="py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  Download File
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-purple-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Complete AI Code Generator Features
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                AI-Powered Generation
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                GPT-4 powered code generation, explanation, and optimization
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                15+ Languages
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                JavaScript, Python, Java, C++, PHP, Go, Ruby, Rust, SQL and more
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileCode className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                50+ Templates
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                API endpoints, database queries, UI components, algorithms, utilities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Export Ready
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Copy to clipboard or download as file with proper extension
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick Tips */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              AI Quick Start
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>1. Enable AI Assistant toggle</li>
              <li>2. Describe what you want in natural language</li>
              <li>3. Let AI generate optimized code</li>
              <li>4. Customize or ask for improvements</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-500" />
              Popular AI Commands
            </h4>
            <div className="space-y-2">
              {["Generate a React form", "Optimize this SQL query", "Explain this function", "Debug this Python code"].map((command) => (
                <button
                  key={command}
                  onClick={() => {
                    setAiModeEnabled(true);
                    setActiveAITab('chat');
                    // In a real app, you'd set the chat input
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  {command}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              Best Practices
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Use AI for complex logic generation</li>
              <li>• Combine templates with AI enhancements</li>
              <li>• Review AI-generated code before production</li>
              <li>• Use chat for learning and explanations</li>
            </ul>
          </div>
        </div>

        {/* Cost Estimation Banner */}
        {aiModeEnabled && (
          <div className="mt-8 p-6 bg-linear-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white">AI Usage Cost</h4>
                  <p className="text-sm text-blue-300">
                    Estimated: $0.01 - $0.05 per generation • Powered by OpenAI GPT-4
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAiModeEnabled(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
              >
                Disable AI
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}