"use server";

import { auth } from "@clerk/nextjs/server";
import { userService } from "@/services/user.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
  college: z.string().optional().or(z.literal("")),
  branch: z.string().optional().or(z.literal("")),
  cgpa: z.string().optional().or(z.literal("")),
  targetRole: z.string().optional().or(z.literal("")),
});

export async function updateProfileData(formData: FormData) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return { success: false, error: "Unauthorized" };
    }

    const data = {
      name: formData.get("name")?.toString() || "",
      college: formData.get("college")?.toString() || "",
      branch: formData.get("branch")?.toString() || "",
      cgpa: formData.get("cgpa")?.toString() || "",
      targetRole: formData.get("targetRole")?.toString() || "",
    };

    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Invalid form data" };
    }

    const { name, college, branch, cgpa, targetRole } = parsed.data;

    let cgpaFloat: number | null = null;
    if (cgpa && cgpa.trim() !== "") {
      const parsedCgpa = parseFloat(cgpa);
      if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
        return { success: false, error: "CGPA must be a valid number between 0 and 10" };
      }
      cgpaFloat = parsedCgpa;
    }

    await userService.updateProfile(clerkId, {
      name: name || null,
      college: college || null,
      branch: branch || null,
      cgpa: cgpaFloat,
      targetRole: targetRole || null,
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
