import Link from "next/link";
import { Facebook, Twitter, Github, Heart } from "lucide-react";

const Footer = () => {
  const toolCategories = [
    {
      title: "PDF Tools",
      links: [
        { name: "PDF Editor", href: "/tools/pdf-editor" },
        { name: "PDF to Word", href: "/tools/pdf-to-word" },
        { name: "PDF to Excel", href: "/tools/pdf-to-excel" },
        { name: "PDF Compressor", href: "/tools/pdf-compressor" },
        { name: "Merge PDF", href: "/tools/merge-pdf" },
      ],
    },
    {
      title: "Calculators",
      links: [
        { name: "Loan Calculator", href: "/tools/loan-calculator" },
        { name: "Mortgage Calculator", href: "/tools/mortgage-calculator" },
        { name: "EMI Calculator", href: "/tools/emi-calculator" },
        { name: "Interest Calculator", href: "/tools/interest-calculator" },
        { name: "Currency Converter", href: "/tools/currency-converter" },
      ],
    },
    {
      title: "Converters",
      links: [
        { name: "Image Converter", href: "/tools/image-converter" },
        { name: "Video Converter", href: "/tools/video-converter" },
        { name: "Audio Converter", href: "/tools/audio-converter" },
        { name: "Unit Converter", href: "/tools/unit-converter" },
        { name: "File Compressor", href: "/tools/file-compressor" },
      ],
    },
    {
      title: "Generators",
      links: [
        { name: "QR Code Generator", href: "/tools/qr-generator" },
        { name: "Password Generator", href: "/tools/password-generator" },
        { name: "Random Number", href: "/tools/random-number" },
        { name: "UUID Generator", href: "/tools/uuid-generator" },
        { name: "Lorem Ipsum", href: "/tools/lorem-ipsum" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">U</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UtilityToolsHub
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Free online tools for everyday tasks. No registration required. 
              Fast, secure, and easy to use.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Tool Categories */}
          {toolCategories.map((category) => (
            <div key={category.title}>
              <h3 className="font-semibold text-lg mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} UtilityToolsHub. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" /> for the community
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;