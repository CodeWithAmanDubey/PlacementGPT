import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { InterviewInteractive } from "./InterviewInteractive";

export default async function InterviewPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mock Interview Simulator</h1>
        <p className="text-neutral-400">Practice your technical and behavioral skills in a realistic, timed environment.</p>
      </div>

      <InterviewInteractive />
    </div>
  );
}
