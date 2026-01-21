import { extractDocxText, extractPdfText } from "../lib/resume-parser";
import { analyzeResume } from "../lib/ats-engine";
import { resumeAnalysisRepository } from "../repositories/resume-analysis.repository";
import { storageService } from "./storage.service";
import path from "path";

export class ResumeAnalysisService {
  async processResume(userId: string, file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const ext = path.extname(fileName).toLowerCase() || "";

    // 1. Save File to Disk via Storage Service
    const fileUrl = await storageService.saveFile(buffer, ext);

    // 2. Extract Text
    let rawText = "";
    if (ext === ".pdf") {
      rawText = await extractPdfText(buffer);
    } else if (ext === ".docx") {
      rawText = await extractDocxText(buffer);
    } else {
      throw new Error("Unsupported file type");
    }

    // 3. Analyze Text (ATS Engine)
    const atsResult = analyzeResume(rawText);

    // 4. Save to Database
    const analysis = await resumeAnalysisRepository.create({
      userId,
      fileName,
      fileUrl,
      rawText,
      atsScore: atsResult.score,
      status: "ANALYZED",
      missingKeywords: atsResult.missingKeywords,
      suggestions: atsResult.suggestions,
    });

    return analysis;
  }

  async getLatestAnalysis(userId: string) {
    return resumeAnalysisRepository.findByUserId(userId);
  }
}

export const resumeAnalysisService = new ResumeAnalysisService();
