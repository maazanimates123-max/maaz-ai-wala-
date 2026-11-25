import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, YouTubeIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

export interface SocialUrls { instagram?: string; tiktok?: string; facebook?: string; youtube?: string; linkedin?: string }

const items = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon, hover: "hover:border-transparent hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:shadow-[0_0_22px_-2px_#ee2a7b]" },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon, hover: "hover:border-transparent hover:bg-black hover:text-white hover:shadow-[2px_2px_0_#25f4ee,-2px_-2px_0_#fe2c55,0_0_22px_-4px_#25f4ee]" },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon, hover: "hover:border-transparent hover:bg-[#1877f2] hover:text-white hover:shadow-[0_0_22px_-2px_#1877f2]" },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon, hover: "hover:border-transparent hover:bg-[#0a66c2] hover:text-white hover:shadow-[0_0_22px_-2px_#0a66c2]" },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon, hover: "hover:border-transparent hover:bg-[#ff0000] hover:text-white hover:shadow-[0_0_22px_-2px_#ff0000]" },
] as const;

export function SocialLinks({ urls, size = "md", withLabels = false, className }: { urls: SocialUrls; size?: "md" | "lg"; withLabels?: boolean; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {items.map(({ key, label, Icon, hover }) => {
        const href = urls[key];
        if (!href) return null;
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Maaz AI Wala on ${label} (opens in a new tab)`}
              className={cn(
                "shine flex items-center gap-2.5 rounded-full border border-neon/25 bg-gradient-to-b from-white/[.08] to-white/[.02] text-white/90 shadow-[0_0_18px_-8px_#a78bfa] transition duration-300 hover:-translate-y-0.5",
                hover,
                withLabels ? "px-4 h-11 text-sm" : size === "lg" ? "h-12 w-12 justify-center" : "h-10 w-10 justify-center",
              )}
            >
              <Icon className={size === "lg" ? "h-5 w-5" : "h-[18px] w-[18px]"} />
              {withLabels && <span>{label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
