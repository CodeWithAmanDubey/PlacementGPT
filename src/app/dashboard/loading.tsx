export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <div>
        <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-white/5 rounded w-1/2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-40"></div>
        ))}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-40 md:col-span-2 lg:col-span-3"></div>
      </div>
    </div>
  );
}
