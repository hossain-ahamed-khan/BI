"use client";
import React, { useMemo } from "react";
import {
    Area,
    CartesianGrid,
    AreaChart,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useRange } from "@/components/range-context";
import { usePaymentMethods } from "@/hooks/use-metrics";
import { ProductSummaryMetric, BreakdownItem } from "@/lib/types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEuro(value: number | string): string {
    const val = typeof value === 'string' ? parseFloat(value) : value;
    return `€${Math.round(val).toLocaleString("de-DE")}`;
}

const COLORS = ["#6366f1", "#a5b4fc", "#f59e0b", "#14b8a6", "#22c55e", "#c084fc", "#ef4444", "#3b82f6"];

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
    const values = metric.trend.map(t => typeof t === 'number' ? t : t.value);
    if (values.length === 0) {
        return <div style={{ height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#cbd5e1' }}>No trend data</div>;
    }

    const data = metric.trend.map((t, i) => ({
        d: xLabels[i] || '',
        value: typeof t === 'number' ? t : t.value
    }));    
    const max = Math.max(...values, 1);
    const min = Math.min(...values);
    const ticks = [Math.round(min), Math.round(max)];

    return (
        <ResponsiveContainer width="100%" height={62}>
            <AreaChart data={data} margin={{ top: 2, right: 14, left: 10, bottom: 0 }}>
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
}: {
    label: string;
    value: number | string;
    sub: React.ReactNode;
    metric: ProductSummaryMetric;
    color: string;
    xLabels: string[];
}) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px 20px 8px 20px",
                flex: 1,
                minWidth: 0,
                border: "1px solid #f1f5f9",
                boxShadow: "0 2px 6px rgba(15, 23, 42, 0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", margin: 0, fontWeight: 700 }}>
                {label}
            </p>
            <p style={{ fontSize: 32, fontWeight: 600, color: "#1e293b", margin: "4px 0 0 0", letterSpacing: "-0.02em" }}>
                {formatEuro(value)}
            </p>
            <div style={{ fontSize: 11, margin: "2px 0 4px 0" }}>
                {sub}
            </div>
            <MiniChart metric={metric} color={color} xLabels={xLabels} />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PaymentDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = usePaymentMethods(activeRange, customStart, customEnd);

    const weekLabels = useMemo(() => {
        if (!data) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return data.summary.total_received.trend.map(t => {
            if (typeof t === 'number') return "";
            return days[new Date(t.date).getDay()];
        });
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Payment Analytics...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, breakdown_chart, card_type_detail } = data;

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh", padding: 24, boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Payment Methods</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* Top row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <StatCard
                    label="Total Received"
                    value={summary.total_received.value}
                    sub={
                        <span style={{ color: "#10b981", fontWeight: 700, background: "#d1fae5", borderRadius: 999, padding: "2px 8px", display: "inline-block" }}>
                            {summary.total_received.growth_ly! >= 0 ? '▲' : '▼'} {Math.abs(summary.total_received.growth_ly!)}% vs LY
                        </span>
                    }
                    metric={summary.total_received}
                    color="#6366f1"
                    xLabels={weekLabels}
                />
                <StatCard
                    label="Card Payments"
                    value={summary.card_payments.value}
                    sub={
                        <span style={{ color: "#64748b", background: "#f1f5f9", borderRadius: 999, padding: "2px 8px", display: "inline-block", fontWeight: 700 }}>
                            {Math.round(summary.card_payments.percentage_of_total!)}% of total
                        </span>
                    }
                    metric={summary.card_payments}
                    color="#818cf8"
                    xLabels={weekLabels}
                />
                <StatCard
                    label="Cash"
                    value={summary.cash_payments.value}
                    sub={
                        <span style={{ color: "#64748b", background: "#f1f5f9", borderRadius: 999, padding: "2px 8px", display: "inline-block", fontWeight: 700 }}>
                            {Math.round(summary.cash_payments.percentage_of_total!)}% of total
                        </span>
                    }
                    metric={summary.cash_payments}
                    color="#2dd4bf"
                    xLabels={weekLabels}
                />
                <StatCard
                    label="Other"
                    value={summary.other_payments.value}
                    sub={
                        <span style={{ color: "#64748b", background: "#f1f5f9", borderRadius: 999, padding: "2px 8px", display: "inline-block", fontWeight: 700 }}>
                            {Math.round(summary.other_payments.percentage_of_total!)}% of total
                        </span>
                    }
                    metric={summary.other_payments}
                    color="#f59e0b"
                    xLabels={weekLabels}
                />
            </div>

            {/* Bottom row */}
            <div style={{ display: "flex", gap: 16 }}>
                {/* Payment Breakdown */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "24px", flex: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", margin: 0, fontWeight: 700 }}>
                            Payment Breakdown
                        </p>
                        <span style={{ color: "#cbd5e1", fontSize: 16 }}>→</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32 }}>
                        <PieChart width={220} height={220}>
                            <Pie
                                data={breakdown_chart}
                                cx={105}
                                cy={105}
                                innerRadius={68}
                                outerRadius={105}
                                dataKey="value"
                                strokeWidth={2}
                                stroke="#fff"
                            >
                                {breakdown_chart.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {breakdown_chart.map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: "#1e293b", fontWeight: 500 }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card Type Detail */}
                <div style={{ background: "#fff", borderRadius: 16, padding: "24px", flex: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase", margin: 0, fontWeight: 700 }}>
                            Card Type Detail
                        </p>
                        <span style={{ color: "#cbd5e1", fontSize: 16 }}>→</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f8fafc" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ background: "#6366f1", borderRadius: 4, width: 22, height: 14 }} />
                            <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>Card Total</span>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{formatEuro(card_type_detail.total)}</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {card_type_detail.brands.map((row, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 12, background: "#f8fafc" }}>
                                <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{row.brand.replace('_', ' ')}</span>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 700 }}>{formatEuro(row.amount)}</span>
                                    <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 30, textAlign: "right", fontWeight: 600 }}>· {row.percentage}%</span>
                                    <span style={{ color: "#cbd5e1", fontSize: 12 }}>›</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
