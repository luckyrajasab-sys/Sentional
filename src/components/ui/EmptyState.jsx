import { ShieldAlert, RefreshCw } from 'lucide-react'

export function EmptyState({
  title = 'No records found',
  description = 'No matching data found for the selected filters or search parameters.',
  icon: Icon = ShieldAlert,
  onReset,
  resetLabel = 'Reset Filters',
  className = ''
}) {
  return (
    <div className={`card p-12 text-center flex flex-col items-center justify-center border-dashed border-line ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-line/50 border border-line-light grid place-items-center mb-4 text-muted">
        <Icon size={22} className="text-accent" />
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="btn-ghost text-xs py-2 px-3 flex items-center gap-2 text-accent border-accent/30 hover:bg-accent/10"
        >
          <RefreshCw size={13} />
          {resetLabel}
        </button>
      )}
    </div>
  )
}
