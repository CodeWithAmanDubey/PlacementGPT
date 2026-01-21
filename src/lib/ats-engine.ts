import {
  TARGET_KEYWORDS,
  SKILL_KEYWORDS,
  EXPERIENCE_KEYWORDS,
  EDUCATION_KEYWORDS,
  PROJECT_KEYWORDS
} from "./ats-rules";

export interface ATSResult {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
}

export function analyzeResume(text: string): ATSResult {
  const normalizedText = text.toLowerCase();
  
  let skillsScore = 0;
  let projectsScore = 0;
  let experienceScore = 0;
  let educationScore = 0;
  let keywordDensityScore = 0;
  
  const missingKeywords: string[] = [];
  const suggestions: string[] = [];

  // Skills (30)
  let foundSkills = 0;
  SKILL_KEYWORDS.forEach(skill => {
    if (normalizedText.includes(skill.toLowerCase())) foundSkills++;
  });
  skillsScore = Math.min(30, (foundSkills / 10) * 30);
  
  if (skillsScore < 20) {
    suggestions.push("Add more relevant technical skills to your resume.");
  }

  // Projects (25)
  const hasProjectsSection = PROJECT_KEYWORDS.some(kw => normalizedText.includes(kw));
  if (hasProjectsSection) {
    projectsScore = 25;
  } else {
    suggestions.push("Consider adding a dedicated 'Projects' section to showcase your work.");
  }

  // Experience (20)
  const hasExperienceSection = EXPERIENCE_KEYWORDS.some(kw => normalizedText.includes(kw));
  if (hasExperienceSection) {
    experienceScore = 20;
  } else {
    suggestions.push("Ensure your work experience or internships are clearly labeled.");
  }

  // Education (15)
  const hasEducationSection = EDUCATION_KEYWORDS.some(kw => normalizedText.includes(kw));
  if (hasEducationSection) {
    educationScore = 15;
  } else {
    suggestions.push("Your education details are missing or not clearly labeled.");
  }

  // Missing Keywords Engine & Keyword Density (10)
  TARGET_KEYWORDS.forEach(kw => {
    if (!normalizedText.includes(kw.toLowerCase())) {
      missingKeywords.push(kw);
    }
  });
  
  keywordDensityScore = Math.max(0, 10 - missingKeywords.length * 2);

  const totalScore = Math.round(skillsScore + projectsScore + experienceScore + educationScore + keywordDensityScore);

  if (missingKeywords.length > 0) {
    suggestions.push(`Consider adding these missing keywords if you have experience with them: ${missingKeywords.join(", ")}`);
  }

  return {
    score: totalScore,
    missingKeywords,
    suggestions
  };
}
