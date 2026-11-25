import type { Metadata } from "next";

export const SITE_NAME = "Maaz AI Wala";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const DEFAULT_DESCRIPTION =
  "Maaz AI Wala is an AI automation agency building n8n workflows, AI agents, AI chatbots and business automation systems that save time and help businesses grow.";
export const KEYWORDS = [
  "Maaz AI Wala", "AI Automation Agency", "n8n Automation", "AI Agents", "Business Automation", "AI Chatbots", "Workflow Automation",
  "AI automation Pakistan",
];

export function pageMetadata({ title, description, path, noindex }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url: path, siteName: SITE_NAME, type: "website" },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
