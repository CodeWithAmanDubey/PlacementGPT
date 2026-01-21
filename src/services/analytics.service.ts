import { analyticsRepository } from "../repositories/analytics.repository";

export class AnalyticsService {
  private formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  async getAnalyticsDash(userId: string) {
    const [resumes, interviews, jobs, readiness] = await Promise.all([
      analyticsRepository.getResumeHistory(userId),
      analyticsRepository.getInterviewHistory(userId),
      analyticsRepository.getJobMatchHistory(userId),
      analyticsRepository.getReadinessHistory(userId)
    ]);

    const resumeTrend = resumes
      .filter(r => r.atsScore !== null)
      .map(r => ({
        date: this.formatDate(r.createdAt),
        score: r.atsScore as number
      }));

    const interviewTrend = interviews
      .filter(i => i.score !== null)
      .map(i => ({
        date: this.formatDate(i.createdAt),
        score: i.score as number
      }));

    const matchTrend = jobs.map(j => ({
      date: this.formatDate(j.createdAt),
      score: j.matchScore
    }));

    const readinessTrend = readiness.map(r => ({
      date: this.formatDate(r.createdAt),
      score: r.overallScore
    }));

    return {
      resumeTrend,
      interviewTrend,
      matchTrend,
      readinessTrend
    };
  }
}

export const analyticsService = new AnalyticsService();
