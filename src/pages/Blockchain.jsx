import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Link2,
  BadgeCheck,
  Layers,
  ArrowRight,
  ExternalLink,
  Shield,
  Copy,
  Check,
  Search
} from 'lucide-react'
import {
  PageHead,
  SeverityBadge,
  DataTable,
  Drawer,
  Tooltip,
  EvidenceHashBadge
} from '../components/ui'
import { useApp } from '../context/AppContext'

export default function Blockchain() {
  const navigate = useNavigate()
  const { chainLedger } = useApp()
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [searchHash, setSearchHash] = useState('')

  const filteredRecords = chainLedger.filter(c => {
    if (!searchHash) return true
    const q = searchHash.toLowerCase()
    return c.hash.toLowerCase().includes(q) || c.event.toLowerCase().includes(q) || String(c.block).includes(q)
  })

  const cols = [
    {
      k: 'block',
      h: 'Block #',
      r: (r) => (
        <span className="font-mono font-bold text-accent">
          #{r.block}
        </span>
      )
    },
    {
      k: 'event',
      h: 'Anchored Artifact / Event',
      r: (r) => (
        <div>
          <div className="font-semibold text-white">{r.event}</div>
          <div className="text-[11px] text-muted truncate max-w-sm">{r.item || r.contract}</div>
        </div>
      )
    },
    {
      k: 'hash',
      h: 'SHA-256 Digest',
      r: (r) => <EvidenceHashBadge hash={r.hash} />
    },
    {
      k: 'ts',
      h: 'Block Timestamp',
      r: (r) => <span className="font-mono text-xs text-slate-300">{r.ts}</span>
    },
    {
      k: 'gasUsed',
      h: 'Gas Used',
      r: (r) => <span className="font-mono text-xs text-muted">{r.gasUsed}</span>
    },
    {
      k: 'status',
      h: 'Chain Proof',
      r: (r) => <SeverityBadge size="xs">{r.status}</SeverityBadge>
    },
    {
      k: 'verify',
      h: 'Verification',
      sortable: false,
      r: (r) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/verification?hash=${r.hash}`)
          }}
          className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
        >
          <span>Verify</span>
          <ArrowRight size={11} />
        </button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHead
        title="Decentralized Evidence Ledger & Blockchain Anchor"
        sub="Cryptographic Auditability"
        subtitle="Immutable ledger records anchoring forensic social media captures, deepfake classifications, and threat reports to the Polygon testnet (Problem ID: SIH26152)."
        badge={<Tooltip termKey="hashAnchoring" />}
      >
        <button
          type="button"
          onClick={() => navigate('/verification')}
          className="btn text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <BadgeCheck size={14} />
          <span>Public Verify Tool</span>
        </button>
      </PageHead>

      {/* Visual Block Sequence Carousel / Chain Cards */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="label text-muted">Latest Sealed Blocks on Chain</div>
          <span className="text-[11px] font-mono text-emerald-400">Consensus: Polygon Proof-of-Stake</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {chainLedger.slice(0, 5).map((b, i) => (
            <div key={b.block + i} className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedBlock(b)}
                className="card p-3.5 bg-panel-light/40 border-line hover:border-accent/40 text-left transition-all group shrink-0 min-w-[190px]"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono font-bold text-accent">Block #{b.block}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                  {b.event}
                </div>
                <div className="text-[10px] text-muted font-mono mt-2 flex items-center justify-between">
                  <span>{b.ts.slice(11, 16)} UTC</span>
                  <span className="text-cyan-300">Verified</span>
                </div>
              </button>
              {i < Math.min(chainLedger.length - 1, 4) && (
                <span className="text-accent/60 font-mono text-sm shrink-0">&rarr;</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search Hash Filter */}
      <div className="card p-3 flex items-center gap-2 max-w-md">
        <Search size={14} className="text-muted ml-2 shrink-0" />
        <input
          type="text"
          className="bg-transparent text-xs text-white placeholder-muted outline-none w-full"
          placeholder="Filter by hash, block number, or event..."
          value={searchHash}
          onChange={(e) => setSearchHash(e.target.value)}
        />
      </div>

      {/* Main Blockchain Records Data Table */}
      <DataTable
        cols={cols}
        rows={filteredRecords}
        onRow={(r) => setSelectedBlock(r)}
        emptyTitle="No blockchain records matching search"
      />

      {/* Block Detail Inspection Drawer */}
      <Drawer
        open={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
        title={`Block #${selectedBlock?.block}`}
        subtitle="Polygon PoS Ledger Sealed Header"
        width="max-w-xl"
      >
        {selectedBlock && (
          <div className="space-y-4 text-xs font-sans">
            <div className="card p-4 space-y-2 bg-panel-light/30">
              <div className="flex justify-between items-center">
                <span className="label text-muted">Anchor Event</span>
                <SeverityBadge size="xs">{selectedBlock.status}</SeverityBadge>
              </div>
              <div className="text-sm font-bold text-white">{selectedBlock.event}</div>
              <div className="text-muted text-[11px]">{selectedBlock.item}</div>
            </div>

            <div className="card p-4 space-y-3 bg-bg/80 font-mono text-[11px]">
              <div>
                <span className="text-muted block text-[10px]">TRANSACTION HASH:</span>
                <span className="text-cyan-300 break-all">{selectedBlock.hash}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px]">SMART CONTRACT:</span>
                <span className="text-slate-200">{selectedBlock.contract || '0x71b...882e (SentinelEvidenceStore)'}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px]">MERKLE ROOT:</span>
                <span className="text-slate-200">{selectedBlock.merkleRoot || '0x99fe...a120'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line">
                <div>
                  <span className="text-muted block text-[10px]">TIMESTAMP:</span>
                  <span className="text-slate-200">{selectedBlock.ts}</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">GAS CONSUMPTION:</span>
                  <span className="text-slate-200">{selectedBlock.gasUsed}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/verification?hash=${selectedBlock.hash}`)}
              className="btn text-xs w-full py-2.5 flex items-center justify-center gap-1.5"
            >
              <span>Test Public Verification for this Block</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </Drawer>
    </div>
  )
}
