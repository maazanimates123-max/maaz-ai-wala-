import {
  Bot,
  BarChart3,
  Database,
  FileText,
  Mail,
  MessageSquare,
  Share2,
  Sparkles,
  Target,
  Workflow,
  Zap,
  Users,
  Settings,
  ShieldCheck,
  Headset, Filter, CalendarDays, PenLine, Phone, Receipt, TrendingUp, Megaphone, Building2, ShoppingCart,
  Stethoscope, GraduationCap, UtensilsCrossed, Landmark, Store, Briefcase, UserSearch, Plug, Gem, Brain,
  Sheet, Folder, MessageCircle, Send, Hash, Cloud, CreditCard,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  workflow: Workflow,
  bot: Bot,
  "message-square": MessageSquare,
  target: Target,
  mail: Mail,
  share: Share2,
  "file-text": FileText,
  chart: BarChart3,
  database: Database,
  zap: Zap,
  users: Users,
  settings: Settings,
  shield: ShieldCheck,
  headset: Headset, filter: Filter, calendar: CalendarDays, pen: PenLine, phone: Phone, receipt: Receipt,
  "trending-up": TrendingUp, megaphone: Megaphone, building: Building2, cart: ShoppingCart, stethoscope: Stethoscope,
  graduation: GraduationCap, utensils: UtensilsCrossed, landmark: Landmark, store: Store, briefcase: Briefcase,
  "user-search": UserSearch, plug: Plug, gem: Gem, brain: Brain, sheet: Sheet, folder: Folder,
  "message-circle": MessageCircle, send: Send, hash: Hash, cloud: Cloud, "credit-card": CreditCard,
};
export const ICON_NAMES = Object.keys(ICONS);

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}
