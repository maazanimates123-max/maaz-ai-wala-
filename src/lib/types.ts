export type ProjectStatus =
  | "new"
  | "under_review"
  | "quotation_sent"
  | "awaiting_payment"
  | "in_progress"
  | "testing"
  | "completed"
  | "cancelled";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "new",
  "under_review",
  "quotation_sent",
  "awaiting_payment",
  "in_progress",
  "testing",
  "completed",
  "cancelled",
];

export const LEAD_STATUSES = ["new", "contacted", "qualified", "unqualified", "converted", "archived"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const PAYMENT_STATUSES = ["unpaid", "pending", "paid", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const QUOTATION_STATUSES = ["draft", "sent", "accepted", "declined", "expired"] as const;
export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];

export const SUPPORT_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;
export const CONTACT_STATUSES = ["new", "read", "replied", "archived"] as const;

export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  benefits: string[];
  features: string[];
  use_case: string;
  icon: string;
  category: string;
  problem: string;
  how_it_works: string[];
  use_cases: string[];
  integrations: string[];
  faqs: { q: string; a: string }[];
  display_order: number;
  is_active: boolean;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  technologies: string[];
  result: string;
  image_url: string | null;
  workflow_steps: string[];
  summary: string;
  is_demo: boolean;
  is_published: boolean;
  display_order: number;
}

export interface PricingPackage {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number | null;
  currency: string;
  billing_note: string;
  features: string[];
  workflows_included: string;
  support_period: string;
  cta_text: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export interface Project {
  id: string;
  reference: string;
  client_id: string | null;
  full_name: string;
  email: string;
  business_name: string;
  business_website: string | null;
  industry: string;
  service_required: string;
  description: string;
  current_problem: string;
  desired_automation: string;
  budget: string;
  timeline: string;
  existing_tools: string | null;
  additional_requirements: string | null;
  status: ProjectStatus;
  progress: number;
  deadline: string | null;
  deployment_status: "not_started" | "building" | "testing" | "deployed" | "paused";
  intake_status: "pending" | "forwarded" | "failed" | "not_configured";
  intake_response: unknown;
  confirmation_email_status: "pending" | "sent" | "failed" | "not_configured" | "delegated_to_n8n";
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: string;
  project_id: string;
  client_id: string;
  title: string;
  description: string;
  line_items: { label: string; amount: number }[];
  amount: number;
  currency: string;
  valid_until: string | null;
  status: QuotationStatus;
  sent_at: string | null;
  responded_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  project_id: string;
  client_id: string;
  quotation_id: string | null;
  amount: number;
  currency: string;
  provider: string;
  transaction_reference: string | null;
  status: PaymentStatus;
  client_note: string | null;
  admin_note: string | null;
  verified_at: string | null;
  created_at: string;
}

export const DEPLOYMENT_STATUSES = ["not_started", "building", "testing", "deployed", "paused"] as const;
export const BOOKING_STATUSES = ["confirmed", "cancelled", "completed", "no_show"] as const;
export const DOCUMENT_KINDS = ["document", "report", "invoice", "deliverable"] as const;

export interface Booking {
  id: string;
  reference: string;
  manage_token: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string;
  requirements: string;
  starts_at: string;
  ends_at: string;
  status: (typeof BOOKING_STATUSES)[number];
  calendar_event_id: string | null;
  admin_notes: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  company: string | null;
  quote: string;
  rating: number | null;
  is_verified: boolean;
  is_published: boolean;
  display_order: number;
}
