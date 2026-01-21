import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { interviewService } from "@/services/interview.service";
import { userService } from "@/services/user.service";

const startSchema = z.object({
  role: z.string().min(1, "Role is required").max(100),
  company: z.string().min(1, "Company is required").max(100),
  difficulty: z.string().min(1, "Difficulty is required").max(50),
});

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();
    
    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = startSchema.safeParse(body);

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

    // Process Start
    const { role, company, difficulty } = parsed.data;
    const sessionData = await interviewService.startInterview(
      user.id,
      role,
      company,
      difficulty
    );

    return NextResponse.json(sessionData);
  } catch (error: unknown) {
    console.error("Interview Start Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to start interview" }, { status: 500 });
  }
}
