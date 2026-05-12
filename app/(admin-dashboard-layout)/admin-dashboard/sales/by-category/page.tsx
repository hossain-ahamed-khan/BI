"use client";
import React, { useState, useCallback, CSSProperties, useMemo } from "react";
import { useRange } from "@/components/range-context";
import { useSalesByCategory } from "@/hooks/use-metrics";
import { CategoryTableItem, CategoryProduct } from "@/lib/types/api";

// ── Types ──────────────────────────────────────────────────────────────────────

type SortKey = keyof Omit<CategoryTableItem, "category" | "top_products">;
type SortDir = "asc" | "desc";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtEur(n: number): string {
    return "€ " + Math.round(n).toLocaleString("de-DE", { minimumFractionDigits: 0 });
}

function fmtNum(n: number): string {
    return Math.round(n).toLocaleString("de-DE");
}

// Chart viewport constants
const CHART_W = 1000;
const CHART_H = 300;
const PAD_L = 60;
const PAD_R = 40;
const PAD_T = 20;
const PAD_B = 40;

const COLORS = ["#7c6fcd", "#f97316", "#10b981", "#059669", "#8b5cf6", "#fb923c", "#ec4899", "#3b82f6"];

// ── Shared styles ──────────────────────────────────────────────────────────────

const cardStyle: CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const sectionTitleStyle: CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "#9aa0ac",
    textTransform: "uppercase",
    marginBottom: 16,
};

const thBaseStyle: CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    color: "#9aa0ac",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    padding: "6px 8px",
    borderBottom: "1px solid #f0f0f0",
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
};

// ── Sub-components ─────────────────────────────────────────────────────────────

interface LegendDotProps {
    color: string;
}

const LegendDot: React.FC<LegendDotProps> = ({ color }) => (
    <span
        style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: color,
            marginRight: 6,
            flexShrink: 0,
        }}
    />
);

interface SortIndicatorProps {
    column: SortKey;
    activeKey: SortKey | null;
    dir: SortDir;
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ column, activeKey, dir }) => {
    if (activeKey !== column) return <> ↕</>;
    return <> {dir === "asc" ? "↑" : "↓"}</>;
};

import {
    LineChart as ReLineChart,
    Line,
    XAxis as ReXAxis,
    YAxis as ReYAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#1e293b",
                    color: "#fff",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    border: "none",
                    minWidth: "140px"
                }}
            >
                <p style={{ margin: "0 0 8px", color: "#94a3b8", fontWeight: 600 }}>{label}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: entry.color }} />
                                <span>{entry.name}</span>
                            </div>
                            <span style={{ fontWeight: 700 }}>{fmtEur(entry.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

// ── LineChart ──────────────────────────────────────────────────────────────────

interface LineChartProps {
    categories: string[];
    data: any[];
}

const LineChart: React.FC<LineChartProps> = ({ categories, data }) => {
    return (
        <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <ReXAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        dy={10}
                        tickFormatter={(val) => val.split('-').slice(1).join('/')}
                    />
                    <ReYAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickFormatter={(val) => `€${(val/1000).toFixed(0)}k`}
                    />
                    <ReTooltip content={<CustomTooltip />} />
                    <Legend 
                        verticalAlign="top" 
                        align="center" 
                        height={50}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingBottom: '20px' }}
                    />
                    {categories.map((cat, i) => {
                        const color = COLORS[i % COLORS.length];
                        return (
                            <Line
                                key={cat}
                                type="monotone"
                                dataKey={cat}
                                name={cat}
                                stroke={color}
                                strokeWidth={2.5}
                                dot={{ r: 3, fill: color, strokeWidth: 0, fillOpacity: 1 }}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                            />
                        );
                    })}
                </ReLineChart>
            </ResponsiveContainer>
        </div>
    );
};
// ── SalesTable ─────────────────────────────────────────────────────────────────

interface SalesTableProps {
    data: CategoryTableItem[];
}

const SalesTable: React.FC<SalesTableProps> = ({ data }) => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [sortKey, setSortKey] = useState<SortKey | null>("gross_revenue");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const toggleExpand = useCallback((name: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
        });
    }, []);

    const handleSort = useCallback((key: SortKey) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    }, [sortKey]);

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a, b) => {
            const diff = (a[sortKey] as number) - (b[sortKey] as number);
            return sortDir === "asc" ? diff : -diff;
        });
    }, [data, sortKey, sortDir]);

    const thLeft: CSSProperties = { ...thBaseStyle, textAlign: "left" };
    const thRight: CSSProperties = { ...thBaseStyle, textAlign: "right" };

    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
                <tr>
                    <th style={thLeft}>Category</th>
                    <th style={thRight} onClick={() => handleSort("products_sold")}>
                        Products Sold
                        <SortIndicator column="products_sold" activeKey={sortKey} dir={sortDir} />
                    </th>
                    <th style={thRight} onClick={() => handleSort("gross_revenue")}>
                        Gross Revenue
                        <SortIndicator column="gross_revenue" activeKey={sortKey} dir={sortDir} />
                    </th>
                    <th style={thRight} onClick={() => handleSort("net_revenue")}>
                        Net Revenue
                        <SortIndicator column="net_revenue" activeKey={sortKey} dir={sortDir} />
                    </th>
                    <th style={thRight} onClick={() => handleSort("perc_of_total")}>
                        % of Total
                        <SortIndicator column="perc_of_total" activeKey={sortKey} dir={sortDir} />
                    </th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map((cat) => {
                    const isOpen = expanded.has(cat.category);
                    return (
                        <React.Fragment key={cat.category}>
                            {/* Category row */}
                            <tr
                                style={{ borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
                                onClick={() => toggleExpand(cat.category)}
                            >
                                <td style={{ padding: "14px 8px", fontWeight: 600, color: "#222" }}>
                                    {cat.category}
                                    <span style={{ fontSize: 10, color: "#aaa", marginLeft: 6 }}>
                                        {isOpen ? "▴" : "▾"}
                                    </span>
                                </td>
                                <td style={{ padding: "14px 8px", textAlign: "right", color: "#333" }}>
                                    {fmtNum(cat.products_sold)}
                                </td>
                                <td style={{ padding: "14px 8px", textAlign: "right", color: "#333" }}>
                                    {fmtEur(cat.gross_revenue)}
                                </td>
                                <td style={{ padding: "14px 8px", textAlign: "right", color: "#333" }}>
                                    {fmtEur(cat.net_revenue)}
                                </td>
                                <td style={{ padding: "14px 8px", textAlign: "right", color: "#6366f1", fontWeight: 600 }}>
                                    {cat.perc_of_total.toFixed(1)}%
                                </td>
                            </tr>

                            {/* Item rows */}
                            {isOpen &&
                                cat.top_products.map((item) => (
                                    <tr key={item.name} style={{ borderBottom: "1px solid #f9f9f9", background: "#fafafa" }}>
                                        <td style={{ padding: "10px 8px 10px 32px", color: "#666", fontSize: 12 }}>
                                            ↳ {item.name}
                                        </td>
                                        <td style={{ padding: "10px 8px", textAlign: "right", color: "#666", fontSize: 12 }}>
                                            {fmtNum(item.qty)}
                                        </td>
                                        <td style={{ padding: "10px 8px", textAlign: "right", color: "#666", fontSize: 12 }}>
                                            {fmtEur(item.gross_revenue)}
                                        </td>
                                        <td style={{ padding: "10px 8px", textAlign: "right", color: "#666", fontSize: 12 }}>
                                            {fmtEur(item.net_revenue)}
                                        </td>
                                        <td style={{ padding: "10px 8px", textAlign: "right", color: "#6366f1", fontSize: 11, opacity: 0.8 }}>
                                            {item.perc_of_total.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
};

// ── RevenueDashboard (root) ────────────────────────────────────────────────────

export default function RevenueDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useSalesByCategory(activeRange, customStart, customEnd);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Category Sales...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    return (
        <div
            style={{
                background: "#f4f5f7",
                padding: 16,
                minHeight: "100vh",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>Sales by Category</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '4px 10px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* Chart card */}
            <div style={{ ...cardStyle, position: 'relative' }}>
                {isLoading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#6366f1' }}>Updating chart...</p>
                    </div>
                )}
                <p style={sectionTitleStyle}>Revenue by Category – Over Time</p>
                <LineChart categories={data.chart.categories} data={data.chart.data} />
            </div>

            {/* Table card */}
            <div style={cardStyle}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <p style={{ ...sectionTitleStyle, marginBottom: 0 }}>Sales by Category</p>
                    <span style={{ fontSize: 10, color: "#9aa0ac" }}>↕ Click columns to sort</span>
                </div>
                <SalesTable data={data.table.data} />
            </div>
        </div>
    );
}