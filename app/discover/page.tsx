import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DiscoverExperience } from "@/components/DiscoverExperience";

export default function DiscoverPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader compact />
      <main className="flex-1 px-6 py-10 md:px-10 md:py-14">
        <DiscoverExperience />
      </main>
      <SiteFooter />
    </div>
  );
}
