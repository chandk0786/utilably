"use client";
import RelatedTools from "@/components/RelatedTools";
import { useState, useRef, useEffect } from "react";
import { 
  Mail, 
  User, 
  Briefcase, 
  Phone, 
  Globe, 
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Camera,
  Palette,
  Layout,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Share2,
  Image as ImageIcon,
  X,
  Sparkles,
  Zap,
  Crown
} from "lucide-react";
import ToolLayout from "@/components/ToolLayout";

type TemplateType = 'modern' | 'classic' | 'minimal' | 'creative';
type ColorScheme = 'blue' | 'green' | 'purple' | 'red' | 'dark';
type SocialPlatform = 'linkedin' | 'twitter' | 'github' | 'instagram' | 'website';

interface SocialLink {
  platform: SocialPlatform;
  url: string;
  enabled: boolean;
}

interface SignatureData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo: string;
  socialLinks: SocialLink[];
  template: TemplateType;
  colorScheme: ColorScheme;
  fontSize: number;
  showBorder: boolean;
  includeDisclaimer: boolean;
}

export default function EmailSignatureGenerator() {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    name: "John Doe",
    title: "Senior Developer",
    company: "TechCorp Inc.",
    email: "john.doe@techcorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA 94107",
    website: "www.techcorp.com",
    logo: "",
    socialLinks: [
      { platform: 'linkedin', url: 'linkedin.com/in/johndoe', enabled: true },
      { platform: 'twitter', url: 'twitter.com/johndoe', enabled: true },
      { platform: 'github', url: 'github.com/johndoe', enabled: false },
      { platform: 'instagram', url: 'instagram.com/johndoe', enabled: false },
      { platform: 'website', url: 'techcorp.com', enabled: true },
    ],
    template: 'modern',
    colorScheme: 'blue',
    fontSize: 14,
    showBorder: true,
    includeDisclaimer: true,
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [selectedTemplateBadge, setSelectedTemplateBadge] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Templates with enhanced info
  const templates = [
    { 
      id: 'modern' as TemplateType, 
      name: 'Modern', 
      icon: Layout, 
      description: 'Clean with social icons',
      badge: 'Popular',
      color: 'blue'
    },
    { 
      id: 'classic' as TemplateType, 
      name: 'Classic', 
      icon: Briefcase, 
      description: 'Professional business',
      badge: 'Formal',
      color: 'gray'
    },
    { 
      id: 'minimal' as TemplateType, 
      name: 'Minimal', 
      icon: Mail, 
      description: 'Simple & elegant',
      badge: 'Lightweight',
      color: 'slate'
    },
    { 
      id: 'creative' as TemplateType, 
      name: 'Creative', 
      icon: Palette, 
      description: 'Colorful design',
      badge: 'Modern',
      color: 'purple'
    },
  ];

  // Color schemes
  const colorSchemes = [
    { id: 'blue' as ColorScheme, name: 'Blue', color: 'from-blue-500 to-cyan-500', hex: '#3B82F6' },
    { id: 'green' as ColorScheme, name: 'Green', color: 'from-emerald-500 to-green-500', hex: '#10B981' },
    { id: 'purple' as ColorScheme, name: 'Purple', color: 'from-purple-500 to-pink-500', hex: '#8B5CF6' },
    { id: 'red' as ColorScheme, name: 'Red', color: 'from-red-500 to-orange-500', hex: '#EF4444' },
    { id: 'dark' as ColorScheme, name: 'Dark', color: 'from-gray-800 to-gray-900', hex: '#1F2937' },
  ];

  // Social platform icons
  const socialIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    instagram: Instagram,
    website: Globe,
  };

  // Handle input changes
  const handleInputChange = (field: keyof SignatureData, value: any) => {
    setSignatureData(prev => ({ ...prev, [field]: value }));
    if (field === 'template') {
      const template = templates.find(t => t.id === value);
      setSelectedTemplateBadge(template?.badge || "");
    }
  };

  // Handle social link toggle
  const toggleSocialLink = (platform: SocialPlatform) => {
    setSignatureData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.platform === platform ? { ...link, enabled: !link.enabled } : link
      )
    }));
  };

  // Handle social link URL change
  const updateSocialLink = (platform: SocialPlatform, url: string) => {
    setSignatureData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.platform === platform ? { ...link, url } : link
      )
    }));
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange('logo', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function for social icons SVG
  const getSocialIconSVG = (platform: SocialPlatform): string => {
    const icons = {
      linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
      twitter: '<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>',
      github: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.807 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
      instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
      website: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>'
    };
    return icons[platform] || '';
  };

  // Generate HTML signature with template variations
  const generateSignatureHTML = (): string => {
    const colorMap = {
      blue: '#3B82F6',
      green: '#10B981',
      purple: '#8B5CF6',
      red: '#EF4444',
      dark: '#1F2937',
    };

    const mainColor = colorMap[signatureData.colorScheme];
    
    // Template-specific styles
    const templateStyles = {
      modern: {
        container: `border-left: ${signatureData.showBorder ? `4px solid ${mainColor}` : 'none'}; padding-left: ${signatureData.showBorder ? '15px' : '0'};`,
        nameStyle: `font-size: ${signatureData.fontSize + 6}px; color: ${mainColor}; font-weight: 600;`,
        titleStyle: `font-size: ${signatureData.fontSize + 2}px; font-weight: bold; color: #444;`,
        companyStyle: `font-size: ${signatureData.fontSize}px; color: #666; font-style: italic;`,
        contactStyle: `color: #555; line-height: 1.6;`
      },
      classic: {
        container: `border-top: ${signatureData.showBorder ? `2px solid ${mainColor}` : 'none'}; padding-top: ${signatureData.showBorder ? '15px' : '0'};`,
        nameStyle: `font-size: ${signatureData.fontSize + 4}px; color: ${mainColor}; font-family: Georgia, serif; font-weight: bold;`,
        titleStyle: `font-size: ${signatureData.fontSize}px; font-style: italic; color: #444;`,
        companyStyle: `font-size: ${signatureData.fontSize}px; font-weight: bold; color: #333;`,
        contactStyle: `color: #555; line-height: 1.8; font-family: Georgia, serif;`
      },
      minimal: {
        container: `border-bottom: ${signatureData.showBorder ? `1px solid ${mainColor}` : 'none'}; padding-bottom: ${signatureData.showBorder ? '10px' : '0'};`,
        nameStyle: `font-size: ${signatureData.fontSize + 4}px; color: #222; font-weight: 300; letter-spacing: 1px;`,
        titleStyle: `font-size: ${signatureData.fontSize}px; color: #666; font-weight: normal;`,
        companyStyle: `font-size: ${signatureData.fontSize}px; color: #999; font-weight: 300;`,
        contactStyle: `color: #777; line-height: 1.8; font-weight: 300;`
      },
      creative: {
        container: `background: linear-gradient(135deg, ${mainColor}15, transparent 15%); padding: 20px; border-radius: 12px; border: ${signatureData.showBorder ? `1px solid ${mainColor}40` : 'none'}; box-shadow: 0 4px 12px ${mainColor}20;`,
        nameStyle: `font-size: ${signatureData.fontSize + 8}px; color: ${mainColor}; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;`,
        titleStyle: `font-size: ${signatureData.fontSize + 2}px; color: #555; font-weight: 600;`,
        companyStyle: `font-size: ${signatureData.fontSize}px; color: #777; font-weight: 500;`,
        contactStyle: `color: #666; line-height: 1.6; font-weight: 500;`
      }
    };

    const style = templateStyles[signatureData.template];
    
    // Generate social links HTML with icons for modern/creative templates
    const socialLinksHTML = signatureData.socialLinks
      .filter(link => link.enabled)
      .map(link => {
        if (signatureData.template === 'modern' || signatureData.template === 'creative') {
          const iconColors = {
            linkedin: '#0077B5',
            twitter: '#1DA1F2',
            github: '#333',
            instagram: '#E4405F',
            website: mainColor
          };
          return `<a href="https://${link.url}" target="_blank" style="display: inline-block; margin-right: 12px; text-decoration: none;" title="${link.platform}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${iconColors[link.platform]}" style="vertical-align: middle; transition: transform 0.2s;">
                      ${getSocialIconSVG(link.platform)}
                    </svg>
                  </a>`;
        } else if (signatureData.template === 'classic') {
          return `<a href="https://${link.url}" target="_blank" style="color: ${mainColor}; text-decoration: none; margin-right: 10px; border-bottom: 1px solid ${mainColor}40; padding-bottom: 2px;">
                    ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                  </a>`;
        } else {
          return `<a href="https://${link.url}" target="_blank" style="color: ${mainColor}; text-decoration: none; margin-right: 8px; font-size: ${signatureData.fontSize - 1}px;">
                    ${link.platform}
                  </a>`;
        }
      })
      .join(signatureData.template === 'classic' ? ' | ' : '');

    // Different layout structures based on template
    if (signatureData.template === 'minimal') {
      return `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: ${signatureData.fontSize}px; color: #333; ${style.container}">
          <div style="margin-bottom: 15px;">
            <div style="${style.nameStyle} margin-bottom: 5px; line-height: 1.2;">${signatureData.name}</div>
            <div style="${style.titleStyle} margin-bottom: 3px;">${signatureData.title}</div>
            <div style="${style.companyStyle}">${signatureData.company}</div>
          </div>
          <div style="${style.contactStyle}">
            <div>✉️ ${signatureData.email}</div>
            <div>📞 ${signatureData.phone}</div>
            ${signatureData.website ? `<div>🌐 ${signatureData.website}</div>` : ''}
          </div>
          ${socialLinksHTML ? `
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;">
              ${socialLinksHTML}
            </div>
          ` : ''}
        </div>
      `;
    }

    // Default structure for other templates
    const logoStyle = signatureData.template === 'creative' 
      ? `width: 70px; height: 70px; border-radius: 50%; margin-right: 20px; border: 3px solid ${mainColor}; object-fit: cover;`
      : `width: 60px; height: 60px; border-radius: 8px; margin-right: 15px; object-fit: contain; background: white; padding: 5px;`;

    return `
      <div style="font-family: ${signatureData.template === 'classic' ? 'Georgia, Times New Roman, serif' : 'Arial, Helvetica, sans-serif'}; font-size: ${signatureData.fontSize}px; color: #333; ${style.container}">
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          ${signatureData.logo ? `<img src="${signatureData.logo}" alt="${signatureData.company} Logo" style="${logoStyle}">` : ''}
          <div>
            <div style="${style.nameStyle} margin: 0; line-height: 1.2;">${signatureData.name}</div>
            <div style="${style.titleStyle}; margin: 8px 0;">${signatureData.title}</div>
            <div style="${style.companyStyle}; margin: 5px 0;">${signatureData.company}</div>
          </div>
        </div>
        
        <div style="${style.contactStyle} margin-bottom: 20px;">
          <div style="margin: 5px 0;"><strong>📧 Email:</strong> <a href="mailto:${signatureData.email}" style="color: ${mainColor}; text-decoration: none;">${signatureData.email}</a></div>
          <div style="margin: 5px 0;"><strong>📱 Phone:</strong> ${signatureData.phone}</div>
          ${signatureData.website ? `<div style="margin: 5px 0;"><strong>🌐 Website:</strong> <a href="https://${signatureData.website}" target="_blank" style="color: ${mainColor}; text-decoration: none;">${signatureData.website}</a></div>` : ''}
          ${signatureData.address ? `<div style="margin: 5px 0;"><strong>📍 Address:</strong> ${signatureData.address}</div>` : ''}
        </div>
        
        ${socialLinksHTML ? `
          <div style="margin: 20px 0;">
            <div style="font-size: ${signatureData.fontSize - 1}px; color: #777; margin-bottom: 8px; ${signatureData.template === 'creative' ? 'font-weight: 600;' : ''}">
              Connect with me:
            </div>
            ${socialLinksHTML}
          </div>
        ` : ''}
        
        ${signatureData.includeDisclaimer ? `
          <div style="font-size: ${signatureData.fontSize - 2}px; color: #999; border-top: 1px solid #eee${signatureData.template === 'creative' ? mainColor + '20' : ''}; padding-top: 15px; margin-top: 20px; font-style: italic;">
            <p style="margin: 0;">✉️ This email and any attachments are confidential. If you are not the intended recipient, please notify the sender and delete immediately.</p>
          </div>
        ` : ''}
      </div>
    `;
  };

  // Generate plain text signature
  const generatePlainTextSignature = (): string => {
    return `
${signatureData.name}
${signatureData.title}
${signatureData.company}

📧 Email: ${signatureData.email}
📱 Phone: ${signatureData.phone}
🌐 Website: ${signatureData.website}
📍 Address: ${signatureData.address}

Connect with me:
${signatureData.socialLinks
  .filter(link => link.enabled)
  .map(link => `• ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}: https://${link.url}`)
  .join('\n')}

${signatureData.includeDisclaimer ? '\nConfidentiality Notice: This email and any attachments are confidential.' : ''}
    `.trim();
  };

  // Handle copy
  const handleCopy = (format: 'html' | 'plain') => {
    const text = format === 'html' ? generateSignatureHTML() : generatePlainTextSignature();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle download
  const handleDownload = () => {
    const html = generateSignatureHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signature-${signatureData.name.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset to default
  const handleReset = () => {
    setSignatureData({
      name: "",
      title: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      website: "",
      logo: "",
      socialLinks: [
        { platform: 'linkedin', url: '', enabled: true },
        { platform: 'twitter', url: '', enabled: true },
        { platform: 'github', url: '', enabled: false },
        { platform: 'instagram', url: '', enabled: false },
        { platform: 'website', url: '', enabled: true },
      ],
      template: 'modern',
      colorScheme: 'blue',
      fontSize: 14,
      showBorder: true,
      includeDisclaimer: true,
    });
  };

  // Quick presets
  const presets = [
    {
      name: "Executive",
      icon: Crown,
      data: {
        name: "Sarah Johnson",
        title: "Chief Executive Officer",
        company: "Global Innovations Inc.",
        email: "sarah.johnson@globalinnovations.com",
        phone: "+1 (212) 555-7890",
        address: "500 Park Avenue, New York, NY 10022",
        website: "www.globalinnovations.com",
        template: 'classic' as TemplateType,
        colorScheme: 'dark' as ColorScheme,
      }
    },
    {
      name: "Developer",
      icon: Github,
      data: {
        name: "Alex Chen",
        title: "Full Stack Developer",
        company: "TechStart Solutions",
        email: "alex.chen@techstart.com",
        phone: "+1 (415) 555-1234",
        address: "1 Market Street, San Francisco, CA 94105",
        website: "www.techstart.com",
        template: 'modern' as TemplateType,
        colorScheme: 'blue' as ColorScheme,
      }
    },
    {
      name: "Designer",
      icon: Palette,
      data: {
        name: "Maria Rodriguez",
        title: "Creative Director",
        company: "DesignStudio Pro",
        email: "maria@designstudiopro.com",
        phone: "+1 (310) 555-5678",
        address: "123 Creative Blvd, Los Angeles, CA 90028",
        website: "www.designstudiopro.com",
        template: 'creative' as TemplateType,
        colorScheme: 'purple' as ColorScheme,
      }
    },
  ];

  // Apply preset
  const applyPreset = (preset: typeof presets[0]) => {
    setSignatureData(prev => ({
      ...prev,
      ...preset.data,
      socialLinks: prev.socialLinks, // Keep existing social links
    }));
  };

  // Update preview HTML when signature data changes
  useEffect(() => {
    if (autoRefresh) {
      setPreviewHtml(generateSignatureHTML());
    }
  }, [signatureData, autoRefresh]);

  // Initialize selected template badge
  useEffect(() => {
    const template = templates.find(t => t.id === signatureData.template);
    setSelectedTemplateBadge(template?.badge || "");
  }, []);

  return (
    <ToolLayout
      title="Email Signature Generator"
      description="Create professional email signatures with custom templates, colors, and social links. Export as HTML or plain text."
      keywords="email signature generator, professional email signature, email signature template, HTML signature, business email signature"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8 p-6 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Email Signature Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create stunning email signatures in minutes. {selectedTemplateBadge && 
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full ml-2">
                    <Sparkles className="w-3 h-3" />
                    {selectedTemplateBadge} Template
                  </span>
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">5</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Color Schemes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">5</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Social Platforms</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'editor'
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
          >
            <Palette className="w-5 h-5" />
            Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'preview'
                ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
          >
            <Eye className="w-5 h-5" />
            Preview
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Editor */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              {/* Personal Information Card */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={signatureData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                        {signatureData.name.length}/50
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={signatureData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Senior Developer"
                      />
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                        {signatureData.title.length}/50
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={signatureData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="TechCorp Inc."
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                      {signatureData.company.length}/100
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={signatureData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="john.doe@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={signatureData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="text"
                      value={signatureData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="www.company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={signatureData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="123 Street, City, State ZIP"
                    />
                  </div>
                </div>
              </div>

              {/* Design Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Design Settings
                </h3>
                
                {/* Template Selection */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Choose Template
                    </label>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                      {selectedTemplateBadge}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {templates.map((template) => {
                      const Icon = template.icon;
                      const isSelected = signatureData.template === template.id;
                      return (
                        <button
                          key={template.id}
                          onClick={() => handleInputChange('template', template.id)}
                          className={`p-3 rounded-xl border transition-all duration-200 ${isSelected
                              ? "ring-2 ring-blue-500 ring-offset-2 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-700 scale-[1.02]"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-[1.01]"
                            }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            {/* Template visual preview */}
                            <div className="w-full h-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5">
                              <div className={`flex items-center gap-0.5 h-full ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                                {/* Modern template indicator */}
                                {template.id === 'modern' && (
                                  <div className={`w-1 h-full ${signatureData.colorScheme === 'blue' ? 'bg-blue-500' : 
                                    signatureData.colorScheme === 'green' ? 'bg-green-500' :
                                    signatureData.colorScheme === 'purple' ? 'bg-purple-500' :
                                    signatureData.colorScheme === 'red' ? 'bg-red-500' : 'bg-gray-800'}`}
                                  />
                                )}
                                {/* Classic template indicator */}
                                {template.id === 'classic' && (
                                  <div className={`w-full h-0.5 ${signatureData.colorScheme === 'blue' ? 'bg-blue-500' : 
                                    signatureData.colorScheme === 'green' ? 'bg-green-500' :
                                    signatureData.colorScheme === 'purple' ? 'bg-purple-500' :
                                    signatureData.colorScheme === 'red' ? 'bg-red-500' : 'bg-gray-800'} absolute top-0 left-0`}
                                  />
                                )}
                                {/* Content */}
                                <div className="flex-1 pl-1">
                                  <div className="flex items-center gap-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    <div className="w-6 h-0.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                                  </div>
                                  <div className="mt-0.5 flex gap-0.5">
                                    <div className="w-2 h-0.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                                    <div className="w-3 h-0.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                                  </div>
                                </div>
                                {/* Creative template indicator */}
                                {template.id === 'creative' && (
                                  <div className="w-3 h-3 rounded-full border border-dashed border-gray-300 dark:border-gray-600 ml-1" />
                                )}
                                {/* Minimal template indicator */}
                                {template.id === 'minimal' && (
                                  <div className={`w-full h-0.5 ${signatureData.colorScheme === 'blue' ? 'bg-blue-500' : 
                                    signatureData.colorScheme === 'green' ? 'bg-green-500' :
                                    signatureData.colorScheme === 'purple' ? 'bg-purple-500' :
                                    signatureData.colorScheme === 'red' ? 'bg-red-500' : 'bg-gray-800'} absolute bottom-0 left-0`}
                                  />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`} />
                              <div className="font-medium text-gray-800 dark:text-white text-xs">
                                {template.name}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Template-specific tips */}
                  {signatureData.template === 'minimal' && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mt-4">
                      💡 <strong>Tip:</strong> Minimal template works best with email clients that have limited HTML support
                    </div>
                  )}
                  {signatureData.template === 'modern' && (
                    <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mt-4">
                      ⭐ <strong>Most Popular:</strong> Modern template works with most email clients including Gmail and Outlook
                    </div>
                  )}
                  {signatureData.template === 'creative' && (
                    <div className="text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mt-4">
                      🎨 <strong>Creative:</strong> Best for marketing and design professionals
                    </div>
                  )}
                  {signatureData.template === 'classic' && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mt-4">
                      👔 <strong>Professional:</strong> Ideal for corporate and executive use
                    </div>
                  )}
                </div>

                {/* Color Scheme */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Color Scheme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorSchemes.map((scheme) => {
                      const isSelected = signatureData.colorScheme === scheme.id;
                      return (
                        <button
                          key={scheme.id}
                          onClick={() => handleInputChange('colorScheme', scheme.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${isSelected
                              ? "ring-2 ring-offset-2 ring-blue-500 bg-white dark:bg-gray-800 shadow-sm"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                          <div className={`w-6 h-6 rounded-full bg-linear-to-br ${scheme.color} ${isSelected ? 'ring-2 ring-white dark:ring-gray-900' : ''}`} />
                          <span className={`text-sm font-medium ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                            {scheme.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <Layout className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Show Border</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Add decorative border</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInputChange('showBorder', !signatureData.showBorder)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${signatureData.showBorder
                          ? "bg-blue-500"
                          : "bg-gray-300 dark:bg-gray-700"
                        }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${signatureData.showBorder
                          ? "translate-x-6"
                          : "translate-x-1"
                        }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-white">Include Disclaimer</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Add confidentiality notice</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInputChange('includeDisclaimer', !signatureData.includeDisclaimer)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${signatureData.includeDisclaimer
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-700"
                        }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${signatureData.includeDisclaimer
                          ? "translate-x-6"
                          : "translate-x-1"
                        }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Social Links
                </h3>
                <div className="space-y-3">
                  {signatureData.socialLinks.map((link) => {
                    const Icon = socialIcons[link.platform];
                    return (
                      <div key={link.platform} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <button
                          onClick={() => toggleSocialLink(link.platform)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${link.enabled
                              ? "bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 text-blue-600 dark:text-blue-400 ring-2 ring-blue-200 dark:ring-blue-800"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                              {link.platform}
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${link.enabled
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500"
                              }`}>
                              {link.enabled ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateSocialLink(link.platform, e.target.value)}
                            className={`w-full p-2 bg-transparent border-b focus:border-blue-500 outline-none text-sm transition-colors ${link.enabled
                                ? "border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
                                : "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
                              }`}
                            placeholder={`your-${link.platform}-profile`}
                            disabled={!link.enabled}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Right Column - Preview & Actions */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-emerald-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Signature Preview
                  <span className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                    Live Preview
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className="p-2 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                    title={autoRefresh ? "Auto-refresh enabled" : "Auto-refresh disabled"}
                  >
                    {autoRefresh ? <RefreshCw className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="p-2 text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                    title={previewMode ? "Hide preview" : "Show preview"}
                  >
                    {previewMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {previewMode && (
                <div className="mb-6">
                  <div className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm">
                    <div 
                      className="email-signature-preview"
                      dangerouslySetInnerHTML={{ __html: previewHtml || generateSignatureHTML() }}
                    />
                  </div>
                  
                  {/* Template Info */}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-gray-600 dark:text-gray-400">
                      Template: <span className="font-medium text-gray-800 dark:text-white">{signatureData.template.charAt(0).toUpperCase() + signatureData.template.slice(1)}</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Color: <span className="font-medium text-gray-800 dark:text-white">{signatureData.colorScheme.charAt(0).toUpperCase() + signatureData.colorScheme.slice(1)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleCopy('html')}
                  className={`py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${copied
                      ? "bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                      : "bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg"
                    }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copied!" : "Copy HTML"}
                </button>
                <button
                  onClick={() => handleCopy('plain')}
                  className="py-3 rounded-xl font-medium bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 shadow hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copy Plain Text
                </button>
                <button
                  onClick={handleDownload}
                  className="py-3 rounded-xl font-medium bg-linear-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download HTML
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 rounded-xl font-medium bg-linear-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 shadow hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset All
                </button>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Company Logo
              </h3>
              
              <div className="text-center">
                {signatureData.logo ? (
                  <div className="relative inline-block group">
                    <img
                      src={signatureData.logo}
                      alt="Logo preview"
                      className="w-32 h-32 object-contain rounded-lg border-2 border-gray-300 dark:border-gray-600 group-hover:border-blue-500 transition-colors shadow-sm"
                    />
                    <button
                      onClick={() => handleInputChange('logo', '')}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="mt-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        Change Logo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-32 h-32 mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Upload Logo
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG, SVG
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  className="hidden"
                  accept="image/*"
                />
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  <span className="font-medium">Recommended:</span> 200×200px PNG with transparent background for best results
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Quick Presets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {presets.map((preset, index) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => applyPreset(preset)}
                      className="p-3 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="font-medium text-gray-800 dark:text-white text-sm">
                          {preset.name}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {preset.data.title} • {preset.data.company}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Usage Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                  </div>
                  <span><strong>Copy HTML</strong> for email clients (Gmail, Outlook, Apple Mail)</span>
                </li>
                <li className="flex items-start gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">2</span>
                  </div>
                  <span><strong>Test signature</strong> by sending an email to yourself before using</span>
                </li>
                <li className="flex items-start gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">3</span>
                  </div>
                  <span><strong>Keep it concise</strong> - aim for 4-6 lines maximum for best results</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-linear-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-purple-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Professional Email Signature Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Layout className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                4 Professional Templates
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Modern, Classic, Minimal, and Creative designs for any industry
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Social Media Integration
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                LinkedIn, Twitter, GitHub, Instagram, and website links
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-linear-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                Easy Export Options
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Copy HTML/plain text or download as HTML file
              </p>
            </div>
          </div>
        </div>
      </div>
      <RelatedTools currentToolId="email-signature-generator" />
    </ToolLayout>
  );
}