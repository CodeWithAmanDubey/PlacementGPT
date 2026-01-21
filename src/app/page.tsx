import Link from "next/link";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      <nav className="fixed w-full border-b border-white/10 bg-neutral-950/50 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            PlacementGPT
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/sign-in" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/sign-up" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
          Your AI Placement Copilot
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
          Ace your placements with AI-driven insights
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-12">
          Master interviews, optimize your resume, and close your skill gaps with the smartest placement preparation platform.
        </p>
        
        <div className="flex gap-4">
          <Link href="/sign-up" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105">
            Start Preparing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 text-left w-full">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors">
            <Target className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Job Matcher</h3>
            <p className="text-neutral-400">Discover roles that perfectly align with your skills and aspirations.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors">
            <Zap className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Mock Interviews</h3>
            <p className="text-neutral-400">Practice with AI interviewers tailored to your target company and role.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Resume Analyzer</h3>
            <p className="text-neutral-400">Get instant ATS scores and actionable feedback to stand out.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
