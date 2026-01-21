import { semanticMatch } from "../lib/semantic-matcher";
import { generateRoadmap } from "../lib/roadmap-engine";
import { jobAnalysisRepository } from "../repositories/job-analysis.repository";
import { resumeAnalysisRepository } from "../repositories/resume-analysis.repository";
import { toJsonValue } from "../lib/json-serializer";

export class JobAnalysisService {
  async processJobMatch(userId: string, jobTitle: string, companyName: string, jobDescription: string) {
    // 1. Fetch Latest Resume
    const latestResume = await resumeAnalysisRepository.findByUserId(userId);
    if (!latestResume || !latestResume.rawText) {
      throw new Error("No resume found or missing text. Please upload a resume first.");
    }

    // 2. Run Match Engine
    const matchResult = semanticMatch(latestResume.rawText, jobDescription);

    // 3. Generate Learning Roadmap for missing skills
    const missingSkillNames = matchResult.missingSkills.map(m => m.skill);
    const roadmap = generateRoadmap(missingSkillNames);

    // 4. Save to DB
    const analysis = await jobAnalysisRepository.create({
      userId,
      jobTitle,
      companyName,
      jobDescription,
      matchScore: matchResult.overallScore,
      skillMatch: matchResult.skillMatch,
      experienceMatch: matchResult.experienceMatch,
      projectMatch: matchResult.projectMatch,
      educationMatch: matchResult.educationMatch,
      roleInsights: matchResult.roleInsights,
      missingSkills: toJsonValue(matchResult.missingSkills),
      strengths: matchResult.strengths,
      learningRoadmap: toJsonValue(roadmap),
    });

    return analysis;
  }

  async getLatestJobAnalysis(userId: string) {
    return jobAnalysisRepository.findLatestByUserId(userId);
  }

  async getAllJobAnalyses(userId: string) {
    return jobAnalysisRepository.findManyByUserId(userId);
  }
}

export const jobAnalysisService = new JobAnalysisService();
