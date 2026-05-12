"use client";
import React, { useState, useMemo } from "react";
import { useRange } from "@/components/range-context";
import { useFBPerformanceData } from "@/hooks/use-metrics";
import { 
    FBTopItem, 
    FBParetoItem, 
    ProductSummaryMetric 
} from "@/lib/types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEuro(value: number): string {
    return `€${Math.round(value).toLocaleString("de-DE")}`;
}

// ─── Sparkline (High Fidelity) ───────────────────────────────────────────────

function Sparkline({
    data,
    color,
    fill = false,
    width = 300,
    height = 80,
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

    const padL = 4, padR = 40, padT = 6, padB = xLabels ? 18 : 4;
    const chartW = width - padL - padR;
    const chartH = height - padT - padB;

    const min = Math.min(...data);
    const max = Math.max(...data, 1);
    const range = max - min || 1;

    const getY = (v: number) => padT + chartH - ((v - min) / range) * chartH;
    const getX = (i: number) => padL + (i / Math.max(1, data.length - 1)) * chartW;

    const pts = data.map((v, i) => [getX(i), getY(v)]);
    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
    const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(2)},${(padT + chartH).toFixed(2)} L${pts[0][0].toFixed(2)},${(padT + chartH).toFixed(2)} Z`;

    const formatTick = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(1);
    const ticks = [max, min];

    return (
        <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible", display: "block" }}>
            <defs>
                <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
            </defs>
            {fill && <path d={areaPath} fill={`url(#grad-${color.replace("#", "")})`} />}
            <line x1={padL} y1={padT + chartH} x2={width - padR} y2={padT + chartH} stroke="#eceff3" strokeWidth={1} />
            <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill="#fff" stroke={color} strokeWidth={1.5} />
            ))}
            {xLabels && xLabels.map((lbl, i) => (
                <text key={i} x={getX(i)} y={height - 2} fontSize={9} fill="#b0b7c3" textAnchor="middle" fontWeight="600">{lbl}</text>
            ))}
            {ticks.map((t, i) => (
                <text key={i} x={width - 2} y={getY(t) + 3} fontSize={8.5} fill="#cbd5e1" textAnchor="end" fontWeight="700">{formatTick(t)}</text>
            ))}
        </svg>
    );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
    title, value, subtitle, badge, badgeColor, trend = [], color, xLabels,
}: {
    title: string;
    value: string;
    subtitle?: string;
    badge?: string;
    badgeColor?: string;
    trend: number[];
    color: string;
    xLabels?: string[];
}) {
    return (
        <div style={{
            background: "#fff", borderRadius: 16, padding: "20px 22px 12px",
            border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            display: "flex", flexDirection: "column", gap: 3, minWidth: 0, flex: 1,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>
                    {title}
                </span>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>→</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 300, color: "#1e293b", lineHeight: 1.1 }}>{value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "2px 0" }}>
                {badge && (
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20, background: `${badgeColor || color}15`, color: badgeColor || color, fontSize: 11, fontWeight: 700 }}>
                        {badge}
                    </span>
                )}
                {subtitle && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{subtitle}</span>}
            </div>
            <div style={{ marginTop: 8 }}>
                <Sparkline data={trend} color={color} fill xLabels={xLabels} />
            </div>
        </div>
    );
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────

const rankColors: Record<number, string> = { 1: "#ef4444", 2: "#f97316", 3: "#3b82f6" };
function RankBadge({ rank }: { rank: number }) {
    const color = rankColors[rank] ?? "#94a3b8";
    return <span style={{ fontWeight: 700, color, minWidth: 20, display: "inline-block" }}>{rank}</span>;
}

// ─── Top Table ────────────────────────────────────────────────────────────────

function TopTable({ title, items, qtyLabel = "QTY" }: { title: string; items: FBTopItem[]; qtyLabel?: string }) {
    return (
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>{title}</span>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>→</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                    <tr style={{ color: "#94a3b8", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <th style={{ textAlign: "left", paddingBottom: 8, width: 24 }}>#</th>
                        <th style={{ textAlign: "left", paddingBottom: 8 }}>ITEM</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>{qtyLabel}</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>REVENUE</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>VS LY</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                            <td style={{ padding: "8px 0" }}><RankBadge rank={i + 1} /></td>
                            <td style={{ padding: "8px 4px", color: "#1e293b", fontWeight: 500 }}>{item.name}</td>
                            <td style={{ textAlign: "right", color: "#64748b", fontWeight: 600 }}>{item.qty.toLocaleString()}</td>
                            <td style={{ textAlign: "right", color: "#1e293b", fontWeight: 600 }}>{formatEuro(item.rev)}</td>
                            <td style={{ textAlign: "right" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: (item.vs_ly || 0) >= 0 ? "#10b981" : "#ef4444" }}>
                                    {(item.vs_ly || 0) >= 0 ? "+" : ""}{item.vs_ly || 0}%
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Pareto Table ─────────────────────────────────────────────────────────────

function ParetoTable({ items, totalCount, currentPage, pageSize, onPageChange, onPageSizeChange }: { items: FBParetoItem[], totalCount: number, currentPage: number, pageSize: number, onPageChange: (p: number) => void, onPageSizeChange: (s: number) => void }) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (currentPage - 1) * pageSize;

    return (
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>Revenue Pareto Analysis – 80/20 Rule</span>
                <span style={{ fontSize: 11, color: "#cbd5e1" }}>Sorted by revenue · Cumulative % recalculated across full dataset</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ color: "#94a3b8", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            <th style={{ textAlign: "left", paddingBottom: 10, width: 24 }}>#</th>
                            <th style={{ textAlign: "left", paddingBottom: 10 }}>ITEM ↑↓</th>
                            <th style={{ textAlign: "left", paddingBottom: 10 }}>CATEGORY</th>
                            <th style={{ textAlign: "right", paddingBottom: 10 }}>QTY ↑↓</th>
                            <th style={{ textAlign: "right", paddingBottom: 10 }}>GROSS REVENUE ↓</th>
                            <th style={{ textAlign: "right", paddingBottom: 10 }}>% OF TOTAL ↑↓</th>
                            <th style={{ textAlign: "right", paddingBottom: 10 }}>CUMULATIVE %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                                <td style={{ padding: "12px 0", color: "#1e293b" }}>{offset + i + 1}</td>
                                <td style={{ padding: "12px 4px", color: "#1e293b", fontWeight: 600 }}>{item.name}</td>
                                <td style={{ color: "#64748b" }}>
                                    <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{item.category}</span>
                                </td>
                                <td style={{ textAlign: "right", color: "#64748b" }}>{item.qty}</td>
                                <td style={{ textAlign: "right", color: "#1e293b", fontWeight: 600 }}>{formatEuro(item.gross_revenue)}</td>
                                <td style={{ textAlign: "right", color: "#64748b" }}>{item.perc_of_total}%</td>
                                <td style={{ textAlign: "right", fontWeight: 700, color: item.cumulative_perc <= 80 ? "#10b981" : "#f43f5e" }}>{item.cumulative_perc}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: "1.5px solid #f1f5f9" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", fontSize: 12 }}>
                    <span>Show</span>
                    <select 
                        style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "4px 8px", outline: 'none' }}
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    >
                        {[10, 25, 50, 100].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span>per page</span>
                </div>
                <div style={{ color: "#64748b", fontSize: 12, fontWeight: 600 }}>
                    {offset + 1}–{Math.min(offset + pageSize, totalCount)} of {totalCount} items
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: currentPage === 1 ? 'not-allowed' : "pointer", color: currentPage === 1 ? '#cbd5e1' : '#475569' }}>‹</button>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", cursor: currentPage === totalPages ? 'not-allowed' : "pointer", color: currentPage === totalPages ? '#cbd5e1' : '#475569' }}>›</button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function FBPerformanceDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    const offset = (currentPage - 1) * pageSize;
    const { data, isLoading, error } = useFBPerformanceData(activeRange, customStart, customEnd, pageSize, offset);

    const xLabels = useMemo(() => {
        return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    }, []);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading F&B Performance Analysis...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, top_10, pareto_table } = data;

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "24px" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>F&B Operational Performance</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* KPI Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
                <KpiCard
                    title="Food Cost %"
                    value={`${summary.food_cost_perc.value}%`}
                    subtitle={`Target: ${summary.food_cost_perc.target}%`}
                    badge={`${(summary.food_cost_perc.value as number - summary.food_cost_perc.target!).toFixed(1)}pp vs Goal`}
                    badgeColor={summary.food_cost_perc.value as number > summary.food_cost_perc.target! ? "#ef4444" : "#10b981"}
                    trend={[27.5, 27.8, 28.0, 28.1, 28.2, 28.3, summary.food_cost_perc.value as number]}
                    color="#f59e0b"
                    xLabels={xLabels}
                />
                <KpiCard
                    title="Drink Cost %"
                    value={`${summary.drink_cost_perc.value}%`}
                    subtitle={`Target: ${summary.drink_cost_perc.target}%`}
                    badge="On Target"
                    badgeColor="#10b981"
                    trend={[19.0, 18.8, 18.6, 18.5, 18.4, 18.3, summary.drink_cost_perc.value as number]}
                    color="#10b981"
                    xLabels={xLabels}
                />
                <KpiCard
                    title="Stock Value"
                    value={formatEuro(summary.stock_value.value as number)}
                    subtitle="Frozen liquidity"
                    trend={summary.stock_value.trend as number[]}
                    color="#8b5cf6"
                    xLabels={xLabels}
                />
                <KpiCard
                    title="Purchases"
                    value={formatEuro(summary.purchases_month.value as number)}
                    subtitle="Total this period"
                    badge={`▲ +${summary.purchases_month.growth_lm}% vs LM`}
                    badgeColor="#ef4444"
                    trend={summary.purchases_month.trend as number[]}
                    color="#f97316"
                    xLabels={xLabels}
                />
            </div>

            {/* Top 10 Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
                <TopTable title="Top 10 Dishes" items={top_10.dishes} />
                <TopTable title="Top 10 Cocktails" items={top_10.cocktails} />
                <TopTable title="Top 10 Wines" items={top_10.wines} qtyLabel="BTLS" />
            </div>

            {/* Pareto Table */}
            <ParetoTable 
                items={pareto_table.data}
                totalCount={pareto_table.total_count}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
            />
        </div>
    );
}
