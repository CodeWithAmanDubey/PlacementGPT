export interface RoadmapStep {
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  description: string;
}

export interface SkillRoadmap {
  skill: string;
  steps: RoadmapStep[];
}

export function generateRoadmap(missingSkills: string[]): SkillRoadmap[] {
  return missingSkills.map(skill => {
    return {
      skill,
      steps: [
        {
          level: "Beginner",
          title: `Introduction to ${skill.toUpperCase()}`,
          description: `Understand the core concepts, terminology, and basic use cases of ${skill}. Focus on setup and Hello World examples.`,
        },
        {
          level: "Intermediate",
          title: `Building with ${skill.toUpperCase()}`,
          description: `Learn how to integrate ${skill} into a standard application. Focus on best practices, configuration, and common patterns.`,
        },
        {
          level: "Advanced",
          title: `Mastering ${skill.toUpperCase()}`,
          description: `Explore advanced topics like performance optimization, security, scaling, and production deployment for ${skill}.`,
        }
      ]
    };
  });
}
