export type SkillCategory = "Languages" | "Frameworks" | "Databases" | "Cloud" | "DevOps" | "System Design";

export interface ExtractedSkill {
  name: string;
  category: SkillCategory;
}

const SKILL_DICTIONARY: Record<SkillCategory, string[]> = {
  Languages: ["javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin"],
  Frameworks: ["react", "angular", "vue", "next.js", "node.js", "express", "django", "flask", "spring", "spring boot", "laravel", "ruby on rails", ".net"],
  Databases: ["sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb", "oracle"],
  Cloud: ["aws", "gcp", "azure", "google cloud", "heroku", "digitalocean"],
  DevOps: ["docker", "kubernetes", "ci/cd", "jenkins", "github actions", "gitlab ci", "terraform", "ansible"],
  "System Design": ["system design", "microservices", "graphql", "rest api", "kafka", "rabbitmq", "grpc"],
};

export function extractSkills(text: string): ExtractedSkill[] {
  const normalizedText = text.toLowerCase();
  const extracted: ExtractedSkill[] = [];

  for (const [category, skills] of Object.entries(SKILL_DICTIONARY)) {
    const cat = category as SkillCategory;
    for (const skill of skills) {
      // Use regex with word boundaries to prevent partial matches (e.g., 'go' matching 'good')
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(normalizedText)) {
        extracted.push({ name: skill, category: cat });
      }
    }
  }

  return extracted;
}
