import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Shield } from 'lucide-react'

const routeMeta = {
  '/dashboard': { section: 'Overview', label: 'Dashboard' },
  '/sentiment': { section: 'Analyze', label: 'Sentiment' },
  '/trends': { section: 'Analyze', label: 'Trends' },
  '/network': { section: 'Analyze', label: 'Network Graph' },
  '/map': { section: 'Analyze', label: 'Geo Intelligence' },
  '/threats': { section: 'Investigate', label: 'Threats & Triage' },
  '/accounts': { section: 'Investigate', label: 'Accounts & Bots' },
  '/cases': { section: 'Investigate', label: 'Case Management' },
  '/verification': { section: 'Investigate', label: 'Content Verification' },
  '/blockchain': { section: 'Trust', label: 'Blockchain Ledger' },
  '/audit': { section: 'Trust', label: 'Audit Trail' },
  '/reports': { section: 'Trust', label: 'Reports' },
}

export function Breadcrumbs() {
  const location = useLocation()
  const current = routeMeta[location.pathname] || { section: 'Platform', label: location.pathname.replace('/', '') }

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-xs text-muted">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-slate-100 transition-colors"
      >
        <Shield size={13} className="text-accent" />
        <span className="font-semibold text-slate-300">Sentinel</span>
      </Link>
      <ChevronRight size={12} className="text-muted/50" />
      <span className="text-muted/80">{current.section}</span>
      <ChevronRight size={12} className="text-muted/50" />
      <span className="text-slate-100 font-medium">{current.label}</span>
    </nav>
  )
}
