import { extractSkills, SkillCategory } from "./skill-extractor";

export type SkillPriority = "High" | "Medium" | "Low";

export interface PrioritizedSkill {
  skill: string;
  priority: SkillPriority;
}

export interface SemanticMatchResult {
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  projectMatch: number;
  educationMatch: number;
  missingSkills: PrioritizedSkill[];
  strengths: string[];
  roleInsights: string[];
}

function assignPriority(category: SkillCategory): SkillPriority {
  switch (category) {
    case "Languages":
    case "Frameworks":
      return "High";
    case "Databases":
    case "Cloud":
      return "Medium";
    case "DevOps":
    case "System Design":
      return "Low";
    default:
      return "Medium";
  }
}

function detectRoleInsights(jdText: string): string[] {
  const insights: string[] = [];
  const normalized = jdText.toLowerCase();

  const frontendKeywords = ["react", "vue", "angular", "css", "html", "frontend", "front-end", "ui/ux"];
  const backendKeywords = ["node", "java", "python", "sql", "backend", "back-end", "api"];
  const aiKeywords = ["machine learning", "ai", "artificial intelligence", "pytorch", "tensorflow", "nlp"];
  const mobileKeywords = ["react native", "flutter", "ios", "android", "swift", "kotlin", "mobile"];

  const hasFrontend = frontendKeywords.some(k => normalized.includes(k));
  const hasBackend = backendKeywords.some(k => normalized.includes(k));
  
  if (hasFrontend && hasBackend) {
    insights.push("Full Stack Role");
  } else if (hasFrontend) {
    insights.push("Frontend Role");
  } else if (hasBackend) {
    insights.push("Backend Role");
  }

  if (aiKeywords.some(k => normalized.includes(k))) insights.push("AI/ML Role");
  if (mobileKeywords.some(k => normalized.includes(k))) insights.push("Mobile Role");

  return insights.length > 0 ? insights : ["Software Engineering Role"];
}

function calculateSectionMatch(resumeText: string, jdText: string, keywords: string[]): number {
  const normResume = resumeText.toLowerCase();
  const normJD = jdText.toLowerCase();

  // If JD doesn't mention these keywords, we assume a neutral/perfect score for this section to not penalize
  const jdHasKeywords = keywords.some(k => normJD.includes(k));
  if (!jdHasKeywords) return 100;

  // If JD has them, check if Resume also has them
  const resumeHasKeywords = keywords.some(k => normResume.includes(k));
  return resumeHasKeywords ? 100 : 0;
}

export function semanticMatch(resumeText: string, jobDescription: string): SemanticMatchResult {
  const jdSkills = extractSkills(jobDescription);
  const resumeSkills = extractSkills(resumeText);

  const missingSkills: PrioritizedSkill[] = [];
  const strengths: string[] = [];

  const resumeSkillNames = new Set(resumeSkills.map(s => s.name));

  // Determine strengths and missing skills based on what the JD asks for
  jdSkills.forEach(jdSkill => {
    if (resumeSkillNames.has(jdSkill.name)) {
      if (!strengths.includes(jdSkill.name)) strengths.push(jdSkill.name);
    } else {
      if (!missingSkills.some(m => m.skill === jdSkill.name)) {
        missingSkills.push({
          skill: jdSkill.name,
          priority: assignPriority(jdSkill.category)
        });
      }
    }
  });

  // Calculate Skill Match (40% weight)
  const totalJDSkills = jdSkills.length > 0 ? Array.from(new Set(jdSkills.map(s => s.name))).length : 0;
  let skillMatch = 100;
  if (totalJDSkills > 0) {
    skillMatch = Math.round((strengths.length / totalJDSkills) * 100);
  }

  // Calculate Experience Match (20% weight)
  const expKeywords = ["experience", "years", "senior", "junior", "lead", "staff"];
  const experienceMatch = calculateSectionMatch(resumeText, jobDescription, expKeywords);

  // Calculate Project Match (25% weight)
  const projKeywords = ["project", "portfolio", "github", "deployed", "production"];
  const projectMatch = calculateSectionMatch(resumeText, jobDescription, projKeywords);

  // Calculate Education Match (15% weight)
  const eduKeywords = ["bachelor", "master", "phd", "degree", "computer science", "university"];
  const educationMatch = calculateSectionMatch(resumeText, jobDescription, eduKeywords);

  // Weighted Final Match Score
  const finalMatchScore = Math.round(
    (skillMatch * 0.40) +
    (projectMatch * 0.25) +
    (experienceMatch * 0.20) +
    (educationMatch * 0.15)
  );

  const roleInsights = detectRoleInsights(jobDescription);

  return {
    overallScore: Math.max(0, Math.min(100, finalMatchScore)),
    skillMatch,
    experienceMatch,
    projectMatch,
    educationMatch,
    missingSkills,
    strengths,
    roleInsights
  };
}
