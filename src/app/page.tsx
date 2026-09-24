import { MarketingNav } from "@/components/marketing/Nav";
import { Hero } from "@/components/marketing/Hero";
import { Problem } from "@/components/marketing/Problem";
import { Opportunity } from "@/components/marketing/Opportunity";
import { Solution } from "@/components/marketing/Solution";
import { MarketSize } from "@/components/marketing/MarketSize";
import { BusinessModel } from "@/components/marketing/BusinessModel";
import { Traction } from "@/components/marketing/Traction";
import { Competitive } from "@/components/marketing/Competitive";
import { Connectivity } from "@/components/marketing/Connectivity";
import { Ask } from "@/components/marketing/Ask";
import { MarketingFooter } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <>
      <MarketingNav />
      <main className="flex-1">
        <Hero />
        <Problem />
        <Opportunity />
        <Solution />
        <MarketSize />
        <BusinessModel />
        <Traction />
        <Competitive />
        <Connectivity />
        <Ask />
      </main>
      <MarketingFooter />
    </>
  );
}
