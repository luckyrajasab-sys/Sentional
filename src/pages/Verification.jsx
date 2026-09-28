import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  BadgeCheck,
  Search,
  CheckCircle2,
  XCircle,
  Link2,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Copy,
  Check
} from 'lucide-react'
import {
  PageHead,
  SeverityBadge,
  Tooltip
} from '../components/ui'
import { useApp } from '../context/AppContext'

const sampleHashes = [
  {
    label: 'Valid Threat Evidence (THR-2041)',
    hash: '0x8f3a9214c91eb44d8721a99f18a2e7c3019f6a73bcde912448371239aa804c1e',
    valid: true
  },
  {
    label: 'Valid Phishing Record (THR-2040)',
    hash: '0x41bd8821907aacd441098492019ffea829103847192837461928374619283746',
    valid: true
  },
  {
    label: 'Tampered / Unknown Hash (Simulate Mismatch)',
    hash: '0xdeadbeef0000111122223333444455556666777788889999aaaabbbbccccdddd',
    valid: false
  }
]

export function Verification() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyHashOnChain, anchorEvidenceOnChain, role } = useApp()

  const [inputHash, setInputHash] = useState(searchParams.get('hash') || '')
  const [result, setResult] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)

  // Custom Anchor tool states
  const [customTitle, setCustomTitle] = useState('')
  const [customPayload, setCustomPayload] = useState('')
  const [anchorLoading, setAnchorLoading] = useState(false)
  const [newAnchorResult, setNewAnchorResult] = useState(null)

  // Run verification if hash param is present in URL
  useEffect(() => {
    const urlHash = searchParams.get('hash')
    if (urlHash) {
      setInputHash(urlHash)
      runVerification(urlHash)
    }
  }, [searchParams])

  const runVerification = (hashToTest) => {
    const target = hashToTest || inputHash
    if (!target.trim()) return

    setIsVerifying(true)
    setTimeout(() => {
      const res = verifyHashOnChain(target)
      setResult(res)
      setIsVerifying(false)
    }, 250)
  }

  const handleCustomAnchor = async (e) => {
    e.preventDefault()
    if (!customTitle.trim() || !customPayload.trim()) return
    setAnchorLoading(true)

    const record = await anchorEvidenceOnChain(customTitle, { payload: customPayload })
    setAnchorLoading(false)
    setNewAnchorResult(record)
    setCustomTitle('')
    setCustomPayload('')
  }

  return (
    <div className="space-y-6">
      <PageHead
        title="Public Evidence Verification & Cryptographic Provenance"
        sub="Zero-Knowledge & Decentralized Trust"
        subtitle="Verify the authenticity and tamper-proof state of social media intelligence reports, tweet captures, and forensic artifacts against the Polygon immutable ledger (Problem ID: SIH26152)."
        badge={<Tooltip termKey="hashAnchoring" />}
      >
        <button
          type="button"
          onClick={() => navigate('/blockchain')}
          className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <Link2 size={14} className="text-accent" />
          <span>Full Blockchain Ledger</span>
        </button>
      </PageHead>

      {/* Verification Query Input Card */}
      <div className="card p-6 border-accent/40 space-y-4">
        <div>
          <div className="label text-accent flex items-center gap-1.5">
            <Search size={13} />
            <span>Public Verification Portal</span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Paste any SHA-256 evidence hash to check cryptographic proof of existence and block timestamp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            className="input font-mono text-xs flex-1 py-2.5"
            placeholder="Paste SHA-256 hash (e.g. 0x8f3a9214c91eb44d...)"
            value={inputHash}
            onChange={(e) => setInputHash(e.target.value)}
          />
          <button
            type="button"
            onClick={() => runVerification()}
            disabled={!inputHash.trim() || isVerifying}
            className="btn text-xs py-2.5 px-6 whitespace-nowrap"
          >
            {isVerifying ? 'Querying Chain...' : 'Verify Hash On-Chain'}
          </button>
        </div>

        {/* Quick Sample Hash Tester for Judges */}
        <div className="pt-2 border-t border-line">
          <div className="text-[11px] text-muted mb-2 font-medium">Quick Test with Sample Hashes:</div>
          <div className="flex flex-wrap gap-2">
            {sampleHashes.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputHash(s.hash)
                  runVerification(s.hash)
                }}
                className={`text-xs px-2.5 py-1.5 rounded-lg border text-left transition-colors font-mono ${
                  s.valid
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    : 'border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                }`}
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VERIFICATION RESULT DISPLAY */}
      {result && (
        <div className="animate-in fade-in duration-200">
          {result.match ? (
            <div className="card p-6 border-emerald-500/50 bg-emerald-500/[0.04] space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 grid place-items-center text-emerald-400 shrink-0">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <span className="label text-emerald-400 font-bold">MATCH CONFIRMED</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      Authentic Evidence Sealed on Polygon Ledger
                    </h3>
                  </div>
                </div>
                <SeverityBadge size="sm">Verified</SeverityBadge>
              </div>

              <div className="p-4 rounded-lg bg-bg/90 border border-line space-y-2 text-xs">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-muted">Anchored Artifact:</span>
                  <span className="font-semibold text-white">{result.record.event || result.record.item}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-muted">Target SHA-256 Hash:</span>
                  <span className="font-mono text-cyan-300 break-all">{result.record.hash}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-muted">Anchored Block Number:</span>
                  <span className="font-mono text-emerald-400 font-bold">Block #{result.record.block}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-muted">Timestamp Sealed:</span>
                  <span className="font-mono text-slate-200">{result.record.ts}</span>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-muted">Smart Contract:</span>
                  <span className="font-mono text-muted">{result.record.contract || '0x71b...882e'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted pt-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <BadgeCheck size={14} />
                  Cryptographic integrity intact. Zero bytes altered since registration.
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/blockchain')}
                  className="text-accent hover:underline flex items-center gap-1 font-medium"
                >
                  <span>View in Blockchain Ledger</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-6 border-red-500/50 bg-red-500/[0.04] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 grid place-items-center text-red-400 shrink-0">
                  <XCircle size={28} />
                </div>
                <div>
                  <span className="label text-red-400 font-bold">MISMATCH / UNVERIFIED</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    Hash Not Found in Immutable Ledger
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-bg/90 border border-line text-xs space-y-2">
                <div className="text-slate-300">
                  The query hash <code className="text-red-400 font-mono break-all">{result.hash}</code> does not match any registered threat, forensic capture, or case dossier on the Sentinel Polygon testnet ledger.
                </div>
                <div className="text-muted text-[11px] leading-relaxed">
                  Possible reasons:
                  <ul className="list-disc pl-4 space-y-0.5 mt-1">
                    <li>The social media post or media file was tampered with (even 1 altered character breaks the SHA-256 digest).</li>
                    <li>The evidence item has not yet been sealed to the blockchain.</li>
                    <li>The hash was copied incompletely.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LIVE SHA-256 HASH GENERATOR & ANCHORING ENGINE */}
      <div className="card p-6 space-y-4 bg-panel-light/30">
        <div>
          <div className="label text-accent flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Interactive On-Chain Evidence Anchoring Engine</span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Simulate the creation of a new forensic artifact. It will be SHA-256 hashed and anchored on a new Polygon block.
          </p>
        </div>

        <form onSubmit={handleCustomAnchor} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">Artifact Title</label>
              <input
                type="text"
                className="input text-xs"
                placeholder="e.g. Quarantined Disinformation Post #9921"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                disabled={role === 'Viewer'}
              />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Target Blockchain</label>
              <div className="input text-xs bg-bg text-muted font-mono flex items-center justify-between">
                <span>Polygon PoS Testnet (Simulated)</span>
                <span className="text-[10px] text-emerald-400">Connected</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Raw Content / JSON Payload</label>
            <textarea
              className="input text-xs h-20 resize-none font-mono"
              placeholder="Paste raw social media text, author handle, timestamp, or extracted metadata..."
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              disabled={role === 'Viewer'}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-muted">
              {role === 'Viewer' ? 'Viewer role is read-only. Switch role in user menu to anchor.' : 'Anchoring emits a cryptographic SHA-256 transaction'}
            </span>
            <button
              type="submit"
              disabled={role === 'Viewer' || anchorLoading || !customTitle.trim() || !customPayload.trim()}
              className="btn text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <Link2 size={13} />
              <span>{anchorLoading ? 'Mining Block...' : 'Compute Hash & Anchor to Chain'}</span>
            </button>
          </div>
        </form>

        {newAnchorResult && (
          <div className="card p-4 border-cyan-500/40 bg-cyan-500/5 space-y-2 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5 text-cyan-300">
                <CheckCircle2 size={14} />
                Successfully Anchored on Block #{newAnchorResult.block}!
              </span>
              <SeverityBadge size="xs">Valid</SeverityBadge>
            </div>
            <div className="font-mono text-slate-300 break-all bg-bg p-2 rounded border border-line">
              SHA-256: {newAnchorResult.hash}
            </div>
            <div className="flex justify-between text-muted text-[11px]">
              <span>Gas: {newAnchorResult.gasUsed}</span>
              <button
                type="button"
                onClick={() => {
                  setInputHash(newAnchorResult.hash)
                  runVerification(newAnchorResult.hash)
                }}
                className="text-accent hover:underline font-semibold"
              >
                Test Verification of this Hash &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
