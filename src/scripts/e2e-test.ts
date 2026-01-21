import { userService } from "../services/user.service";
import { resumeAnalysisService } from "../services/resume-analysis.service";
import { jobAnalysisService } from "../services/job-analysis.service";
import { interviewService } from "../services/interview.service";

async function runE2ETests() {
  console.log("🚀 Starting E2E Functional Backend Tests");
  try {
    // 1. Create a mock user
    console.log("--> 1. Seeding User");
    const mockClerkId = "e2e_clerk_" + Date.now();
    const user = await userService.getOrCreateUser(mockClerkId, "e2e_" + Date.now() + "@example.com", "E2E Tester");
    console.log(`    ✅ User created with ID: ${user.id}`);

    // 2. Upload a sample resume
    console.log("--> 2. Processing Resume");
    const pdfBase64 = "JVBERi0xLgoxIDAgb2JqPDwvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqPDwvS2lkc1szIDAgUl0vQ291bnQgMT4+ZW5kb2JqCjMgMCBvYmo8PC9QYXJlbnQgMiAwIFIvUmVzb3VyY2VzPDw+Pi9Db250ZW50cyA0IDAgUj4+ZW5kb2JqCjQgMCBvYmo8PC9MZW5ndGggMTI+PnN0cmVhbQpCVCBFVCANCmVuZHN0cmVhbQplbmRvYmoKdHJhaWxlcjw8L1Jvb3QgMSAwIFI+Pg==";
    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    // Create a mock File object
    const file = new File([pdfBuffer], "sample-resume.pdf", { type: "application/pdf" });
    
    const resumeAnalysis = await resumeAnalysisService.processResume(user.id, file);
    console.log(`    ✅ Resume processed! ATS Score: ${resumeAnalysis.atsScore}`);

    // 3. Run Job Matcher
    console.log("--> 3. Analyzing Job (Job Matcher)");
    const jobDescription = `
      We are looking for a Software Engineer with experience in TypeScript, Node.js, and React.
      You should be comfortable with building scalable web applications and REST APIs.
      Experience with PostgreSQL and Prisma is a big plus.
    `;
    const jobAnalysis = await jobAnalysisService.processJobMatch(user.id, "Software Engineer", "TechCorp", jobDescription);
    console.log(`    ✅ Job Analysis created! Match Score: ${jobAnalysis.matchScore}`);
    
    // Check Roadmap creation
    if (jobAnalysis.learningRoadmap) {
      console.log(`    ✅ Learning Roadmap correctly generated.`);
    } else {
      console.log(`    ❌ Learning Roadmap generation failed (empty).`);
    }

    // 4. Start Mock Interview
    console.log("--> 4. Starting Mock Interview");
    const session = await interviewService.startInterview(user.id, "Software Engineer", "TechCorp", "Medium");
    console.log(`    ✅ Interview Session created! ID: ${session.sessionId}`);
    
    // Simulate answering all questions
    console.log("--> 5. Submitting Mock Interview Answers");
    const answers = [
      { questionId: session.questions[0].id, answerText: "I use TypeScript because it adds static typing to JavaScript." },
      { questionId: session.questions[1].id, answerText: "Node.js allows me to run JavaScript on the server side." },
      { questionId: session.questions[2].id, answerText: "React uses a virtual DOM for efficient UI updates." },
    ];
    
    const scoredSession = await interviewService.submitInterview(session.sessionId, answers);
    console.log(`    ✅ Interview Session Scored! Overall Score: ${scoredSession.score}`);

    console.log("\n🎉 All core backend workflows completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ E2E Test Failed:", error);
    process.exit(1);
  }
}

runE2ETests();
