import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { analyticsService } from "@/services/analytics.service";
import { AnalyticsCharts } from "./AnalyticsCharts";

export default async function AnalyticsPage() {
  const { userId: clerkId } = await auth();
  const clerkUser = await currentUser();

  if (!clerkId || !clerkUser) {
    redirect("/sign-in");
  }

  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
  const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

  const user = await userService.getOrCreateUser(clerkId, primaryEmail, name);

  const data = await analyticsService.getAnalyticsDash(user.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Performance Analytics</h1>
        <p className="text-neutral-400">Track your preparation progress across ATS mapping, semantic matching, and mock interviews over time.</p>
      </div>

      <AnalyticsCharts data={data} />
    </div>
  );
}
