"use client";

import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

export interface TrendData {
  date: string;
  score: number;
}

export interface AnalyticsData {
  resumeTrend: TrendData[];
  interviewTrend: TrendData[];
  matchTrend: TrendData[];
  readinessTrend: TrendData[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: Array<{ value: number }>, label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900 border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-sm text-neutral-400 mb-1">{label}</p>
        <p className="text-lg font-bold text-white">
          Score: <span className="text-indigo-400">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const EmptyState = () => (
  <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
    <p className="text-neutral-500">Not enough data to display trend.</p>
  </div>
);

export function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  const { resumeTrend, interviewTrend, matchTrend, readinessTrend } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Readiness Trend */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-6 text-white">Job Readiness Trend</h3>
        {readinessTrend.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={readinessTrend}>
                <defs>
                  <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorReadiness)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState />}
      </div>

      {/* ATS Score Trend */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-6 text-white">Resume ATS Score History</h3>
        {resumeTrend.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resumeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState />}
      </div>

      {/* Interview Performance */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-6 text-white">Interview Score Trend</h3>
        {interviewTrend.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={interviewTrend}>
                <defs>
                  <linearGradient id="colorInterview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorInterview)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState />}
      </div>

      {/* Job Match Trend */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-6 text-white">Semantic Job Match History</h3>
        {matchTrend.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={matchTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : <EmptyState />}
      </div>

    </div>
  );
}
