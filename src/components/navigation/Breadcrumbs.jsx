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
  const isNetwork = location.pathname === '/network'
  const current = routeMeta[location.pathname] || { section: 'Platform', label: location.pathname.replace('/', '') }

  return (
    <nav aria-label="Breadcrumb" className={`hidden md:flex items-center gap-1.5 text-xs ${isNetwork ? 'text-slate-500' : 'text-muted'}`}>
      <Link
        to="/dashboard"
        className={`flex items-center gap-1 transition-colors ${
          isNetwork ? 'text-slate-700 hover:text-slate-900' : 'text-slate-300 hover:text-slate-100'
        }`}
      >
        <Shield size={13} className={isNetwork ? 'text-blue-600' : 'text-accent'} />
        <span className="font-semibold">Sentinel</span>
      </Link>
      <ChevronRight size={12} className={isNetwork ? 'text-slate-400' : 'text-muted/50'} />
      <span className={isNetwork ? 'text-slate-500' : 'text-muted/80'}>{current.section}</span>
      <ChevronRight size={12} className={isNetwork ? 'text-slate-400' : 'text-muted/50'} />
      <span className={`font-medium ${isNetwork ? 'text-slate-900' : 'text-slate-100'}`}>{current.label}</span>
    </nav>
  )
}
