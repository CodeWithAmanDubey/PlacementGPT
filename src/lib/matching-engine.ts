export interface MatchResult {
  matchScore: number;
  missingSkills: string[];
  strengths: string[];
}

const COMMON_TECH_SKILLS = [
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust",
  "react", "angular", "vue", "next.js", "node.js", "express", "django", "flask",
  "spring", "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
  "docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "jenkins", "github actions",
  "system design", "microservices", "graphql", "rest api", "html", "css", "tailwind"
];

export function analyzeJobMatch(resumeText: string, jobDescription: string): MatchResult {
  const normalizedResume = resumeText.toLowerCase();
  const normalizedJD = jobDescription.toLowerCase();

  // 1. Extract skills from JD
  const jdSkills = COMMON_TECH_SKILLS.filter(skill => normalizedJD.includes(skill));

  // 2. Compare with Resume
  const missingSkills: string[] = [];
  const strengths: string[] = [];

  jdSkills.forEach(skill => {
    if (normalizedResume.includes(skill)) {
      strengths.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate Match Score
  let matchScore = 100;
  if (jdSkills.length > 0) {
    matchScore = Math.round((strengths.length / jdSkills.length) * 100);
  }

  // Cap matching score between 0 and 100
  matchScore = Math.max(0, Math.min(100, matchScore));

  return {
    matchScore,
    missingSkills,
    strengths,
  };
}
