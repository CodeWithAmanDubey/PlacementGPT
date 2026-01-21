import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { SettingsForm } from "./SettingsForm";
import { UserProfile } from "@clerk/nextjs";
import { Shield } from "lucide-react";

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();
  const clerkUser = await currentUser();

  if (!clerkId || !clerkUser) {
    redirect("/sign-in");
  }

  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress || "";
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
  const user = await userService.getOrCreateUser(clerkId, primaryEmail, name);

  const initialData = {
    name: user.name,
    college: user.college,
    branch: user.branch,
    cgpa: user.cgpa,
    targetRole: user.targetRole,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-neutral-400">Manage your profile and application preferences.</p>
      </div>

      <div className="space-y-8">
        <SettingsForm initialData={initialData} />

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Account Security
          </h2>
          {/* We wrap UserProfile in a div to enforce dark mode styles natively if needed, 
              though Clerk typically reads the system/appearance prop or wrapper. 
              Using routing="hash" ensures it doesn't conflict with our App Router setup. */}
          <div className="w-full overflow-hidden rounded-xl border border-white/10">
            <UserProfile 
              appearance={{
                variables: {
                  colorPrimary: '#6366f1', // indigo-500
                  colorBackground: '#0a0a0a', // neutral-950
                  colorInputBackground: '#171717',
                  colorText: '#ffffff',
                }
              }}
              routing="hash"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
