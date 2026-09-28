import { useState } from 'react'
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
  Bot
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar as RBar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts'
import {
  PageHead,
  SeverityBadge,
  Drawer,
  Bar,
  Tooltip
} from '../components/ui'
import { nodes, edges, coordinatedCampaigns } from '../data'
import { useApp } from '../context/AppContext'

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: '#0f1218',
    borderColor: '#1e2430',
    borderRadius: '8px',
    fontSize: '12px'
  }
}

export default function Network() {
  const navigate = useNavigate()
  const [selectedNode, setSelectedNode] = useState(null)
  const [activeCampaignId, setActiveCampaignId] = useState('CAMP-2026-ALPHA')
  const [filterCluster, setFilterCluster] = useState('all')

  const activeCampaign = coordinatedCampaigns.find(c => c.id === activeCampaignId) || coordinatedCampaigns[0]

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  const nodeColors = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#06b6d4',
    Low: '#64748b'
  }

  return (
    <div className="space-y-6">
      <PageHead
        title="Coordinated Campaign Detection & Network Graph"
        sub="Graph Intelligence & Disinformation Swarms"
        subtitle="Detect coordinated inauthentic behavior (CIB), automated bot amplification clusters, and synchronized posting patterns within micro-second time deltas."
        badge={<Tooltip termKey="coordinatedBehavior" />}
      >
        <button
          type="button"
          onClick={() => navigate('/accounts')}
          className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <Bot size={14} />
          <span>Bot Score Matrix</span>
        </button>
      </PageHead>

      {/* Campaign Switcher Banner */}
      <div className="card p-5 border-accent/40 bg-panel-light/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="label text-accent flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Active Campaign Detection</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {activeCampaign.name}
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Narrative target: <span className="text-slate-200 font-medium">{activeCampaign.targetNarrative}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-line p-1 bg-bg">
            {coordinatedCampaigns.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCampaignId(c.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeCampaignId === c.id
                    ? 'bg-accent text-slate-950 font-semibold shadow-glow-cyan'
                    : 'text-muted hover:text-white'
                }`}
              >
                {c.id.split('-')[2]}
              </button>
            ))}
          </div>

          <SeverityBadge>{activeCampaign.severity}</SeverityBadge>
        </div>
      </div>

      {/* Top Campaign Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="label text-muted">Coordinated Nodes</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {activeCampaign.accountCount} accounts
          </div>
          <div className="text-xs text-accent mt-0.5">Synchronized cluster</div>
        </div>

        <div className="card p-4">
          <div className="label text-muted">Cosine Text Similarity</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {activeCampaign.similarityScore}%
          </div>
          <div className="text-xs text-muted mt-0.5">Templated duplication</div>
        </div>

        <div className="card p-4">
          <div className="label text-muted">Synchronization Delta (Δt)</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            &lt; {activeCampaign.timeDeltaSeconds}s
          </div>
          <div className="text-xs text-muted mt-0.5">Mean inter-post latency</div>
        </div>

        <div className="card p-4">
          <div className="label text-muted">Cluster Origin / Seed</div>
          <div className="text-base font-bold font-mono text-slate-200 mt-1 truncate">
            {activeCampaign.seedAccount}
          </div>
          <div className="text-xs text-muted mt-0.5">First post at {activeCampaign.firstDetected.slice(11, 16)} UTC</div>
        </div>
      </div>

      {/* Main Interactive Network SVG & Cluster Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Interactive SVG Network Graph */}
        <div className="card p-4 lg:col-span-3 bg-panel-light/20 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="label text-muted flex items-center gap-1.5">
              <Share2 size={13} className="text-accent" />
              <span>Interactive Graph Visualization (Click node to inspect)</span>
            </div>
            <span className="text-[11px] font-mono text-muted">9 Nodes • 10 Edges</span>
          </div>

          <div className="relative w-full h-[380px] sm:h-[420px] rounded-lg bg-bg/70 border border-line cyber-grid overflow-hidden">
            <svg viewBox="0 0 700 380" className="w-full h-full select-none">
              {/* Edges */}
              {edges.map(([a, b, rel, weight], i) => {
                const nodeA = nodeMap[a]
                const nodeB = nodeMap[b]
                if (!nodeA || !nodeB) return null
                const midX = (nodeA.x + nodeB.x) / 2
                const midY = (nodeA.y + nodeB.y) / 2

                return (
                  <g key={i}>
                    <line
                      x1={nodeA.x}
                      y1={nodeA.y}
                      x2={nodeB.x}
                      y2={nodeB.y}
                      stroke={weight > 0.9 ? '#ef4444' : '#334155'}
                      strokeWidth={weight > 0.9 ? 2.5 : 1.2}
                      strokeDasharray={weight > 0.9 ? '4 2' : undefined}
                      strokeOpacity={weight > 0.9 ? 0.8 : 0.4}
                    />
                    <text
                      x={midX}
                      y={midY - 4}
                      fill="#8b97a8"
                      fontSize="9"
                      textAnchor="middle"
                      className="font-mono bg-bg"
                    >
                      {rel}
                    </text>
                  </g>
                )
              })}

              {/* Nodes */}
              {nodes.map((n) => {
                const isSelected = selectedNode?.id === n.id
                const isSeed = n.id === 'a'
                const radius = 12 + (n.c / 30)
                const fillCol = nodeColors[n.risk] || '#64748b'

                return (
                  <g
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className="cursor-pointer group"
                    transform={`translate(0, 0)`}
                  >
                    {/* Pulsing ring for high risk/seed */}
                    {(n.risk === 'Critical' || isSeed) && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={radius + 8}
                        fill="none"
                        stroke={fillCol}
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          values={`${radius + 4};${radius + 14};${radius + 4}`}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="stroke-opacity"
                          values="0.6;0.1;0.6"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={radius}
                      fill={fillCol}
                      fillOpacity={isSelected ? 0.5 : 0.25}
                      stroke={fillCol}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all duration-150 group-hover:fill-opacity-50"
                    />

                    {/* Node Text Label */}
                    <text
                      x={n.x}
                      y={n.y + radius + 14}
                      fill="#e2e8f0"
                      fontSize="10"
                      fontWeight="500"
                      textAnchor="middle"
                      className="pointer-events-none drop-shadow"
                    >
                      {n.label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-muted mt-3 pt-2 border-t border-line">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>Critical Seed / Bot</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Amplifier Node</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Target Topic</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <span>Organic Node</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">Louvain Modularity: 0.72</span>
          </div>
        </div>

        {/* Coordinated Burst Timeline & Graph Metrics Panel */}
        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <div className="label text-muted">Synchronized Burst Timing</div>
            <p className="text-xs text-muted">
              Coordinated posts spike synchronously within narrow 15-minute windows.
            </p>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeCampaign.burstTimeline} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <RechartsTooltip {...chartTooltipStyle} />
                  <RBar dataKey="syncPosts" name="Synchronized Bots" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  <RBar dataKey="organic" name="Organic Users" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-4 space-y-3 text-xs">
            <div className="label text-muted">Sample Disinformation Payload</div>
            <p className="italic text-slate-300 p-2.5 rounded bg-bg border border-line text-[11px] leading-relaxed">
              {activeCampaign.samplePayload}
            </p>
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="btn text-xs w-full py-2 flex items-center justify-center gap-1.5"
            >
              <span>Add Campaign to Case File</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Top Coordinated Accounts Matrix Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="label text-muted">Coordinated Account Synchronization Matrix</div>
            <p className="text-xs text-muted mt-0.5">
              Identified accounts, coordination roles, inter-post delay offsets, and cosine text similarity
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="label py-2.5 px-3">Account Handle</th>
                <th className="label py-2.5 px-3">Cluster Role</th>
                <th className="label py-2.5 px-3">Timing Offset</th>
                <th className="label py-2.5 px-3">Text Similarity</th>
                <th className="label py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {activeCampaign.topAccounts.map((acc, i) => (
                <tr key={acc.handle} className="hover:bg-white/[0.03]">
                  <td className="py-2.5 px-3 font-semibold text-white font-mono">
                    {acc.handle}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-line text-slate-300">
                      {acc.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-amber-400">
                    {acc.delay}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold">
                    {acc.sim}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/accounts?handle=${acc.handle}`)}
                      className="text-accent hover:underline text-xs"
                    >
                      Inspect Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Node Detail Drawer */}
      <Drawer
        open={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        title={selectedNode?.label || 'Node Detail'}
        subtitle={`Type: ${selectedNode?.type || 'Entity'}`}
      >
        {selectedNode && (
          <div className="space-y-4 text-xs">
            <div className="card p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="label text-muted">Cluster Risk</span>
                <SeverityBadge size="xs">{selectedNode.risk}</SeverityBadge>
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                {selectedNode.label}
              </div>
              <div className="text-muted">
                Affiliation: <span className="text-cyan-300 font-medium">{selectedNode.cluster}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="card p-3">
                <div className="text-muted">Connection Degree</div>
                <div className="text-xl font-bold font-mono text-white mt-1">{selectedNode.c}</div>
              </div>
              <div className="card p-3">
                <div className="text-muted">Bot Probability</div>
                <div className="text-xl font-bold font-mono text-accent mt-1">{selectedNode.bot}%</div>
              </div>
            </div>

            {selectedNode.type === 'user' && (
              <button
                type="button"
                onClick={() => navigate(`/accounts?handle=${selectedNode.label}`)}
                className="btn w-full text-xs py-2"
              >
                Inspect Account Risk Score Breakdown
              </button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}
