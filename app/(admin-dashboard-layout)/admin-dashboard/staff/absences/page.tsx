"use client";
import React, { useMemo } from "react";
import {
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Bar,
    BarChart,
    ComposedChart,
    Area,
} from "recharts";
import { useRange } from "@/components/range-context";
import { useAbsencesData } from "@/hooks/use-metrics";
import { AbsenceTracking, IndividualPerformance } from "@/lib/types/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEuro(value: number): string {
    return `€${Math.round(value).toLocaleString("de-DE")}`;
}

// ─── Tiny Sparkline ───────────────────────────────────────────────────────────

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

    const chartData = data.map((v, i) => ({ v, day: xLabels[i] || '' }));
    const min = Math.min(...data);
    const max = Math.max(...data, 1);
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
                <Tooltip content={<CustomMiniTooltip />} position={{ y: -20 }} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const KPICard = ({ title, value, delta, subtitle, trend = [], color, isAlert, xLabels, suffix = "" }: any) => (
    <div style={styles.kpiCard}>
        <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>{title}</span>
            <span style={styles.kpiArrow}>→</span>
        </div>
        <div style={{ ...styles.kpiValue, color: isAlert ? "#ef4444" : "#111827" }}>{value}{suffix}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
            <span style={{ ...styles.kpiDelta, color: isAlert ? "#ef4444" : "#10b981" }}>{delta}</span>
        </div>
        {subtitle && <div style={styles.kpiSubtitle}>{subtitle}</div>}
        <div style={{ marginTop: 8 }}>
            <Spark data={trend} color={isAlert ? "#ef4444" : color} xLabels={xLabels} />
        </div>
    </div>
);

// ─── Absence Bar ─────────────────────────────────────────────────────────────

function AbsenceBarChart({ data }: { data: any[] }) {
    if (!data.length) return <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 }}>No evolution data.</div>;
    
    const colors = ["#FF6B6B", "#FFA726", "#AB47BC", "#26C6DA"];
    const keys = Object.keys(data[0].values);

    return (
        <ResponsiveContainer width="100%" height={140}>
            <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11 }} />
                {keys.map((key, i) => (
                    <Bar key={key} dataKey={`values.${key}`} stackId="a" fill={colors[i % colors.length]} radius={i === keys.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HRDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useAbsencesData(activeRange, customStart, customEnd);

    const xLabels = useMemo(() => {
        if (!data || !data.evolution_chart.length) return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        // Placeholder day labels as the API summary trend is missing dates in this specific response
        return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Absence Analytics...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, paid_absence_tracking, individual_performance, shift_ranking, evolution_chart } = data;

    return (
        <div style={styles.root}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Absences & Performance</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* TOP KPI CARDS */}
            <div style={styles.grid6}>
                <KPICard
                    title="Absenteeism Rate"
                    value={summary.absenteeism_rate.value}
                    suffix="%"
                    delta="▲ +0.6pp vs LM"
                    subtitle={summary.absenteeism_rate.label}
                    trend={[2.7, 2.8, 2.9, 3.0, 3.1, 3.2, summary.absenteeism_rate.value]}
                    color="#FF6B6B"
                    isAlert
                    xLabels={xLabels}
                />
                <KPICard
                    title="Cost Bajas Laborales"
                    value={formatEuro(summary.cost_bajas.value as number)}
                    delta="▲ +€1,240 vs LM"
                    subtitle={summary.cost_bajas.label}
                    trend={[4400, 4600, 4800, 5000, 5200, 5400, summary.cost_bajas.value]}
                    color="#FF6B6B"
                    isAlert
                    xLabels={xLabels}
                />
                <KPICard
                    title="Active Sick Leaves"
                    value={summary.active_sick_leaves.value}
                    delta="▲ En curso"
                    subtitle="Currently active cases"
                    trend={summary.active_sick_leaves.trend}
                    color="#FFA726"
                    xLabels={xLabels}
                />
                <KPICard
                    title="Accum. Overtime"
                    value={`${summary.accum_overtime.value}h`}
                    delta={`▲ +${summary.accum_overtime.growth_lw}h vs LW`}
                    subtitle="Additional labor hours"
                    trend={summary.accum_overtime.trend}
                    color="#FFA726"
                    xLabels={xLabels}
                />
                <KPICard
                    title="Punctuality Rate"
                    value={summary.punctuality_rate.value}
                    suffix="%"
                    delta="▲ +1.1pp vs LM"
                    subtitle="On-time vs total clock-ins"
                    trend={summary.punctuality_rate.trend}
                    color="#4CAF50"
                    xLabels={xLabels}
                />
            </div>

            {/* MIDDLE ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}>
                {/* Paid Absence Tracking Table */}
                <div style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div style={styles.sectionTitle}>Paid Absence Tracking</div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            {[
                                { label: "Sick Leave", color: "#FF6B6B" },
                                { label: "Work Accident", color: "#FFA726" },
                                { label: "Paid Leave", color: "#AB47BC" },
                                { label: "Mat/Pat", color: "#26C6DA" },
                            ].map((t) => (
                                <span key={t.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#94a3b8", fontWeight: 700 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, display: "inline-block" }} />
                                    {t.label.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                    <th style={{ textAlign: "left", paddingBottom: 10, fontWeight: 700 }}>Employee</th>
                                    <th style={{ textAlign: "left", paddingBottom: 10, fontWeight: 700 }}>Department</th>
                                    <th style={{ textAlign: "left", paddingBottom: 10, fontWeight: 700 }}>Type</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Start Date</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Days</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Hs.</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Cost</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paid_absence_tracking.length > 0 ? paid_absence_tracking.map((row, i) => (
                                    <tr key={i} style={{ borderTop: "1px solid #F8FAFC" }}>
                                        <td style={{ padding: "12px 0", fontWeight: 600, color: "#1e293b" }}>{row.employee}</td>
                                        <td style={{ color: "#64748b" }}>{row.department}</td>
                                        <td>
                                            <span style={{ background: "#F1F5F9", color: "#475569", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: "right", color: "#64748b" }}>{row.start_date}</td>
                                        <td style={{ textAlign: "right", color: "#1e293b", fontWeight: 600 }}>{row.days}</td>
                                        <td style={{ textAlign: "right", color: "#64748b" }}>{row.hs}h</td>
                                        <td style={{ textAlign: "right", color: "#ef4444", fontWeight: 700 }}>{formatEuro(row.cost)}</td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ color: row.status === 'Active' ? "#ef4444" : "#10b981", fontWeight: 700, fontSize: 11 }}>{row.status.toUpperCase()}</span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={8} style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>No active absence tracking this period.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Absence Evolution Chart */}
                <div style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <div style={styles.sectionTitle}>Absence Evolution</div>
                        <span style={{ fontSize: 16, color: "#cbd5e1" }}>→</span>
                    </div>
                    <AbsenceBarChart data={evolution_chart} />
                </div>
            </div>

            {/* BOTTOM ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
                {/* Productivity Table */}
                <div style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <div style={styles.sectionTitle}>Individual Productivity & Performance</div>
                        <span style={{ fontSize: 16, color: "#cbd5e1" }}>→</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                    <th style={{ textAlign: "left", paddingBottom: 10, fontWeight: 700 }}>Employee</th>
                                    <th style={{ textAlign: "left", paddingBottom: 10, fontWeight: 700 }}>Dept.</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Hs. Contrato</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Hs. Trabajadas</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Hs. Extra</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Prod. €/H</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Punctuality</th>
                                    <th style={{ textAlign: "right", paddingBottom: 10, fontWeight: 700 }}>Cost Turno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {individual_performance.map((row, i) => (
                                    <tr key={i} style={{ borderTop: "1px solid #F8FAFC" }}>
                                        <td style={{ padding: "10px 0", fontWeight: 600, color: "#1e293b" }}>{row.employee}</td>
                                        <td style={{ color: "#64748b" }}>{row.dept}</td>
                                        <td style={{ textAlign: "right", color: "#64748b" }}>{row.hs_contrato}h</td>
                                        <td style={{ textAlign: "right", color: "#1e293b", fontWeight: 500 }}>{row.hs_trabajadas}h</td>
                                        <td style={{ textAlign: "right", color: row.hs_extra >= 0 ? "#10b981" : "#ef4444", fontWeight: 700 }}>{row.hs_extra > 0 ? '+' : ''}{row.hs_extra}h</td>
                                        <td style={{ textAlign: "right" }}>
                                            <span style={{ background: "#F1F5F9", color: "#6366f1", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>€{row.productivity.toFixed(1)}</span>
                                        </td>
                                        <td style={{ textAlign: "right", fontWeight: 700, color: "#10b981" }}>{row.punctuality}</td>
                                        <td style={{ textAlign: "right", color: "#1e293b", fontWeight: 700 }}>{formatEuro(row.cost)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Shift Ranking */}
                <div style={styles.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div style={styles.sectionTitle}>Highest Unproductive Cost — Shift Ranking</div>
                        <span style={{ fontSize: 16, color: "#cbd5e1" }}>→</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {shift_ranking.map((r, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 800, width: 14, textAlign: "right" }}>{i + 1}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}>{r.label}</div>
                                    <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Impact calculated from absence IT</div>
                                </div>
                                <span style={{ fontWeight: 700, color: "#ef4444", fontSize: 14 }}>{formatEuro(r.value)}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: "1.5px solid #F1F5F9", marginTop: 14, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: 'uppercase' }}>Total unproductive impact</span>
                        <span style={{ fontWeight: 800, color: "#ef4444", fontSize: 16 }}>{formatEuro(shift_ranking.reduce((s, r) => s + r.value, 0))}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    root: {
        fontFamily: "'Inter', sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    grid6: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 14,
        marginBottom: 14,
    },
    kpiCard: {
        background: "#fff",
        borderRadius: 16,
        padding: "18px 20px 10px",
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
    kpiSubtitle: { fontSize: 10, color: "#cbd5e1", marginTop: 2, fontWeight: 600 },
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
};
