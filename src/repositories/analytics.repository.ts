import { prisma } from "@/lib/prisma";

export class AnalyticsRepository {
  async getResumeHistory(userId: string) {
    return prisma.resumeAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        createdAt: true,
        atsScore: true
      }
    });
  }

  async getInterviewHistory(userId: string) {
    return prisma.interviewSession.findMany({
      where: { userId, score: { not: null } },
      orderBy: { createdAt: "asc" },
      select: {
        createdAt: true,
        score: true
      }
    });
  }

  async getJobMatchHistory(userId: string) {
    return prisma.jobAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        createdAt: true,
        matchScore: true
      }
    });
  }

  async getReadinessHistory(userId: string) {
    return prisma.jobReadinessHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        createdAt: true,
        overallScore: true
      }
    });
  }
}

export const analyticsRepository = new AnalyticsRepository();
