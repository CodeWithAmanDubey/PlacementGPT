import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { jobAnalysisService } from "@/services/job-analysis.service";
import { BookOpen, Target, ArrowRight, CheckCircle2 } from "lucide-react";
import { SkillRoadmap } from "@/lib/roadmap-engine";
import { userService } from "@/services/user.service";
import { z } from "zod";

const roadmapStepSchema = z.object({
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  title: z.string(),
  description: z.string()
});

const roadmapSchema = z.array(z.object({
  skill: z.string(),
  steps: z.array(roadmapStepSchema)
}));

export default async function SkillGapPage() {
  const { userId: clerkId } = await auth();
  const clerkUser = await currentUser();

  if (!clerkId || !clerkUser) {
    redirect("/sign-in");
  }

  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
  const user = await userService.getOrCreateUser(clerkId, primaryEmail, name);

  const latestAnalysis = await jobAnalysisService.getLatestJobAnalysis(user.id);

  if (!latestAnalysis || !latestAnalysis.learningRoadmap) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Target className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Skill Gap Data Found</h1>
        <p className="text-neutral-400 mb-6">
          You need to analyze a job description first to generate a personalized learning roadmap.
        </p>
        <a href="/dashboard/job-matcher" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
          Go to Job Matcher <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  const parsedRoadmap = roadmapSchema.safeParse(latestAnalysis.learningRoadmap);
  const roadmapData: SkillRoadmap[] = parsedRoadmap.success ? (parsedRoadmap.data as SkillRoadmap[]) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Learning Roadmap</h1>
        <p className="text-neutral-400">Your personalized path to bridge the skill gap for: <span className="text-white font-medium">{latestAnalysis.jobTitle} at {latestAnalysis.companyName}</span></p>
      </div>

      {roadmapData.length === 0 ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">You&apos;re Fully Prepared!</h2>
          <p className="text-emerald-200/70 max-w-md">
            Our analysis shows you have all the core skills required for this job. You&apos;re ready to apply!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {roadmapData.map((roadmap, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold capitalize text-white">Mastering {roadmap.skill}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roadmap.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="bg-black/20 rounded-xl p-5 border border-white/5 hover:border-indigo-500/30 transition-colors">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                      Step {stepIdx + 1}: {step.level}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
