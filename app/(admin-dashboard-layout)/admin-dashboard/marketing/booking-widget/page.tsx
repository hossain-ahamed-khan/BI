"use client";
import React, { useMemo } from "react";
import {
    ComposedChart,
    Area,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useRange } from "@/components/range-context";
import { useBookingWidgetData } from "@/hooks/use-metrics";

// ── Styles ──────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    border: "0.5px solid #e5e5e5",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
};

const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    color: "#9a9a9a",
    textTransform: "uppercase",
};

const bigNumStyle: React.CSSProperties = {
    fontSize: 32,
    fontWeight: 300,
    color: "#1a1a1a",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
};

const badgeStyle = (positive: boolean | null): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    fontSize: 12,
    fontWeight: 600,
    color: positive === null ? "#888" : positive ? "#16a34a" : "#dc2626",
    background: positive === null ? "#f3f4f6" : positive ? "#dcfce7" : "#fee2e2",
    borderRadius: 6,
    padding: "2px 8px",
});

const sectionLabelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#b0b0b0",
    textTransform: "uppercase",
    marginBottom: 12,
};

const chartCardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    border: "0.5px solid #e5e5e5",
    padding: "18px 20px 10px",
};

const tableHeaderStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.07em",
    color: "#b0b0b0",
    textTransform: "uppercase",
    paddingBottom: 8,
    borderBottom: "0.5px solid #ececec",
};

const PURPLE = "#9b9cf0";
const GREEN_LINE = "#3bbf9a";
const ORANGE = "#f4a261";
const SALMON = "#f4a07a";
const PURPLE_DIM = "#c5c6f7";

// ── Components ───────────────────────────────────────────────────────────

const ArrowIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#c0c0c0" }}>
        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChartLegend = ({
    items,
}: {
    items: { color: string; label: string; type?: "bar" | "line" }[];
}) => (
    <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#94a3b8", marginBottom: 12, fontWeight: 600 }}>
        {items.map((item) => (
            <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                    style={{
                        display: "inline-block",
                        width: item.type === 'line' ? 14 : 8,
                        height: item.type === 'line' ? 2 : 8,
                        background: item.color,
                        borderRadius: 2,
                    }}
                />
                {item.label}
            </span>
        ))}
    </div>
);

function Sparkline({ data, stroke, yTicks, xLabels }: { data: any[], stroke: string, yTicks: number[], xLabels: string[] }) {
    const chartData = data.map((v, i) => ({ d: xLabels[i], v: v.value }));
    return (
        <ResponsiveContainer width="100%" height={72}>
            <ComposedChart data={chartData} margin={{ top: 4, right: 36, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`grad-${stroke.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stroke} stopOpacity={0.18} />
                        <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="d" hide />
                <YAxis orientation="right" domain={['auto', 'auto']} ticks={yTicks} tick={{ fontSize: 9, fill: "#cbd5e1" }} axisLine={false} tickLine={false} width={32} />
                <Area type="monotone" dataKey="v" stroke="none" fill={`url(#grad-${stroke.replace('#','')})`} />
                <Line type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.8} dot={{ r: 2, fill: stroke, strokeWidth: 0 }} activeDot={{ r: 4 }} />
            </ComposedChart>
        </ResponsiveContainer>
    );
}

function KpiCard({ label, value, badge, positive, subLabel, sparkData, sparkColor, yTicks, xLabels }: any) {
    return (
        <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={labelStyle}>{label}</span>
                <ArrowIcon />
            </div>
            <div style={bigNumStyle}>{value}</div>
            {badge && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <span style={badgeStyle(positive)}>
                        {positive === true ? "▲" : positive === false ? "▼" : ""} {badge}
                    </span>
                </div>
            )}
            {subLabel && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, fontWeight: 500 }}>{subLabel}</div>}
            {sparkData && (
                <div style={{ marginTop: 8 }}>
                    <Sparkline data={sparkData} stroke={sparkColor} yTicks={yTicks} xLabels={xLabels} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        {xLabels.map((l: string, i: number) => (
                            <span key={i} style={{ fontSize: 8, color: '#cbd5e1', fontWeight: 700 }}>{l}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function BookingWidgetDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useBookingWidgetData(activeRange, customStart, customEnd);

    const xLabels = useMemo(() => {
        if (!data) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return data.trends.map(t => days[new Date(t.date).getDay()]);
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Booking Analytics...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, trends, party_size_demand, lead_time_demand, breakdowns } = data;

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "24px 20px", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Booking Widget Analysis</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* KPI Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 16 }}>
                <KpiCard
                    label="Total Reservations"
                    value={summary.total_reservations}
                    badge="+0% vs LW"
                    positive={true}
                    subLabel={`Total this ${activeRange}`}
                    sparkData={trends.map(t => ({ value: t.bookings }))}
                    sparkColor="#6366f1"
                    yTicks={[0, 10, 20]}
                    xLabels={xLabels}
                />
                <KpiCard
                    label="Widget Searches"
                    value={summary.widget_searches.toLocaleString()}
                    badge="+0% vs LW"
                    positive={true}
                    subLabel={`Conv. rate: ${((summary.total_reservations / summary.widget_searches) * 100 || 0).toFixed(1)}%`}
                    sparkData={trends.map(t => ({ value: t.searches }))}
                    sparkColor="#818cf8"
                    yTicks={[0, 100, 200]}
                    xLabels={xLabels}
                />
                <KpiCard
                    label="Availability Rate"
                    value={`${summary.availability_rate}%`}
                    badge="Optimal"
                    positive={null}
                    subLabel="searches w/ avail."
                    sparkData={trends.map(t => ({ value: t.availability_rate }))}
                    sparkColor="#ef4444"
                    yTicks={[0, 50, 100]}
                    xLabels={xLabels}
                />
                <KpiCard
                    label="Avg. Advance (Days)"
                    value={`${summary.avg_advance_days.toFixed(1)}d`}
                    badge="Consistent"
                    positive={true}
                    sparkData={trends.map(t => ({ value: t.searches / 10 }))} // Placeholder trend
                    sparkColor="#3bbf9a"
                    yTicks={[0, 10, 20]}
                    xLabels={xLabels}
                />
                <KpiCard
                    label="Avg. Party Size"
                    value={summary.avg_party_size.toFixed(1)}
                    subLabel="pax per booking"
                    sparkData={trends.map(t => ({ value: t.bookings > 0 ? summary.avg_party_size : 0 }))}
                    sparkColor="#f4a261"
                    yTicks={[0, 2, 4]}
                    xLabels={xLabels}
                />
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={chartCardStyle}>
                    <span style={sectionLabelStyle}>Widget Searches by Day — vs Availability Rate</span>
                    <ChartLegend items={[{ color: PURPLE, label: "Searches", type: "bar" }, { color: GREEN_LINE, label: "Avail. Rate %", type: "line" }]} />
                    <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart data={trends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" tickFormatter={(v) => v.split('-')[2]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" hide domain={[0, 'dataMax + 50']} />
                            <YAxis yAxisId="right" orientation="right" hide domain={[0, 100]} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Bar yAxisId="left" dataKey="searches" fill={PURPLE} radius={[4, 4, 0, 0]} maxBarSize={20} />
                            <Line yAxisId="right" type="monotone" dataKey="availability_rate" stroke={GREEN_LINE} strokeWidth={2} dot={{ r: 3, fill: GREEN_LINE, strokeWidth: 0 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div style={chartCardStyle}>
                    <span style={sectionLabelStyle}>Demand & Availability by Days Searched in Advance</span>
                    <ChartLegend items={[{ color: SALMON, label: "Searches", type: "bar" }, { color: PURPLE_DIM, label: "Avail. Rate %", type: "line" }]} />
                    <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart data={lead_time_demand} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="days" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" hide />
                            <YAxis yAxisId="right" orientation="right" hide domain={[0, 100]} />
                            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Bar yAxisId="left" dataKey="searches" fill={SALMON} radius={[4, 4, 0, 0]} maxBarSize={30} />
                            <Line yAxisId="right" type="monotone" dataKey="avail_rate" stroke={PURPLE_DIM} strokeWidth={2} dot={{ r: 3, fill: PURPLE_DIM, strokeWidth: 0 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Breakdowns Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div style={cardStyle}>
                    <span style={sectionLabelStyle}>Reservations by Country</span>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ ...tableHeaderStyle, textAlign: "left" }}>Country</th>
                                <th style={{ ...tableHeaderStyle, textAlign: "right" }}>Reservations</th>
                                <th style={{ ...tableHeaderStyle, textAlign: "right" }}>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {breakdowns.by_country.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "0.5px solid #f8fafc" }}>
                                    <td style={{ fontSize: 13, color: "#1e293b", padding: "10px 0", fontWeight: 500 }}>{r.label}</td>
                                    <td style={{ fontSize: 13, color: "#1e293b", textAlign: "right", fontWeight: 600 }}>{r.value}</td>
                                    <td style={{ fontSize: 12, color: "#64748b", textAlign: "right" }}>{r.perc}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={cardStyle}>
                    <span style={sectionLabelStyle}>Reservations by Source</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                        {breakdowns.by_source.map((src, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                                    <span style={{ color: '#1e293b', fontWeight: 600 }}>{src.label}</span>
                                    <span style={{ color: '#64748b' }}>{src.perc}% · {src.value}</span>
                                </div>
                                <div style={{ height: 4, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${src.perc}%`, background: '#6366f1', borderRadius: 4 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ ...cardStyle, justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: '#94a3b8' }}>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>City & Device breakdown arriving in next API update.</p>
                </div>
            </div>
        </div>
    );
}
