import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { resumeAnalysisService } from "@/services/resume-analysis.service";
import { UploadZone } from "./UploadZone";
import { userService } from "@/services/user.service";
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Lightbulb,
  Calendar
} from "lucide-react";

export default async function ResumePage() {
  const { userId: clerkId } = await auth();
  const clerkUser = await currentUser();

  if (!clerkId || !clerkUser) {
    redirect("/sign-in");
  }

  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
  const user = await userService.getOrCreateUser(clerkId, primaryEmail, name);

  const analysis = await resumeAnalysisService.getLatestAnalysis(user.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Analyzer</h1>
          <p className="text-neutral-400">Upload your resume to get instant ATS feedback.</p>
        </div>
      </div>

      {!analysis ? (
        <div className="pt-8">
          <UploadZone />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upload New Resume CTA */}
          <div className="flex justify-end">
             <details className="group">
                <summary className="list-none cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Upload New Resume
                </summary>
                <div className="mt-4 absolute right-6 left-6 lg:left-72 z-10 bg-neutral-950 border border-white/10 p-6 rounded-xl shadow-2xl">
                   <UploadZone />
                </div>
             </details>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ATS Score Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-1 flex flex-col items-center justify-center text-center">
              <h3 className="text-neutral-400 font-medium mb-6">ATS Compatibility Score</h3>
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * (analysis.atsScore || 0)) / 100}
                    className={`transition-all duration-1000 ${
                      (analysis.atsScore || 0) >= 80 ? 'text-emerald-500' : 
                      (analysis.atsScore || 0) >= 50 ? 'text-amber-500' : 'text-red-500'
                    }`} 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-bold">{analysis.atsScore}</span>
                  <span className="text-neutral-400 text-sm">/ 100</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm">
                <div className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-medium">
                  {analysis.status}
                </div>
              </div>
            </div>

            {/* Details & Keywords */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-lg">{analysis.fileName}</h3>
                  <span className="ml-auto text-sm text-neutral-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Missing Critical Keywords
                    </h4>
                    {analysis.missingKeywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map(kw => (
                          <span key={kw} className="px-3 py-1 rounded-md bg-red-500/10 text-red-400 text-sm border border-red-500/20">
                            {kw}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Great job! No critical keywords missing.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-neutral-400 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-indigo-400" /> Improvement Suggestions
                    </h4>
                    <ul className="space-y-3">
                      {analysis.suggestions.length > 0 ? (
                        analysis.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex gap-3 text-sm text-neutral-300">
                            <XCircle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                            <span>{suggestion}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex gap-3 text-sm text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>Your resume follows all structural best practices!</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
