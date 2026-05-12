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
import { useTips } from "@/hooks/use-metrics";
import { ProductSummaryMetric } from "@/lib/types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEuro(value: number): string {
    return `€ ${value.toLocaleString("de-DE")}`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

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
                    dot={{ r: 2.5, fill: color, stroke: "#fff", strokeWidth: 1 }}
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
    isCurrency = true,
    suffix = "",
}: {
    label: string;
    value: number | string;
    sub: string;
    metric: ProductSummaryMetric;
    color: string;
    xLabels: string[];
    isCurrency?: boolean;
    suffix?: string;
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
            <span style={{ fontSize: 32, fontWeight: 400, color: "#1e293b", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {typeof value === 'number' ? (isCurrency ? formatEuro(value) : value.toLocaleString()) : value}{suffix}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "4px 0 8px" }}>
                <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>{sub}</span>
            </div>
            <MiniChart metric={metric} color={color} xLabels={xLabels} />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TipsDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useTips(activeRange, customStart, customEnd);

    const weekLabels = useMemo(() => {
        if (!data) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return data.summary.total_tips.trend.map(t => days[new Date(t.date).getDay()]);
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Tips Analytics...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, tips_by_area, breakdown } = data;

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "24px", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Staff Tips Analytics</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <StatCard
                    label="Total Tips"
                    value={summary.total_tips.value}
                    sub={`▲ ${summary.total_tips.growth_ly}% vs LY`}
                    metric={summary.total_tips}
                    color="#6366f1"
                    xLabels={weekLabels}
                />
                <StatCard
                    label="Avg Tip / Cover"
                    value={summary.avg_tip_cover.value}
                    sub={`▲ ${summary.avg_tip_cover.growth_ly}% vs LY`}
                    metric={summary.avg_tip_cover}
                    color="#10b981"
                    xLabels={weekLabels}
                />
                <StatCard
                    label="Tip Rate"
                    value={summary.tip_rate.value}
                    sub={`▲ ${summary.tip_rate.growth_ly}pp vs LY`}
                    metric={summary.tip_rate}
                    color="#f59e0b"
                    xLabels={weekLabels}
                    isCurrency={false}
                    suffix="%"
                />
                <StatCard
                    label="Cash Tips"
                    value={summary.cash_tips.value}
                    sub={`${Math.round((summary.cash_tips.value / summary.total_tips.value) * 100) || 0}% of total`}
                    metric={summary.cash_tips}
                    color="#f43f5e"
                    xLabels={weekLabels}
                />
            </div>

            {/* Bottom Row */}
            <div style={{ display: "flex", gap: 16 }}>
                {/* Area Breakdown */}
                <div style={{ flex: 1.5, background: "#fff", borderRadius: 16, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                        <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 700 }}>Tips by Area</span>
                        <span style={{ color: "#cbd5e1", fontSize: 16 }}>→</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {["Area", "Total Tips", "Avg / Order", "Tip Rate"].map((h) => (
                                    <th key={h} style={{ textAlign: "left", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 700, paddingBottom: 12, borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tips_by_area.map((row, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                                    <td style={{ padding: "14px 0", fontSize: 13, color: "#1e293b", fontWeight: 600 }}>{row.area}</td>
                                    <td style={{ padding: "14px 0", fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{formatEuro(row.total_tips)}</td>
                                    <td style={{ padding: "14px 0", fontSize: 13, color: "#475569" }}>€ {row.avg_per_order.toFixed(2)}</td>
                                    <td style={{ padding: "14px 0", fontSize: 13, color: "#10b981", fontWeight: 600 }}>{row.tip_rate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Payment & Shift Breakdown */}
                <div style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "24px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#94a3b8", fontWeight: 700 }}>Breakdown</span>
                        <span style={{ color: "#cbd5e1", fontSize: 16 }}>→</span>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", marginBottom: 12, letterSpacing: '0.05em' }}>By Payment Method</p>
                        {breakdown.by_payment.map((item, i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                    <span style={{ color: '#475569', fontWeight: 500 }}>{item.label}</span>
                                    <span style={{ color: '#1e293b', fontWeight: 600 }}>{item.percentage}% · {formatEuro(item.value)}</span>
                                </div>
                                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99 }}>
                                    <div style={{ width: `${item.percentage}%`, height: '100%', background: item.label === 'Card' ? '#6366f1' : '#f59e0b', borderRadius: 99 }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#cbd5e1", textTransform: "uppercase", marginBottom: 12, letterSpacing: '0.05em' }}>By Shift</p>
                        {breakdown.by_shift.map((item, i) => (
                            <div key={i} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                    <span style={{ color: '#475569', fontWeight: 500 }}>{item.label}</span>
                                    <span style={{ color: '#1e293b', fontWeight: 600 }}>{item.percentage}% · {formatEuro(item.value)}</span>
                                </div>
                                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99 }}>
                                    <div style={{ width: `${item.percentage}%`, height: '100%', background: item.label === 'Day' ? '#10b981' : '#8b5cf6', borderRadius: 99 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
