import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { jobAnalysisService } from "@/services/job-analysis.service";
import { JobMatcherForm } from "./JobMatcherForm";
import { Target, CheckCircle2, XCircle, Building2, Briefcase, GraduationCap, Code2, FolderGit2 } from "lucide-react";
import { PrioritizedSkill } from "@/lib/semantic-matcher";
import { userService } from "@/services/user.service";
import { z } from "zod";

const prioritizedSkillSchema = z.array(z.object({
  skill: z.string(),
  priority: z.enum(["High", "Medium", "Low"])
}));

export default async function JobMatcherPage() {
  const { userId: clerkId } = await auth();
  const clerkUser = await currentUser();

  if (!clerkId || !clerkUser) {
    redirect("/sign-in");
  }

  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
  const user = await userService.getOrCreateUser(clerkId, primaryEmail, name);

  const latestAnalysis = await jobAnalysisService.getLatestJobAnalysis(user.id);

  let missingSkills: PrioritizedSkill[] = [];
  if (latestAnalysis && latestAnalysis.missingSkills) {
    const parsed = prioritizedSkillSchema.safeParse(latestAnalysis.missingSkills);
    if (parsed.success) {
      missingSkills = parsed.data as PrioritizedSkill[];
    } else {
      console.error("Failed to parse missingSkills JSON:", parsed.error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Job Matcher Engine</h1>
        <p className="text-neutral-400">Deep semantic analysis comparing your resume against any job description.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <JobMatcherForm />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {latestAnalysis ? (
            <>
              {/* Top Banner: Score & Roles */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{latestAnalysis.jobTitle}</h2>
                    <p className="text-neutral-400 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> {latestAnalysis.companyName}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {latestAnalysis.roleInsights.map((role) => (
                        <span key={role} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-5xl font-black text-white">{latestAnalysis.matchScore}<span className="text-2xl text-neutral-500">%</span></div>
                    <p className="text-sm text-neutral-400 font-medium uppercase tracking-widest mt-1">Overall Match</p>
                  </div>
                </div>
              </div>

              {/* Match Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard title="Skills" score={latestAnalysis.skillMatch} icon={<Code2 className="w-4 h-4" />} />
                <ScoreCard title="Projects" score={latestAnalysis.projectMatch} icon={<FolderGit2 className="w-4 h-4" />} />
                <ScoreCard title="Experience" score={latestAnalysis.experienceMatch} icon={<Briefcase className="w-4 h-4" />} />
                <ScoreCard title="Education" score={latestAnalysis.educationMatch} icon={<GraduationCap className="w-4 h-4" />} />
              </div>

              {/* Strengths & Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Verified Strengths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {latestAnalysis.strengths.length > 0 ? (
                      latestAnalysis.strengths.map((skill) => (
                        <span key={skill} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 text-sm font-medium border border-emerald-500/20">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500">No key matching strengths detected.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-red-400 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" /> Skill Gaps
                  </h3>
                  <div className="flex flex-col gap-3">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((m) => (
                        <div key={m.skill} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                          <span className="text-sm font-medium text-white capitalize">{m.skill}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            m.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                            m.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-neutral-500/20 text-neutral-400'
                          }`}>
                            {m.priority} Priority
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500">You fulfill all technical skill requirements!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              {missingSkills.length > 0 && (
                <div className="bg-indigo-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 text-white/10">
                    <Target className="w-40 h-40" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg mb-1">Bridge the Skill Gap</h3>
                    <p className="text-indigo-100 text-sm max-w-md">
                      We&apos;ve created a custom learning roadmap targeting your High and Medium priority missing skills.
                    </p>
                  </div>
                  <a href="/dashboard/skill-gap" className="relative z-10 whitespace-nowrap bg-white text-indigo-600 font-bold py-2.5 px-6 rounded-xl hover:bg-neutral-100 transition-colors">
                    View Roadmap
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-[500px]">
              <Target className="w-16 h-16 text-neutral-600 mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Awaiting Job Description</h3>
              <p className="text-neutral-400 max-w-sm">
                Paste a job description in the form to generate a deep semantic match breakdown of your resume.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ title, score, icon }: { title: string, score: number, icon: React.ReactNode }) {
  // Determine color based on score
  const colorClass = score >= 80 ? "text-emerald-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const bgClass = score >= 80 ? "bg-emerald-500/10" : score >= 50 ? "bg-amber-500/10" : "bg-red-500/10";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center">
      <div className={`w-10 h-10 rounded-full ${bgClass} ${colorClass} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-black text-white mb-1">{score}%</div>
      <div className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">{title}</div>
    </div>
  );
}
