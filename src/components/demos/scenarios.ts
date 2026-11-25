export interface DemoNode { name: string; kind: "trigger" | "ai" | "action" | "logic"; detail: string; output: string; ms: number }
export interface Scenario {
  id: string;
  title: string;
  icon: string;
  trigger: string;
  input: Record<string, unknown>;
  nodes: DemoNode[];
  aiResponse: string;
  result: Record<string, unknown>;
  before: { step: string; time: string }[];
  after: { step: string; time: string }[];
}

/** Illustrative demo data — simulated in the browser, no real systems are called. */
export const SCENARIOS: Scenario[] = [
  {
    id: "lead", title: "Lead qualification", icon: "filter", trigger: "Website form submitted",
    input: { name: "Ayesha Khan", company: "Bright Homes Realty", message: "We get 200+ property enquiries a month and need faster follow-up. Budget ~$2,000, want to start this month.", source: "website" },
    nodes: [
      { name: "Webhook trigger", kind: "trigger", detail: "Receives the form submission", output: "Payload received (4 fields)", ms: 700 },
      { name: "Validate & clean", kind: "logic", detail: "Checks email, removes duplicates", output: "Valid · not a duplicate", ms: 600 },
      { name: "AI qualification", kind: "ai", detail: "Scores budget, need, timeline", output: "HOT · score 86", ms: 1400 },
      { name: "Save to CRM", kind: "action", detail: "Creates contact + deal in HubSpot", output: "Deal created: Bright Homes Realty", ms: 700 },
      { name: "Notify sales", kind: "action", detail: "WhatsApp alert for hot leads", output: "Alert sent to sales team", ms: 600 },
      { name: "Follow-up email", kind: "ai", detail: "Personalised reply drafted & sent", output: "Email sent to Ayesha", ms: 900 },
    ],
    aiResponse: "Lead temperature: HOT (86/100)\nReason: clear pain point (200+ monthly enquiries), stated budget that fits the Professional plan, and wants to start this month. Recommended next step: call within 1 hour and offer a consultation.",
    result: { lead_status: "hot", score: 86, crm: "deal_created", follow_up: "sent" },
    before: [{ step: "Read enquiry in inbox", time: "~3 min" }, { step: "Copy details into spreadsheet", time: "~4 min" }, { step: "Decide priority", time: "~3 min" }, { step: "Write follow-up email", time: "~8 min" }, { step: "Often delayed until next day", time: "hours" }],
    after: [{ step: "Captured automatically", time: "instant" }, { step: "Scored & summarised by AI", time: "seconds" }, { step: "CRM updated + sales alerted", time: "seconds" }, { step: "Personalised follow-up sent", time: "under a minute" }],
  },
  {
    id: "email", title: "AI email reply", icon: "mail", trigger: "New email in Gmail",
    input: { from: "customer@example.com", subject: "Do you deliver to Lahore?", body: "Hi, I want to order 3 items. Do you deliver to Lahore and how long does it take?" },
    nodes: [
      { name: "Gmail trigger", kind: "trigger", detail: "Watches the inbox for new mail", output: "1 new email", ms: 700 },
      { name: "AI classify", kind: "ai", detail: "Intent + urgency classification", output: "Intent: delivery question · urgency: normal", ms: 1100 },
      { name: "Knowledge lookup", kind: "logic", detail: "Finds delivery policy", output: "Policy: Lahore 2–3 working days", ms: 600 },
      { name: "Draft reply", kind: "ai", detail: "Writes reply in brand tone", output: "Draft ready", ms: 1300 },
      { name: "Approval", kind: "logic", detail: "Owner approves with one click", output: "Approved ✓", ms: 900 },
      { name: "Send & log", kind: "action", detail: "Sends reply, logs to sheet", output: "Reply sent", ms: 600 },
    ],
    aiResponse: "Hi! Yes, we deliver to Lahore. Orders usually arrive within 2–3 working days after dispatch. You can place your order on our website and you'll receive a tracking link by email. Let us know if you need help choosing items!",
    result: { classified: "delivery_question", reply: "sent_after_approval", logged: true },
    before: [{ step: "Open and read email", time: "~2 min" }, { step: "Look up delivery policy", time: "~3 min" }, { step: "Type reply", time: "~5 min" }, { step: "Repeat for every similar email", time: "all day" }],
    after: [{ step: "Email classified", time: "instant" }, { step: "Reply drafted from policy", time: "seconds" }, { step: "One-click approval", time: "~10 sec" }],
  },
  {
    id: "invoice", title: "Invoice extraction", icon: "receipt", trigger: "Invoice PDF uploaded to Drive",
    input: { file: "INV-2041-supplier.pdf", folder: "Invoices/Incoming" },
    nodes: [
      { name: "Drive trigger", kind: "trigger", detail: "New file in folder", output: "INV-2041-supplier.pdf", ms: 700 },
      { name: "AI extraction", kind: "ai", detail: "Reads vendor, dates, totals, items", output: "6 fields + 3 line items", ms: 1500 },
      { name: "Validation", kind: "logic", detail: "Totals add up? Duplicate?", output: "Totals match · not duplicate", ms: 700 },
      { name: "Append to sheet", kind: "action", detail: "Accounting sheet row", output: "Row 214 added", ms: 600 },
      { name: "File & notify", kind: "action", detail: "Moves file, Slack message", output: "Filed to Invoices/2026", ms: 600 },
    ],
    aiResponse: '{ "vendor": "Alpha Supplies", "invoice_no": "2041", "date": "2026-11-18", "due": "2026-12-02", "subtotal": 840.00, "tax": 134.40, "total": 974.40, "currency": "USD" }',
    result: { extracted: true, validated: true, sheet_row: 214 },
    before: [{ step: "Open each PDF", time: "~1 min" }, { step: "Type fields into sheet", time: "~5 min" }, { step: "Double-check totals", time: "~2 min" }, { step: "Rename & file", time: "~1 min" }],
    after: [{ step: "Extracted by AI", time: "seconds" }, { step: "Validated automatically", time: "instant" }, { step: "Logged & filed", time: "instant" }],
  },
  {
    id: "booking", title: "Appointment booking", icon: "calendar", trigger: "Chatbot booking request",
    input: { business: "Example dental clinic", patient: "Bilal", service: "Dental check-up", preferred: "Tomorrow afternoon" },
    nodes: [
      { name: "Chat trigger", kind: "trigger", detail: "Visitor asks to book", output: "Booking intent detected", ms: 700 },
      { name: "Check availability", kind: "logic", detail: "Reads open calendar slots", output: "3 slots available", ms: 800 },
      { name: "AI offers slots", kind: "ai", detail: "Suggests best options", output: "Visitor picks 3:00 PM", ms: 1100 },
      { name: "Create event", kind: "action", detail: "Google Calendar event", output: "Event created", ms: 700 },
      { name: "Confirm & remind", kind: "action", detail: "Email now, reminder later", output: "Confirmation sent", ms: 700 },
    ],
    aiResponse: "Great choice, Bilal! You're booked for a dental check-up tomorrow at 3:00 PM. A confirmation with a reschedule link has been sent to your email, and you'll get a reminder before your appointment.",
    result: { booked: true, calendar: "event_created", reminder: "scheduled" },
    before: [{ step: "Back-and-forth messages", time: "~15 min" }, { step: "Check calendar manually", time: "~3 min" }, { step: "Send confirmation", time: "~3 min" }, { step: "Remember to remind", time: "often missed" }],
    after: [{ step: "Customer picks a slot", time: "~1 min" }, { step: "Calendar + confirmation", time: "instant" }, { step: "Reminder sent automatically", time: "scheduled" }],
  },
];
