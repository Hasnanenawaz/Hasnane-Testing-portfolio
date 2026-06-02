import {
  BadgeIndianRupee,
  BarChart3,
  BriefcaseBusiness,
  GraduationCap,
  Megaphone,
  MessageCircle,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

export const metrics = [
  { value: "2.5+", label: "Years in social growth" },
  { value: "50k+", label: "Community members scaled" },
  { value: "300%", label: "Legal community growth" },
  { value: "7x+", label: "Revenue jump in 2 months" },
];

export const experience = [
  {
    company: "STAMP2FLY",
    period: "Apr 2025 - Jan 2026",
    role: "Marketing & Sales Intern",
    icon: BriefcaseBusiness,
    color: "bg-electric",
    highlights: [
      "Set up and managed the company's B2B marketing framework, aligning sales and marketing teams for efficiency.",
      "Conducted business research to identify and secure high-profile leads.",
      "Achieved 20% revenue growth by streamlining lead acquisition and conversion processes.",
      "Coordinated cross-functional sales and marketing efforts to strengthen leadership skills.",
    ],
  },
  {
    company: "Budding Mariners",
    period: "Feb 2024 - Mar 2025",
    role: "Marketing & Sales Head",
    icon: Users,
    color: "bg-cyan",
    highlights: [
      "Led end-to-end marketing and sales operations for rapid community and revenue growth.",
      "Grew the BM GP Rating Community from 10,000 to 50,000+ members within 4 months across Telegram and WhatsApp.",
      "Built Telegram channels from 0 to 5,000+ members while maintaining engagement and retention.",
      "Headed 30 sales callers and improved lead conversion and closing performance.",
      "Increased company revenue from Rs. 40,000 to Rs. 3,10,000 within 2 months through structured lead management.",
    ],
  },
  {
    company: "Voodaz",
    period: "Sep 2024 - Nov 2024",
    role: "Marketing & Sales Head",
    icon: BarChart3,
    color: "bg-coral",
    highlights: [
      "Learned and implemented Meta Ads strategies to scale paid campaigns.",
      "Grew the official Facebook page from 1,000 to 7,000+ followers through targeted ad placements and organic engagement.",
      "Analyzed ad performance metrics to optimize CPC, audience targeting, and campaign ROI.",
    ],
  },
  {
    company: "The Jus Anima",
    period: "Mar 2025 - Aug 2025",
    role: "Social Media & Community Growth Manager",
    icon: Megaphone,
    color: "bg-electric",
    highlights: [
      "Scaled a legal education community from 1,500 to 6,000 members in 2 months.",
      "Built structured content planning and daily engagement strategies that produced 300% growth.",
      "Managed posting schedules and improved organic reach with audience-centric legal content.",
    ],
  },
  {
    company: "Cureable",
    period: "Dec 2023 - Mar 2024",
    role: "Content Writer Intern",
    icon: MessageCircle,
    color: "bg-cyan",
    highlights: [
      "Collaborated on written material aligned with inclusivity and empowerment.",
      "Contributed to blog posts, website copy, and landing page content.",
      "Assisted social media captions and awareness campaigns to expand reach and foster community engagement.",
    ],
  },
];

export const skillGroups = [
  {
    title: "Growth",
    items: ["Social Media Marketing", "Lead Generation", "Community Growth", "Sales Tracking"],
  },
  {
    title: "Content",
    items: ["Content Strategy", "Campaign Planning", "Copywriting", "Organic Reach"],
  },
  {
    title: "Leadership",
    items: ["Communication", "Teamwork", "30-Member Team Handling", "Time Management"],
  },
  {
    title: "Analysis",
    items: ["Meta Ads", "CPC Optimization", "ROI Thinking", "Critical Thinking"],
  },
];

export const projects = [
  {
    title: "BM GP Rating Community Scale-Up",
    type: "Community Growth Case Study",
    result: "10k to 50k+ members in 4 months",
    summary:
      "A focused Telegram and WhatsApp growth engine using targeted campaigns, consistent engagement loops, and sales-team coordination.",
    tags: ["Telegram", "WhatsApp", "Growth Loops", "Sales Team"],
    icon: Users,
  },
  {
    title: "Revenue Conversion System",
    type: "Sales Operations Case Study",
    result: "Rs. 40k to Rs. 3.10L in 2 months",
    summary:
      "Structured lead management, caller coordination, and conversion tracking that turned community attention into measurable revenue.",
    tags: ["Lead Management", "Sales Tracking", "Revenue Growth"],
    icon: BadgeIndianRupee,
  },
  {
    title: "Legal Education Community Growth",
    type: "Content-Led Community Case Study",
    result: "300% growth in 2 months",
    summary:
      "Audience-centric legal content, daily engagement rituals, and optimized posting schedules for a student-driven community.",
    tags: ["Legal Content", "Engagement", "Organic Reach"],
    icon: GraduationCap,
  },
  {
    title: "Meta Ads Growth Sprint",
    type: "Paid Growth Case Study",
    result: "1k to 7k+ Facebook followers",
    summary:
      "Campaign targeting, ad placement experiments, and CPC analysis used to grow a Facebook audience with paid and organic support.",
    tags: ["Meta Ads", "CPC", "Facebook", "ROI"],
    icon: Target,
  },
];

export const achievements = [
  {
    title: "Community Builder",
    copy: "Scaled communities across Telegram, WhatsApp, and Facebook with channel strategy and daily engagement systems.",
    icon: Users,
  },
  {
    title: "Revenue-Focused Marketer",
    copy: "Connected content, leads, sales callers, and tracking into a practical conversion machine.",
    icon: TrendingUp,
  },
  {
    title: "Law + Marketing Edge",
    copy: "Currently pursuing BA LLB, bringing research, argument, and audience psychology into growth work.",
    icon: GraduationCap,
  },
];

export const testimonials = [
  {
    quote:
      "Built from CV-backed outcomes: Hasnane's portfolio is positioned around measurable growth, leadership, and community execution.",
    name: "Portfolio positioning note",
    role: "Replace with client or manager testimonial when available",
  },
];
