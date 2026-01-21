"use client";

import { useState, useTransition } from "react";
import { updateProfileData } from "./actions";
import { Save, Loader2, User, Building2, BookOpen, Target, GraduationCap } from "lucide-react";

type SettingsFormProps = {
  initialData: {
    name?: string | null;
    college?: string | null;
    branch?: string | null;
    cgpa?: number | null;
    targetRole?: string | null;
  };
};

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfileData(formData);
      if (result.success) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ text: result.error || "Failed to update profile", type: "error" });
      }
    });
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-indigo-400" />
        Application Preferences
      </h2>

      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-neutral-300 flex items-center gap-2">
               Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={initialData.name || ""}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="college" className="text-sm font-medium text-neutral-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-neutral-500" /> College / University
            </label>
            <input
              type="text"
              id="college"
              name="college"
              defaultValue={initialData.college || ""}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder="e.g. Stanford University"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm font-medium text-neutral-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-500" /> Branch / Major
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              defaultValue={initialData.branch || ""}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="cgpa" className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-neutral-500" /> CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                id="cgpa"
                name="cgpa"
                defaultValue={initialData.cgpa || ""}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="e.g. 8.5"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="targetRole" className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-neutral-500" /> Target Role
              </label>
              <input
                type="text"
                id="targetRole"
                name="targetRole"
                defaultValue={initialData.targetRole || ""}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="e.g. SDE"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            {message && (
              <p className={`text-sm font-medium ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {message.text}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
