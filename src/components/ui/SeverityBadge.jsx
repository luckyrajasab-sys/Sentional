export const severityMap = {
  // Standardized Severity Colors across entire application
  Critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-400',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.25)]'
  },
  High: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]'
  },
  Medium: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    dot: 'bg-cyan-400',
    glow: 'shadow-[0_0_12px_rgba(6,182,212,0.25)]'
  },
  Low: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-700',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    glow: ''
  },
  // Operational Statuses
  Valid: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]'
  },
  Verified: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]'
  },
  New: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    dot: 'bg-indigo-400',
    glow: ''
  },
  Investigating: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    glow: ''
  },
  Resolved: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    glow: ''
  },
  Pending: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-300',
    dot: 'bg-yellow-300',
    glow: ''
  },
  Flagged: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-400',
    glow: ''
  }
}

export function SeverityBadge({ children, withDot = true, size = 'sm', className = '' }) {
  const level = children || 'Low'
  const style = severityMap[level] || severityMap.Low
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium font-mono uppercase tracking-wider ${style.bg} ${style.border} ${style.text} ${style.glow} ${sizeClasses} ${className}`}
    >
      {withDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
      )}
      {children}
    </span>
  )
}
