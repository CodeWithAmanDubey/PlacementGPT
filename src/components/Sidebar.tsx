"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Video, 
  Building2, 
  LineChart, 
  PieChart, 
  Settings,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Analyzer", href: "/dashboard/resume", icon: FileText },
  { name: "Job Matcher", href: "/dashboard/job-matcher", icon: Briefcase },
  { name: "Mock Interview", href: "/dashboard/interview", icon: Video },
  { name: "Company Prep", href: "/dashboard/company", icon: Building2 },
  { name: "Skill Gap Analysis", href: "/dashboard/skill-gap", icon: LineChart },
  { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-neutral-950 hidden lg:flex flex-col h-screen fixed top-0 left-0">
      <div className="h-16 border-b border-white/10 flex items-center px-6">
        <Link href="/dashboard" className="font-bold text-xl flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          PlacementGPT
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
