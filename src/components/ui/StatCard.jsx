import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SeverityBadge } from './SeverityBadge'

export function Counter({ to, duration = 600 }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(to, 10)
    if (isNaN(end)) return

    const incrementTime = 20
    const totalSteps = duration / incrementTime
    const stepValue = Math.ceil(end / totalSteps) || 1

    const timer = setInterval(() => {
      start += stepValue
      if (start >= end) {
        setVal(end)
        clearInterval(timer)
      } else {
        setVal(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [to, duration])

  return <span>{val.toLocaleString()}</span>
}

export function StatCard({
  label,
  value,
  unit = '',
  d,
  severity,
  drilldown,
  subtext,
  icon: Icon,
  className = ''
}) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (drilldown) {
      navigate(drilldown)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.15 }}
      onClick={handleClick}
      role={drilldown ? 'button' : 'region'}
      tabIndex={drilldown ? 0 : undefined}
      onKeyDown={(e) => {
        if (drilldown && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          navigate(drilldown)
        }
      }}
      className={`card-glow p-5 flex flex-col justify-between group cursor-pointer relative overflow-hidden focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="label text-muted group-hover:text-slate-200 transition-colors">
          {Icon && <Icon size={14} className="text-accent" />}
          {label}
        </span>
        {severity && <SeverityBadge size="xs">{severity}</SeverityBadge>}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-1 my-1">
        <span className="text-3xl font-bold tracking-tight text-white font-mono">
          <Counter to={value} />
        </span>
        {unit && <span className="text-lg font-medium text-slate-300">{unit}</span>}
      </div>

      {/* Bottom status & drilldown indicator */}
      <div className="mt-3 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
        <div>
          {d && <span className="text-accent font-medium mr-2">{d}</span>}
          {subtext && <span className="text-muted/80">{subtext}</span>}
        </div>
        {drilldown && (
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-accent flex items-center gap-0.5 text-[11px]">
            Inspect <ArrowUpRight size={13} />
          </span>
        )}
      </div>

      {/* Ambient background accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none group-hover:bg-accent/10 transition-colors" />
    </motion.div>
  )
}
