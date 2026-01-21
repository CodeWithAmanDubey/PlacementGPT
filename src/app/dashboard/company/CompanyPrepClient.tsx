"use client";

import { useState } from "react";
import { Search, Building2, BookOpen, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

type CompanyInsight = {
  name: string;
  rounds: string[];
  techFocus: string[];
  behavioral: string[];
};

const MOCK_INSIGHTS: Record<string, CompanyInsight> = {
  "google": {
    name: "Google",
    rounds: ["Phone Screen (45 min)", "Onsite: 4-5 Coding Rounds (Data Structures & Algorithms)", "Onsite: 1 System Design (For L4+)", "Onsite: 1 Googleyness & Leadership"],
    techFocus: ["Graphs & Trees", "Dynamic Programming", "System Scalability", "Concurrency"],
    behavioral: ["Navigating Ambiguity", "Working with difficult teammates", "Taking initiative beyond scope"],
  },
  "microsoft": {
    name: "Microsoft",
    rounds: ["Codility Online Assessment", "1-2 Technical Phone Screens", "Onsite: 3-4 Coding & System Design", "As-Appropriate (AA) round with a senior leader"],
    techFocus: ["Arrays & Strings", "Linked Lists", "Object Oriented Design", "C# / Java basics"],
    behavioral: ["Growth Mindset", "Customer Obsession", "Diversity and Inclusion"],
  },
  "amazon": {
    name: "Amazon",
    rounds: ["Online Assessment (Debugging, Coding, Work Style)", "Phone Screen", "Onsite: 4 Rounds (Mixed Coding & System Design)"],
    techFocus: ["Hash Maps", "Breadth-First Search", "Object Oriented Design", "Scalable Architectures"],
    behavioral: ["Customer Obsession", "Deliver Results", "Ownership", "Dive Deep (STAR format essential)"],
  },
  "meta": {
    name: "Meta",
    rounds: ["Initial Phone Screen (2 Leetcode questions)", "Onsite: 2 Coding Rounds (Speed and Accuracy)", "Onsite: 1 System/Product Design", "Onsite: 1 Behavioral (Jedi)"],
    techFocus: ["Arrays", "Strings", "Fast & Slow Pointers", "Product Design (API design)"],
    behavioral: ["Resolving conflict", "Prioritization", "Moving fast"],
  }
};

const DEFAULT_INSIGHT: CompanyInsight = {
  name: "Generic Tech Company",
  rounds: ["Initial HR Screen", "Technical Assessment / Take-home", "1-2 Technical Interviews", "Final Culture Fit / Manager Round"],
  techFocus: ["Core Data Structures", "REST API Design", "Database Modeling", "Language-specific knowledge"],
  behavioral: ["Past project deep-dives", "Strengths and weaknesses", "Why this company?"],
};

export function CompanyPrepClient() {
  const [query, setQuery] = useState("");
  const [insight, setInsight] = useState<CompanyInsight | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().trim();
      const match = Object.keys(MOCK_INSIGHTS).find(k => normalizedQuery.includes(k) || k.includes(normalizedQuery));
      
      if (match) {
        setInsight(MOCK_INSIGHTS[match]);
      } else {
        setInsight({ ...DEFAULT_INSIGHT, name: query });
      }
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-2xl">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a company (e.g. Google, Amazon, StartupX)..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-32 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-lg"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Results */}
      {insight && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="col-span-full bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{insight.name} Interview Guide</h2>
              <p className="text-neutral-400">Aggregated insights from recent candidate experiences.</p>
            </div>
            <Link 
              href="/dashboard/interview"
              className="hidden sm:flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-neutral-100 transition-colors"
            >
              Start Mock Interview <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Interview Process
            </h3>
            <ul className="space-y-3">
              {insight.rounds.map((round, i) => (
                <li key={i} className="flex gap-3 text-sm text-neutral-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="mt-0.5">{round}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Technical Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {insight.techFocus.map((topic, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 text-sm font-medium border border-emerald-500/20">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" /> Behavioral Prep
            </h3>
            <div className="flex flex-col gap-3">
              {insight.behavioral.map((topic, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/20 border border-amber-500/10 text-sm text-neutral-300">
                  {topic}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
