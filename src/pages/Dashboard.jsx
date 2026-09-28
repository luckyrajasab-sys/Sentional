import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar as RBar, PieChart, Pie, Cell } from 'recharts'
import { MetricCard, ChartCard, PageHead, Badge } from '../components/ui'
import { kpis, timeline, platforms, threats } from '../data'
const C=['#22d3ee','#3b82f6','#6366f1','#64748b','#334155']
const ax={stroke:'#8b93a1',fontSize:11}
const tip={contentStyle:{background:'#111318',border:'1px solid #1f232b'}}
export default function Dashboard(){return(<>
<PageHead sub="Live monitoring" title="Social Intelligence"><Badge>Medium</Badge><span className="text-xs text-muted self-center">Chain: Polygon testnet (simulated) - Updated just now</span></PageHead>
<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-4">{kpis.map(k=><MetricCard key={k.label} {...k}/>)}</div>
<div className="grid lg:grid-cols-3 gap-4">
<ChartCard title="Sentiment over time" className="lg:col-span-2"><ResponsiveContainer><AreaChart data={timeline}><XAxis dataKey="t" {...ax}/><YAxis {...ax}/><Tooltip {...tip}/><Area dataKey="pos" stackId="1" stroke="#22d3ee" fill="#22d3ee" fillOpacity={.25}/><Area dataKey="neu" stackId="1" stroke="#64748b" fill="#64748b" fillOpacity={.2}/><Area dataKey="neg" stackId="1" stroke="#f87171" fill="#f87171" fillOpacity={.25}/></AreaChart></ResponsiveContainer></ChartCard>
<ChartCard title="Platform distribution"><ResponsiveContainer><PieChart><Pie data={platforms} dataKey="value" innerRadius={55} outerRadius={85}>{platforms.map((p,i)=><Cell key={p.name} fill={C[i]}/>)}</Pie><Tooltip {...tip}/></PieChart></ResponsiveContainer></ChartCard>
<ChartCard title="Activity volume"><ResponsiveContainer><BarChart data={timeline}><XAxis dataKey="t" {...ax}/><YAxis {...ax}/><Tooltip {...tip}/><RBar dataKey="vol" fill="#22d3ee" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></ChartCard>
<ChartCard title="Threat events"><ResponsiveContainer><BarChart data={timeline}><XAxis dataKey="t" {...ax}/><YAxis {...ax}/><Tooltip {...tip}/><RBar dataKey="threats" fill="#f59e0b" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></ChartCard>
<div className="card p-4"><div className="label mb-3">Latest alerts</div>{threats.slice(0,4).map(t=><div key={t.id} className="flex justify-between items-center py-2 border-b border-line/60 text-sm"><span>{t.type}<div className="text-xs text-muted">{t.platform} - {t.time}</div></span><Badge>{t.sev}</Badge></div>)}</div>
</div></>)}
