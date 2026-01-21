export interface ScoreEngineInput {
  user: {
    college?: string | null;
    branch?: string | null;
    cgpa?: number | null;
    targetRole?: string | null;
  };
  latestResumeScore: number | null;
  averageInterviewScore: number | null;
  latestJobMatchScore: number | null;
}

export interface ReadinessBreakdown {
  resumeAnalysis: number;      // max 30
  interviewPerformance: number; // max 40
  profileCompletion: number;   // max 15
  jobMatch: number;            // max 15
}

export interface ReadinessResult {
  overallScore: number;
  breakdown: ReadinessBreakdown;
  recommendations: string[];
}

export function calculateReadinessScore(input: ScoreEngineInput): ReadinessResult {
  const recommendations: string[] = [];
  
  // 1. Profile Completion (max 15 points)
  let profileScore = 0;
  if (input.user.college) profileScore += 3.75;
  if (input.user.branch) profileScore += 3.75;
  if (input.user.cgpa) profileScore += 3.75;
  if (input.user.targetRole) profileScore += 3.75;

  let resumeComponent = 0;
  if (input.latestResumeScore !== null) {
    resumeComponent = (input.latestResumeScore / 100) * 30;
  }

  let interviewComponent = 0;
  if (input.averageInterviewScore !== null) {
    interviewComponent = (input.averageInterviewScore / 100) * 40;
  }

  let matchComponent = 0;
  if (input.latestJobMatchScore !== null) {
    matchComponent = (input.latestJobMatchScore / 100) * 15;
  }
  
  const overallScore = Math.round(profileScore + resumeComponent + interviewComponent + matchComponent);

  if (overallScore < 50) {
    recommendations.push("Your readiness score is critically low. Focus on uploading a complete resume, practicing basic mock interviews, and filling out your profile completely.");
  } else if (overallScore < 75) {
    recommendations.push("You are on the right track, but there are clear gaps. Improve your ATS scores by tailoring your resume, and refine your interview answers for clarity and depth.");
  } else {
    recommendations.push("Excellent work! You are highly job-ready. Keep practicing advanced interview questions and applying to roles matching your semantic profile.");
  }

  return {
    overallScore,
    breakdown: {
      profileCompletion: Math.round(profileScore),
      resumeAnalysis: Math.round(resumeComponent),
      interviewPerformance: Math.round(interviewComponent),
      jobMatch: Math.round(matchComponent),
    },
    recommendations
  };
}
