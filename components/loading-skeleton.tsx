export function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-48 mb-6" />
      <div className="h-10 bg-slate-200 rounded w-64 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-48 mb-8" />

      <div className="bg-slate-200 rounded-lg h-48 mb-6" />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-200 rounded-lg h-64" />
        <div className="bg-slate-200 rounded-lg h-64" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-slate-200 rounded-lg h-24" />
        ))}
      </div>
    </div>
  );
}
