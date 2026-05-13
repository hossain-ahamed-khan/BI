"use client";
import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useRange } from "@/components/range-context";
import { useSalesByProduct } from "@/hooks/use-metrics";
import { ProductTableItem, ProductSummaryMetric } from "@/lib/types/api";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtEur(n: number | string): string {
    const val = typeof n === 'string' ? parseFloat(n) : n;
    return "€" + Math.round(val).toLocaleString("de-DE");
}

function fmtNum(n: number | string): string {
    const val = typeof n === 'string' ? parseFloat(n) : n;
    return Math.round(val).toLocaleString("de-DE");
}

// ── Components ─────────────────────────────────────────────────────────────────

const CustomMiniTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "#1e293b", color: "#fff", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, textAlign: "center", position: "relative" }}>
                <div style={{ color: "#94a3b8", marginBottom: "2px" }}>{label}</div>
                <div>{payload[0].value.toFixed(2)}</div>
                <div style={{ position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%)", width: "0", height: "0", borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #1e293b" }} />
            </div>
        );
    }
    return null;
};

const ProductKpiChart = ({ metric, color }: { metric: ProductSummaryMetric, color: string }) => {
    // Map dates to weekdays for the X-Axis
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const data = metric.trend.map((p, i) => {
        if (typeof p === 'number') {
            return { d: i.toString(), value: p };
        }
        const date = new Date(p.date);
        return { 
            d: days[date.getDay()], 
            value: p.value 
        };
    });
    
    const values = metric.trend.map(p => typeof p === 'number' ? p : p.value);
    const max = Math.max(...values, 1);
    const min = Math.min(...values);
    
    // Create clean ticks: Min and Max
    const ticks = [Math.round(min), Math.round(max)];

    return (
        <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={data} margin={{ top: 10, right: 4, left: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id={`color-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <XAxis 
                    dataKey="d" 
                    tick={{ fontSize: 9, fill: "#a7b0bf" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    padding={{ left: 5, right: 5 }}
                />
                <YAxis 
                    orientation="right" 
                    tick={{ fontSize: 9, fill: "#c6ccd8" }} 
                    axisLine={false} 
                    tickLine={false} 
                    ticks={ticks} 
                    width={28} 
                    domain={['dataMin - 10', 'dataMax + 10']} 
                />
                <Tooltip 
                    content={<CustomMiniTooltip />} 
                    cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
                    position={{ y: -20 }} 
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={color} 
                    strokeWidth={2} 
                    fill={`url(#color-${color.replace('#', '')})`} 
                    dot={{ r: 2, fill: color, strokeWidth: 0, fillOpacity: 1 }}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

const KpiCard = ({ label, value, subValue, metric, color, prefix = "" }: { label: string, value: string | number, subValue?: string, metric: ProductSummaryMetric, color: string, prefix?: string }) => (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #f1f5f9", flex: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 600, color: "#1e293b", letterSpacing: "-0.02em" }}>{prefix}{value}</span>
        </div>
        {subValue && <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600, marginBottom: 12 }}>{subValue}</div>}
        <ProductKpiChart metric={metric} color={color} />
    </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function SalesByProductPage() {
    const { activeRange, customStart, customEnd } = useRange();
    
    // Pagination State
    const [pageSize, setPageSize] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    
    const offset = (currentPage - 1) * pageSize;

    const { data, isLoading, error } = useSalesByProduct(activeRange, customStart, customEnd, pageSize, offset);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [sortKey, setSortKey] = useState<keyof ProductTableItem>("gross_revenue");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const filteredAndSortedData = useMemo(() => {
        if (!data || !data.table || !data.table.data) return [];
        // Note: In a real professional app, searching and sorting would also be server-side
        // but for now we'll handle the current page's data
        let items = [...data.table.data].filter(item => {
            const itemName = (item.name || (item as any).product || "").toLowerCase();
            const categoryName = (item.category || "").toLowerCase();
            const search = searchQuery.toLowerCase();
            return itemName.includes(search) || categoryName.includes(search);
        });
        
        items.sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortDir === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
        });
        
        return items;
    }, [data, searchQuery, sortKey, sortDir]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Product Sales...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, table } = data;
    const totalPages = Math.ceil(table.total_count / pageSize);

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh", padding: 24, fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Sales by Product</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                <KpiCard label="Total SKUs" value={summary.total_skus.value} subValue="Active products" metric={summary.total_skus} color="#6366f1" />
                <KpiCard 
                    label="Units Sold" 
                    value={fmtNum(summary.units_sold.value)} 
                    subValue={summary.units_sold.growth_lw !== undefined ? `${summary.units_sold.growth_lw >= 0 ? '▲' : '▼'} ${Math.abs(summary.units_sold.growth_lw)}% vs LW` : "This period"} 
                    metric={summary.units_sold} 
                    color="#10b981" 
                />
                <KpiCard label="Top Category" value={summary.top_category.name || ""} subValue={`${summary.top_category.percentage}% of units`} metric={summary.top_category} color="#f59e0b" />
                <KpiCard label="Avg Price / Unit" value={(typeof summary.avg_price_unit.value === 'string' ? parseFloat(summary.avg_price_unit.value) : summary.avg_price_unit.value).toFixed(2)} subValue="This period" metric={summary.avg_price_unit} color="#8b5cf6" prefix="€" />
            </div>

            {/* Table Card */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", overflow: "hidden" }}>
                <div style={{ padding: "20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Products Performance</h2>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ position: "relative" }}>
                            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                            <input 
                                type="text" 
                                placeholder="Search current results..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ padding: "8px 12px 8px 32px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, width: 240, outline: 'none' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#fcfcfd" }}>
                                {["name", "category", "qty", "gross_revenue", "net_revenue"].map((key) => (
                                    <th 
                                        key={key}
                                        onClick={() => {
                                            if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                            else { setSortKey(key as any); setSortDir('desc'); }
                                        }}
                                        style={{ padding: "12px 20px", textAlign: key === "name" ? "left" : "right", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", cursor: "pointer", userSelect: "none" }}
                                    >
                                        {key === "qty" ? "Units Sold" : key.replace("_", " ")} {sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedData.map((item, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                    <td style={{ padding: "16px 20px", fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{item.name || (item as any).product}</td>
                                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                        <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: "#f1f5f9", color: "#64748b" }}>{item.category}</span>
                                    </td>
                                    <td style={{ padding: "16px 20px", textAlign: "right", fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{fmtNum(item.qty ?? (item as any).units_sold)}</td>
                                    <td style={{ padding: "16px 20px", textAlign: "right", fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{fmtEur(item.gross_revenue)}</td>
                                    <td style={{ padding: "16px 20px", textAlign: "right", fontSize: 13, color: "#6366f1", fontWeight: 600 }}>{fmtEur(item.net_revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fcfcfd", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>Show</span>
                        <select 
                            value={pageSize} 
                            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                            style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, outline: 'none' }}
                        >
                            {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
                        </select>
                        <span style={{ fontSize: 12, color: "#64748b" }}>per page</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>
                            {offset + 1}–{Math.min(offset + pageSize, table.total_count)} of {table.total_count} products
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, color: currentPage === 1 ? "#cbd5e1" : "#64748b", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                            >
                                Previous
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, color: currentPage === totalPages ? "#cbd5e1" : "#64748b", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
