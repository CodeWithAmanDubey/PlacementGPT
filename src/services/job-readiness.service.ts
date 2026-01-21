import { jobReadinessRepository } from "../repositories/job-readiness.repository";
import { userRepository } from "../repositories/user.repository";
import { resumeAnalysisRepository } from "../repositories/resume-analysis.repository";
import { interviewRepository } from "../repositories/interview.repository";
import { jobAnalysisRepository } from "../repositories/job-analysis.repository";
import { calculateReadinessScore } from "../lib/score-engine";
import { toJsonValue } from "../lib/json-serializer";

export class JobReadinessService {
  async computeAndGetScore(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const resume = await resumeAnalysisRepository.findByUserId(userId);
    const interviews = await interviewRepository.findManyByUserId(userId);
    const jobAnalyses = await jobAnalysisRepository.findManyByUserId(userId);

    const latestResumeScore = resume ? (resume.atsScore ?? null) : null;
    
    let averageInterviewScore = null;
    const scoredInterviews = interviews.filter(i => i.score !== null);
    if (scoredInterviews.length > 0) {
      const total = scoredInterviews.reduce((acc, curr) => acc + (curr.score || 0), 0);
      averageInterviewScore = total / scoredInterviews.length;
    }

    const latestJobMatchScore = jobAnalyses.length > 0 ? (jobAnalyses[0].matchScore ?? null) : null;

    const result = calculateReadinessScore({
      user,
      latestResumeScore,
      averageInterviewScore,
      latestJobMatchScore
    });

    const breakdownJson = toJsonValue(result.breakdown);
    const recommendationsJson = toJsonValue(result.recommendations);

    await jobReadinessRepository.upsertScore(userId, result.overallScore, breakdownJson, recommendationsJson);
    await jobReadinessRepository.logHistory(userId, result.overallScore);

    return result;
  }
}

export const jobReadinessService = new JobReadinessService();
