/**
 * Built-in default content.
 *
 * The public site shows this content while the matching database table is
 * empty (or while Supabase is not configured). From the admin dashboard the
 * owner can import these defaults into the database and then edit them.
 */
import type { PortfolioProject, PricingPackage, Service } from "@/lib/types";
import { SERVICE_SEEDS } from "@/lib/catalog/services";

type Seed<T> = Omit<T, "id">;

export const defaultServices: Seed<Service>[] = SERVICE_SEEDS;

/**
 * Real n8n workflows built by Maaz AI Wala (screenshots in /public/portfolio).
 * They are own builds, not client case studies — so is_demo stays true and no client results are claimed.
 */
export const defaultPortfolio: Seed<PortfolioProject>[] = [
  {
    slug: "ai-news-video-pipeline",
    title: "Daily AI News Video Pipeline",
    category: "Content Automation",
    summary: "Turns the day's AI news into a finished video with script, slides and render — then uploads it and emails a report.",
    problem: "Producing a daily news video by hand means reading feeds, writing a script, designing slides, rendering, uploading and reporting — hours of work every single day.",
    solution:
      "A scheduled n8n workflow picks today's topic lane, reads news RSS feeds, and uses two AI agents (Gemini) — one to plan the story and one to write slides and the script. It sends a review email via Gmail, builds the video JSON, renders it through a video API, polls until the render is ready, downloads the file, uploads it to Google Drive and emails a daily summary.",
    technologies: ["n8n", "Google Gemini (AI Agents)", "RSS", "Gmail", "Video render API", "Google Drive"],
    result: "Runs every day on a schedule (or manually) and produces a ready-to-publish video with no manual editing.",
    image_url: "/portfolio/ai-news-video-pipeline.png",
    workflow_steps: ["Daily trigger", "Read news feeds", "AI agents write script", "Render video", "Upload & email report"],
    is_demo: true,
    is_published: true,
    display_order: 1,
  },
  {
    slug: "ai-cartoon-series",
    title: "Daily AI Cartoon Series Generator",
    category: "Video Automation",
    summary: "Creates one episode of an AI cartoon series every day — script, scenes, clips, final video — and publishes it to YouTube.",
    problem: "A daily animated series needs a script, many generated clips, waiting for renders, stitching and publishing — impossible to keep up manually.",
    solution:
      "Every day at 9 AM the workflow reads the next topic and episode part from Google Sheets (and stops cleanly if none are left). AI writes the video script, which is split into scenes. For each scene it starts an AI video clip, waits, checks the status until the clip is ready, downloads it and uploads it to Cloudinary. The clips are combined into the final video, which is published to YouTube, and the sheet is updated with progress.",
    technologies: ["n8n", "AI video generation API", "Google Sheets", "Cloudinary", "YouTube API"],
    result: "Fully automated daily episodes with progress tracked in a spreadsheet.",
    image_url: "/portfolio/ai-cartoon-series.png",
    workflow_steps: ["9 AM trigger", "Next topic from Sheets", "AI script → scenes", "Generate clips", "Publish to YouTube"],
    is_demo: true,
    is_published: true,
    display_order: 2,
  },
  {
    slug: "multi-agent-router",
    title: "Multi-Agent AI Router",
    category: "AI Agents",
    summary: "Classifies each incoming request and sends it to the right specialised AI agent, each with its own tools.",
    problem: "One general chatbot gives weak answers when requests cover very different jobs — support, sales and operations need different knowledge and tools.",
    solution:
      "Incoming requests are checked and routed by a switch to one of several specialised AI agents. Each agent has its own model, memory and tools, and its output is passed on to the next action — so every request is handled by the agent best suited to it.",
    technologies: ["n8n", "AI Agents", "Switch routing", "Agent memory & tools"],
    result: "Shows a scalable multi-agent design where new specialist agents can be added as new branches.",
    image_url: "/portfolio/multi-agent-router.png",
    workflow_steps: ["Request in", "Classify", "Route to agent", "Agent uses tools", "Deliver result"],
    is_demo: true,
    is_published: true,
    display_order: 3,
  },
  {
    slug: "ai-content-pipeline",
    title: "AI Content Processing Pipeline",
    category: "AI Automation",
    summary: "A step-by-step pipeline that collects data, processes it with AI and delivers the result, with a separate branch for failures.",
    problem: "Content and data tasks that pass through many manual steps are slow and easy to get wrong.",
    solution:
      "A linear n8n pipeline: a trigger starts the run, data is fetched and prepared, an AI step generates the output, the result is formatted and delivered — with a separate branch that handles errors so failures are never silent.",
    technologies: ["n8n", "AI Agent", "HTTP / APIs", "Data formatting"],
    result: "Shows a clean, maintainable pipeline structure with error handling.",
    image_url: "/portfolio/ai-content-pipeline.png",
    workflow_steps: ["Trigger", "Fetch data", "AI processing", "Format", "Deliver"],
    is_demo: true,
    is_published: true,
    display_order: 4,
  },
  {
    slug: "multi-platform-automation",
    title: "Multi-Platform Automation Hub",
    category: "Integrations",
    summary: "One central AI step fans out to many branches and platforms at once, with smaller helper workflows alongside.",
    problem: "Sending the same information to many tools and platforms by hand wastes time and leads to inconsistent results.",
    solution:
      "A central AI node prepares the content and fans out to many parallel branches, each handling a different platform or action, before the results are collected. Smaller helper workflows run alongside for supporting tasks.",
    technologies: ["n8n", "AI Agent", "Parallel branches", "Multiple platform integrations"],
    result: "Shows how one trigger can update many platforms consistently in a single run.",
    image_url: "/portfolio/multi-platform-automation.png",
    workflow_steps: ["Trigger", "Central AI step", "Fan out to platforms", "Collect results"],
    is_demo: true,
    is_published: true,
    display_order: 5,
  },
];

export const defaultPricing: Seed<PricingPackage>[] = [
  {
    slug: "starter",
    name: "Starter",
    description: "For startups and small businesses.",
    price: 500,
    currency: "USD",
    billing_note: "One-time development fee",
    features: [
      "1–2 custom automation workflows",
      "Basic AI integration",
      "n8n workflow development",
      "Google Sheets integration",
      "Gmail automation",
      "Basic CRM integration",
      "Lead capture and management",
      "Automated notifications",
      "Basic data processing",
      "Workflow testing",
      "Final deployment and handover",
    ],
    workflows_included: "1–2 workflows",
    support_period: "",
    cta_text: "Get Started",
    is_featured: false,
    is_active: true,
    display_order: 1,
  },
  {
    slug: "professional",
    name: "Professional",
    description: "For growing businesses and established companies.",
    price: 2000,
    currency: "USD",
    billing_note: "One-time development fee",
    features: [
      "3–7 advanced custom workflows",
      "Advanced AI agent development",
      "OpenAI and Google Gemini integration",
      "WhatsApp Business API automation",
      "Advanced CRM integration",
      "Automated lead generation and qualification",
      "Intelligent customer support systems",
      "Automated sales and follow-up systems",
      "AI-powered email management",
      "Automated appointment booking",
      "Google Sheets and database integration",
      "Multi-platform integrations",
      "Complex conditional logic",
      "API integrations and webhooks",
      "Automated reporting and analytics",
      "Advanced error handling",
      "Workflow testing and optimization",
      "Complete deployment and handover",
    ],
    workflows_included: "3–7 workflows",
    support_period: "",
    cta_text: "Get Started",
    is_featured: true,
    is_active: true,
    display_order: 2,
  },
  {
    slug: "custom",
    name: "Custom",
    description: "For advanced AI agents, complex integrations and larger teams.",
    price: null,
    currency: "USD",
    billing_note: "",
    features: ["More than 7 workflows", "Custom AI agents & multi-agent systems", "Complex API / database integrations", "Scope and price agreed by email"],
    workflows_included: "Scoped to your project",
    support_period: "",
    cta_text: "Contact for Pricing",
    is_featured: false,
    is_active: true,
    display_order: 3,
  },
];

export const defaultSocial = {
  instagram: "https://www.instagram.com/maaz_ai_wala/",
  tiktok: "https://www.tiktok.com/@maazfaisal60",
  facebook: "https://www.facebook.com/profile.php?id=61594638246958",
  youtube: "https://www.youtube.com/@maaz_ai_wala",
  linkedin: "",
};

export const defaultSettings = {
  brand: {
    name: "Maaz AI Wala",
    tagline: "Automate. Create. Grow.",
  },
  hero: {
    label: "MAAZ AI WALA",
    heading: "AI Automation That Replies to Your Leads in Minutes",
    description:
      "For small and growing businesses: we build n8n + AI systems that capture, qualify and answer every enquiry — and take repetitive admin off your team.",
    primary_cta: "Start Your Project",
    secondary_cta: "Explore Our Services",
  },
  cta: {
    heading: "Ready to Automate Your Business?",
    description: "Tell us about the work that slows your team down. We will review it and suggest a practical automation plan.",
    button: "Start Your Project",
  },
  about: {
    intro:
      "Maaz AI Wala is an AI automation agency focused on one thing: turning the repetitive work inside a business into reliable, intelligent systems. We combine workflow automation platforms like n8n with modern AI models to build solutions that save time and keep operations running smoothly.",
    why:
      "Most businesses do not need more software — they need the tools they already use to work together. Automation connects those tools, and AI handles the parts that need reading, writing or judgement. Together they remove hours of manual work every week.",
    approach:
      "We start with your process, not with technology. We learn how work flows today, find the steps that are repetitive or error-prone, and design an automation that fits — with testing, error handling and clear documentation so you can trust it.",
    mission: "To make practical AI automation accessible to businesses of every size, so teams can spend their time on work that actually needs people.",
    vision: "A future where every growing business runs on reliable automated systems — and AI is a dependable tool, not a buzzword.",
  },
  contact: {
    email: "",
    location: "Pakistan",
    response_note: "We reply to every message by email, usually within 1–2 business days.",
  },
  footer: {
    description: "AI automation, n8n workflows and AI agents that help businesses save time and grow. Automate. Create. Grow.",
  },
  social: defaultSocial,
  chatbot: {
    enabled: true,
    name: "Maaz AI Assistant",
    welcome_message:
      "Hi! Welcome to Maaz AI Wala. I can help you understand our AI automation services, explore solutions, and start your project. How can I help?",
    position: "right" as "right" | "left",
  },
  media: {
    youtube_video: "",
  },
  payment: {
    instructions:
      "Payment details will be shared with your quotation. After paying, enter your transaction reference below and we will verify it manually.",
  },
};

export type SiteSettings = typeof defaultSettings;
export type SettingsKey = keyof SiteSettings;
export const SETTINGS_KEYS = Object.keys(defaultSettings) as SettingsKey[];
