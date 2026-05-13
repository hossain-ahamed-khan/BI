"use client";
import React, { useState, useMemo } from "react";
import { useRange } from "@/components/range-context";
import { useSalesByTrend } from "@/hooks/use-metrics";
import { ParetoItem, TopListItem, TrendSummaryMetric } from "@/lib/types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEuro(value: number | string): string {
    const val = typeof value === 'string' ? parseFloat(value) : value;
    return `€${Math.round(val).toLocaleString("de-DE")}`;
}

function getCumulativeColor(value: number): string {
    if (value <= 80) return "#10b981";
    return "#f97316";
}

// ─── Sparkline (High Fidelity) ───────────────────────────────────────────────

function Sparkline({
    data,
    color,
    fillColor,
    xLabels,
    width = 300,
    height = 74,
}: {
    data: { value: number }[];
    color: string;
    fillColor: string;
    xLabels?: string[];
    width?: number;
    height?: number;
}) {
    const values = data.map((d) => d.value);
    const chartLeft = 8;
    const chartRight = 42;
    const chartTop = 8;
    const chartBottom = 42;
    const innerWidth = width - chartLeft - chartRight;
    const innerHeight = chartBottom - chartTop;

    const max = Math.max(...values, 1);
    const min = Math.min(...values);
    const range = max - min || 1;

    const getY = (v: number) => chartTop + ((max - v) / range) * innerHeight;

    const points = values.map((v, i) => {
        const x = chartLeft + (i / Math.max(1, values.length - 1)) * innerWidth;
        const y = getY(v);
        return [x, y];
    });

    if (points.length === 0) {
        return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#cbd5e1' }}>No trend data</div>;
    }

    const linePath = points
        .map((point, i) => {
            if (i === 0) return `M${point[0]},${point[1]}`;
            const prev = points[i - 1];
            const cpX = (prev[0] + point[0]) / 2;
            return `C${cpX},${prev[1]} ${cpX},${point[1]} ${point[0]},${point[1]}`;
        })
        .join(" ");
    
    const fillPath = points.length > 0 
        ? `${linePath} L${points[points.length - 1][0]},${chartBottom} L${points[0][0]},${chartBottom} Z`
        : "";
    const labels = xLabels && xLabels.length === values.length ? xLabels : [];
    const ticks = [Math.round(min), Math.round(max)];

    return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: "visible" }}>
            <defs>
                <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={fillColor} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={fillColor} stopOpacity={0.01} />
                </linearGradient>
            </defs>

            {ticks.map((tick) => {
                const y = getY(tick);
                return (
                    <g key={tick}>
                        <line x1={chartLeft} y1={y} x2={width - chartRight + 2} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                        <text x={width - 2} y={y + 3} textAnchor="end" fontSize="9" fill="#cbd5e1" fontWeight="600">
                            {tick > 1000 ? `${(tick/1000).toFixed(0)}k` : tick}
                        </text>
                    </g>
                );
            })}

            <path d={fillPath} fill={`url(#grad-${color.replace("#", "")})`} />
            <path d={linePath} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
            {points.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={2} fill={color} stroke="#ffffff" strokeWidth="0.8" />
            ))}

            {labels.map((label, i) => {
                const x = chartLeft + (i / Math.max(1, labels.length - 1)) * innerWidth;
                return (
                    <text key={`${label}-${i}`} x={x} y={height - 8} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
    title,
    value,
    change,
    changeUp,
    valueNote,
    metric,
    color,
    fillColor,
    xLabels,
    suffix = "",
}: {
    title: string;
    value: string;
    change?: string;
    changeUp?: boolean;
    valueNote?: string;
    metric: TrendSummaryMetric;
    color: string;
    fillColor: string;
    xLabels?: string[];
    suffix?: string;
}) {
    return (
        <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>{title}</span>
                <span style={styles.kpiArrow}>→</span>
            </div>
            <div style={styles.kpiValue}>{value}<span style={styles.kpiSuffix}>{suffix}</span></div>
            {valueNote && <div style={styles.kpiPill}>{valueNote}</div>}
            {change && (
                <div style={{ ...styles.kpiBadge, color: changeUp ? "#10b981" : "#ef4444" }}>
                    <span>{changeUp ? "▲" : "▼"}</span>
                    <span style={{ marginLeft: 3 }}>{change}</span>
                </div>
            )}
            <div style={{ marginTop: 12 }}>
                <Sparkline
                    data={metric.trend.map(t => ({ value: typeof t === 'number' ? t : t.value }))}
                    color={color}
                    fillColor={fillColor}
                    xLabels={xLabels}
                />
            </div>
        </div>
    );
}

// ─── Top List ─────────────────────────────────────────────────────────────────

function TopList({
    title,
    items,
    qtyLabel = "QTY",
}: {
    title: string;
    items: TopListItem[];
    qtyLabel?: string;
}) {
    return (
        <div style={styles.listCard}>
            <div style={styles.listHeader}>
                <span style={styles.listTitle}>{title}</span>
            </div>
            <div style={styles.listTableHeader}>
                <span style={{ ...styles.listCol, width: 24, color: "#9ca3af" }}>#</span>
                <span style={{ ...styles.listCol, flex: 1, color: "#9ca3af" }}>
                    {title.includes("WINE") ? "WINE" : title.includes("COCKTAIL") ? "COCKTAIL" : "DISH"}
                </span>
                <span style={{ ...styles.listColRight, color: "#9ca3af" }}>{qtyLabel}</span>
            </div>
            {items.map((item, i) => (
                <div
                    key={i}
                    style={{
                        ...styles.listRow,
                        backgroundColor: i === 0 ? "#f8fafc" : "transparent",
                    }}
                >
                    <span style={{ ...styles.listCol, width: 24, color: "#6366f1", fontWeight: 600, fontSize: 13 }}>
                        {i + 1}
                    </span>
                    <span style={{ ...styles.listCol, flex: 1, fontSize: 13, color: "#1e293b", fontWeight: 500 }}>
                        {item.name || item.product}
                    </span>
                    <span style={{ ...styles.listColRight, fontSize: 13, color: "#64748b", fontWeight: 600 }}>
                        {item.qty}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Pareto Table ─────────────────────────────────────────────────────────────

function ParetoTable({ items, totalCount, currentPage, pageSize, onPageChange, onPageSizeChange }: { items: ParetoItem[], totalCount: number, currentPage: number, pageSize: number, onPageChange: (p: number) => void, onPageSizeChange: (s: number) => void }) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (currentPage - 1) * pageSize;

    return (
        <div style={styles.paretoCard}>
            <div style={styles.listHeader}>
                <span style={styles.listTitle}>REVENUE PARETO ANALYSIS — 80/20 RULE</span>
                <span style={styles.kpiArrow}>→</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={styles.paretoTable}>
                    <thead>
                        <tr>
                            {["#", "ITEM NAME ↑↓", "CATEGORY", "QTY ↑↓", "GROSS REVENUE ↓", "% OF TOTAL ↑↓", "CUMULATIVE %"].map((h) => (
                                <th key={h} style={styles.thCell}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => (
                            <tr
                                key={i}
                                style={{
                                    ...styles.paretoRow,
                                    backgroundColor: i % 2 === 0 ? "#fff" : "#fcfcfd",
                                }}
                            >
                                <td style={styles.tdCell}>{offset + i + 1}</td>
                                <td style={{ ...styles.tdCell, fontWeight: 600, color: "#1e293b" }}>{item.name || item.product}</td>
                                <td style={{ ...styles.tdCell, color: "#64748b" }}>
                                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{item.category}</span>
                                </td>
                                <td style={styles.tdCell}>{item.qty}</td>
                                <td style={styles.tdCell}>{formatEuro(item.gross_revenue)}</td>
                                <td style={styles.tdCell}>{item.perc_of_total}%</td>
                                <td style={{ ...styles.tdCell, color: getCumulativeColor(item.cumulative_perc), fontWeight: 700 }}>
                                    {item.cumulative_perc}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={styles.pagination}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#64748b", fontSize: 12 }}>
                    <span>Show</span>
                    <select 
                        style={styles.pageSelect} 
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <span>per page</span>
                </div>
                <div style={{ color: "#64748b", fontSize: 12, fontWeight: 500 }}>
                    {offset + 1}–{Math.min(offset + pageSize, totalCount)} of {totalCount} items
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        style={{ ...styles.pageBtn, color: currentPage === 1 ? "#cbd5e1" : "#475569", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                    >
                        ‹
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        style={{ ...styles.pageBtn, color: currentPage === totalPages ? "#cbd5e1" : "#475569", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function RestaurantDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    
    const offset = (currentPage - 1) * pageSize;
    const { data, isLoading, error } = useSalesByTrend(activeRange, customStart, customEnd, pageSize, offset);

    const weekLabels = useMemo(() => {
        if (!data) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return data.summary.food_sales.trend.map(t => {
            if (typeof t === 'number') return "";
            return days[new Date(t.date).getDay()];
        });
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Trend Analytics...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, top_10, pareto_table } = data;

    return (
        <div style={styles.root}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Sales by Trend</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* KPI Row */}
            <div style={styles.kpiRow}>
                <KpiCard
                    title="FOOD SALES"
                    value={formatEuro(summary.food_sales.value)}
                    change={`${Math.abs(summary.food_sales.growth_ly!)}% vs LY`}
                    changeUp={summary.food_sales.growth_ly! >= 0}
                    metric={summary.food_sales}
                    color="#10b981"
                    fillColor="#10b981"
                    xLabels={weekLabels}
                />
                <KpiCard
                    title="DRINK SALES"
                    value={formatEuro(summary.drink_sales.value)}
                    change={`${Math.abs(summary.drink_sales.growth_ly!)}% vs LY`}
                    changeUp={summary.drink_sales.growth_ly! >= 0}
                    metric={summary.drink_sales}
                    color="#f43f5e"
                    fillColor="#f43f5e"
                    xLabels={weekLabels}
                />
                <KpiCard
                    title="FOOD / DRINK SPLIT"
                    value={`${Math.round(summary.food_drink_split.food_perc!)}/${Math.round(summary.food_drink_split.drink_perc!)}`}
                    valueNote="Food% / Drink%"
                    metric={summary.food_drink_split}
                    color="#8b5cf6"
                    fillColor="#8b5cf6"
                    xLabels={weekLabels}
                />
                <KpiCard
                    title="AVG DISH PRICE"
                    value={formatEuro(summary.avg_dish_price.value)}
                    change={`${Math.abs(summary.avg_dish_price.growth_ly!)}% vs LY`}
                    changeUp={summary.avg_dish_price.growth_ly! >= 0}
                    metric={summary.avg_dish_price}
                    color="#6366f1"
                    fillColor="#6366f1"
                    xLabels={weekLabels}
                />
            </div>

            {/* Top Lists Row */}
            <div style={styles.listsRow}>
                <TopList title="TOP 10 DISHES (QTY)" items={top_10.dishes} />
                <TopList title="TOP 10 COCKTAILS (QTY)" items={top_10.cocktails} />
                <TopList title="TOP 10 WINES (QTY)" items={top_10.wines} qtyLabel="BTLS" />
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    root: {
        fontFamily: "'Inter', 'DM Sans', sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        boxSizing: "border-box",
    },
    kpiRow: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
    },
    kpiCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        border: "1px solid #f1f5f9",
        display: "flex",
        flexDirection: "column",
    },
    kpiHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    kpiTitle: {
        fontSize: 10,
        letterSpacing: "0.08em",
        fontWeight: 700,
        color: "#94a3b8",
        textTransform: "uppercase" as const,
    },
    kpiArrow: {
        fontSize: 12,
        color: "#cbd5e1",
    },
    kpiValue: {
        fontSize: 32,
        fontWeight: 600,
        color: "#1e293b",
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        marginBottom: 4,
    },
    kpiSuffix: {
        fontSize: 16,
        color: "#94a3b8",
    },
    kpiBadge: {
        display: "flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.02em",
    },
    kpiPill: {
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        fontSize: 10,
        fontWeight: 700,
        color: "#64748b",
        backgroundColor: "#f1f5f9",
        borderRadius: 999,
        padding: "2px 8px",
        marginBottom: 4,
    },
    listsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
    },
    listCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        border: "1px solid #f1f5f9",
    },
    listHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 10,
        letterSpacing: "0.08em",
        fontWeight: 700,
        color: "#94a3b8",
        textTransform: "uppercase" as const,
    },
    listTableHeader: {
        display: "flex",
        alignItems: "center",
        paddingBottom: 10,
        borderBottom: "1px solid #f1f5f9",
        marginBottom: 8,
        fontSize: 10,
        letterSpacing: "0.06em",
        fontWeight: 700,
    },
    listRow: {
        display: "flex",
        alignItems: "center",
        padding: "8px 10px",
        borderRadius: 8,
        marginBottom: 2,
    },
    listCol: {
        display: "flex" as const,
        alignItems: "center" as const,
    },
    listColRight: {
        marginLeft: "auto",
        fontWeight: 600,
    },
    paretoCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        border: "1px solid #f1f5f9",
    },
    paretoTable: {
        width: "100%",
        borderCollapse: "collapse" as const,
        fontSize: 13,
    },
    thCell: {
        textAlign: "left" as const,
        fontSize: 10,
        letterSpacing: "0.06em",
        fontWeight: 700,
        color: "#94a3b8",
        padding: "12px 10px",
        borderBottom: "1px solid #f1f5f9",
        textTransform: "uppercase" as const,
    },
    tdCell: {
        padding: "14px 10px",
        color: "#1e293b",
        fontSize: 13,
        borderBottom: "1px solid #f8fafc",
    },
    paretoRow: {
        transition: "background 0.15s",
    },
    pagination: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        paddingTop: 16,
        borderTop: "1px solid #f1f5f9",
    },
    pageSelect: {
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "4px 8px",
        fontSize: 12,
        color: "#1e293b",
        outline: 'none',
    },
    pageBtn: {
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e2e8f0",
        background: "#fff",
        cursor: "pointer",
        fontSize: 14,
        borderRadius: 8,
        fontFamily: "inherit",
        transition: 'all 0.2s',
    },
};
