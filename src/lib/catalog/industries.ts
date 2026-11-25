export interface Industry {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  challenges: string[];
  opportunities: { title: string; text: string; service: string }[];
  workflows: { title: string; steps: string[] }[];
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "real-estate", name: "Real Estate", icon: "building",
    tagline: "Respond to every property enquiry instantly and focus agents on serious buyers.",
    challenges: ["Enquiries arrive from portals, social media and calls", "Agents lose time on unqualified leads", "Viewings are scheduled by hand", "Follow-ups are inconsistent"],
    opportunities: [
      { title: "Inquiry management", text: "Capture every portal, website and social enquiry into one pipeline.", service: "ai-lead-generation" },
      { title: "Buyer qualification", text: "AI asks budget, area and timeline, then scores each lead.", service: "ai-lead-qualification" },
      { title: "Viewing scheduling", text: "Qualified buyers book viewings into agents' calendars.", service: "ai-appointment-booking" },
      { title: "Listing follow-ups", text: "Matching new listings are sent to interested buyers automatically.", service: "ai-marketing-automation" },
    ],
    workflows: [
      { title: "Portal lead to viewing", steps: ["Portal enquiry", "AI qualification", "CRM entry", "Viewing booked", "Agent notified"] },
      { title: "New listing alerts", steps: ["Listing added", "Match buyer criteria", "Personalised message", "WhatsApp / email sent"] },
    ],
  },
  {
    slug: "ecommerce", name: "E-commerce", icon: "cart",
    tagline: "Automate support, orders and product content so your store scales without extra admin.",
    challenges: ["Repeated order-status questions", "Manual order notifications", "Abandoned carts rarely followed up", "Product data kept in sync by hand"],
    opportunities: [
      { title: "AI customer support", text: "Answer order, delivery and return questions instantly.", service: "ai-customer-support" },
      { title: "Order notifications", text: "Confirmations and status updates sent automatically.", service: "ai-email-automation" },
      { title: "Product content", text: "Generate SEO-friendly product descriptions in bulk.", service: "ai-content-generation" },
      { title: "Cart recovery", text: "Personalised reminders for abandoned carts.", service: "ai-marketing-automation" },
    ],
    workflows: [
      { title: "Order to customer update", steps: ["New order", "Validate details", "Update sheet / ERP", "Customer confirmation", "Team alert"] },
      { title: "Support triage", steps: ["Customer message", "AI answers FAQ", "Ticket if needed", "Human resolves"] },
    ],
  },
  {
    slug: "healthcare", name: "Healthcare", icon: "stethoscope",
    tagline: "Reduce front-desk workload with automated bookings, reminders and patient enquiries.",
    challenges: ["Phones busy with booking calls", "No-shows from forgotten appointments", "Patient forms typed in manually", "After-hours enquiries missed"],
    opportunities: [
      { title: "Appointment booking", text: "Patients book and reschedule online, with reminders.", service: "ai-appointment-booking" },
      { title: "Patient enquiry assistant", text: "Answer timings, services and preparation questions.", service: "ai-chatbots" },
      { title: "Form processing", text: "Extract patient intake form data into your system.", service: "ai-document-processing" },
      { title: "After-hours calls", text: "Voice agent captures caller details for the morning.", service: "ai-voice-agents" },
    ],
    workflows: [
      { title: "Booking with reminders", steps: ["Patient books slot", "Calendar updated", "Confirmation sent", "Reminder 24h before"] },
      { title: "Intake forms", steps: ["Form uploaded", "AI extracts fields", "Staff review", "Saved to records"] },
    ],
  },
  {
    slug: "education", name: "Education", icon: "graduation",
    tagline: "Handle admissions enquiries, applications and student communication automatically.",
    challenges: ["High volume of admission questions", "Application forms processed manually", "Fee reminders sent by hand", "Parent communication is scattered"],
    opportunities: [
      { title: "Admissions assistant", text: "Answer course, fee and schedule questions 24/7.", service: "ai-chatbots" },
      { title: "Application processing", text: "Extract application data and flag missing documents.", service: "ai-document-processing" },
      { title: "Enquiry qualification", text: "Prioritise serious applicants for counsellors.", service: "ai-lead-qualification" },
      { title: "Reminders & updates", text: "Automated fee, class and event reminders.", service: "ai-email-automation" },
    ],
    workflows: [
      { title: "Admission enquiry flow", steps: ["Enquiry received", "AI answers", "Lead scored", "Counsellor call booked"] },
      { title: "Application intake", steps: ["Form submitted", "Documents checked", "Data extracted", "Status email sent"] },
    ],
  },
  {
    slug: "marketing-agencies", name: "Marketing Agencies", icon: "megaphone",
    tagline: "Automate onboarding, reporting and content so your team spends time on strategy.",
    challenges: ["Client onboarding is repetitive", "Monthly reports take days", "Content production bottlenecks", "Leads scattered across channels"],
    opportunities: [
      { title: "Client onboarding", text: "Folders, forms, welcome emails and tasks created automatically.", service: "custom-ai-agents" },
      { title: "Automated reporting", text: "Collect metrics and AI-written summaries every month.", service: "ai-marketing-automation" },
      { title: "Content pipelines", text: "Ideas, drafts and approvals for every client.", service: "ai-social-media-automation" },
      { title: "CRM automation", text: "Keep deals and client activity up to date.", service: "ai-crm-automation" },
    ],
    workflows: [
      { title: "New client onboarding", steps: ["Contract signed", "Drive folder created", "Intake form sent", "Tasks assigned", "Kick-off booked"] },
      { title: "Monthly report", steps: ["Pull metrics", "Calculate KPIs", "AI summary", "Report emailed"] },
    ],
  },
  {
    slug: "restaurants", name: "Restaurants", icon: "utensils",
    tagline: "Take reservations, answer questions and collect reviews without tying up staff.",
    challenges: ["Phones ring during rush hours", "Reservation no-shows", "Same menu and timing questions", "Few customers leave reviews"],
    opportunities: [
      { title: "Reservations", text: "Online and WhatsApp bookings with reminders.", service: "ai-appointment-booking" },
      { title: "Menu & order assistant", text: "Answer menu, timing and delivery questions.", service: "ai-chatbots" },
      { title: "Call answering", text: "Voice agent takes reservation details when busy.", service: "ai-voice-agents" },
      { title: "Review requests", text: "Polite review requests after each visit.", service: "ai-marketing-automation" },
    ],
    workflows: [
      { title: "Reservation flow", steps: ["Customer requests table", "Availability checked", "Confirmation sent", "Reminder same day"] },
      { title: "Review collection", steps: ["Visit completed", "Thank-you message", "Review link", "Feedback logged"] },
    ],
  },
  {
    slug: "financial-services", name: "Financial Services", icon: "landmark",
    tagline: "Speed up document handling, client onboarding and compliance-friendly communication.",
    challenges: ["Heavy document processing", "Slow client onboarding", "Manual data entry into systems", "Follow-ups on pending documents"],
    opportunities: [
      { title: "Document extraction", text: "Extract data from statements, forms and IDs with review.", service: "ai-document-processing" },
      { title: "Invoice processing", text: "Automate payables data entry and validation.", service: "ai-invoice-processing" },
      { title: "Client onboarding", text: "Checklists, reminders and status updates automatically.", service: "ai-email-automation" },
      { title: "CRM updates", text: "Keep client records and activities current.", service: "ai-crm-automation" },
    ],
    workflows: [
      { title: "Onboarding checklist", steps: ["New client", "Document request", "AI checks uploads", "Missing items chased", "Advisor notified"] },
      { title: "Payables", steps: ["Invoice received", "Data extracted", "Validated", "Approval request", "Recorded"] },
    ],
  },
  {
    slug: "small-businesses", name: "Small Businesses", icon: "store",
    tagline: "Get back hours every week by automating email, enquiries and admin.",
    challenges: ["Owners handle every message themselves", "Data entry eats time", "Leads forgotten in busy weeks", "No time for marketing"],
    opportunities: [
      { title: "Email automation", text: "Drafted replies and smart routing for your inbox.", service: "ai-email-automation" },
      { title: "Website chatbot", text: "Answer customers and capture leads 24/7.", service: "ai-chatbots" },
      { title: "Lead follow-up", text: "Every enquiry saved and followed up automatically.", service: "ai-lead-generation" },
      { title: "Invoice handling", text: "Receipts and invoices organised without typing.", service: "ai-invoice-processing" },
    ],
    workflows: [
      { title: "Enquiry to follow-up", steps: ["Customer enquiry", "Saved to sheet", "Auto reply", "Reminder to owner"] },
      { title: "Weekly summary", steps: ["Collect sales & leads", "AI summary", "Emailed every Monday"] },
    ],
  },
  {
    slug: "corporate-businesses", name: "Corporate Businesses", icon: "briefcase",
    tagline: "Scale operations with secure AI agents, integrations and governed workflows.",
    challenges: ["Processes spread across many systems", "Knowledge hard to find", "Manual reporting across departments", "Governance and approval requirements"],
    opportunities: [
      { title: "Internal knowledge agents", text: "Staff get answers from policies and documents.", service: "custom-ai-agents" },
      { title: "Cross-system integrations", text: "Connect ERP, CRM and internal tools reliably.", service: "custom-ai-agents" },
      { title: "Document workflows", text: "Classify, extract and route documents at scale.", service: "ai-document-processing" },
      { title: "Sales operations", text: "Proposal drafting and pipeline automation.", service: "ai-sales-automation" },
    ],
    workflows: [
      { title: "Approval workflow", steps: ["Request submitted", "AI pre-checks", "Manager approval", "System updated", "Audit log"] },
      { title: "Knowledge assistant", steps: ["Staff question", "Search documents", "Cited answer", "Escalate if unsure"] },
    ],
  },
  {
    slug: "recruitment-agencies", name: "Recruitment Agencies", icon: "user-search",
    tagline: "Screen CVs, schedule interviews and keep candidates informed automatically.",
    challenges: ["Hundreds of CVs per role", "Interview scheduling back-and-forth", "Candidates left without updates", "Manual ATS data entry"],
    opportunities: [
      { title: "CV screening", text: "AI extracts skills and matches CVs to role criteria.", service: "ai-document-processing" },
      { title: "Candidate qualification", text: "Score candidates and summarise fit for recruiters.", service: "ai-lead-qualification" },
      { title: "Interview scheduling", text: "Candidates self-book interview slots with reminders.", service: "ai-appointment-booking" },
      { title: "Candidate updates", text: "Status emails at every stage automatically.", service: "ai-email-automation" },
    ],
    workflows: [
      { title: "Application screening", steps: ["CV received", "AI extracts skills", "Match score", "Shortlist to recruiter"] },
      { title: "Interview booking", steps: ["Shortlisted", "Booking link sent", "Calendar updated", "Reminder sent"] },
    ],
  },
];
