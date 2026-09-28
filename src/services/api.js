// Swap these mock calls for fetch('/api/...') when a backend exists.
import * as d from '../data'
const wrap = (v) => new Promise(r => setTimeout(() => r(v), 150))
export const getThreats = () => wrap(d.threats)
export const getAccounts = () => wrap(d.accounts)
export const getChain = () => wrap(d.chain)
export const verifyContent = async (input) => { // POST /api/verify
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  const hash = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
  return wrap({ hash, block: 1928374, network: 'Polygon Test Network (simulated)', status: 'Valid', ts: new Date().toISOString().slice(0,16).replace('T',' ')+' UTC', confidence: 87 })
}
