import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { SERVICE_SEEDS } from "@/lib/catalog/services";
import { INDUSTRIES } from "@/lib/catalog/industries";
import { defaultPortfolio } from "@/lib/defaults";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority,
  });
  return [
    page("", 1, "weekly"),
    ...["/services", "/solutions", "/pricing", "/start-project", "/demos", "/portfolio", "/about", "/contact", "/how-it-works"].map((p) => page(p, 0.8)),
    ...SERVICE_SEEDS.map((s) => page(`/services/${s.slug}`, 0.7)),
    ...INDUSTRIES.map((i) => page(`/solutions/${i.slug}`, 0.7)),
    ...defaultPortfolio.map((p) => page(`/portfolio/${p.slug}`, 0.5)),
    page("/privacy", 0.3, "yearly"),
    page("/terms", 0.3, "yearly"),
  ];
}
