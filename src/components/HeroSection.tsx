import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-50 to-purple-50 text-blue-700 mb-6">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">19 Free Online Tools</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Free Online Tools
          </span>
          <br />
          <span className="text-foreground">For Everyday Tasks</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          No downloads, no registration needed. Instantly access PDF editors, calculators,
          converters, and generators - all completely free!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-8 py-3 text-white font-medium hover:opacity-90 transition-all hover:scale-[1.02]"
          >
            Explore All Tools
            <ArrowRight className="h-5 w-5" />
          </Link>

          {/* FIX: was /trending (404). Now points to tools page with filter */}
          <Link
            href="/tools?filter=trending"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-input bg-background px-8 py-3 font-medium hover:bg-accent transition-colors"
          >
            Trending Tools
            <Zap className="h-5 w-5" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          <div className="text-center p-4 rounded-lg bg-card border">
            <div className="text-2xl md:text-3xl font-bold text-primary">19</div>
            <div className="text-sm text-muted-foreground">Tools</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card border">
            <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Secure</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card border">
            <div className="text-2xl md:text-3xl font-bold text-primary">No Signup</div>
            <div className="text-sm text-muted-foreground">Required</div>
          </div>
          <div className="text-center p-4 rounded-lg bg-card border">
            <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Secure & Private</span>
          </div>
          <div className="hidden md:block">•</div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span>Instant Results</span>
          </div>
          <div className="hidden md:block">•</div>
          <div>No Watermarks</div>
          <div className="hidden md:block">•</div>
          <div>Browser-Based</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
