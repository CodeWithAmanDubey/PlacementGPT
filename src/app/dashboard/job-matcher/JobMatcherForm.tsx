"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, AlertCircle } from "lucide-react";

export function JobMatcherForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, companyName, jobDescription }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to analyze job");
      }

      setJobTitle("");
      setCompanyName("");
      setJobDescription("");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">New Job Analysis</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-neutral-400">Job Title</label>
            <input
              required
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-neutral-400">Company Name</label>
            <input
              required
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Google"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-neutral-400">Job Description</label>
          <textarea
            required
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            placeholder="Paste the full job description here..."
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          {isLoading ? "Analyzing Match..." : "Analyze Match"}
        </button>
      </form>
    </div>
  );
}
