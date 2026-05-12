"use client";
import React, { useState, useMemo } from "react";
import { useRange } from "@/components/range-context";
import { useCRMData } from "@/hooks/use-metrics";
import { CRMClient, ProductTrendPoint } from "@/lib/types/api";

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtEur(n: number | string): string {
    const val = typeof n === 'string' ? parseFloat(n) : n;
    return "€ " + Math.round(val).toLocaleString("de-DE");
}

function fmtNum(n: number | string): string {
    const val = typeof n === 'string' ? parseFloat(n) : n;
    return Math.round(val).toLocaleString("de-DE");
}

// ── Types ──────────────────────────────────────────────────────────────────────

type FilterTier = "All" | "At Risk" | "New Client" | "Potential Loyal" | "Loyal" | "Silver Loyal" | "Gold Loyal";

const filterTiers: FilterTier[] = ["All", "At Risk", "New Client", "Potential Loyal", "Loyal", "Silver Loyal", "Gold Loyal"];

const tierStyles: Record<string, { bg: string; text: string; border: string; icon?: string }> = {
    "At Risk": { bg: "#fff8e6", text: "#b45309", border: "#fcd34d", icon: "⚠" },
    "New Client": { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
    "Potential Loyal": { bg: "#faf5ff", text: "#7c3aed", border: "#c4b5fd" },
    "Loyal": { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
    "Silver Loyal": { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
    "Gold Loyal": { bg: "#fffbeb", text: "#b45309", border: "#fcd34d" },
    "default": { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" }
};

const tagColors: Record<string, { bg: string; text: string }> = {
    "VIP": { bg: "#fef3c7", text: "#92400e" },
    "Corporate": { bg: "#e0f2fe", text: "#075985" },
    "First visit": { bg: "#f0fdf4", text: "#166534" },
    "Tourist": { bg: "#fdf4ff", text: "#7e22ce" },
    "Regular": { bg: "#f0fdf4", text: "#166534" },
    default: { bg: "#f1f5f9", text: "#475569" },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function MiniChart({ data, color, gradientId }: { data: (ProductTrendPoint | number | { value: number })[]; color: string; gradientId: string }) {
    if (data.length === 0) return <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#cbd5e1' }}>No data</div>;

    const values = data.map(d => typeof d === 'number' ? d : d.value);
    const min = Math.min(...values);
    const max = Math.max(...values, 1);
    const range = max - min || 1;

    // Layout constants
    const W = 200, H = 80;
    const padL = 4, padR = 38, padT = 8, padB = 22;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const pts = values.map((v, i) => [
        padL + (i / Math.max(1, values.length - 1)) * chartW,
        padT + chartH - ((v - min) / range) * chartH,
    ]);

    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
    const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(2)},${(padT + chartH).toFixed(2)} L${pts[0][0].toFixed(2)},${(padT + chartH).toFixed(2)} Z`;

    const formatTick = (v: number) => v >= 1000 ? (v / 1000).toFixed(0) + "k" : Math.round(v).toString();
    const tickLabels = [
        { y: padT, val: max },
        { y: padT + chartH / 2, val: (max + min) / 2 },
        { y: padT + chartH, val: min },
    ];

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", display: "block" }}>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path d={linePath} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill={color} stroke="#fff" strokeWidth={1} />
            ))}
            {tickLabels.map((t, i) => (
                <text key={i} x={W - 2} y={t.y + 3} textAnchor="end" fontSize={8.5} fill="#cbd5e1" fontWeight="600">{formatTick(t.val)}</text>
            ))}
        </svg>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function CRMDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    
    // UI State
    const [activeFilter, setActiveFilter] = useState<FilterTier>("All");
    const [search, setSearch] = useState("");
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    const offset = (currentPage - 1) * pageSize;

    const { data, isLoading, error } = useCRMData(
        activeRange, 
        customStart, 
        customEnd, 
        pageSize, 
        offset, 
        search, 
        activeFilter
    );

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Guest Insights...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, table } = data;
    const totalPages = Math.ceil(table.total_count / pageSize);

    const kpiCards = [
        { label: "TOTAL CLIENTS", value: fmtNum(summary.total_clients.value), badge: `▲ ${summary.total_clients.growth_lm}% vs LM`, badgeColor: "#16a34a", trend: summary.total_clients.trend, color: "#818cf8", gid: "g1" },
        { label: "RETURNING GUESTS", value: fmtNum(summary.returning_guests.value), badge: `▲ ${summary.returning_guests.percentage}% rate`, badgeColor: "#16a34a", trend: summary.returning_guests.trend, color: "#818cf8", gid: "g2" },
        { label: "AVG LIFETIME SPEND", value: fmtEur(summary.avg_lifetime_spend.value), sub: "per client", trend: summary.avg_lifetime_spend.trend, color: "#34d399", gid: "g3" },
        { label: "NEW THIS MONTH", value: fmtNum(summary.new_this_month.value), badge: `▲ +${summary.new_this_month.growth}%`, badgeColor: "#16a34a", trend: summary.new_this_month.trend, color: "#fb923c", gid: "g4" },
        { label: "RESERV. WITH SPEND", value: `${summary.res_with_spend.percentage}%`, badge: `▲ ${summary.res_with_spend.count} bookings`, badgeColor: "#3b82f6", sub2: `${summary.res_with_spend.count} of ${summary.res_with_spend.total} records`, trend: summary.res_with_spend.trend, color: "#818cf8", gid: "g5", right: "SEVENROOMS" },
    ];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fb", minHeight: "100vh", padding: "24px", color: "#1e293b" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Guest Database</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                        Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                    </div>
                    {isLoading && <span style={{ fontSize: 11, fontWeight: 600, color: '#6366f1' }}>Refreshing...</span>}
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24, position: 'relative' }}>
                {isLoading && (
                    <div style={{ position: 'absolute', inset: -10, background: 'rgba(248,249,251,0.5)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}>
                        <div style={{ background: '#fff', padding: '8px 16px', borderRadius: 99, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12, fontWeight: 600, color: '#6366f1' }}>Updating guest analytics...</div>
                    </div>
                )}
                {kpiCards.map((card, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: '1px solid #f1f5f9', display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>{card.label}</span>
                            {card.right && <span style={{ fontSize: 9, fontWeight: 800, color: "#cbd5e1", letterSpacing: "0.06em" }}>{card.right}</span>}
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", color: "#0f172a", lineHeight: 1.1 }}>{card.value}</div>
                        {card.sub && <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{card.sub}</div>}
                        {card.badge && <div style={{ fontSize: 11, color: card.badgeColor, fontWeight: 700 }}>{card.badge}</div>}
                        {card.sub2 && <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>{card.sub2}</div>}
                        <div style={{ marginTop: 8 }}>
                            <MiniChart data={card.trend} color={card.color} gradientId={card.gid} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search + Filters */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: '1px solid #f1f5f9', marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: "0 0 280px" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14 }}>🔍</span>
                        <input
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            placeholder="Search by name, email, phone..."
                            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1.5px solid #f1f5f9", borderRadius: 10, fontSize: 13, color: "#334155", background: "#fcfcfd", outline: "none" }}
                        />
                    </div>
                    <div style={{ height: 24, width: 1, background: '#f1f5f9', margin: '0 8px' }} />
                    {filterTiers.map((tier) => {
                        const active = activeFilter === tier;
                        const s = tierStyles[tier] || tierStyles.default;
                        return (
                            <button
                                key={tier}
                                onClick={() => { setActiveFilter(tier); setCurrentPage(1); }}
                                style={{
                                    padding: "6px 16px",
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: active ? 700 : 500,
                                    border: `1.5px solid ${active ? s.border : "#f1f5f9"}`,
                                    background: active ? s.bg : "#fff",
                                    color: active ? s.text : "#64748b",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                }}
                            >
                                {tier === "At Risk" && <span style={{ fontSize: 12 }}>⚠</span>}
                                {tier}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.02)", border: '1px solid #f1f5f9', overflow: "hidden" }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ borderBottom: "1.5px solid #f1f5f9", background: '#fcfcfd' }}>
                                {["FULL NAME", "PHONE", "EMAIL", "COMPANY", "VISITS", "TOTAL SPEND", "SPEND/VISIT", "LOYALTY TIER", "TAGS", ""].map((h) => (
                                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {table.data.map((client) => {
                                const ts = tierStyles[client.loyalty_tier] || tierStyles.default;
                                return (
                                    <tr key={client.id} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.1s" }}
                                        onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                                        onMouseLeave={e => (e.currentTarget.style.background = "")}>
                                        <td style={{ padding: "14px 16px", fontWeight: 600, color: "#0f172a" }}>{client.full_name}</td>
                                        <td style={{ padding: "14px 16px", color: "#475569" }}>{client.phone || '—'}</td>
                                        <td style={{ padding: "14px 16px", color: "#475569" }}>{client.email}</td>
                                        <td style={{ padding: "14px 16px", color: "#475569" }}>{client.company || '—'}</td>
                                        <td style={{ padding: "14px 16px", color: "#0f172a", fontWeight: 500 }}>{client.visits}</td>
                                        <td style={{ padding: "14px 16px", color: "#0f172a", fontWeight: 600 }}>{fmtEur(client.total_spend)}</td>
                                        <td style={{ padding: "14px 16px", color: "#475569" }}>{fmtEur(client.spend_per_visit)}</td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", gap: 4,
                                                padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                                background: ts.bg, color: ts.text, border: `1px solid ${ts.border}`
                                            }}>
                                                {ts.icon && <span style={{ fontSize: 11 }}>{ts.icon}</span>}
                                                {client.loyalty_tier}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                                {client.tags.slice(0, 2).map((tag) => (
                                                    <span key={tag} style={{ padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600, background: "#f1f5f9", color: "#64748b" }}>
                                                        {tag}
                                                    </span>
                                                ))}
                                                {client.tags.length > 2 && <span style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 600 }}>+{client.tags.length - 2}</span>}
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 16px", textAlign: 'right' }}>
                                            <button style={{ padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 11, fontWeight: 600, background: "#fff", color: "#475569", cursor: "pointer" }}>
                                                View →
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderTop: "1.5px solid #f1f5f9", background: '#fcfcfd' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                        Show
                        <select 
                            style={{ border: "1.5px solid #f1f5f9", borderRadius: 8, padding: "4px 8px", fontSize: 12, outline: 'none' }}
                            value={pageSize}
                            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        per page
                    </div>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                        {offset + 1}–{Math.min(offset + pageSize, table.total_count)} of {table.total_count} clients
                    </span>
                    <div style={{ display: "flex", gap: 6 }}>
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            style={{ padding: '6px 12px', border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: currentPage === 1 ? 'not-allowed' : "pointer", fontSize: 13, color: currentPage === 1 ? '#cbd5e1' : "#64748b" }}
                        >‹</button>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            style={{ padding: '6px 12px', border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: currentPage === totalPages ? 'not-allowed' : "pointer", fontSize: 13, color: currentPage === totalPages ? '#cbd5e1' : "#64748b" }}
                        >›</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
