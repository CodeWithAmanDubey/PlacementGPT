import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { interviewService } from "@/services/interview.service";

const submitSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  answers: z.array(z.object({
    questionId: z.string(),
    answerText: z.string()
  }))
});

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();
    
    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = submitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Process Submit
    const { sessionId, answers } = parsed.data;
    const result = await interviewService.submitInterview(
      sessionId,
      answers
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Interview Submit Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to submit interview" }, { status: 500 });
  }
}
