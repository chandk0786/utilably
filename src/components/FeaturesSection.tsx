import { Shield, Zap, Globe, Cloud, Smartphone, BarChart, RefreshCw, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "All processing happens in your browser. We never store or see your files.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "No waiting times. Get results immediately with our optimized tools.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Globe,
      title: "No Registration",
      description: "Use all tools without signing up. No accounts, no emails required.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Cloud,
      title: "Browser-Based",
      description: "Works directly in your browser. No downloads or installations needed.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Optimized for all devices. Use our tools on phone, tablet, or desktop.",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: BarChart,
      title: "Auto-Optimized",
      description: "Tools automatically update based on usage patterns and trends.",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: RefreshCw,
      title: "Always Improving",
      description: "We continuously add new features and improve existing tools.",
      color: "from-teal-500 to-green-500",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Tool suggestions and improvements based on user feedback.",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">UtilityToolsHub</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;ve built the ultimate online tools platform with features that matter to you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon with gradient background */}
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {feature.description}
              </p>

              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r from-primary to-primary/50" />
            </div>
          ))}
        </div>

        {/* Stats banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Free Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Browser-Based</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">0</div>
              <div className="text-sm text-muted-foreground">Registration Required</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;