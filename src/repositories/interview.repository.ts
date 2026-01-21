import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class InterviewRepository {
  async createSession(userId: string, role: string, company: string, difficulty: string, questions: Prisma.InputJsonValue) {
    return prisma.interviewSession.create({
      data: {
        userId,
        role,
        company,
        difficulty,
        questions,
      }
    });
  }

  async updateSession(sessionId: string, answers: Prisma.InputJsonValue, score: number, feedback: string) {
    return prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        answers,
        score,
        feedback
      }
    });
  }

  async findById(sessionId: string) {
    return prisma.interviewSession.findUnique({
      where: { id: sessionId }
    });
  }

  async findManyByUserId(userId: string) {
    return prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const interviewRepository = new InterviewRepository();
