"use client";
import React, { useMemo } from "react";
import { useRange } from "@/components/range-context";
import { useLoyaltyData } from "@/hooks/use-metrics";
import { 
    LoyaltyTierMovement, 
    AtRiskLoyalClient, 
    LoyaltyEvolutionPoint, 
    ProductSummaryMetric 
} from "@/lib/types/api";

// ── Types ──────────────────────────────────────────────────────────────────
type TierType = "New" | "Potential" | "Loyal" | "VIP" | "Super Loyal" | "At Risk";

// ── Card Sparkline (matches reference: area chart with axes) ───────────────
function Sparkline({
    data,
    color,
    fill = false,
    width = 260,
    height = 72,
    xLabels,
}: {
    data: number[];
    color: string;
    fill?: boolean;
    width?: number;
    height?: number;
    xLabels?: string[];
}) {
    if (!data.length) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#cbd5e1' }}>No trend data</div>;

    const padL = 4, padR = 36, padT = 6, padB = xLabels ? 18 : 4;
    const W = width - padL - padR;
    const H = height - padT - padB;

    const min = Math.min(...data);
    const max = Math.max(...data, 1);
    const range = max - min || 1;

    const toX = (i: number) => padL + (i / Math.max(1, data.length - 1)) * W;
    const toY = (v: number) => padT + H - ((v - min) / range) * H;

    const pts = data.map((v, i) => [toX(i), toY(v)]);
    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
    const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(2)},${(padT + H).toFixed(2)} L${pts[0][0].toFixed(2)},${(padT + H).toFixed(2)} Z`;

    const formatTick = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : Math.round(v).toString();
    const tickLabels = [
        { y: padT, val: max },
        { y: padT + H, val: min },
    ];

    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible", display: "block" }}>
            <defs>
                <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
            </defs>
            {fill && <path d={areaPath} fill={`url(#grad-${color.replace("#", "")})`} />}
            <line x1={padL} y1={padT + H} x2={width - padR} y2={padT + H} stroke="#eceff3" strokeWidth={1} />
            <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill="#fff" stroke={color} strokeWidth={1.5} />
            ))}
            {xLabels && xLabels.map((lbl, i) => (
                <text key={i} x={toX(i)} y={height - 2} fontSize={9} fill="#b0b7c3" textAnchor="middle" fontWeight="600">{lbl}</text>
            ))}
            {tickLabels.map((t, i) => (
                <text key={i} x={width - 2} y={t.y + 3} fontSize={9} fill="#cbd5e1" textAnchor="end" fontWeight="700">{formatTick(t.val)}</text>
            ))}
        </svg>
    );
}

// ── Tier Badge ─────────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: string }) {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
        "New Client": { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
        "Potential Loyal": { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
        "Loyal": { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
        "VIP": { bg: "#fefce8", color: "#ca8a04", border: "#fde68a" },
        "Silver Loyal": { bg: "#f8fafc", color: "#475569", border: "#cbd5e1" },
        "Gold Loyal": { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
        "At Risk": { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
        "default": { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" }
    };
    const s = styles[tier] || styles.default;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
            {tier === "At Risk" && "⚠ "}
            {tier}
        </span>
    );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
    label,
    value,
    sub,
    metric,
    color,
    rightSub,
    xLabels,
}: {
    label: string;
    value: string | number;
    sub: string;
    metric: ProductSummaryMetric;
    color: string;
    rightSub?: string;
    xLabels?: string[];
}) {
    return (
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px 0px", border: "1px solid #e6e9ef", boxShadow: "0 1px 2px rgba(17,24,39,0.04)", display: "flex", flexDirection: "column", flex: 1, minWidth: 0, overflow: "hidden" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", color: "#b0b7c3", textTransform: "uppercase", marginBottom: 6 }}>{label}</span>
            <span style={{ fontSize: 32, fontWeight: 300, color: "#111827", letterSpacing: "-1px", lineHeight: 1.1 }}>{value}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 20, background: `${color}10`, color, fontSize: 11, fontWeight: 700 }}>
                    {sub}
                </span>
            </div>
            {rightSub && <span style={{ fontSize: 10, color: "#9ca3af", marginTop: 3, fontWeight: 500 }}>{rightSub}</span>}
            <div style={{ marginTop: "auto", paddingTop: 8 }}>
                <Sparkline data={metric.trend.map(t => typeof t === 'number' ? t : t.value)} color={color} fill xLabels={xLabels} />
            </div>
        </div>
    );
}

// ── Funnel Bar ─────────────────────────────────────────────────────────────
function FunnelBar({ label, value, max }: { label: string; value: number; max: number }) {
    const pct = Math.max(2, (value / max) * 100);
    const colors: Record<string, string> = {
        "At Risk": "#f59e0b",
        "New Client": "#6366f1",
        "Potential Loyal": "#8b5cf6",
        "Loyal": "#10b981",
        "Silver Loyal": "#eab308",
        "Gold Loyal": "#ef4444"
    };
    const color = colors[label] || "#94a3b8";
    
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 110, flexShrink: 0 }}>
                <TierBadge tier={label} />
            </div>
            <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 8, height: 8 }}>
                <div style={{ width: `${pct}%`, background: color, borderRadius: 8, height: "100%", transition: "width 1s ease-out" }} />
            </div>
            <span style={{ width: 60, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{value.toLocaleString()}</span>
        </div>
    );
}

// ── Line Chart (evolution) ────────────────────────────────────────
function EvolutionChart({ data }: { data: LoyaltyEvolutionPoint[] }) {
    if (!data.length) return null;

    const months = data.map(d => d.month);
    const series = [
        { label: "Loyal", color: "#10b981", key: "Loyal" },
        { label: "VIP", color: "#6366f1", key: "VIP" },
        { label: "Super", color: "#f97316", key: "Super" },
        { label: "At Risk", color: "#ef4444", key: "At Risk", dashed: true },
    ];

    const W = 860, H = 160, pad = { t: 10, r: 20, b: 28, l: 36 };
    const chartW = W - pad.l - pad.r;
    const chartH = H - pad.t - pad.b;
    
    const allVals = data.flatMap(d => [d.Loyal, d.VIP, d.Super, d["At Risk"]]);
    const min = 0, max = Math.max(...allVals, 100) + 20;

    const toX = (i: number) => pad.l + (i / Math.max(1, months.length - 1)) * chartW;
    const toY = (v: number) => pad.t + chartH - ((v - min) / (max - min)) * chartH;

    return (
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>
                    Loyalty Evolution
                </span>
                <div style={{ display: "flex", gap: 16 }}>
                    {series.map((s) => (
                        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
                {/* Grid lines */}
                {[0, Math.round(max/2), Math.round(max)].map((v) => (
                    <line key={v} x1={pad.l} y1={toY(v)} x2={W - pad.r} y2={toY(v)} stroke="#f1f5f9" strokeWidth={1} />
                ))}
                {/* Series */}
                {series.map((s) => {
                    const pts = data.map((d, i) => `${toX(i)},${toY(d[s.key as keyof LoyaltyEvolutionPoint] as number || 0)}`).join(" ");
                    return (
                        <g key={s.label}>
                            <polyline
                                points={pts}
                                fill="none"
                                stroke={s.color}
                                strokeWidth={2}
                                strokeDasharray={s.dashed ? "5 4" : undefined}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            {data.map((d, i) => (
                                <circle key={i} cx={toX(i)} cy={toY(d[s.key as keyof LoyaltyEvolutionPoint] as number || 0)} r={3} fill={s.color} stroke="#fff" strokeWidth={1} />
                            ))}
                        </g>
                    );
                })}
                {/* X axis labels */}
                {months.map((m, i) => (
                    <text key={i} x={toX(i)} y={H - 4} fontSize={10} fill="#94a3b8" textAnchor="middle" fontWeight="600">{m}</text>
                ))}
            </svg>
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function LoyaltyDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useLoyaltyData(activeRange, customStart, customEnd);

    const xLabels = useMemo(() => {
        if (!data) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return data.summary.total_loyal_plus.trend.map(t => {
            if (typeof t === 'number') return "";
            return days[new Date(t.date).getDay()];
        });
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Loyalty Insights...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, funnel, tier_movements, at_risk_table, evolution } = data;
    const maxFunnel = Math.max(...funnel.map(f => f.value), 1);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "24px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Loyalty & Tiers</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* ── Top KPI Cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
                <StatCard
                    label="Total Loyal+"
                    value={summary.total_loyal_plus.value.toLocaleString()}
                    sub={`▲ ${summary.total_loyal_plus.growth_lm}% vs LM`}
                    metric={summary.total_loyal_plus}
                    color="#10b981"
                    rightSub="Loyal / VIP / Super"
                    xLabels={xLabels}
                />
                <StatCard
                    label="New Promotions"
                    value={summary.new_promotions.value}
                    sub="this period"
                    metric={summary.new_promotions}
                    color="#6366f1"
                    rightSub="Tier upgrade events"
                    xLabels={xLabels}
                />
                <StatCard
                    label="At Risk"
                    value={summary.at_risk.value}
                    sub="Action required"
                    metric={summary.at_risk}
                    color="#f59e0b"
                    rightSub="Detect before churn"
                    xLabels={xLabels}
                />
                <StatCard
                    label="Conversions"
                    value={summary.conversions_lm.value}
                    sub="Conversion rate"
                    metric={summary.conversions_lm}
                    color="#8b5cf6"
                    xLabels={xLabels}
                />
            </div>

            {/* ── Middle Row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, marginBottom: 16 }}>
                {/* Loyalty Funnel */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>Loyalty Funnel — Current Distribution</span>
                        <span style={{ color: "#cbd5e1", fontSize: 18 }}>→</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {funnel.map((b) => (
                            <FunnelBar key={b.label} label={b.label} value={b.value} max={maxFunnel} />
                        ))}
                    </div>
                </div>

                {/* Tier Movements */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>Tier Movements — This Month</span>
                        <span style={{ color: "#cbd5e1", fontSize: 18 }}>→</span>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        {tier_movements.length > 0 ? (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        {["Guest", "From", "To", "Date", "Driver"].map((h) => (
                                            <th key={h} style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textAlign: "left", paddingBottom: 10, textTransform: "uppercase" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tier_movements.map((row, i) => (
                                        <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                                            <td style={{ padding: "10px 0", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{row.guest}</td>
                                            <td style={{ padding: "10px 4px" }}><TierBadge tier={row.from} /></td>
                                            <td style={{ padding: "10px 4px" }}><TierBadge tier={row.to} /></td>
                                            <td style={{ padding: "10px 4px", fontSize: 12, color: "#64748b" }}>{row.date}</td>
                                            <td style={{ padding: "10px 0", fontSize: 12, color: "#64748b" }}>{row.driver}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No tier movements recorded this period.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── At Risk Table ── */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#f59e0b", textTransform: "uppercase" }}>⚠ At-Risk Loyal Clients — Action Required</span>
                    <span style={{ color: "#cbd5e1", fontSize: 18 }}>→</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                    {at_risk_table.length > 0 ? (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["Guest", "Tier", "Last Visit", "Days Inactive", "Avg Frequency", "Total Spend", "Action"].map((h) => (
                                        <th key={h} style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textAlign: "left", paddingBottom: 10, textTransform: "uppercase" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {at_risk_table.map((row, i) => (
                                    <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                                        <td style={{ padding: "12px 0", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{row.guest}</td>
                                        <td style={{ padding: "12px 4px" }}><TierBadge tier={row.tier} /></td>
                                        <td style={{ padding: "12px 4px", fontSize: 13, color: "#64748b" }}>{row.last_visit}</td>
                                        <td style={{ padding: "12px 4px" }}>
                                            <span style={{ background: "#fef2f2", color: "#ef4444", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{row.days_inactive} days</span>
                                        </td>
                                        <td style={{ padding: "12px 4px", fontSize: 13, color: "#64748b" }}>{row.avg_frequency}</td>
                                        <td style={{ padding: "12px 4px", fontSize: 13, fontWeight: 700, color: "#1e293b" }}>€ {row.total_spend.toLocaleString()}</td>
                                        <td style={{ padding: "12px 0" }}>
                                            <button style={{ padding: "5px 14px", borderRadius: 20, border: "1.5px solid #6366f1", background: "transparent", color: "#6366f1", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Contact →</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Great! No at-risk clients identified at this time.</div>
                    )}
                </div>
            </div>

            {/* ── Evolution Chart ── */}
            <EvolutionChart data={evolution} />
        </div>
    );
}
