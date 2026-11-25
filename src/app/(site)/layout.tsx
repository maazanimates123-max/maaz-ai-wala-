import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { getSettings } from "@/lib/content";
import { ScrollProgress, Spotlight } from "@/components/layout/effects";

/** All customer communication happens by email — so the "human" route is the contact form. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <ScrollProgress />
      <Spotlight />
      <Navbar brandName={settings.brand.name} />
      <main id="main" className="min-h-[60vh]">{children}</main>
      <Footer />
      {settings.chatbot.enabled && (
        <ChatWidget
          name={settings.chatbot.name}
          welcome={settings.chatbot.welcome_message}
          position={settings.chatbot.position}
          humanLink="/contact"
        />
      )}
    </>
  );
}
