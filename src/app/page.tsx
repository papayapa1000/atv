import { Hero } from "@/components/home/Hero";
import { HomeOverview } from "@/components/home/HomeOverview";
import { QuickInfo } from "@/components/home/QuickInfo";

export default function Home() {
  return (
    <main>
      <Hero />
      <QuickInfo />
      <HomeOverview />
    </main>
  );
}
