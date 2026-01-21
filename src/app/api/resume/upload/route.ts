import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { resumeAnalysisService } from "@/services/resume-analysis.service";
import { userService } from "@/services/user.service";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();
    
    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Resolve Clerk ID to Internal User ID
    const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const user = await userService.getOrCreateUser(clerkId, primaryEmail, name);

    // 2. Extract File
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string" || !('arrayBuffer' in file)) {
      return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
    }

    // 3. Security Validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    // 4. Process
    const analysis = await resumeAnalysisService.processResume(user.id, file as File);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Resume Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to process resume" },
      { status: 500 }
    );
  }
}
