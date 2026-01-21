import { interviewRepository } from "../repositories/interview.repository";
import { generateQuestions, scoreAnswers, AnswerSubmission, MockQuestion } from "../lib/interview-engine";
import { toJsonValue } from "../lib/json-serializer";
import { z } from "zod";

const mockQuestionSchema = z.array(z.object({
  id: z.string(),
  text: z.string(),
  expectedKeywords: z.array(z.string())
}));

export class InterviewService {
  async getInterviews(userId: string) {
    return interviewRepository.findManyByUserId(userId);
  }

  async getAverageScore(userId: string) {
    const interviews = await this.getInterviews(userId);
    if (!interviews || interviews.length === 0) return null;
    
    const scoredInterviews = interviews.filter(i => i.score !== null);
    if (scoredInterviews.length === 0) return null;

    const total = scoredInterviews.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return {
      average: total / scoredInterviews.length,
      count: scoredInterviews.length
    };
  }

  async startInterview(userId: string, role: string, company: string, difficulty: string) {
    const questions = generateQuestions(role, difficulty);
    
    // Save to DB
    const session = await interviewRepository.createSession(
      userId,
      role,
      company,
      difficulty,
      toJsonValue(questions)
    );

    return {
      sessionId: session.id,
      questions
    };
  }

  async submitInterview(sessionId: string, answers: AnswerSubmission[]) {
    // Fetch the session to get the questions
    const session = await interviewRepository.findById(sessionId);
    if (!session || !session.questions) {
      throw new Error("Session not found or missing questions");
    }

    const parsedQuestions = mockQuestionSchema.safeParse(session.questions);
    if (!parsedQuestions.success) {
      throw new Error("Invalid questions format in database.");
    }
    const questions = parsedQuestions.data as MockQuestion[];
    
    const result = scoreAnswers(questions, answers);

    // Build the feedback payload containing strengths, weaknesses, and tips
    const feedbackPayload = JSON.stringify({
      message: result.feedback,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      tips: result.tips
    });

    const updatedSession = await interviewRepository.updateSession(
      sessionId,
      toJsonValue(answers),
      result.score,
      feedbackPayload
    );

    return {
      score: updatedSession.score,
      feedback: result.feedback,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      tips: result.tips
    };
  }
}

export const interviewService = new InterviewService();
