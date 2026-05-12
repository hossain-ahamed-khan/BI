"use client";
import React, { useMemo } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    CartesianGrid,
} from "recharts";
import { useRange } from "@/components/range-context";
import { useReservationsData } from "@/hooks/use-metrics";

// ── Styles ───────────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    padding: "18px 20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 4,
};

const PURPLE = "#6366f1";
const SALMON = "#f87171";
const ORANGE = "#fb923c";

// ── Sub-components ─────────────────────────────────────────────────────────────

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div style={cardStyle} className={className}>{children}</div>
);

const ArrowIcon = () => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth={2}>
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: "#1e293b", color: "#fff", padding: "6px 10px", borderRadius: "8px", fontSize: "11px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", border: "none" }}>
                <p style={{ margin: "0 0 4px", color: "#94a3b8", fontWeight: 600 }}>{label}</p>
                <div style={{ fontWeight: 700 }}>{payload[0].value}</div>
            </div>
        );
    }
    return null;
};

function StatCard({
    label, value, badge, badgeColor, sub, data = [], lineColor,
    yTicks, variant = "line", areaColor
}: any) {
    return (
        <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={labelStyle}>{label}</span>
                <ArrowIcon />
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#1e293b", margin: "4px 0 2px", lineHeight: 1.1 }}>{value}</div>
            {badge && (
                <div style={{ display: "inline-flex", background: badgeColor + "15", color: badgeColor, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                    {badge}
                </div>
            )}
            {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontWeight: 500 }}>{sub}</div>}
            
            <ResponsiveContainer width="100%" height={70}>
                {variant === "area" ? (
                    <AreaChart data={data} margin={{ top: 4, right: 32, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`grad-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={areaColor || lineColor} stopOpacity={0.18} />
                                <stop offset="100%" stopColor={areaColor || lineColor} stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="day" hide />
                        <YAxis orientation="right" domain={['auto', 'auto']} ticks={yTicks} tick={{ fontSize: 9, fill: "#cbd5e1" }} axisLine={false} tickLine={false} width={28} />
                        <Area type="monotone" dataKey="v" stroke={lineColor} strokeWidth={1.8} fill={`url(#grad-${label.replace(/\s/g, "")})`} dot={{ r: 2, fill: lineColor, strokeWidth: 0 }} />
                    </AreaChart>
                ) : (
                    <LineChart data={data} margin={{ top: 4, right: 32, left: 0, bottom: 0 }}>
                        <XAxis dataKey="day" hide />
                        <YAxis orientation="right" domain={['auto', 'auto']} ticks={yTicks} tick={{ fontSize: 9, fill: "#cbd5e1" }} axisLine={false} tickLine={false} width={28} />
                        <Line type="monotone" dataKey="v" stroke={lineColor} strokeWidth={1.8} dot={{ r: 2, fill: lineColor, strokeWidth: 0 }} />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </Card>
    );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

export default function ReservationsDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useReservationsData(activeRange, customStart, customEnd);

    const xLabels = useMemo(() => {
        if (!data || !data.summary.total_reservations.trend) return [];
        const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return (data.summary.total_reservations.trend as any[]).map((t: any) => days[new Date(t.date).getDay()]);
    }, [data]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Reservations Analytics...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, bookings_by_source, bookings_by_day_of_week, peak_hours_chart, top_countries, party_size_table } = data;

    return (
        <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "24px", boxSizing: "border-box", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Reservations Overview</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* Row 1 – Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
                <StatCard
                    label="Total Reservations"
                    value={summary.total_reservations.value.toLocaleString()}
                    badge={`${(summary.total_reservations.growth_lw || 0) >= 0 ? '▲' : '▼'} ${Math.abs(summary.total_reservations.growth_lw || 0)}% vs LW`}
                    badgeColor={(summary.total_reservations.growth_lw || 0) >= 0 ? "#10b981" : "#ef4444"}
                    lineColor="#6366f1"
                    data={(summary.total_reservations.trend as any[]).map((t: any, i: number) => ({ day: xLabels[i], v: t.value }))}
                    yTicks={[0, 10, 20]}
                />
                <StatCard
                    label="No-Shows"
                    value={summary.no_shows.count}
                    sub={`${summary.no_shows.rate}% rate`}
                    lineColor="#f87171"
                    areaColor="#f87171"
                    variant="area"
                    data={summary.no_shows.trend.map((t: any, i: number) => ({ day: xLabels[i], v: t.value }))}
                    yTicks={[0, 5, 10]}
                />
                <StatCard
                    label="Cancellations"
                    value={summary.cancellations.count}
                    sub={`${summary.cancellations.rate}% rate`}
                    lineColor="#fb923c"
                    areaColor="#fb923c"
                    variant="area"
                    data={summary.cancellations.trend.map((t: any, i: number) => ({ day: xLabels[i], v: t.value }))}
                    yTicks={[0, 5, 10]}
                />
                <StatCard
                    label="Avg Party Size"
                    value={Number(summary.avg_party_size.value).toFixed(1)}
                    sub="pax / reservation"
                    lineColor="#6366f1"
                    data={(summary.avg_party_size.trend as any[]).map((t: any, i: number) => ({ day: xLabels[i], v: t.value }))}
                    yTicks={[0, 4, 8]}
                />
            </div>

            {/* Row 2 – Source + Day of Week */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16, marginBottom: 16 }}>
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={labelStyle}>Bookings by Source</span>
                        <ArrowIcon />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 12 }}>
                        <PieChart width={200} height={180}>
                            <Pie
                                data={bookings_by_source} dataKey="value"
                                cx={90} cy={85} innerRadius={55} outerRadius={85}
                                stroke="none" paddingAngle={2}
                            >
                                {bookings_by_source.map((entry, index) => (
                                    <Cell key={index} fill={[PURPLE, "#818cf8", "#fb923c", "#10b981"][index % 4]} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {bookings_by_source.map((s, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: [PURPLE, "#818cf8", "#fb923c", "#10b981"][i % 4], flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>{s.label}</span>
                                    <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}>{s.perc}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={labelStyle}>Bookings by Day of Week</span>
                        <ArrowIcon />
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={bookings_by_day_of_week} barSize={36} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.04)" }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {bookings_by_day_of_week.map((entry, index) => (
                                    <Cell key={index} fill={entry.value === Math.max(...bookings_by_day_of_week.map(d => d.value)) ? PURPLE : "#c7d2fe"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Row 3 – Country / Party Size / Peak Hours */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 16 }}>
                <Card>
                    <span style={labelStyle}>By Country – Top 10</span>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
                        {top_countries.map((c, i) => (
                            <div key={i}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                                    <span style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>{c.country}</span>
                                    <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{c.perc}% · {c.count}</span>
                                </div>
                                <div style={{ background: "#f1f5f9", borderRadius: 99, height: 4 }}>
                                    <div style={{ width: `${c.perc}%`, height: "100%", borderRadius: 99, background: PURPLE }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <span style={labelStyle}>By Party Size</span>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10 }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                                {["PAX", "RESERV.", "%", "COVERS", "AVG €", "VS LY"].map((h) => (
                                    <th key={h} style={{ padding: "8px 6px", color: "#94a3b8", fontWeight: 700, fontSize: 10, textAlign: h === "PAX" ? "left" : "right" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {party_size_table.rows.map((r, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                                    <td style={{ padding: "8px 6px", fontWeight: 600, color: "#1e293b" }}>{r.pax}</td>
                                    <td style={{ padding: "8px 6px", textAlign: "right", color: "#475569" }}>{r.reservations}</td>
                                    <td style={{ padding: "8px 6px", textAlign: "right", color: r.perc > 20 ? PURPLE : "#64748b", fontWeight: r.perc > 20 ? 700 : 500 }}>{r.perc}%</td>
                                    <td style={{ padding: "8px 6px", textAlign: "right", color: "#475569" }}>{r.covers}</td>
                                    <td style={{ padding: "8px 6px", textAlign: "right", color: "#1e293b", fontWeight: 600 }}>€ {r.avg_spend.toFixed(0)}</td>
                                    <td style={{ padding: "8px 6px", textAlign: "right", color: r.vs_ly >= 0 ? "#10b981" : "#ef4444", fontWeight: 700 }}>{r.vs_ly > 0 ? '+' : ''}{r.vs_ly}%</td>
                                </tr>
                            ))}
                            {/* Sigma Total Row */}
                            <tr style={{ borderTop: "2px solid #f1f5f9", background: "#fcfcfd" }}>
                                <td style={{ padding: "10px 6px", fontWeight: 800, color: "#1e293b" }}>Σ</td>
                                <td style={{ padding: "10px 6px", textAlign: "right", fontWeight: 800, color: "#1e293b" }}>{party_size_table.total.reservations}</td>
                                <td />
                                <td style={{ padding: "10px 6px", textAlign: "right", fontWeight: 800, color: "#1e293b" }}>{party_size_table.total.covers}</td>
                                <td style={{ padding: "10px 6px", textAlign: "right", fontWeight: 800, color: "#1e293b" }}>€ {party_size_table.total.avg_spend.toFixed(0)}</td>
                                <td />
                            </tr>
                        </tbody>
                    </table>
                </Card>

                <Card>
                    <span style={labelStyle}>Peak Hours</span>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={peak_hours_chart} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                            <defs>
                                <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={ORANGE} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={ORANGE} stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="hour" tickFormatter={(v) => `${v}h`} tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="count" stroke={ORANGE} strokeWidth={2.5} fill="url(#peakGrad)" dot={{ r: 3, fill: ORANGE, strokeWidth: 0 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}
