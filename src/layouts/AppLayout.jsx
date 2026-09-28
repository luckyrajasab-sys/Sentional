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

  return (
    <div className="min-h-screen bg-bg text-slate-100 flex flex-col md:flex-row relative">
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop Collapsible & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 z-40 h-screen bg-panel border-r border-line flex flex-col transition-all duration-300 ${
          collapsed ? 'lg:w-[72px]' : 'lg:w-64'
        } w-64 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-line px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/40 grid place-items-center text-accent shrink-0 shadow-glow-cyan">
              <Shield size={18} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-bold text-base leading-none text-white tracking-tight flex items-center gap-1.5">
                  Sentinel <span className="text-[10px] font-mono text-accent uppercase px-1 py-0.2 rounded bg-accent/10 border border-accent/20">SOC</span>
                </div>
                <div className="text-[10px] text-muted font-medium tracking-wider mt-0.5 truncate">
                  Social Intel & Blockchain
                </div>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-muted hover:text-white rounded"
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
                <div className="px-2 mb-2 text-[10px] uppercase font-bold tracking-wider text-muted/70">
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
                            ? 'bg-accent/15 text-white border border-accent/40 shadow-glow-cyan'
                            : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                        }`
                      }
                    >
                      <Icon size={16} className="shrink-0 text-muted group-hover:text-accent transition-colors" />
                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-line-light/60 text-muted group-hover:text-accent border border-line">
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
        <div className="p-3 border-t border-line space-y-2 bg-panel-light/30">
          <button
            type="button"
            onClick={() => startTour()}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-accent hover:bg-white/5 border border-line transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title="Start First-Run Tour"
          >
            <Sparkles size={15} className="text-accent shrink-0" />
            {!collapsed && <span>Guided Tour</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(c => !c)}
            className="hidden lg:flex w-full items-center justify-center p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-line"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <div className="flex items-center gap-2 text-[11px] text-muted"><ChevronLeft size={14} /> Collapse Sidebar</div>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-bg/90 backdrop-blur-md border-b border-line px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-muted hover:text-white rounded-lg border border-line bg-panel"
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
              className="w-full flex items-center justify-between gap-2 bg-panel border border-line hover:border-line-light rounded-lg px-3.5 py-1.5 text-xs text-muted hover:text-slate-200 transition-colors shadow-inner"
              aria-label="Search or type command"
            >
              <div className="flex items-center gap-2 truncate">
                <Search size={14} className="text-accent shrink-0" />
                <span className="truncate">Search accounts, threats, pages, hashes...</span>
              </div>
              <kbd className="hidden lg:inline-flex text-[10px] font-mono border border-line-light rounded px-1.5 py-0.5 bg-bg text-muted shrink-0">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons: Operational status, Notifications, Role menu */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Operational Status */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-muted font-mono px-2.5 py-1 rounded-full border border-line bg-panel">
              <Radio size={12} className="text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold">SOC ONLINE</span>
              <span className="text-muted/60">• Polygon #1928374</span>
            </div>

            {/* Mobile search icon button */}
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="sm:hidden p-2 rounded-lg border border-line bg-panel text-muted hover:text-white"
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1800px] w-full mx-auto min-w-0">
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
