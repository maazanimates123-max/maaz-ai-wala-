/** Integrations we build with. Shown on the site; connected per-client inside their n8n / accounts. */
export const INTEGRATIONS: { name: string; icon: string; group: string }[] = [
  { name: "n8n", icon: "workflow", group: "Automation" },
  { name: "Webhooks & REST APIs", icon: "plug", group: "Automation" },
  { name: "OpenAI", icon: "sparkles", group: "AI Models" },
  { name: "Google Gemini", icon: "gem", group: "AI Models" },
  { name: "Anthropic Claude", icon: "brain", group: "AI Models" },
  { name: "Google Sheets", icon: "sheet", group: "Google Workspace" },
  { name: "Google Drive", icon: "folder", group: "Google Workspace" },
  { name: "Gmail", icon: "mail", group: "Google Workspace" },
  { name: "Google Calendar", icon: "calendar", group: "Google Workspace" },
  { name: "WhatsApp Business API", icon: "message-circle", group: "Messaging" },
  { name: "Telegram", icon: "send", group: "Messaging" },
  { name: "Slack", icon: "hash", group: "Messaging" },
  { name: "HubSpot", icon: "users", group: "CRM & Payments" },
  { name: "Salesforce", icon: "cloud", group: "CRM & Payments" },
  { name: "Stripe", icon: "credit-card", group: "CRM & Payments" },
];
