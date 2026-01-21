export default function AnalyticsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <div>
        <div className="h-8 w-64 bg-white/10 rounded-lg mb-4"></div>
        <div className="h-4 w-96 bg-white/5 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-80 flex flex-col justify-between">
            <div className="h-6 w-48 bg-white/10 rounded-lg"></div>
            <div className="h-48 w-full bg-white/5 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
