import { 
  CheckCircle2, 
  FileText, 
  Trophy, 
  Target, 
  AlertCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { resumeAnalysisService } from "@/services/resume-analysis.service";
import { interviewService } from "@/services/interview.service";
import { jobReadinessService } from "@/services/job-readiness.service";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  const clerkUser = await currentUser();

  if (!clerkId || !clerkUser) {
    redirect("/sign-in");
  }

  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
  const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

  const user = await userService.getOrCreateUser(clerkId, primaryEmail, name);

  const [resumeAnalysis, interviewData, readiness] = await Promise.all([
    resumeAnalysisService.getLatestAnalysis(user.id),
    interviewService.getAverageScore(user.id),
    jobReadinessService.computeAndGetScore(user.id)
  ]);

  // Calculate profile completion locally for the card (though readiness has it too)
  const profileFields = [user.name, user.college, user.branch, user.cgpa, user.targetRole];
  const filledFields = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((filledFields / profileFields.length) * 100) || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user.name || 'User'}!</h1>
        <p className="text-neutral-400">Here is an overview of your placement preparation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Completion */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h3 className="text-neutral-400 text-sm font-medium mb-1">Profile Completion</h3>
          <div className="text-3xl font-bold mb-4">{profileCompletion}%</div>
          <div className="w-full bg-neutral-800 rounded-full h-2 mb-2">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
          </div>
          {profileCompletion < 100 && (
            <p className="text-xs text-neutral-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Complete profile in settings
            </p>
          )}
        </div>

        {/* Resume Status */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <FileText className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h3 className="text-neutral-400 text-sm font-medium mb-1">Resume Status</h3>
          {resumeAnalysis ? (
            <>
              <div className="text-xl font-bold mb-2">{resumeAnalysis.status}</div>
              {resumeAnalysis.atsScore !== null && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                  ATS Score: {resumeAnalysis.atsScore}/100
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-neutral-500 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> No data available
              </span>
            </div>
          )}
        </div>

        {/* Interview Score */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h3 className="text-neutral-400 text-sm font-medium mb-1">Avg. Interview Score</h3>
          {interviewData ? (
            <>
              <div className="text-3xl font-bold mb-2">{interviewData.average.toFixed(1)}<span className="text-lg text-neutral-500">/100</span></div>
              <p className="text-xs text-neutral-500">Based on {interviewData.count} mock interviews</p>
            </>
          ) : (
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-neutral-500 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> No data available
              </span>
            </div>
          )}
        </div>

        {/* Job Readiness Engine UI */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:col-span-2 lg:col-span-3">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Overall Score */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-indigo-500/10 rounded-full mb-4">
                <Target className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Job Readiness Score</h3>
              <p className="text-neutral-400 text-sm mb-6 max-w-sm">
                A composite metric analyzing your resume strength, interview performance, and profile completeness.
              </p>
              
              <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-neutral-800 mb-2">
                <div 
                  className="absolute inset-[-8px] rounded-full border-8 border-transparent border-t-indigo-500 border-r-indigo-500 rotate-45 transition-all duration-1000"
                  style={{ transform: `rotate(${(readiness.overallScore / 100) * 360 - 90}deg)` }}
                />
                <div className="text-5xl font-black text-white">{readiness.overallScore}</div>
              </div>
              <div className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-2">Overall Score</div>
            </div>

            {/* Right Column: Breakdown & Recommendations */}
            <div className="flex-[2] space-y-8">
              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  Score Breakdown <span className="text-xs font-normal text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">Weighted</span>
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-300">Resume Analysis (30%)</span>
                      <span className="font-bold">{readiness.breakdown.resumeAnalysis} / 30</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(readiness.breakdown.resumeAnalysis / 30) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-300">Interview Performance (40%)</span>
                      <span className="font-bold">{readiness.breakdown.interviewPerformance} / 40</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(readiness.breakdown.interviewPerformance / 40) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-300">Job Matches (15%)</span>
                      <span className="font-bold">{readiness.breakdown.jobMatch} / 15</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(readiness.breakdown.jobMatch / 15) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-neutral-300">Profile Completion (15%)</span>
                      <span className="font-bold">{readiness.breakdown.profileCompletion} / 15</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(readiness.breakdown.profileCompletion / 15) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-3">Actionable Recommendations</h4>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5">
                  <ul className="space-y-3">
                    {readiness.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-indigo-100 flex items-start gap-3 leading-relaxed">
                        <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
