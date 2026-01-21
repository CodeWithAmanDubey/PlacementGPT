import { prisma } from "@/lib/prisma";

export class ResumeAnalysisRepository {
  async findByUserId(userId: string) {
    return prisma.resumeAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: { userId: string; fileName: string; fileUrl: string; rawText: string; atsScore: number; status: string; missingKeywords: string[]; suggestions: string[] }) {
    return prisma.resumeAnalysis.create({
      data,
    });
  }
}

export const resumeAnalysisRepository = new ResumeAnalysisRepository();
