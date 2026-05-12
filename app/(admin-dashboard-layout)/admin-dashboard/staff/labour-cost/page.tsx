"use client";
import React, { useMemo } from "react";
import {
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Bar,
    ComposedChart,
    Area,
    CartesianGrid,
} from "recharts";
import { useRange } from "@/components/range-context";
import { useLaborCostData } from "@/hooks/use-metrics";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEuro(value: number): string {
    return `€ ${Math.round(value).toLocaleString("de-DE")}`;
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

const Spark = ({
    data,
    color,
    xLabels,
}: {
    data: number[];
    color: string;
    xLabels: string[];
}) => {
    if (data.length === 0) return <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#cbd5e1' }}>No trend data</div>;

    const chartData = data.map((v, i) => ({ v, day: xLabels[i] }));
    const min = Math.min(...data);
    const max = Math.max(...data, 1);
    const range = max - min || 1;
    const ticks = [Math.round(min), Math.round(max)];

    return (
        <ResponsiveContainer width="100%" height={72}>
            <ComposedChart data={chartData} margin={{ top: 4, right: 36, left: 10, bottom: 0 }}>
                <defs>
                    <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.03} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#cbd5e1", fontWeight: 600 }} axisLine={false} tickLine={false} interval={0} padding={{ left: 5, right: 5 }} />
                <YAxis orientation="right" domain={['auto', 'auto']} ticks={ticks} tick={{ fontSize: 9, fill: "#cbd5e1" }} axisLine={false} tickLine={false} width={32} />
                <Area type="monotone" dataKey="v" fill={`url(#grad-${color.replace("#", "")})`} stroke="none" isAnimationActive={false} />
                <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={{ r: 2.5, fill: "#fff", stroke: color, strokeWidth: 1.5 }} isAnimationActive={false} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

function KpiCard({ title, value, delta, deltaPositive, subtitle, trend, color, isAlert, xLabels }: any) {
    return (
        <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>{title}</span>
                <span style={styles.kpiArrow}>→</span>
            </div>
            <div style={{ ...styles.kpiValue, color: isAlert ? "#ef4444" : "#111827" }}>{value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <span style={{ ...styles.kpiDelta, color: deltaPositive ? "#ef4444" : "#10b981" }}>{delta}</span>
            </div>
            {subtitle && <div style={styles.kpiSubtitle}>{subtitle}</div>}
            <div style={{ marginTop: 8 }}>
                <Spark data={trend} color={isAlert ? "#ef4444" : color} xLabels={xLabels} />
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LabourCostDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useLaborCostData(activeRange, customStart, customEnd);

    const xLabels = useMemo(() => {
        if (!data) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return data.indicators.map(t => {
            const parts = t.date.split(' ');
            return parts[0] || '';
        });
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Labour Cost Analysis...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, indicators, dept_breakdown, evolution } = data;

    return (
        <div style={styles.root}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>Labour Cost Performance</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={styles.grid6}>
                <KpiCard
                    title="Labour Cost"
                    value={formatEuro(summary.labor_cost.value as number)}
                    delta={`▲ +${summary.labor_cost.growth_lw}% vs LW`}
                    deltaPositive={true}
                    subtitle={`YTD: ${formatEuro(summary.labor_cost.ytd || 0)}`}
                    trend={indicators.map(i => i.labor_cost)}
                    color="#6366f1"
                    xLabels={xLabels}
                />
                <KpiCard
                    title="Labour Cost %"
                    value={`${summary.labor_cost_perc.value}%`}
                    delta={`▲ +${(summary.labor_cost_perc.value as number - summary.labor_cost_perc.target!).toFixed(1)}pp vs Target`}
                    deltaPositive={true}
                    subtitle={`Target: < ${summary.labor_cost_perc.target}%`}
                    trend={indicators.map(i => i.lc_perc)}
                    color="#f59e0b"
                    xLabels={xLabels}
                />
                <KpiCard
                    title="Hours Worked"
                    value={`${summary.hours_worked.value}h`}
                    delta={`▼ -${summary.hours_worked.growth_lw}% vs LW`}
                    deltaPositive={false}
                    subtitle="Current period"
                    trend={indicators.map(i => i.hours_worked)}
                    color="#6366f1"
                    xLabels={xLabels}
                />
                <KpiCard
                    title="Total Headcount"
                    value={summary.total_headcount.value}
                    delta={summary.total_headcount.status}
                    deltaPositive={false}
                    subtitle=""
                    trend={indicators.map(i => i.staff)}
                    color="#10b981"
                    xLabels={xLabels}
                />
                <KpiCard
                    title="Productivity"
                    value={`${(indicators.reduce((acc, curr) => acc + curr.productivity, 0) / indicators.filter(i => i.productivity > 0).length || 0).toFixed(1)} €/h`}
                    delta="Avg for period"
                    deltaPositive={false}
                    trend={indicators.map(i => i.productivity)}
                    color="#8b5cf6"
                    xLabels={xLabels}
                />
                <KpiCard
                    title="Revenue"
                    value={formatEuro(indicators.reduce((acc, curr) => acc + curr.revenue, 0))}
                    delta="Total this period"
                    deltaPositive={false}
                    trend={indicators.map(i => i.revenue)}
                    color="#10b981"
                    xLabels={xLabels}
                />
            </div>

            {/* Middle row: Performance Table + Dept Table */}
            <div style={styles.row2}>
                {/* Performance Table */}
                <div style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={styles.sectionTitle}>Performance Indicators — Detailed Breakdown</span>
                        <span style={{ fontSize: 11, color: "#d1d5db" }}>→</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ ...styles.th, width: 140 }}>Metric</th>
                                    {indicators.map((d, i) => (
                                        <th key={i} style={styles.thRight}>{d.date}</th>
                                    ))}
                                    <th style={styles.thRight}>Total/Avg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { label: "Volumen de Negocio", key: "revenue", prefix: "€ ", total: true },
                                    { label: "Staff", key: "staff", suffix: " pers.", total: true },
                                    { label: "Hours Worked", key: "hours_worked", suffix: "h", total: true },
                                    { label: "Labour Cost", key: "labor_cost", prefix: "€ ", total: true },
                                    { label: "Labour Cost %", key: "lc_perc", suffix: "%", avg: true, colored: true },
                                    { label: "Productividad", key: "productivity", suffix: " €/h", avg: true }
                                ].map((row) => (
                                    <tr key={row.label}>
                                        <td style={{ ...styles.td, fontWeight: 600, color: "#1e293b" }}>{row.label}</td>
                                        {indicators.map((d, i) => (
                                            <td key={i} style={styles.tdRight}>
                                                {row.prefix}{Math.round(d[row.key as keyof typeof d] as number).toLocaleString("de-DE")}{row.suffix}
                                            </td>
                                        ))}
                                        <td style={{ ...styles.tdRight, fontWeight: 700, color: "#0f172a" }}>
                                            {row.prefix}
                                            {row.total 
                                                ? Math.round(indicators.reduce((acc, curr) => acc + (curr[row.key as keyof typeof curr] as number), 0)).toLocaleString("de-DE")
                                                : (indicators.reduce((acc, curr) => acc + (curr[row.key as keyof typeof curr] as number), 0) / indicators.filter(i => (i[row.key as keyof typeof i] as number) > 0).length || 0).toFixed(1)
                                            }
                                            {row.suffix}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Dept Table */}
                <div style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={styles.sectionTitle}>Labour Cost por Dept.</span>
                        <span style={{ fontSize: 11, color: "#d1d5db" }}>→</span>
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Department</th>
                                <th style={styles.thRight}>Staff</th>
                                <th style={styles.thRight}>Horas</th>
                                <th style={styles.thRight}>Cost</th>
                                <th style={styles.thRight}>MS%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dept_breakdown.map((r) => (
                                <tr key={r.department}>
                                    <td style={{ ...styles.td, fontWeight: 600 }}>{r.department}</td>
                                    <td style={styles.tdRight}>{r.staff}</td>
                                    <td style={styles.tdRight}>{r.hours}h</td>
                                    <td style={styles.tdRight}>{formatEuro(r.cost)}</td>
                                    <td style={{ ...styles.tdRight, color: r.ms_perc > 35 ? "#ef4444" : "#374151", fontWeight: 700 }}>{r.ms_perc}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom: Labour Cost vs Revenue Evolution */}
            <div style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={styles.sectionTitle}>Labour Cost vs Revenue Evolution</span>
                    <span style={{ fontSize: 11, color: "#d1d5db" }}>→</span>
                </div>

                {/* Legend */}
                <div style={{ display: "flex", gap: 20, marginBottom: 12, justifyContent: "center" }}>
                    {[
                        { color: "#6366f1", label: "Labour Cost" },
                        { color: "#10b981", label: "Revenue" },
                        { color: "#fca5a5", label: "LC% of Revenue" },
                    ].map(({ color, label }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                            <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{label}</span>
                        </div>
                    ))}
                </div>

                <ResponsiveContainer width="100%" height={250}>
                    <ComposedChart data={evolution} margin={{ top: 4, right: 40, left: 10, bottom: 4 }}>
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 40]} />
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "none", boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar yAxisId="right" dataKey="lc_perc" fill="#fca5a5" fillOpacity={0.4} radius={[4, 4, 0, 0]} barSize={40} />
                        <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }} />
                        <Line yAxisId="left" type="monotone" dataKey="labor_cost" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
    root: {
        fontFamily: "'Inter', sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "24px",
        color: "#1e293b",
        fontSize: 13,
    },
    grid6: {
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 16,
        marginBottom: 16,
    },
    kpiCard: {
        background: "#fff",
        borderRadius: 16,
        padding: "20px 20px 10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        border: '1px solid #f1f5f9',
    },
    kpiHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    kpiTitle: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "#94a3b8",
    },
    kpiArrow: { fontSize: 12, color: "#cbd5e1" },
    kpiValue: {
        fontSize: 28,
        fontWeight: 600,
        lineHeight: 1.1,
        letterSpacing: "-0.5px",
        marginBottom: 4,
    },
    kpiDelta: {
        fontSize: 11,
        fontWeight: 700,
    },
    kpiSubtitle: { fontSize: 11, color: "#94a3b8", marginTop: 2, fontWeight: 500 },
    row2: {
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: 16,
        marginBottom: 16,
    },
    card: {
        background: "#fff",
        borderRadius: 16,
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        border: '1px solid #f1f5f9',
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "#94a3b8",
        marginBottom: 16,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse" as const,
    },
    th: {
        fontSize: 10,
        fontWeight: 700,
        color: "#94a3b8",
        textAlign: "left" as const,
        paddingBottom: 10,
        borderBottom: "1.5px solid #f1f5f9",
        textTransform: "uppercase",
    },
    thRight: {
        fontSize: 10,
        fontWeight: 700,
        color: "#94a3b8",
        textAlign: "right" as const,
        paddingBottom: 10,
        borderBottom: "1.5px solid #f1f5f9",
        textTransform: "uppercase",
    },
    td: {
        padding: "12px 0",
        fontSize: 13,
        color: "#334155",
        borderBottom: "1px solid #f8fafc",
    },
    tdRight: {
        padding: "12px 0",
        fontSize: 13,
        color: "#334155",
        textAlign: "right" as const,
        borderBottom: "1px solid #f8fafc",
    },
};
