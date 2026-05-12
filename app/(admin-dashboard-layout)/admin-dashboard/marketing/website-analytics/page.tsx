"use client";
import React, { useMemo } from "react";
import { useRange } from "@/components/range-context";
import { useWebsiteAnalytics } from "@/hooks/use-metrics";
import { ProductSummaryMetric } from "@/lib/types/api";

const COLORS = ["#6366f1", "#818cf8", "#f97316", "#22c55e", "#06b6d4", "#60a5fa"];

/* ─────────────────────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────────────────────── */
interface SparklineProps {
    points: number[];
    color: string;
    yLabels: string[];
    xLabels: string[];
}

function Sparkline({ points, color, yLabels, xLabels }: SparklineProps) {
    const W = 200, H = 72, padR = 40, padB = 14, padT = 4;
    const chartW = W - padR, chartH = H - padT - padB;
    const n = points.length;
    
    if (n === 0) return <div style={{ height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#cbd5e1' }}>No trend data</div>;

    const min = Math.min(...points);
    const max = Math.max(...points, 1);
    const range = max - min || 1;

    const xs = points.map((_, i) => (i / Math.max(1, n - 1)) * chartW);
    const ys = points.map((v) => padT + chartH - ((v - min) / range) * chartH);
    
    const linePts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
    const areaPts = [
        ...xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`),
        `${xs[n - 1].toFixed(1)},${(padT + chartH).toFixed(1)}`,
        `0,${(padT + chartH).toFixed(1)}`,
    ].join(" ");
    
    const gridYs = [padT, padT + chartH / 2, padT + chartH];
    const uid = `sp${color.replace(/[^a-z0-9]/gi, "").slice(0, 6)}`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
            <defs>
                <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            {gridYs.map((gy, i) => (
                <line key={i} x1={0} y1={gy} x2={chartW} y2={gy} stroke="#eff0f5" strokeWidth={0.8} />
            ))}
            {yLabels.map((lbl, i) => (
                <text key={i} x={W - 2} y={gridYs[i] + 3.5} fontSize={7.5} fill="#c9ccd6" textAnchor="end" fontWeight="700">{lbl}</text>
            ))}
            <polygon points={areaPts} fill={`url(#${uid})`} />
            <polyline points={linePts} fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
            {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r={2.5} fill={color} stroke="#fff" strokeWidth={0.8} />)}
            {xLabels.map((lbl, i) => {
                const x = (i / Math.max(1, xLabels.length - 1)) * chartW;
                return (
                    <text key={i} x={x} y={H - 1} fontSize={7.5} fill="#c9ccd6" textAnchor="middle" fontWeight="600">{lbl}</text>
                );
            })}
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────────────────────── */
interface KpiCardProps {
    label: string; value: string | number; delta: string; up: boolean; sub?: string;
    metric: ProductSummaryMetric; color: string; xLabels: string[];
}

function KpiCard({ label, value, delta, up, sub, metric, color, xLabels }: KpiCardProps) {
    const pts = metric.trend as number[];
    const min = Math.min(...pts);
    const max = Math.max(...pts, 1);
    const yLbls = [
        max > 1000 ? `${(max/1000).toFixed(0)}k` : max.toString(),
        ((max+min)/2) > 1000 ? `${((max+min)/2000).toFixed(0)}k` : Math.round((max+min)/2).toString(),
        min > 1000 ? `${(min/1000).toFixed(0)}k` : min.toString()
    ];

    return (
        <div style={s.kpiCard}>
            <div style={s.cardHeader}>
                <span style={s.cardLabel}>{label}</span>
                <span style={s.arrow}>→</span>
            </div>
            <div style={s.kpiValue}>{value}</div>
            <div style={{ ...s.badge, background: up ? "#e8faf0" : "#fff4ed", color: up ? "#1a9c4e" : "#d45f1a" }}>
                {up ? "▲" : "▼"} {delta}
            </div>
            {sub && <div style={s.kpiSub}>{sub}</div>}
            <div style={{ marginTop: 8 }}>
                <Sparkline points={pts} color={color} yLabels={yLbls} xLabels={xLabels} />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   BAR CHART
───────────────────────────────────────────────────────────── */
function BarChart({ data }: { data: any[] }) {
    const W = 660, H = 210, padL = 46, padB = 24, padR = 12, padT = 22;
    const chartW = W - padL - padR, chartH = H - padT - padB;
    
    const allVals = data.flatMap(d => [d.sessions, d.users]);
    const maxVal = Math.max(...allVals, 1);
    const yTicks = [0, maxVal / 2, maxVal];
    
    const n = data.length;
    const slotW = chartW / Math.max(1, n);
    const barW = slotW * 0.3, gap = 4;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
            <circle cx={W - 170} cy={padT - 8} r={4} fill="#6366f1" />
            <text x={W - 162} y={padT - 4.5} fontSize={9} fill="#9ca3af" fontWeight="600">Users</text>
            <circle cx={W - 112} cy={padT - 8} r={4} fill="#c7d2fe" />
            <text x={W - 104} y={padT - 4.5} fontSize={9} fill="#9ca3af" fontWeight="600">Sessions</text>

            {yTicks.map((v) => {
                const y = padT + chartH - (v / maxVal) * chartH;
                return (
                    <g key={v}>
                        <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f0f1f6" strokeWidth={0.8} />
                        <text x={padL - 6} y={y + 3.5} fontSize={9} fill="#c9ccd6" textAnchor="end" fontWeight="700">
                            {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : Math.round(v)}
                        </text>
                    </g>
                );
            })}

            {data.map((d, i) => {
                const cx = padL + i * slotW + slotW / 2;
                const sh = (d.sessions / maxVal) * chartH;
                const uh = (d.users / maxVal) * chartH;
                const dayLabel = d.date.split('-')[2];
                return (
                    <g key={i}>
                        <rect x={cx - barW - gap / 2} y={padT + chartH - sh} width={barW} height={sh} rx={2} fill="#c7d2fe" />
                        <rect x={cx + gap / 2} y={padT + chartH - uh} width={barW} height={uh} rx={2} fill="#6366f1" />
                        {n < 15 && <text x={cx} y={H - 6} fontSize={9} fill="#b0b4c3" textAnchor="middle" fontWeight="600">{dayLabel}</text>}
                    </g>
                );
            })}
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────
   WAVE CHART
───────────────────────────────────────────────────────────── */
function smooth(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        d += ` C ${mx},${pts[i].y} ${mx},${pts[i + 1].y} ${pts[i + 1].x},${pts[i + 1].y}`;
    }
    return d;
}

function WaveChart({ data }: { data: any[] }) {
    const W = 660, H = 210, padL = 10, padR = 10, padT = 22, padB = 24;
    const chartW = W - padL - padR, chartH = H - padT - padB;
    const n = data.length;
    
    const maxTime = Math.max(...data.map(d => d.avg_time), 1);
    const maxBounce = Math.max(...data.map(d => d.bounce_rate), 1);
    
    const toYTime = (v: number) => padT + chartH - (v / maxTime) * chartH;
    const toYBounce = (v: number) => padT + chartH - (v / maxBounce) * chartH;

    const avgPts = data.map((d, i) => ({ x: padL + (i / Math.max(1, n - 1)) * chartW, y: toYTime(d.avg_time) }));
    const bncPts = data.map((d, i) => ({ x: padL + (i / Math.max(1, n - 1)) * chartW, y: toYBounce(d.bounce_rate) }));
    
    const avgPath = smooth(avgPts);
    const bncPath = smooth(bncPts);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
            <circle cx={W - 232} cy={padT - 8} r={4} fill="#fb923c" />
            <text x={W - 224} y={padT - 4.5} fontSize={9} fill="#9ca3af" fontWeight="600">Avg Time</text>
            <circle cx={W - 120} cy={padT - 8} r={4} fill="#ef4444" />
            <text x={W - 112} y={padT - 4.5} fontSize={9} fill="#9ca3af" fontWeight="600">Bounce Rate %</text>

            <path d={avgPath} fill="none" stroke="#fb923c" strokeWidth={2.2} />
            <path d={bncPath} fill="none" stroke="#ef4444" strokeWidth={2.2} />
            
            {avgPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#fb923c" stroke="#fff" strokeWidth={1} />)}
            {bncPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#ef4444" stroke="#fff" strokeWidth={1} />)}
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────
   LANGUAGE ROW
───────────────────────────────────────────────────────────── */
function LangRow({ name, pct, visits, color }: { name: string; pct: number; visits: number; color: string }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{name}</span>
                <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{pct}% · {visits.toLocaleString()}</span>
            </div>
            <div style={{ height: 5, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────────────────────── */
export default function AnalyticsDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useWebsiteAnalytics(activeRange, customStart, customEnd);

    const xLabels = useMemo(() => {
        if (!data) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return data.summary.site_visits.trend.map((_, i) => {
            if (!data.charts.visits_users[i]) return "";
            return days[new Date(data.charts.visits_users[i].date).getDay()];
        });
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Website Analytics...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading analytics.</div>;

    const { summary, charts, breakdowns } = data;

    return (
        <div style={s.root}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Website Analytics</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* ROW 1 – KPI */}
            <div style={s.kpiRow}>
                <KpiCard label="SITE VISITS" value={summary.site_visits.value.toLocaleString()} delta={`${Math.abs(summary.site_visits.growth_lw!)}% vs LW`} up={summary.site_visits.growth_lw! >= 0} sub={summary.site_visits.users_info}
                    metric={summary.site_visits} color="#818cf8" xLabels={xLabels} />
                <KpiCard label="UNIQUE USERS" value={summary.unique_users.value.toLocaleString()} delta={`${Math.abs(summary.unique_users.growth_lw!)}% vs LW`} up={summary.unique_users.growth_lw! >= 0} sub={summary.unique_users.new_users_info}
                    metric={summary.unique_users} color="#818cf8" xLabels={xLabels} />
                <KpiCard label="AVG. TIME ON SITE" value={summary.avg_time_on_site.value} delta={`${Math.abs(summary.avg_time_on_site.growth_lw!)}% vs LW`} up={summary.avg_time_on_site.growth_lw! >= 0}
                    metric={summary.avg_time_on_site} color="#fb923c" xLabels={xLabels} />
                <KpiCard label="BOUNCE RATE" value={summary.bounce_rate.value} delta={`${Math.abs(summary.bounce_rate.growth_lw!)}pp vs LW`} up={summary.bounce_rate.growth_lw! <= 0}
                    metric={summary.bounce_rate} color="#f87171" xLabels={xLabels} />
                <KpiCard label="PAGES / SESSION" value={summary.pages_per_session.value} delta={`${Math.abs(summary.pages_per_session.growth_lw!)} vs LW`} up={summary.pages_per_session.growth_lw! >= 0}
                    metric={summary.pages_per_session} color="#34d399" xLabels={xLabels} />
            </div>

            {/* ROW 2 – Charts */}
            <div style={s.chartsRow}>
                <div style={s.chartCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>SITE VISITS BY USERS – DAILY</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <BarChart data={charts.visits_users} />
                </div>
                <div style={s.chartCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>AVG. TIME SPENT – DAILY (MIN)</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <WaveChart data={charts.time_bounce} />
                </div>
            </div>

            {/* ROW 3 – Tables */}
            <div style={s.tablesRow}>
                {/* Country */}
                <div style={s.tableCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>VISITS BY COUNTRY</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>COUNTRY</th>
                                <th style={{ ...s.th, textAlign: "right" }}>VISITS</th>
                                <th style={{ ...s.th, textAlign: "right" }}>%</th>
                                <th style={{ ...s.th, textAlign: "right" }}>AVG TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {breakdowns.by_country.map((r, i) => (
                                <tr key={i}>
                                    <td style={s.td}>{r.label}</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.visits.toLocaleString()}</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.perc}%</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.avg_time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* City */}
                <div style={s.tableCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>VISITS BY CITY</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>CITY</th>
                                <th style={{ ...s.th, textAlign: "right" }}>VISITS</th>
                                <th style={{ ...s.th, textAlign: "right" }}>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {breakdowns.by_city.map((r, i) => (
                                <tr key={i}>
                                    <td style={s.td}>🏙 {r.label}</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.visits.toLocaleString()}</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.perc}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Language */}
                <div style={s.tableCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>VISITS BY LANGUAGE</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        {breakdowns.by_language.map((r, i) => (
                            <LangRow key={i} name={r.label} pct={r.perc} visits={r.visits} color={COLORS[i % COLORS.length]} />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    root: {
        fontFamily: "'Inter','Segoe UI',sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        padding: 24,
        boxSizing: "border-box",
    },
    kpiRow: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 12 },
    chartsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
    tablesRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
    kpiCard: { background: "#fff", borderRadius: 14, padding: "18px 20px 12px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: '1px solid #f1f5f9' },
    chartCard: { background: "#fff", borderRadius: 14, padding: "20px 24px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: '1px solid #f1f5f9' },
    tableCard: { background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: '1px solid #f1f5f9' },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    cardLabel: { fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" },
    arrow: { fontSize: 13, color: "#cbd5e1" },
    kpiValue: { fontSize: 32, fontWeight: 600, color: "#1e293b", letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 4 },
    badge: { display: "inline-flex", alignItems: "center", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 700, marginBottom: 4 },
    kpiSub: { fontSize: 11, color: "#94a3b8", marginBottom: 4, fontWeight: 500 },
    table: { width: "100%", borderCollapse: "collapse", marginTop: 4 },
    th: { fontSize: 10, fontWeight: 700, color: "#6366f1", letterSpacing: "0.07em", textTransform: "uppercase", paddingBottom: 8, textAlign: "left", borderBottom: "1px solid #f1f5f9" },
    td: { fontSize: 13, color: "#475569", padding: "10px 0", borderBottom: "1px solid #f8fafc", fontWeight: 500 },
};
