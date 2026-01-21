"use client";

import { useState } from "react";
import { 
  Building2, 
  Briefcase, 
  Trophy, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  RefreshCcw
} from "lucide-react";

export function InterviewInteractive() {
  const [role, setRole] = useState("sde");
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");

  const [session, setSession] = useState<{ sessionId: string, questions: { id: string, text: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Interview state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Results state
  const [results, setResults] = useState<{ score: number, feedback: string, strengths: string[], weaknesses: string[], tips: string[] } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, company, difficulty })
      });
      
      if (!res.ok) throw new Error("Failed to start interview");
      
      setSession(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswers = async () => {
    if (!session) return;
    setSubmitting(true);
    
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      answerText: answers[qId]
    }));

    try {
      const res = await fetch("/api/interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.sessionId, answers: formattedAnswers })
      });
      
      if (!res.ok) throw new Error("Failed to submit answers");
      
      setResults(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  if (results) {
    return (
      <div className="space-y-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Interview Complete</h2>
          <p className="text-neutral-400 max-w-lg mx-auto mb-8">{results.feedback}</p>
          <div className="inline-block bg-black/40 border border-white/10 rounded-full px-6 py-3">
            <span className="text-sm text-neutral-400 uppercase tracking-widest font-bold mr-3">Final Score</span>
            <span className="text-3xl font-black text-white">{results.score}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Strengths
            </h3>
            <ul className="space-y-2">
              {results.strengths?.length > 0 ? results.strengths.map((s: string, i: number) => (
                <li key={i} className="text-sm text-neutral-300 bg-black/20 p-3 rounded-lg border border-white/5">{s}</li>
              )) : <li className="text-sm text-neutral-500">No specific strengths highlighted in this session.</li>}
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {results.weaknesses?.length > 0 ? results.weaknesses.map((w: string, i: number) => (
                <li key={i} className="text-sm text-neutral-300 bg-black/20 p-3 rounded-lg border border-white/5">{w}</li>
              )) : <li className="text-sm text-neutral-500">No specific weaknesses highlighted in this session.</li>}
            </ul>
          </div>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
          <h3 className="text-indigo-400 font-bold mb-4">Actionable Tips</h3>
          <ul className="space-y-3">
            {results.tips?.map((t: string, i: number) => (
              <li key={i} className="text-sm text-indigo-100 flex items-start gap-3">
                <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-indigo-400" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-center pt-4">
          <button onClick={() => { setSession(null); setResults(null); setCurrentQIndex(0); setAnswers({}); }} className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-2 mx-auto">
            <RefreshCcw className="w-4 h-4" /> Start New Interview
          </button>
        </div>
      </div>
    );
  }

  if (session) {
    const question = session.questions[currentQIndex];
    const isLast = currentQIndex === session.questions.length - 1;
    const currentAnswer = answers[question.id] || "";

    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm font-medium text-neutral-400">
            Question {currentQIndex + 1} of {session.questions.length}
          </div>
          <div className="w-64 bg-neutral-800 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${((currentQIndex + 1) / session.questions.length) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-medium leading-relaxed mb-6">{question.text}</h2>
          
          <textarea
            value={currentAnswer}
            onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder="Type your answer here... Provide specific technical details."
            className="w-full h-48 bg-neutral-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            disabled={currentQIndex === 0}
            onClick={() => setCurrentQIndex(prev => prev - 1)}
            className="px-6 py-3 rounded-xl font-medium text-neutral-400 hover:text-white disabled:opacity-50"
          >
            Previous
          </button>
          
          {isLast ? (
            <button
              onClick={submitAnswers}
              disabled={submitting || !currentAnswer.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? "Analyzing..." : "Submit Interview"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQIndex(prev => prev + 1)}
              disabled={!currentAnswer.trim()}
              className="bg-white text-black hover:bg-neutral-200 px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">Configure Mock Session</h2>
          <p className="text-neutral-400 text-sm">Select your target role and difficulty to generate an optimal set of questions.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={startInterview} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Target Role
            </label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            >
              <option value="sde">Software Development Engineer</option>
              <option value="data">Data Scientist</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Target Company (Optional)
            </label>
            <input 
              type="text" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google"
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Difficulty
            </label>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Preparing Engine..." : <><Play className="w-5 h-5 fill-current" /> Start Interview</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
