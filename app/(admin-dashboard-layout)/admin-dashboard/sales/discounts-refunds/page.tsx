"use client";
import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    Tooltip,
    YAxis,
    CartesianGrid,
    Area,
    AreaChart,
    XAxis,
} from "recharts";
import { useRange } from "@/components/range-context";
import { useDiscountsRefunds } from "@/hooks/use-metrics";
import { DetailTableItem, ProductSummaryMetric } from "@/lib/types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEuro(value: number): string {
    const val = Math.abs(value);
    return `€ ${val.toLocaleString("de-DE")}`;
}

const typeBadge: Record<string, { label: string; color: string }> = {
    Discount: { label: "Discount", color: "#22c55e" },
    Refund: { label: "Refund", color: "#f97316" },
    "N/C": { label: "N/C", color: "#eab308" },
};

// ─── Sub-components ─────────────────────────────────────────────────────────────

const CustomMiniTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "#1e293b", color: "#fff", padding: "4px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, textAlign: "center", position: "relative" }}>
                <div style={{ color: "#94a3b8", marginBottom: "2px" }}>{label}</div>
                <div>€{Math.abs(payload[0].value).toFixed(2)}</div>
                <div style={{ position: "absolute", bottom: "-4px", left: "50%", transform: "translateX(-50%)", width: "0", height: "0", borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #1e293b" }} />
            </div>
        );
    }
    return null;
};

function MiniChart({
    metric,
    color,
    xLabels,
}: {
    metric: ProductSummaryMetric;
    color: string;
    xLabels: string[];
}) {
    const values = metric.trend.map(t => t.value);
    if (values.length === 0) {
        return <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#cbd5e1' }}>No trend data</div>;
    }

    const data = metric.trend.map((t, i) => ({ 
        d: xLabels[i] || '', 
        value: t.value 
    }));
    
    const max = Math.max(...values, 1);
    const min = Math.min(...values);
    const ticks = [Math.round(min), Math.round(max)];

    return (
        <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={data} margin={{ top: 4, right: 14, left: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} horizontal stroke="#eceef2" strokeWidth={1} />
                <XAxis 
                    dataKey="d" 
                    tick={{ fontSize: 9, fill: "#cbd5e1", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    padding={{ left: 5, right: 5 }}
                    dy={10}
                />
                <YAxis
                    domain={[min * 0.9, max * 1.1]}
                    ticks={ticks}
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    width={32}
                    tick={{ fontSize: 10, fill: "#b8bec9" }}
                />
                <Tooltip content={<CustomMiniTooltip />} position={{ y: -20 }} />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={1.7}
                    fill={`url(#grad-${color.replace('#','')})`}
                    dot={{ r: 2, fill: color, stroke: "#fff", strokeWidth: 1 }}
                    activeDot={{ r: 4 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

function StatCard({
    label,
    value,
    sub,
    metric,
    color,
    xLabels,
    isNegative = false,
}: {
    label: string;
    value: number;
    sub: string;
    metric: ProductSummaryMetric;
    color: string;
    xLabels: string[];
    isNegative?: boolean;
}) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 28px 16px",
                flex: 1,
                minWidth: 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", fontWeight: 700 }}>
                {label}
            </span>
            <span style={{ fontSize: 36, fontWeight: 300, color: "#1e293b", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {isNegative ? '– ' : ''}{formatEuro(value)}
            </span>
            <span style={{ display: "inline-block", background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 600, borderRadius: 4, padding: "2px 8px", width: "fit-content", marginBottom: 6 }}>
                {sub}
            </span>
            <MiniChart metric={metric} color={color} xLabels={xLabels} />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DiscountsRefundsDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useDiscountsRefunds(activeRange, customStart, customEnd);

    const weekLabels = useMemo(() => {
        if (!data) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return data.summary.total_discounts.trend.map(t => days[new Date(t.date).getDay()]);
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Discounts & Refunds...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, detail_table } = data;
    const totalApplied = detail_table.reduce((s, r) => s + r.times_applied, 0);
    const totalAmount = detail_table.reduce((s, r) => s + r.amount, 0);

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "24px", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Discounts & Refunds</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <StatCard
                    label="Total Discounts"
                    value={summary.total_discounts.value}
                    sub="Applied this period"
                    metric={summary.total_discounts}
                    color="#ef4444"
                    xLabels={weekLabels}
                />
                <StatCard
                    label="Total Refunds"
                    value={summary.total_refunds.value}
                    sub="Refunded this period"
                    metric={summary.total_refunds}
                    color="#f59e0b"
                    xLabels={weekLabels}
                />
                <StatCard
                    label="Total Impact"
                    value={summary.total_impact.value}
                    sub="Net revenue reduction"
                    metric={summary.total_impact}
                    color="#1e293b"
                    xLabels={weekLabels}
                    isNegative={true}
                />
            </div>

            {/* Table Card */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 700 }}>
                        Discounts &amp; Refunds Detail
                    </span>
                    <span style={{ color: "#cbd5e1", fontSize: 16, cursor: "pointer" }}>→</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {["Name", "Type", "Times Applied", "Amount Discounted"].map((h) => (
                                    <th key={h} style={{ textAlign: "left", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 700, paddingBottom: 12, borderBottom: "1px solid #f1f5f9", paddingRight: 16 }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {detail_table.map((row, i) => {
                                const badge = typeBadge[row.type] || { label: row.type, color: "#64748b" };
                                return (
                                    <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                                        <td style={{ padding: "16px 16px 16px 0", fontSize: 14, color: "#1e293b", fontWeight: 600 }}>
                                            {row.name}
                                        </td>
                                        <td style={{ padding: "16px 16px 16px 0" }}>
                                            <span style={{ color: badge.color, fontSize: 11, fontWeight: 700, background: `${badge.color}10`, padding: '2px 8px', borderRadius: 4 }}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: "16px 16px 16px 0", fontSize: 14, color: "#475569", fontWeight: 500 }}>
                                            {row.times_applied}
                                        </td>
                                        <td style={{ padding: "16px 0", fontSize: 14, color: "#ef4444", textAlign: "left", fontWeight: 600 }}>
                                            – {formatEuro(row.amount)}
                                        </td>
                                    </tr>
                                );
                            })}
                            {/* Total row */}
                            <tr style={{ borderTop: "2px solid #f1f5f9", background: "#fcfcfd" }}>
                                <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 800, color: "#1e293b" }}>Total</td>
                                <td />
                                <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 800, color: "#1e293b" }}>{totalApplied}</td>
                                <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 800, color: "#ef4444" }}>– {formatEuro(totalAmount)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
