import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { jobAnalysisService } from "@/services/job-analysis.service";
import { userService } from "@/services/user.service";

const analyzeSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").max(100),
  companyName: z.string().min(1, "Company name is required").max(100),
  jobDescription: z.string().min(10, "Job description is too short").max(10000),
});

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();
    
    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = analyzeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Resolve internal User ID
    const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const user = await userService.getOrCreateUser(clerkId, primaryEmail, name);

    // Process Match
    const { jobTitle, companyName, jobDescription } = parsed.data;
    const analysis = await jobAnalysisService.processJobMatch(
      user.id,
      jobTitle,
      companyName,
      jobDescription
    );

    return NextResponse.json(analysis);
  } catch (error: unknown) {
    console.error("Job Analysis Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to process job match" }, { status: 500 });
  }
}
