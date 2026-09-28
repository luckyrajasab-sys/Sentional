import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar as RBar } from 'recharts'
import { PageHead, ChartCard, DataTable, Badge, Drawer, Filters, Bar } from '../components/ui'
import { sentiment, emotions, posts, timeline, trends, keywords, nodes, edges, accounts, threats, chain, regions } from '../data'
import { verifyContent } from '../services/api'
const tip={contentStyle:{background:'#111318',border:'1px solid #1f232b'}}
const ax={stroke:'#8b93a1',fontSize:11}
const F=[['Platform',['All platforms','X','Reddit','YouTube','Telegram']],['Time',['Last 24h','7 days','30 days']],['Language',['All','English','Hindi','Tamil']],['Topic',['All topics','Digital Identity','UPI Fraud']]]
const sc={Positive:'#22d3ee',Neutral:'#64748b',Negative:'#f87171'}

export const Sentiment=()=>(<><PageHead sub="Sentiment analytics" title="Sentiment Intelligence"/><Filters items={F}/>
<div className="grid lg:grid-cols-3 gap-4"><ChartCard title="Overall sentiment"><ResponsiveContainer><PieChart><Pie data={sentiment} dataKey="value" innerRadius={55} outerRadius={85}>{sentiment.map(s=><Cell key={s.name} fill={sc[s.name]}/>)}</Pie><Tooltip {...tip}/></PieChart></ResponsiveContainer></ChartCard>
<ChartCard title="Sentiment timeline" className="lg:col-span-2"><ResponsiveContainer><LineChart data={timeline}><XAxis dataKey="t" {...ax}/><YAxis {...ax}/><Tooltip {...tip}/><Line dataKey="pos" stroke="#22d3ee" dot={false}/><Line dataKey="neg" stroke="#f87171" dot={false}/></LineChart></ResponsiveContainer></ChartCard>
<div className="card p-4"><div className="label mb-3">Emotion breakdown</div>{emotions.map(e=><div key={e.e} className="mb-3 text-sm"><div className="flex justify-between mb-1">{e.e}<span className="text-muted">{e.v}</span></div><Bar v={e.v}/></div>)}</div>
<div className="card p-4 lg:col-span-2"><div className="label mb-3">Sample posts (aggregate, anonymized demo)</div>{posts.map(p=><div key={p.id} className="py-3 border-b border-line/60 text-sm"><div className="flex justify-between text-xs text-muted mb-1">{p.user} - {p.platform} - {p.t}<Badge>{p.s==='Negative'?'High':p.s==='Positive'?'Valid':'Low'}</Badge></div>{p.text}</div>)}</div></div></>)

export const Trends=()=>{const t=trends[0];return(<><PageHead sub="Trend intelligence" title="Trends"/>
<div className="card p-6 mb-4 border-accent/30"><div className="label">Emerging narrative</div><h2 className="text-3xl font-semibold mt-2">{t.topic}</h2>
<div className="grid grid-cols-3 gap-4 mt-4"><div><div className="label">Velocity</div><div className="text-2xl text-accent">+{t.velocity}%</div></div><div><div className="label">Mentions</div><div className="text-2xl">{t.mentions.toLocaleString()}</div></div><div><div className="label">Acceleration</div><div className="text-2xl">{t.acc}</div></div></div>
<div className="flex flex-wrap gap-2 mt-5">{keywords.map(k=><span key={k} className="px-2 py-1 text-xs border border-line rounded">{k}</span>)}</div></div>
<div className="grid lg:grid-cols-2 gap-4"><ChartCard title="Hashtag velocity (%)"><ResponsiveContainer><BarChart data={trends}><XAxis dataKey="topic" {...ax}/><YAxis {...ax}/><Tooltip {...tip}/><RBar dataKey="velocity" fill="#22d3ee" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></ChartCard>
<DataTable cols={[{k:'topic',h:'Topic'},{k:'mentions',h:'Mentions',r:r=>r.mentions.toLocaleString()},{k:'velocity',h:'Velocity',r:r=>'+'+r.velocity+'%'},{k:'acc',h:'Acceleration'}]} rows={trends}/></div></>)}

export function Network(){const[sel,setSel]=useState(null);const N=Object.fromEntries(nodes.map(n=>[n.id,n]))
const col={High:'#f87171',Medium:'#f59e0b',Low:'#22d3ee'}
return(<><PageHead sub="Network intelligence" title="Social Graph"/>
<div className="grid lg:grid-cols-4 gap-4"><div className="card lg:col-span-3 p-2"><svg viewBox="0 0 680 380" className="w-full">{edges.map(([a,b,l],i)=><g key={i}><line x1={N[a].x} y1={N[a].y} x2={N[b].x} y2={N[b].y} stroke="#334155"/><text x={(N[a].x+N[b].x)/2} y={(N[a].y+N[b].y)/2} fill="#64748b" fontSize="9">{l}</text></g>)}
{nodes.map(n=><g key={n.id} onClick={()=>setSel(n)} className="cursor-pointer"><circle cx={n.x} cy={n.y} r={10+n.c/40} fill={col[n.risk]} fillOpacity=".25" stroke={col[n.risk]}><animate attributeName="stroke-opacity" values="1;.3;1" dur="3s" repeatCount="indefinite"/></circle><text x={n.x} y={n.y+30} fill="#cbd5e1" fontSize="10" textAnchor="middle">{n.label}</text></g>)}</svg></div>
<div className="card p-4 text-sm space-y-3"><div className="label">Network metrics</div><div>Density <b className="float-right">0.31</b></div><div>Communities <b className="float-right">3</b></div><div>Suspicious clusters <b className="float-right text-amber-400">1</b></div><div className="text-xs text-muted">Red nodes: synchronized posting pattern (risk signal, not confirmed).</div></div></div>
<Drawer open={!!sel} onClose={()=>setSel(null)} title={sel?.label}>{sel&&<div className="space-y-3 text-sm"><div>Type: {sel.type}</div><div>Connections: {sel.c}</div><div>Risk signal: <Badge>{sel.risk}</Badge></div><div>Centrality: {(sel.c/450).toFixed(2)}</div></div>}</Drawer></>)}

export function Accounts(){const[a,setA]=useState(null)
return(<><PageHead sub="Bot & account intelligence" title="Accounts"/>
<DataTable onRow={setA} cols={[{k:'handle',h:'Account'},{k:'platform',h:'Platform'},{k:'followers',h:'Followers'},{k:'following',h:'Following'},{k:'age',h:'Account age'},{k:'freq',h:'Posting freq.'},{k:'bot',h:'Bot probability',r:r=>r.bot+'%'},{k:'risk',h:'Risk',r:r=><Badge>{r.risk}</Badge>},{k:'status',h:'Status'}]} rows={accounts}/>
<Drawer open={!!a} onClose={()=>setA(null)} title={a?.handle}>{a&&<div className="space-y-4 text-sm"><div><div className="label">Detection probability</div><div className="text-3xl text-accent my-1">{a.bot}%</div><Bar v={a.bot}/></div>
<div><div className="label mb-2">{a.bot>70?'High bot signal':'Low bot signal'}</div>{a.signals.map(s=><div key={s} className="py-1.5 border-b border-line/60">- {s}</div>)}</div>
<div className="h-32"><ResponsiveContainer><LineChart data={timeline}><XAxis dataKey="t" {...ax}/><Tooltip {...tip}/><Line dataKey="vol" stroke="#22d3ee" dot={false}/></LineChart></ResponsiveContainer></div><p className="text-xs text-muted">AI risk signal only. Requires analyst review.</p></div>}</Drawer></>)}

export function Threats(){const[t,setT]=useState(null)
return(<><PageHead sub="Threat center" title="Threat Intelligence"/><Filters items={[['Category',['All','Misinformation','Phishing','Scam','Bot Network','Coordinated Campaign','Impersonation','Malicious URL','Suspicious Content']],['Severity',['All','Critical','High','Medium','Low']]]}/>
<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{threats.map(x=><div key={x.id} onClick={()=>setT(x)} className="card p-4 cursor-pointer"><div className="flex justify-between"><span className="label">{x.id}</span><Badge>{x.sev}</Badge></div><div className="font-medium mt-2">{x.type}</div><div className="text-xs text-muted mt-1">{x.platform} - {x.time} - {x.accounts} accounts</div><div className="mt-3 text-xs">AI confidence {x.conf}%</div><Bar v={x.conf}/><div className="text-xs text-muted mt-2">{x.status}</div></div>)}</div>
<Drawer open={!!t} onClose={()=>setT(null)} title={t?.id}>{t&&<div className="space-y-3 text-sm"><div>Type: {t.type}</div><div>Severity: <Badge>{t.sev}</Badge></div><div>Platform: {t.platform}</div><div>Potential threat, AI confidence {t.conf}%</div><div>Affected accounts: {t.accounts}</div><div>Status: {t.status}</div></div>}</Drawer></>)}

export function Verification(){const[v,setV]=useState(''),[r,setR]=useState(null),[l,setL]=useState(false)
const run=async()=>{setL(true);setR(await verifyContent(v));setL(false)}
return(<><PageHead sub="Content verification" title="Verify Content"/>
<div className="card p-4 mb-4"><textarea className="input h-28" placeholder="Paste social media text, a URL, or a content hash" value={v} onChange={e=>setV(e.target.value)}/><button disabled={!v||l} onClick={run} className="btn mt-3 disabled:opacity-50">{l?'Analyzing...':'Verify'}</button></div>
{r&&<div className="grid md:grid-cols-2 gap-4"><div className="card p-5"><div className="label">Verification status</div><div className="text-3xl text-emerald-400 my-2">{r.status}</div><div className="text-xs font-mono break-all text-muted">SHA-256: {r.hash}</div></div>
<div className="card p-5 text-sm space-y-2"><div className="label">Blockchain (demo simulation)</div><div>Network: {r.network}</div><div>Block: #{r.block}</div><div>Timestamp: {r.ts}</div><div>AI confidence: {r.confidence}%</div></div></div>}</>)}

export function Blockchain(){const[b,setB]=useState(null)
return(<><PageHead sub="Blockchain audit" title="Evidence Ledger"><Badge>Pending</Badge><span className="text-xs text-muted self-center">Mock data - not connected to a live chain</span></PageHead>
<div className="flex flex-wrap items-center gap-2 mb-5">{chain.map((c,i)=><div key={c.hash} className="flex items-center gap-2"><button onClick={()=>setB(c)} className="card px-4 py-3 text-xs hover:border-accent">BLOCK 0{i+1}<div className="text-muted">#{c.block}</div></button>{i<chain.length-1&&<span className="text-accent">&rarr;</span>}</div>)}</div>
<DataTable onRow={setB} cols={[{k:'hash',h:'Hash'},{k:'event',h:'Event'},{k:'ts',h:'Timestamp'},{k:'block',h:'Block'},{k:'status',h:'Status',r:r=><Badge>{r.status}</Badge>}]} rows={chain}/>
<Drawer open={!!b} onClose={()=>setB(null)} title={'Block #'+b?.block}>{b&&<div className="space-y-3 text-sm font-mono"><div>{b.hash}</div><div>{b.event}</div><div>{b.ts}</div><Badge>{b.status}</Badge></div>}</Drawer></>)}

export const GeoMap=()=>(<><PageHead sub="Geo intelligence" title="Activity Map"/><Filters items={[['Time',['Last 24h','7 days']],['Threat',['All','Critical','High']],...F.slice(0,1)]}/>
<div className="card relative h-[460px] overflow-hidden" style={{backgroundImage:'radial-gradient(#1f232b 1px,transparent 1px)',backgroundSize:'24px 24px'}}>
{regions.map(r=><div key={r.n} className="absolute group" style={{left:r.x+'%',top:r.y+'%'}}><span className="block rounded-full bg-accent/30 border border-accent animate-pulse" style={{width:r.d/3,height:r.d/3}}/><span className="absolute left-full ml-2 top-0 text-xs whitespace-nowrap">{r.n}<span className="text-muted"> - {r.s}</span></span></div>)}
<div className="absolute bottom-3 left-3 label">Schematic demo map - swap in Leaflet with dark tiles for production</div></div></>)

export function Reports(){const[g,setG]=useState(false)
const S=['Executive Summary','Sentiment Overview','Trend Analysis','Threat Analysis','Network Analysis','Blockchain Evidence']
return(<><PageHead sub="Reports" title="Report Generator"/><Filters items={[['Range',['Last 24h','7 days','30 days']],...F.slice(0,1),F[3],['Threat',['All','Phishing','Misinformation','Bot Network']]]}/>
<div className="card p-5"><div className="grid sm:grid-cols-2 gap-3">{S.map((s,i)=><div key={s} className="border border-line rounded-lg p-3 text-sm"><div className="label">Section {i+1}</div>{s}</div>)}</div>
<button onClick={()=>{setG(true);setTimeout(()=>setG(false),1200)}} className="btn mt-4">{g?'Generating...':'Generate Report'}</button></div></>)}

export const About=()=>(<div className="max-w-5xl mx-auto p-6"><Link to="/" className="text-accent text-sm">&larr; Home</Link><h1 className="text-3xl font-semibold my-4">About Sentinel</h1>
<div className="grid sm:grid-cols-2 gap-4">{[['Problem','Public social signals are vast and noisy; analysts cannot manually spot coordinated abuse.'],['Why it matters','Social analytics informs public safety, brand trust and policy response.'],['Cybersecurity challenges','Bots, phishing, impersonation and coordinated manipulation.'],['AI/ML role','NLP sentiment, anomaly and bot classification, network analysis.'],['Blockchain role','Anchors SHA-256 evidence hashes for a tamper-evident audit trail.'],['Research gap','Few tools combine analytics, threat detection and verifiable evidence.'],['Proposed solution','A unified dashboard: signals to threats to evidence to action.'],['Future scope','Live APIs, real ML models, on-chain contracts, multilingual support.']].map(([t,d])=><div key={t} className="card p-5"><div className="label">{t}</div><p className="text-sm mt-2 text-slate-300">{d}</p></div>)}</div></div>)
