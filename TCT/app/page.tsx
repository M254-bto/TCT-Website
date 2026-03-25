import { getSiteConfig, getSermons, getEvents, getMinistries } from "@/lib/content";
import Hero from "@/components/home/Hero";
import AboutPreview from "@/components/home/AboutPreview";
import SermonsPreview from "@/components/home/SermonsPreview";
import EventsPreview from "@/components/home/EventsPreview";
import MinistriesPreview from "@/components/home/MinistriesPreview";
import GivingCTA from "@/components/home/GivingCTA";

export default function HomePage() {
  const site = getSiteConfig();
  const sermons = getSermons();
  const events = getEvents();
  const ministries = getMinistries();

  return (
    <>
      <Hero
        tagline={site.tagline}
        subTagline={site.subTagline}
        scripture={site.scripture}
        scriptureRef={site.scriptureRef}
      />
      <AboutPreview
        vision={site.vision}
        mission={site.mission}
        communityStatement={site.communityStatement}
        deep={site.deep}
      />
      <SermonsPreview sermons={sermons} />
      <EventsPreview events={events} />
      <MinistriesPreview ministries={ministries} />
      <GivingCTA />
    </>
  );
}
