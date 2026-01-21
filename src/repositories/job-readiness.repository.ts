import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class JobReadinessRepository {
  async getScore(userId: string) {
    return prisma.jobReadinessScore.findUnique({
      where: { userId },
    });
  }

  async upsertScore(userId: string, overallScore: number, breakdown: Prisma.InputJsonValue, recommendations: Prisma.InputJsonValue) {
    return prisma.jobReadinessScore.upsert({
      where: { userId },
      update: { overallScore, breakdown, recommendations },
      create: { userId, overallScore, breakdown, recommendations },
    });
  }

  async logHistory(userId: string, overallScore: number) {
    return prisma.jobReadinessHistory.create({
      data: {
        userId,
        overallScore
      }
    });
  }
}

export const jobReadinessRepository = new JobReadinessRepository();
