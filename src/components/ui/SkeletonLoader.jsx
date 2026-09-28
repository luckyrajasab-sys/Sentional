export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-line/60 rounded ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-48" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex gap-4 border-b border-line pb-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-2 border-b border-line/40">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart({ height = 240 }) {
  return (
    <div className="card p-5 space-y-4">
      <Skeleton className="h-4 w-32" />
      <div style={{ height }} className="grid place-items-center bg-line/20 rounded-lg">
        <Skeleton className="h-3/4 w-5/6 rounded-lg" />
      </div>
    </div>
  )
}
