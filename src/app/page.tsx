import HeroSection from "@/components/HeroSection";
import ToolsGrid from "@/components/ToolsGrid";
import FeaturesSection from "@/components/FeaturesSection";
import TrendingTools from "@/components/TrendingTools";

export default function Home() {
  return (
    <div className="animate-in">
      <HeroSection />
      <ToolsGrid />
      <TrendingTools />
      <FeaturesSection />
    </div>
  );
}