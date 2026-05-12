"use client";
import React, { useMemo } from "react";
import { useRange } from "@/components/range-context";
import { usePaidMediaData } from "@/hooks/use-metrics";
import { PaidMediaChannel } from "@/lib/types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtEur(n: number): string {
    return "€" + Math.round(n).toLocaleString("de-DE");
}

function fmtNum(n: number): string {
    return Math.round(n).toLocaleString("de-DE");
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ color, data, xLabels }: { color: string; data: number[]; xLabels: string[] }) {
    const W = 200, H = 52, padL = 4, padR = 32, padT = 6, padB = 18;
    const chartW = W - padL - padR, chartH = H - padT - padB;
    const n = data.length;
    
    if (n === 0) return <div style={{ height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#cbd5e1' }}>No trend</div>;

    const min = Math.min(...data);
    const max = Math.max(...data, 1);
    const range = max - min || 1;

    const pts = data.map((v, i) => ({
        x: padL + (i / Math.max(1, n - 1)) * chartW,
        y: padT + chartH - ((v - min) / range) * chartH,
    }));

    const polyPoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    const gradId = `sg-${color.replace("#", "")}`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 80 }} overflow="visible">
            <defs>
                <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.01} />
                </linearGradient>
            </defs>
            <path d={`${polyPoints} L${pts[n-1].x},${padT + chartH} L${pts[0].x},${padT + chartH} Z`} fill={`url(#${gradId})`} />
            <polyline points={polyPoints} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} stroke="#fff" strokeWidth={0.5} />)}
            
            {/* Y Ticks */}
            <text x={W - padR + 4} y={padT + 3} fontSize="7" fill="#cbd5e1" fontWeight="700" dominantBaseline="middle">{max >= 1000 ? `${(max/1000).toFixed(0)}k` : max}</text>
            <text x={W - padR + 4} y={padT + chartH + 3} fontSize="7" fill="#cbd5e1" fontWeight="700" dominantBaseline="middle">{min >= 1000 ? `${(min/1000).toFixed(0)}k` : min}</text>

            {/* X Labels */}
            {xLabels.map((d, i) => (
                <text key={i} x={padL + (i / Math.max(1, xLabels.length - 1)) * chartW} y={H - 2} fontSize="7" fill="#94a3b8" textAnchor="middle" fontWeight="600">{d}</text>
            ))}
        </svg>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = usePaidMediaData(activeRange, customStart, customEnd);

    const xLabels = useMemo(() => {
        if (!data) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        // Using ad spend trend as a proxy for labels
        const trend = data.summary.total_ad_spend.trend as any[];
        return trend.map(t => days[new Date(t.date || Date.now()).getDay()]);
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Paid Media Data...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading analytics.</div>;

    const { summary, channel_performance } = data;

    const totals = {
        spend: channel_performance.reduce((s, c) => s + c.spend, 0),
        impressions: channel_performance.reduce((s, c) => s + c.impressions, 0),
        clicks: channel_performance.reduce((s, c) => s + c.clicks, 0),
        conv: channel_performance.reduce((s, c) => s + c.conv, 0),
        value: summary.revenue_generated.value,
    };

    const getChannelColor = (name: string) => {
        if (name.includes("Google")) return "#3b82f6";
        if (name.includes("Meta")) return "#ef4444";
        return "#111827";
    };

    return (
        <div style={styles.root}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Paid Media Analysis</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* ── KPI Row ── */}
            <div style={styles.kpiRow}>
                <div style={styles.kpiCard}>
                    <div style={styles.kpiLabel}>TOTAL AD SPEND</div>
                    <div style={styles.kpiValue}>{fmtEur(summary.total_ad_spend.value as number)}</div>
                    <div style={styles.kpiSub}>YTD: €0</div>
                    <Sparkline color="#f59e0b" data={summary.total_ad_spend.trend as number[]} xLabels={xLabels} />
                </div>
                <div style={styles.kpiCard}>
                    <div style={styles.kpiLabel}>TOTAL CONVERSIONS</div>
                    <div style={styles.kpiValue}>{summary.total_conversions.value}</div>
                    <div style={{ ...styles.badge, color: "#16a34a", background: "#f0fdf4" }}>▲ 0% vs LW</div>
                    <Sparkline color="#10b981" data={summary.total_conversions.trend as number[] || []} xLabels={xLabels} />
                </div>
                <div style={styles.kpiCard}>
                    <div style={styles.kpiLabel}>BLENDED CPA</div>
                    <div style={styles.kpiValue}>€{summary.blended_cpa.value.toFixed(2)}</div>
                    <div style={styles.kpiSub}>Cost per reservation</div>
                    <Sparkline color="#8b5cf6" data={[]} xLabels={xLabels} />
                </div>
                <div style={styles.kpiCard}>
                    <div style={styles.kpiLabel}>REVENUE GENERATED</div>
                    <div style={styles.kpiValue}>{fmtEur(summary.revenue_generated.value)}</div>
                    <div style={styles.kpiSub}>ROAS {summary.revenue_generated.roas}× blended</div>
                    <Sparkline color="#10b981" data={[]} xLabels={xLabels} />
                </div>
                <div style={styles.kpiCard}>
                    <div style={styles.kpiLabel}>BLENDED CTR</div>
                    <div style={styles.kpiValue}>{summary.blended_ctr.value}</div>
                    <div style={{ ...styles.badge, color: "#6366f1", background: "#f1f5f9" }}>▲ 0% vs LW</div>
                    <Sparkline color="#6366f1" data={[]} xLabels={xLabels} />
                </div>
            </div>

            {/* ── Channel Performance Table ── */}
            <div style={styles.card}>
                <div style={styles.tableHeader}>
                    <span style={styles.sectionTitle}>PAID MEDIA — CHANNEL PERFORMANCE</span>
                    <span style={styles.sectionSubRight}>LIVE MEDIA METRICS</span>
                </div>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thead}>
                            {["CHANNEL", "SPEND", "IMPRESSIONS", "CLICKS", "CTR", "CPC", "CONV.", "CPA", "ROAS", "VALUE"].map(h => (
                                <th key={h} style={styles.th}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {channel_performance.map((row) => (
                            <tr key={row.channel} style={styles.tr}>
                                <td style={styles.td}>
                                    <span style={{ ...styles.dot, background: getChannelColor(row.channel) }} />
                                    {row.channel}
                                </td>
                                <td style={styles.td}>{fmtEur(row.spend)}</td>
                                <td style={styles.td}>{fmtNum(row.impressions)}</td>
                                <td style={styles.td}>{fmtNum(row.clicks)}</td>
                                <td style={styles.td}>
                                    <span style={styles.ctrBadge}>{row.ctr}</span>
                                </td>
                                <td style={styles.td}>€{row.cpc.toFixed(2)}</td>
                                <td style={styles.td}>{row.conv}</td>
                                <td style={{ ...styles.td, color: "#16a34a", fontWeight: 600 }}>€{row.cpa.toFixed(1)}</td>
                                <td style={{ ...styles.td, color: "#374151", fontWeight: 600 }}>{row.roas}×</td>
                                <td style={styles.td}>{fmtEur(row.spend * row.roas)}</td>
                            </tr>
                        ))}
                        <tr style={{ ...styles.tr, fontWeight: 700, borderTop: "1.5px solid #e5e7eb", background: "#fcfcfd" }}>
                            <td style={styles.td}>Total</td>
                            <td style={styles.td}>{fmtEur(totals.spend)}</td>
                            <td style={styles.td}>{fmtNum(totals.impressions)}</td>
                            <td style={styles.td}>{fmtNum(totals.clicks)}</td>
                            <td style={styles.td}>{(totals.clicks/totals.impressions*100 || 0).toFixed(2)}%</td>
                            <td style={styles.td}>€{(totals.spend/totals.clicks || 0).toFixed(2)}</td>
                            <td style={styles.td}>{totals.conv}</td>
                            <td style={styles.td}>€{(totals.spend/totals.conv || 0).toFixed(1)}</td>
                            <td style={styles.td}>{(totals.value/totals.spend || 0).toFixed(2)}×</td>
                            <td style={styles.td}>{fmtEur(totals.value)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ── Individual Channel Summary ── */}
            <div style={styles.channelCardsRow}>
                {channel_performance.filter(c => c.spend > 0).map((channel) => (
                    <div key={channel.channel} style={{ ...styles.channelCard, borderTopColor: getChannelColor(channel.channel) }}>
                        <div style={styles.channelCardHeader}>
                            <span style={{ ...styles.channelDot, background: getChannelColor(channel.channel) }} />
                            <span style={styles.channelCardLabel}>{channel.channel.toUpperCase()}</span>
                        </div>
                        <div style={styles.channelSpend}>{fmtEur(channel.spend)}</div>
                        <div style={styles.channelSubLabel}>Spend this {activeRange}</div>
                        <div style={styles.metricsGrid}>
                            {[
                                { label: "IMPRESSIONS", value: fmtNum(channel.impressions) },
                                { label: "CLICKS", value: fmtNum(channel.clicks) },
                                { label: "CTR", value: channel.ctr, green: true },
                                { label: "CPC", value: `€${channel.cpc.toFixed(2)}` },
                                { label: "CONVERSIONS", value: channel.conv, green: true },
                                { label: "CPA", value: `€${channel.cpa.toFixed(1)}`, green: true },
                            ].map((m) => (
                                <div key={m.label} style={styles.metricCell}>
                                    <div style={styles.metricLabel}>{m.label}</div>
                                    <div style={{ ...styles.metricValue, color: m.green ? "#16a34a" : "#111827" }}>{m.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {channel_performance.filter(c => c.spend === 0).map(c => (
                    <div key={c.channel} style={{ ...styles.channelCard, opacity: 0.6, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>{c.channel} - No activity this period</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    root: {
        fontFamily: "'Inter', sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    kpiRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 },
    kpiCard: { background: "#fff", borderRadius: 12, padding: "18px 20px 10px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: '1px solid #f1f5f9' },
    kpiLabel: { fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", marginBottom: 6 },
    kpiValue: { fontSize: 30, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 4 },
    badge: { display: "inline-flex", alignItems: "center", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 700, marginBottom: 4 },
    kpiSub: { fontSize: 10, color: "#94a3b8", marginBottom: 4, fontWeight: 500 },
    card: { background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: '1px solid #f1f5f9' },
    tableHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    sectionTitle: { fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#94a3b8", textTransform: "uppercase" },
    sectionSubRight: { fontSize: 9, color: "#cbd5e1", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 800 },
    table: { width: "100%", borderCollapse: "collapse" },
    thead: { borderBottom: "1.5px solid #f1f5f9" },
    th: { textAlign: "left", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", paddingBottom: 10 },
    tr: { borderBottom: "1px solid #f8fafc" },
    td: { padding: "12px 0", fontSize: 13, color: "#1e293b", fontWeight: 500 },
    dot: { display: "inline-block", width: 8, height: 8, borderRadius: "50%", marginRight: 8 },
    ctrBadge: { background: "#dcfce7", color: "#16a34a", fontWeight: 700, padding: "2px 8px", borderRadius: 20, fontSize: 11 },
    channelCardsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
    channelCard: { background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", borderTop: "4px solid transparent", border: '1px solid #f1f5f9' },
    channelCardHeader: { display: "flex", alignItems: "center", marginBottom: 12 },
    channelDot: { width: 8, height: 8, borderRadius: "50%", marginRight: 8 },
    channelCardLabel: { fontSize: 10, fontWeight: 800, color: "#94a3b8" },
    channelSpend: { fontSize: 32, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.5px" },
    channelSubLabel: { fontSize: 11, color: "#94a3b8", marginBottom: 16, fontWeight: 500 },
    metricsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
    metricCell: { background: "#f8fafc", borderRadius: 12, padding: "10px" },
    metricLabel: { fontSize: 8, fontWeight: 800, color: "#94a3b8", marginBottom: 4 },
    metricValue: { fontSize: 15, fontWeight: 700 },
};
