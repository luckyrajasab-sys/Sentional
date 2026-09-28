import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { SeverityBadge, severityMap } from './SeverityBadge'
import { StatCard, Counter } from './StatCard'
import { DataTable } from './DataTable'
import { FilterBar } from './FilterBar'
import { EmptyState } from './EmptyState'
import { Tooltip } from './Tooltip'
import { Skeleton, SkeletonCard, SkeletonTable, SkeletonChart } from './SkeletonLoader'

export {
  SeverityBadge,
  severityMap,
  StatCard,
  Counter,
  DataTable,
  FilterBar,
  EmptyState,
  Tooltip,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonChart
}

// Consistent Page Header with Title, One-line Subtitle & Action buttons
export function PageHead({ title, sub, subtitle, children, badge = null }) {
  const displaySubtitle = subtitle || sub
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6 border-b border-line/60 pb-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="label text-accent font-semibold">{displaySubtitle}</span>
          {badge}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        {children}
      </div>
    </div>
  )
}

// Chart Container Card with header, subtitle, and responsive wrapper
export function ChartCard({ title, subtitle, children, h = 260, action = null, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="label">{title}</div>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div style={{ height: h }}>{children}</div>
    </div>
  )
}

// Sliding Right Drawer for Detail Inspections
export function Drawer({ open, onClose, title, subtitle = null, children, width = 'max-w-md' }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className={`fixed right-0 top-0 h-full w-full ${width} bg-panel border-l border-line z-50 p-6 overflow-y-auto shadow-2xl flex flex-col`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22, ease: 'easeOut' }}
          >
            <div className="flex justify-between items-start mb-6 border-b border-line pb-4">
              <div>
                <h3 className="font-bold text-lg text-white">{title}</h3>
                {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="p-1 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-4">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

// Progress Bar with color variants
export function Bar({ v, color = 'bg-accent', h = 'h-2' }) {
  const percentage = Math.min(Math.max(v || 0, 0), 100)
  return (
    <div className={`w-full ${h} bg-line rounded-full overflow-hidden`}>
      <div
        className={`${h} rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

// Blockchain Hash Pill with instant copy & link
export function EvidenceHashBadge({ hash, block = null, label = null }) {
  const [copied, setCopied] = useState(false)
  const short = hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : '0x0000...0000'

  const copy = (e) => {
    e.stopPropagation()
    if (hash) {
      navigator.clipboard.writeText(hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={`Click to copy full hash: ${hash}`}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[11px] bg-slate-900 border border-line-light text-cyan-300 hover:border-accent hover:bg-cyan-950/30 transition-colors"
    >
      <span className="text-muted/60">{label || 'SHA256:'}</span>
      <span>{short}</span>
      {block && <span className="text-[10px] text-muted">#{block}</span>}
      <span className="text-[10px] text-muted/80">{copied ? '✓' : '⧉'}</span>
    </button>
  )
}
