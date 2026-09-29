import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  LayoutDashboard,
  Smile,
  TrendingUp,
  Share2,
  Globe,
  ShieldAlert,
  UserSearch,
  Briefcase,
  BadgeCheck,
  Link2,
  FileText,
  History,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Radio
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Breadcrumbs } from '../components/navigation/Breadcrumbs'
import { CommandPalette } from '../components/navigation/CommandPalette'
import { NotificationDropdown } from '../components/navigation/NotificationDropdown'
import { UserMenu } from '../components/navigation/UserMenu'
import { GuidedTour } from '../components/navigation/GuidedTour'

const navSections = [
  {
    title: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null }
    ]
  },
  {
    title: 'Analyze',
    items: [
      { to: '/sentiment', label: 'Sentiment', icon: Smile, badge: null },
      { to: '/trends', label: 'Trends', icon: TrendingUp, badge: null },
      { to: '/network', label: 'Network Graph', icon: Share2, badge: 'CIB' },
      { to: '/map', label: 'Geo Map', icon: Globe, badge: null }
    ]
  },
  {
    title: 'Investigate',
    items: [
      { to: '/threats', label: 'Threats & Triage', icon: ShieldAlert, badge: 'Queue' },
      { to: '/accounts', label: 'Accounts & Bots', icon: UserSearch, badge: null },
      { to: '/cases', label: 'Case Management', icon: Briefcase, badge: 'Cases' },
      { to: '/verification', label: 'Verification', icon: BadgeCheck, badge: 'Verify' }
    ]
  },
  {
    title: 'Trust & Audit',
    items: [
      { to: '/blockchain', label: 'Blockchain Ledger', icon: Link2, badge: 'SHA-256' },
      { to: '/audit', label: 'Audit Trail', icon: History, badge: 'Log' },
      { to: '/reports', label: 'Reports', icon: FileText, badge: null }
    ]
  }
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile drawer
  const [collapsed, setCollapsed] = useState(false)     // Desktop collapsible
  const [cmdOpen, setCmdOpen] = useState(false)
  const location = useLocation()
  const { startTour, role } = useApp()

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const isNetwork = location.pathname === '/network'

  return (
    <div className={`min-h-screen ${isNetwork ? 'bg-slate-50 text-slate-900' : 'bg-bg text-slate-100'} flex flex-col md:flex-row relative`}>
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop Collapsible & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen ${
          isNetwork
            ? 'bg-white border-r border-slate-200'
            : 'bg-panel border-r border-line'
        } flex flex-col transition-all duration-300 ${
          collapsed ? 'lg:w-[72px]' : 'lg:w-64'
        } w-64 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className={`h-16 border-b ${isNetwork ? 'border-slate-200' : 'border-line'} px-4 flex items-center justify-between`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`w-8 h-8 rounded-lg ${
              isNetwork
                ? 'bg-blue-50 border border-blue-200 text-blue-600'
                : 'bg-accent/15 border border-accent/40 text-accent shadow-glow-cyan'
            } grid place-items-center shrink-0`}>
              <Shield size={18} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className={`font-bold text-base leading-none tracking-tight flex items-center gap-1.5 ${
                  isNetwork ? 'text-slate-900' : 'text-white'
                }`}>
                  Sentinel <span className={`text-[10px] font-mono uppercase px-1 py-0.2 rounded border ${
                    isNetwork
                      ? 'text-blue-700 bg-blue-50 border-blue-200'
                      : 'text-accent bg-accent/10 border-accent/20'
                  }`}>SOC</span>
                </div>
                <div className={`text-[10px] font-medium tracking-wider mt-0.5 truncate ${
                  isNetwork ? 'text-slate-500' : 'text-muted'
                }`}>
                  Social Intel & Blockchain
                </div>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-1.5 rounded ${
              isNetwork ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-muted hover:text-white'
            }`}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map(sec => (
            <div key={sec.title}>
              {!collapsed && (
                <div className={`px-2 mb-2 text-[10px] uppercase font-bold tracking-wider ${
                  isNetwork ? 'text-slate-400' : 'text-muted/70'
                }`}>
                  {sec.title}
                </div>
              )}
              <div className="space-y-1">
                {sec.items.map(item => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                          isActive
                            ? isNetwork
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm font-semibold'
                              : 'bg-accent/15 text-white border border-accent/40 shadow-glow-cyan'
                            : isNetwork
                              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                              : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                        }`
                      }
                    >
                      <Icon size={16} className={`shrink-0 transition-colors ${
                        isNetwork
                          ? 'text-slate-400 group-hover:text-blue-600'
                          : 'text-muted group-hover:text-accent'
                      }`} />
                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                              isNetwork
                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                : 'bg-line-light/60 text-muted group-hover:text-accent border border-line'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer with Collapse Toggle & Tour launcher */}
        <div className={`p-3 border-t space-y-2 ${isNetwork ? 'border-slate-200 bg-slate-50/50' : 'border-line bg-panel-light/30'}`}>
          <button
            type="button"
            onClick={() => startTour()}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
              isNetwork
                ? 'text-slate-700 hover:text-blue-700 hover:bg-white border-slate-200'
                : 'text-slate-300 hover:text-accent hover:bg-white/5 border-line'
            } ${collapsed ? 'justify-center' : ''}`}
            title="Start First-Run Tour"
          >
            <Sparkles size={15} className={`${isNetwork ? 'text-blue-600' : 'text-accent'} shrink-0`} />
            {!collapsed && <span>Guided Tour</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(c => !c)}
            className={`hidden lg:flex w-full items-center justify-center p-1.5 rounded-lg transition-colors border border-transparent ${
              isNetwork
                ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100 hover:border-slate-200'
                : 'text-muted hover:text-white hover:bg-white/5 hover:border-line'
            }`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <div className={`flex items-center gap-2 text-[11px] ${isNetwork ? 'text-slate-500' : 'text-muted'}`}><ChevronLeft size={14} /> Collapse Sidebar</div>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className={`sticky top-0 z-30 h-16 border-b px-4 sm:px-6 flex items-center justify-between gap-4 ${
          isNetwork
            ? 'bg-white/95 backdrop-blur-md border-slate-200'
            : 'bg-bg/90 backdrop-blur-md border-line'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg border ${
                isNetwork
                  ? 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  : 'border-line bg-panel text-muted hover:text-white'
              }`}
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumbs */}
            <Breadcrumbs />
          </div>

          {/* Global Search Bar (Ctrl+K trigger) */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className={`w-full flex items-center justify-between gap-2 border rounded-lg px-3.5 py-1.5 text-xs transition-colors shadow-sm ${
                isNetwork
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900'
                  : 'bg-panel border-line hover:border-line-light text-muted hover:text-slate-200 shadow-inner'
              }`}
              aria-label="Search or type command"
            >
              <div className="flex items-center gap-2 truncate">
                <Search size={14} className={`${isNetwork ? 'text-blue-600' : 'text-accent'} shrink-0`} />
                <span className="truncate">Search accounts, threats, pages, hashes...</span>
              </div>
              <kbd className={`hidden lg:inline-flex text-[10px] font-mono border rounded px-1.5 py-0.5 shrink-0 ${
                isNetwork ? 'border-slate-200 bg-white text-slate-500' : 'border-line-light bg-bg text-muted'
              }`}>
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons: Operational status, Notifications, Role menu */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Operational Status */}
            <div className={`hidden xl:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full border ${
              isNetwork
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-line bg-panel text-muted'
            }`}>
              <Radio size={12} className="text-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-semibold">SOC ONLINE</span>
              <span className={isNetwork ? 'text-slate-500' : 'text-muted/60'}>• Polygon #1928374</span>
            </div>

            {/* Mobile search icon button */}
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className={`sm:hidden p-2 rounded-lg border ${
                isNetwork
                  ? 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
                  : 'border-line bg-panel text-muted hover:text-white'
              }`}
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            {/* Notification Bell with Badge */}
            <NotificationDropdown />

            {/* User Profile & Role Switcher */}
            <UserMenu />
          </div>
        </header>

        {/* Page Content Body */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 max-w-[1800px] w-full mx-auto min-w-0 ${isNetwork ? 'bg-slate-50' : ''}`}>
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette Modal */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* 5-Step Guided Tour Component */}
      <GuidedTour />
    </div>
  )
}
