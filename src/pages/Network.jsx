import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Share2,
  Users,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Activity,
  Bot,
  Search,
  Filter,
  RefreshCw,
  Download,
  Check,
  Copy,
  ExternalLink,
  AlertTriangle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  Info,
  X,
  Eye,
  Network as NetworkIcon,
  Shield,
  FileText,
  Lock,
  Radio,
  Hash,
  Database
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar as RBar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend
} from 'recharts'
import {
  nodes as initialNodes,
  edges as initialEdges,
  coordinatedCampaigns
} from '../data'
import { useApp } from '../context/AppContext'

// Clean light-mode chart tooltip styling
const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
    fontSize: '12px',
    color: '#0f172a',
    padding: '8px 12px'
  },
  itemStyle: {
    color: '#0f172a',
    fontWeight: 500
  },
  labelStyle: {
    color: '#64748b',
    fontWeight: 600,
    marginBottom: '4px'
  }
}

export default function Network() {
  const navigate = useNavigate()
  const { addItemToCase, addAuditLog, cases, role } = useApp()

  // Primary state
  const [activeCampaignId, setActiveCampaignId] = useState('CAMP-2026-ALPHA')
  const [selectedNodeId, setSelectedNodeId] = useState('a') // Default to seed node so user never sees empty state
  const [nodeFilter, setNodeFilter] = useState('all') // 'all' | 'critical' | 'bots' | 'organic'
  const [searchQuery, setSearchQuery] = useState('')
  const [showEdgeLabels, setShowEdgeLabels] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [minEdgeWeight, setMinEdgeWeight] = useState(0.0)
  const [communityAlgorithm, setCommunityAlgorithm] = useState('louvain')
  const [timeWindow, setTimeWindow] = useState('15m')
  const [resolutionParam, setResolutionParam] = useState(1.0)
  
  // Interactive feedback state
  const [isScanning, setIsScanning] = useState(false)
  const [lastScannedTime, setLastScannedTime] = useState('Just now')
  const [toastMessage, setToastMessage] = useState(null)
  const [payloadCopied, setPayloadCopied] = useState(false)
  const [quarantineModalNode, setQuarantineModalNode] = useState(null)
  const [quarantinedNodeIds, setQuarantinedNodeIds] = useState(new Set())
  const [tableSearch, setTableSearch] = useState('')
  const [tableRoleFilter, setTableRoleFilter] = useState('all')

  const activeCampaign = coordinatedCampaigns.find(c => c.id === activeCampaignId) || coordinatedCampaigns[0]

  // Toast auto-dismiss timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Nodes map
  const nodeMap = useMemo(() => {
    return Object.fromEntries(initialNodes.map(n => [n.id, n]))
  }, [])

  // Selected node object
  const selectedNode = nodeMap[selectedNodeId] || initialNodes[0]

  // Filtered nodes based on search & category
  const filteredNodes = useMemo(() => {
    return initialNodes.filter(n => {
      // Category filter
      if (nodeFilter === 'critical' && n.risk !== 'Critical' && n.risk !== 'High') return false
      if (nodeFilter === 'bots' && n.bot < 70) return false
      if (nodeFilter === 'organic' && (n.risk === 'Critical' || n.risk === 'High' || n.bot > 50)) return false

      // Text search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesLabel = n.label.toLowerCase().includes(q)
        const matchesType = n.type.toLowerCase().includes(q)
        const matchesCluster = n.cluster.toLowerCase().includes(q)
        if (!matchesLabel && !matchesType && !matchesCluster) return false
      }

      return true
    })
  }, [nodeFilter, searchQuery])

  const visibleNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes])

  // Filtered edges based on weight and visible nodes
  const filteredEdges = useMemo(() => {
    return initialEdges.filter(([a, b, rel, weight]) => {
      if (weight < minEdgeWeight) return false
      if (!visibleNodeIds.has(a) || !visibleNodeIds.has(b)) return false
      return true
    })
  }, [minEdgeWeight, visibleNodeIds])

  // Direct connections of currently selected node
  const selectedNodeConnections = useMemo(() => {
    if (!selectedNode) return []
    const connections = []
    initialEdges.forEach(([a, b, rel, weight]) => {
      if (a === selectedNode.id) {
        const target = nodeMap[b]
        if (target) connections.push({ rel, weight, target, direction: 'outgoing' })
      } else if (b === selectedNode.id) {
        const source = nodeMap[a]
        if (source) connections.push({ rel, weight, target: source, direction: 'incoming' })
      }
    })
    return connections
  }, [selectedNode, nodeMap])

  // Trigger simulated scan
  const handleRunScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setLastScannedTime('Just now')
      setToastMessage({
        type: 'success',
        title: 'Network Scan Complete',
        text: 'Scanned 142 cluster nodes across active ingest feeds. No unhandled mutations detected.'
      })
    }, 650)
  }

  // Copy sample payload
  const handleCopyPayload = () => {
    if (activeCampaign.samplePayload) {
      navigator.clipboard.writeText(activeCampaign.samplePayload)
      setPayloadCopied(true)
      setToastMessage({
        type: 'info',
        title: 'Copied to Clipboard',
        text: 'Sample disinformation payload copied successfully.'
      })
      setTimeout(() => setPayloadCopied(false), 2000)
    }
  }

  // Add node to active case
  const handleAddNodeToCase = async (node) => {
    const activeCase = cases && cases.length > 0 ? cases[0] : { id: 'CASE-2026-09' }
    if (addItemToCase) {
      await addItemToCase(activeCase.id, 'account', node.label, null)
    }
    setToastMessage({
      type: 'success',
      title: 'Added to Case File',
      text: `${node.label} successfully linked to investigation ${activeCase.id}.`
    })
  }

  // Confirm quarantine
  const handleExecuteQuarantine = async () => {
    if (!quarantineModalNode) return
    const nodeId = quarantineModalNode.id
    setQuarantinedNodeIds(prev => new Set(prev).add(nodeId))
    if (addAuditLog) {
      await addAuditLog('QUARANTINE_NODE', `Quarantined entity ${quarantineModalNode.label} from network`)
    }
    setToastMessage({
      type: 'warning',
      title: 'Entity Quarantined',
      text: `${quarantineModalNode.label} isolated from active ingestion feeds.`
    })
    setQuarantineModalNode(null)
  }

  // Export topology JSON
  const handleExportTopology = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      campaignId: activeCampaign.id,
      campaignName: activeCampaign.name,
      modularity: 0.72,
      nodes: filteredNodes,
      edges: filteredEdges
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sentinel_network_topology_${activeCampaign.id.toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setToastMessage({
      type: 'info',
      title: 'Topology Exported',
      text: 'Downloaded network topology JSON graph data.'
    })
  }

  // Table accounts filtering
  const filteredAccounts = useMemo(() => {
    return activeCampaign.topAccounts.filter(acc => {
      if (tableRoleFilter !== 'all' && acc.role.toLowerCase() !== tableRoleFilter.toLowerCase()) return false
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase()
        if (!acc.handle.toLowerCase().includes(q) && !acc.role.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [activeCampaign, tableRoleFilter, tableSearch])

  // Color mapping for technical visualization
  const getNodeColor = (risk, isQuarantined) => {
    if (isQuarantined) return '#94a3b8' // Slate for quarantined
    switch (risk) {
      case 'Critical':
        return '#ef4444' // Red
      case 'High':
        return '#f97316' // Amber / Orange
      case 'Medium':
        return '#2563eb' // Electric Blue
      default:
        return '#64748b' // Slate Gray
    }
  }

  return (
    <div className="space-y-6 max-w-[1720px] mx-auto pb-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-white border border-slate-200 rounded-xl shadow-lg p-4 max-w-sm flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className={`p-1.5 rounded-lg shrink-0 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : toastMessage.type === 'warning'
                ? 'bg-amber-50 text-amber-600 border border-amber-200'
                : 'bg-blue-50 text-blue-600 border border-blue-200'
          }`}>
            {toastMessage.type === 'success' && <Check size={16} />}
            {toastMessage.type === 'warning' && <AlertTriangle size={16} />}
            {toastMessage.type === 'info' && <Info size={16} />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900">{toastMessage.title}</h4>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toastMessage.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded"
            aria-label="Dismiss message"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
              <NetworkIcon size={12} className="text-blue-600" />
              Graph Intelligence Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">SIH26152 Threat Topology</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Network Operations & Coordinated Swarm Graph
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Monitor, inspect and manage your connected network. Detect coordinated inauthentic behavior (CIB), automated bot amplification clusters, and synchronized posting patterns within microsecond time deltas.
          </p>
        </div>

        {/* Action Controls & Live Status */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Live Engine Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-900">ENGINE ONLINE</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 text-[11px]">{lastScannedTime}</span>
          </div>

          {/* Secondary Action: Bot Score Matrix */}
          <button
            type="button"
            onClick={() => navigate('/accounts')}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-3.5 py-2 rounded-lg text-xs shadow-sm transition-all focus:ring-2 focus:ring-slate-300 focus:outline-none"
            title="Inspect comprehensive account bot scores"
          >
            <Bot size={14} className="text-slate-600" />
            <span>Bot Score Matrix</span>
          </button>

          {/* Primary Action: Run Network Scan */}
          <button
            type="button"
            onClick={handleRunScan}
            disabled={isScanning}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-sm transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
            title="Perform automated network anomaly scan"
          >
            <RefreshCw size={14} className={`${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Cluster...' : 'Run Network Scan'}</span>
          </button>
        </div>
      </header>

      {/* 2. Campaign Switcher & Narrative Target Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              <Sparkles size={11} className="text-blue-600" />
              Active Campaign Incident
            </span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
              activeCampaign.severity === 'Critical'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                activeCampaign.severity === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'
              }`} />
              {activeCampaign.severity} Severity
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            {activeCampaign.name}
          </h2>

          <p className="text-xs text-slate-600">
            Target Narrative:{' '}
            <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {activeCampaign.targetNarrative}
            </span>
            <span className="mx-2 text-slate-300">•</span>
            First detected at <span className="font-mono text-slate-700">{activeCampaign.firstDetected.slice(11, 16)} UTC</span>
          </p>
        </div>

        {/* Campaign Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden lg:inline">Select Campaign:</span>
          <div className="inline-flex p-1 rounded-lg border border-slate-200 bg-slate-50">
            {coordinatedCampaigns.map(c => {
              const isSelected = activeCampaignId === c.id
              const shortId = c.id.split('-')[2] // 'ALPHA' or 'BETA'
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setActiveCampaignId(c.id)
                    setSelectedNodeId('a')
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-white text-blue-700 font-bold shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {shortId === 'ALPHA' ? 'Campaign Alpha (Digital ID)' : 'Campaign Beta (UPI KYC)'}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={handleExportTopology}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all"
            title="Download complete graph topology JSON"
          >
            <Download size={13} className="text-slate-600" />
            <span>Export Graph</span>
          </button>
        </div>
      </section>

      {/* 3. Network Overview (5 Clean Technical Metric Cards) */}
      <section aria-label="Network Overview Metrics" className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Metric 1: Network Threat State */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Network Status
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
            Active Swarm
          </div>
          <p className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
            <span>●</span> High coordination risk
          </p>
        </div>

        {/* Metric 2: Coordinated Nodes */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Coordinated Accounts
            </span>
            <Users size={14} className="text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
            {activeCampaign.accountCount}
          </div>
          <p className="text-[11px] text-slate-500">
            Synchronized cluster nodes
          </p>
        </div>

        {/* Metric 3: Cosine Similarity */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Text Similarity
            </span>
            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">Cosine</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-blue-700">
            {activeCampaign.similarityScore}%
          </div>
          <p className="text-[11px] text-slate-500">
            Templated message duplication
          </p>
        </div>

        {/* Metric 4: Synchronization Delta */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Sync Latency (Δt)
            </span>
            <Clock size={14} className="text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-700">
            &lt; {activeCampaign.timeDeltaSeconds}s
          </div>
          <p className="text-[11px] text-slate-500">
            Mean inter-post delay offset
          </p>
        </div>

        {/* Metric 5: Cluster Modularity */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Graph Modularity
            </span>
            <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Louvain</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
            0.72 <span className="text-xs font-normal text-slate-500">/ 1.0</span>
          </div>
          <p className="text-[11px] text-slate-500">
            High community polarization
          </p>
        </div>
      </section>

      {/* 4. Main Network Visualization + Integrated Node Detail Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 8 Cols: Interactive SVG Network Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          {/* Canvas Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Share2 size={16} className="text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Interactive Network Topology Canvas
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any node to inspect telemetry, connection weights, and quarantine actions.
              </p>
            </div>

            {/* Quick Search & Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search node within canvas */}
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Find node or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 placeholder-slate-400 w-36 sm:w-44 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label="Clear node search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Node filter pill buttons */}
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
                <button
                  type="button"
                  onClick={() => setNodeFilter('all')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    nodeFilter === 'all'
                      ? 'bg-white text-blue-700 font-bold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All (9)
                </button>
                <button
                  type="button"
                  onClick={() => setNodeFilter('critical')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    nodeFilter === 'critical'
                      ? 'bg-white text-rose-700 font-bold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Risk (5)
                </button>
                <button
                  type="button"
                  onClick={() => setNodeFilter('organic')}
                  className={`px-2 py-0.5 rounded font-medium transition-all ${
                    nodeFilter === 'organic'
                      ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Organic (3)
                </button>
              </div>

              {/* Edge labels toggle */}
              <button
                type="button"
                onClick={() => setShowEdgeLabels(v => !v)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  showEdgeLabels
                    ? 'border-blue-200 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
                title="Toggle relationship labels on edges"
              >
                Labels
              </button>
            </div>
          </div>

          {/* Canvas SVG Container */}
          <div
            className="relative w-full h-[400px] sm:h-[450px] rounded-lg bg-white border border-slate-200 overflow-hidden select-none"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
              backgroundSize: '20px 20px'
            }}
          >
            <svg
              viewBox="0 0 700 380"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
            >
              {/* Edges */}
              {filteredEdges.map(([a, b, rel, weight], i) => {
                const nodeA = nodeMap[a]
                const nodeB = nodeMap[b]
                if (!nodeA || !nodeB) return null

                const isConnectedToSelected = selectedNode && (selectedNode.id === a || selectedNode.id === b)
                const isHighWeight = weight > 0.90
                const midX = (nodeA.x + nodeB.x) / 2
                const midY = (nodeA.y + nodeB.y) / 2

                const strokeColor = isConnectedToSelected
                  ? '#2563eb' // Electric blue highlight when connected to selected
                  : isHighWeight
                    ? '#ef4444' // Red for high coordination weight
                    : weight > 0.5
                      ? '#3b82f6' // Blue for medium weight
                      : '#94a3b8' // Slate for organic interaction

                const strokeWidth = isConnectedToSelected
                  ? 3
                  : isHighWeight
                    ? 2.2
                    : 1.2

                return (
                  <g key={`edge-${a}-${b}-${i}`}>
                    {/* Line */}
                    <line
                      x1={nodeA.x}
                      y1={nodeA.y}
                      x2={nodeB.x}
                      y2={nodeB.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={isHighWeight ? '4 2' : undefined}
                      strokeOpacity={isConnectedToSelected ? 0.95 : 0.65}
                    />

                    {/* Edge Label Pill */}
                    {showEdgeLabels && (
                      <g className="pointer-events-none">
                        <rect
                          x={midX - (rel.length * 2.8 + 8)}
                          y={midY - 8}
                          width={rel.length * 5.6 + 16}
                          height={16}
                          rx={4}
                          fill="#ffffff"
                          stroke={isConnectedToSelected ? '#93c5fd' : '#e2e8f0'}
                          strokeWidth="1"
                          filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))"
                        />
                        <text
                          x={midX}
                          y={midY + 3.5}
                          fill={isConnectedToSelected ? '#1d4ed8' : '#475569'}
                          fontSize="9"
                          fontWeight={isConnectedToSelected ? '600' : '500'}
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {rel}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

              {/* Nodes */}
              {filteredNodes.map((n) => {
                const isSelected = selectedNode?.id === n.id
                const isQuarantined = quarantinedNodeIds.has(n.id)
                const isSeed = n.id === 'a'
                const radius = 13 + (n.c / 28)
                const fillColor = getNodeColor(n.risk, isQuarantined)

                return (
                  <g
                    key={`node-${n.id}`}
                    onClick={() => setSelectedNodeId(n.id)}
                    className="cursor-pointer group"
                  >
                    {/* Animated Pulsing Ring for Seed / Critical Nodes */}
                    {!isQuarantined && (n.risk === 'Critical' || isSeed) && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={radius + 8}
                        fill="none"
                        stroke={fillColor}
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                      >
                        <animate
                          attributeName="r"
                          values={`${radius + 4};${radius + 14};${radius + 4}`}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="stroke-opacity"
                          values="0.5;0.1;0.5"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Active Selected Highlight Halo */}
                    {isSelected && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={radius + 6}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3.5"
                        strokeOpacity="0.8"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={radius}
                      fill={fillColor}
                      fillOpacity={isSelected ? 0.9 : 0.8}
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="transition-all duration-150 group-hover:scale-105"
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
                    />

                    {/* Inner Glyphs */}
                    {isQuarantined ? (
                      <text
                        x={n.x}
                        y={n.y + 4}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        ✕
                      </text>
                    ) : isSeed ? (
                      <text
                        x={n.x}
                        y={n.y + 4}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        ★
                      </text>
                    ) : null}

                    {/* Node Text Label with White Shadow for Optimal Contrast */}
                    <text
                      x={n.x}
                      y={n.y + radius + 15}
                      fill="#0f172a"
                      fontSize="10.5"
                      fontWeight={isSelected ? '700' : '600'}
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      paintOrder="stroke fill"
                    >
                      {n.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Technical Canvas Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 mt-4 pt-3 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs" />
                <span>Critical Seed / Bot</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs" />
                <span>Amplifier Node</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-blue-600 shadow-xs" />
                <span>Target Topic</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-3 h-3 rounded-full bg-slate-500 shadow-xs" />
                <span>Organic Entity</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-rose-500 inline-block" />
                <span>Coordinated (&gt;90%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-0.5 bg-slate-400 inline-block" />
                <span>Organic</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Dedicated Node Inspector Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Inspector Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  Node Inspector
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-slate-500">
                  Entity ID: <span className="font-mono text-slate-700">NODE-{selectedNode.id.toUpperCase()}</span>
                </p>
              </div>

              {/* Risk Badge */}
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold font-mono border ${
                  selectedNode.risk === 'Critical'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : selectedNode.risk === 'High'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedNode.risk === 'Critical' ? 'bg-rose-500' : selectedNode.risk === 'High' ? 'bg-amber-500' : 'bg-slate-500'
                  }`} />
                  {selectedNode.risk} Risk
                </span>
                {quarantinedNodeIds.has(selectedNode.id) && (
                  <span className="block text-[10px] font-bold uppercase text-rose-600 mt-1">
                    Quarantined
                  </span>
                )}
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Degree Centrality
                </span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">
                  {selectedNode.c}
                </span>
                <span className="text-[10px] text-slate-500">Cross-entity links</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Bot Probability
                </span>
                <span className={`text-xl font-bold font-mono mt-0.5 block ${
                  selectedNode.bot > 80
                    ? 'text-rose-600'
                    : selectedNode.bot > 40
                      ? 'text-amber-600'
                      : 'text-slate-700'
                }`}>
                  {selectedNode.bot}%
                </span>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selectedNode.bot > 80 ? 'bg-rose-500' : selectedNode.bot > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedNode.bot}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Grouped Metadata */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Entity Classification:</span>
                <span className="font-semibold text-slate-900 capitalize bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {selectedNode.type}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Cluster Affiliation:</span>
                <span className="font-semibold text-blue-700">
                  {selectedNode.cluster}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">First Detected:</span>
                <span className="font-mono text-slate-700">07:15 UTC (Epoch 1928374)</span>
              </div>
            </div>

            {/* Direct Connected Relationships */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Active Connections ({selectedNodeConnections.length})
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100">
                {selectedNodeConnections.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">
                    No active edges matching current filter settings.
                  </p>
                ) : (
                  selectedNodeConnections.map((conn, idx) => (
                    <button
                      key={`conn-${idx}`}
                      type="button"
                      onClick={() => setSelectedNodeId(conn.target.id)}
                      className="w-full text-left py-1.5 px-2 rounded hover:bg-slate-50 flex items-center justify-between text-xs group transition-colors"
                    >
                      <div className="truncate">
                        <span className="text-slate-500 font-mono text-[10px] mr-1.5">
                          {conn.rel}
                        </span>
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {conn.target.label}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 group-hover:text-slate-700 shrink-0 ml-2">
                        {(conn.weight * 100).toFixed(0)}%
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Action Button Hierarchy for Selected Node */}
          <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
            {/* Primary Action (Blue) */}
            {selectedNode.type === 'user' ? (
              <button
                type="button"
                onClick={() => navigate(`/accounts?handle=${encodeURIComponent(selectedNode.label)}`)}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2.5 rounded-lg text-xs shadow-sm transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <Bot size={14} />
                <span>Inspect Account Risk Profile</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/threats')}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2.5 rounded-lg text-xs shadow-sm transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <ShieldAlert size={14} />
                <span>Inspect Threat Feed</span>
                <ArrowRight size={13} />
              </button>
            )}

            {/* Secondary Action: Add to Active Case */}
            <button
              type="button"
              onClick={() => handleAddNodeToCase(selectedNode)}
              className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-300 font-medium px-4 py-2 rounded-lg text-xs shadow-sm transition-all focus:ring-2 focus:ring-slate-300 focus:outline-none"
            >
              <FileText size={13} className="text-slate-600" />
              <span>Link Node to Case File</span>
            </button>

            {/* Destructive Action: Quarantine Node */}
            {!quarantinedNodeIds.has(selectedNode.id) && (
              <button
                type="button"
                onClick={() => setQuarantineModalNode(selectedNode)}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium px-4 py-1.5 rounded-lg text-xs transition-all"
              >
                <Lock size={12} className="text-rose-600" />
                <span>Quarantine Node from Network</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 5. Synchronized Burst Dynamics & Sample Payload */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 Cols: Synchronized Burst Timing Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-slate-900">
                Synchronized Burst Timing vs. Organic Cadence
              </h3>
              <span className="text-[11px] font-mono text-slate-500">15-min intervals (UTC)</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Coordinated posts spike synchronously within narrow 15-minute windows, demonstrating algorithmic machine pacing.
            </p>

            <div className="h-48 sm:h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeCampaign.burstTimeline} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <RechartsTooltip {...chartTooltipStyle} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
                  />
                  <RBar
                    dataKey="syncPosts"
                    name="Synchronized Bots"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                  <RBar
                    dataKey="organic"
                    name="Organic Users"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Peak Swarm Volume: 142 bots at 08:00 UTC</span>
            <span className="font-semibold text-rose-700">Cosine Match 94.6%</span>
          </div>
        </div>

        {/* Right 5 Cols: Sample Disinformation Payload */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                Flagged Content Signature
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-1.5">
                Sample Disinformation Payload
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Replicated message payload diffused across echo accounts within sub-second intervals.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono relative group">
              <p className="italic">
                {activeCampaign.samplePayload}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>Seed Account: <span className="font-bold text-slate-700">{activeCampaign.seedAccount}</span></span>
                <span className="text-emerald-700 font-semibold font-mono">Proof Anchored</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t border-slate-200">
            {/* Primary Action (Blue) */}
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-sm transition-all"
            >
              <span>Add Campaign to Case File</span>
              <ArrowRight size={13} />
            </button>

            {/* Secondary Action: Copy */}
            <button
              type="button"
              onClick={handleCopyPayload}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-3.5 py-2 rounded-lg text-xs shadow-sm transition-all"
              title="Copy payload text to clipboard"
            >
              {payloadCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-slate-600" />}
              <span>{payloadCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Coordinated Account Synchronization Matrix Table */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Coordinated Account Synchronization Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified accounts, cluster roles, inter-post delay offsets, and cosine text similarity scores.
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter handles..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 text-slate-900 placeholder-slate-400 w-36 sm:w-44 outline-none transition-all"
              />
            </div>

            <select
              value={tableRoleFilter}
              onChange={(e) => setTableRoleFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:border-blue-500 outline-none"
              aria-label="Filter accounts by cluster role"
            >
              <option value="all">All Roles</option>
              <option value="seed injector">Seed Injectors</option>
              <option value="amplifier node">Amplifiers</option>
              <option value="echo node">Echo Nodes</option>
              <option value="retweet swarm">Retweet Swarms</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Account Handle</th>
                <th className="py-2.5 px-3">Cluster Role</th>
                <th className="py-2.5 px-3">Timing Offset (Δt)</th>
                <th className="py-2.5 px-3">Text Similarity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No accounts match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const isNodeQuarantined = quarantinedNodeIds.has(acc.handle)
                  return (
                    <tr key={acc.handle} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold font-mono text-slate-900">
                        {acc.handle}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          {acc.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-amber-700 font-semibold">
                        {acc.delay}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">
                        {acc.sim}
                      </td>
                      <td className="py-2.5 px-3">
                        {isNodeQuarantined ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-rose-700 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            Quarantined
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active Ingest
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            const found = initialNodes.find(n => n.label === acc.handle)
                            if (found) setSelectedNodeId(found.id)
                          }}
                          className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
                        >
                          Locate
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/accounts?handle=${encodeURIComponent(acc.handle)}`)}
                          className="text-xs text-blue-700 hover:text-blue-900 font-medium underline inline-flex items-center gap-0.5"
                        >
                          <span>Profile</span>
                          <ExternalLink size={10} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Recent Network Activity & Events Log (Requirement 5) */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Recent Network Activity & Ingestion Events
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of cluster detections, timing offset synchronizations, and mitigation events.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Showing last 5 events</span>
        </div>

        <div className="space-y-2">
          {[
            {
              time: '08:48 UTC',
              title: 'Cluster Hash Anchored to Blockchain',
              desc: 'SHA-256 evidence digest anchored on Polygon Block #1928374 for auditability.',
              sev: 'Valid',
              badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              dotColor: 'bg-emerald-500'
            },
            {
              time: '08:15 UTC',
              title: 'Organic Rebuttal Engagement Detected',
              desc: 'Fact-checking handle @civic_analyst published verified debunking response.',
              sev: 'Low',
              badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
              dotColor: 'bg-slate-500'
            },
            {
              time: '08:00 UTC',
              title: 'Swarm Volume Saturation Threshold',
              desc: 'Synchronized account count breached 140 nodes with text similarity exceeding 94%.',
              sev: 'Critical',
              badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
              dotColor: 'bg-rose-500'
            },
            {
              time: '07:38 UTC',
              title: 'Amplifier Node Synchronization Trigger',
              desc: 'Handle @trend_pusher_77 replicated seed payload within 3.8s delta offset.',
              sev: 'High',
              badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
              dotColor: 'bg-amber-500'
            },
            {
              time: '07:15 UTC',
              title: 'Cluster Origin / Seed Detected',
              desc: 'Seed account @newsflash_0912 dispatched initial templated hashtag #DigitalIdScam.',
              sev: 'Critical',
              badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
              dotColor: 'bg-rose-500'
            }
          ].map((evt, idx) => (
            <div
              key={`evt-${idx}`}
              className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="font-mono text-slate-400 font-semibold text-[11px] shrink-0">
                  {evt.time}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${evt.badgeColor} shrink-0`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${evt.dotColor}`} />
                  {evt.sev}
                </span>
                <div>
                  <span className="font-semibold text-slate-900">{evt.title}: </span>
                  <span className="text-slate-600">{evt.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Advanced Network Controls (Expandable - Requirement 5 & 4) */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          aria-expanded={showAdvanced}
        >
          <div className="flex items-center gap-2.5">
            <Sliders size={16} className="text-slate-500" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Advanced Network Controls & Graph Topology Parameters
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure community detection algorithms, edge weight thresholds, and raw graph exports.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>{showAdvanced ? 'Hide Advanced' : 'Show Advanced'}</span>
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {showAdvanced && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/50 space-y-5 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Parameter 1: Clustering Algorithm */}
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2">
                <label htmlFor="algo-select" className="text-xs font-bold text-slate-900 block">
                  Community Detection Algorithm
                </label>
                <select
                  id="algo-select"
                  value={communityAlgorithm}
                  onChange={(e) => setCommunityAlgorithm(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
                >
                  <option value="louvain">Louvain Modularity (Fast Community Partition)</option>
                  <option value="betweenness">Girvan-Newman (Edge Betweenness)</option>
                  <option value="pagerank">PageRank Centrality Vector</option>
                  <option value="forceatlas">ForceAtlas2 Physics Layout</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  Current modularity score Q = 0.72 indicates strong clustered partition.
                </p>
              </div>

              {/* Parameter 2: Edge Weight Pruning Slider */}
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="weight-slider" className="font-bold text-slate-900">
                    Edge Weight Cutoff Threshold
                  </label>
                  <span className="font-mono text-blue-700 font-bold">≥ {minEdgeWeight.toFixed(2)}</span>
                </div>
                <input
                  id="weight-slider"
                  type="range"
                  min="0.0"
                  max="0.95"
                  step="0.05"
                  value={minEdgeWeight}
                  onChange={(e) => setMinEdgeWeight(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Hides weak relationships below threshold to focus on high-confidence coordination.
                </p>
              </div>

              {/* Parameter 3: Time-Window Binning */}
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2">
                <label className="text-xs font-bold text-slate-900 block">
                  Temporal Synchronization Window
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['5m', '15m', '1h', '24h'].map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setTimeWindow(w)}
                      className={`py-1 text-xs rounded font-medium transition-all ${
                        timeWindow === w
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Binning window for calculating inter-post coordination delays.
                </p>
              </div>
            </div>

            {/* Direct Export & Graph Serialization Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-600">
                Graph Data Structure: <span className="font-mono font-bold text-slate-800">9 Nodes, 10 Edges (GEXF/JSON Format)</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportTopology}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-3 py-1.5 rounded-lg text-xs shadow-sm transition-all"
                >
                  <Download size={13} className="text-slate-600" />
                  <span>Download Graph JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToastMessage({
                      type: 'success',
                      title: 'Graph Re-clustered',
                      text: `Community partition recomputed using ${communityAlgorithm} algorithm.`
                    })
                  }}
                  className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium px-3 py-1.5 rounded-lg text-xs transition-all"
                >
                  <RefreshCw size={13} className="text-blue-600" />
                  <span>Re-cluster Graph</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quarantine Confirmation Modal */}
      {quarantineModalNode && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirm Node Quarantine
                </h3>
                <p className="text-xs text-slate-500">
                  Target: <span className="font-mono font-bold text-slate-900">{quarantineModalNode.label}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              Quarantining will isolate <strong className="text-slate-900">{quarantineModalNode.label}</strong> from active social media ingestion streams. An immutable audit record will be signed with your analyst key.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setQuarantineModalNode(null)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-4 py-2 rounded-lg text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteQuarantine}
                className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium px-4 py-2 rounded-lg text-xs shadow-sm transition-all"
              >
                Confirm Quarantine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
