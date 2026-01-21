import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class JobAnalysisRepository {
  async findManyByUserId(userId: string) {
    return prisma.jobAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findLatestByUserId(userId: string) {
    return prisma.jobAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: {
    userId: string;
    jobTitle: string;
    companyName: string;
    jobDescription: string;
    matchScore: number;
    skillMatch: number;
    experienceMatch: number;
    projectMatch: number;
    educationMatch: number;
    roleInsights: string[];
    missingSkills: Prisma.InputJsonValue;
    strengths: string[];
    learningRoadmap: Prisma.InputJsonValue;
  }) {
    return prisma.jobAnalysis.create({
      data,
    });
  }
}

export const jobAnalysisRepository = new JobAnalysisRepository();
