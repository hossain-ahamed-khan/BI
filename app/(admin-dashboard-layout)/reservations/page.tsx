"use client";
import { useState } from "react";
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
} from "recharts";

// ── Data ────────────────────────────────────────────────────────────────────

const weeklyReservations = [
    { day: "Mo", v: 220 }, { day: "Tu", v: 180 }, { day: "We", v: 260 },
    { day: "Th", v: 200 }, { day: "Fr", v: 240 }, { day: "Sa", v: 290 }, { day: "Su", v: 210 },
];
const weeklyNoShows = [
    { day: "Mo", v: 5 }, { day: "Tu", v: 6 }, { day: "We", v: 4 },
    { day: "Th", v: 7 }, { day: "Fr", v: 5 }, { day: "Sa", v: 4 }, { day: "Su", v: 7 },
];
const weeklyCancellations = [
    { day: "Mo", v: 3 }, { day: "Tu", v: 3.5 }, { day: "We", v: 2.5 },
    { day: "Th", v: 4 }, { day: "Fr", v: 3 }, { day: "Sa", v: 3.8 }, { day: "Su", v: 3.5 },
];
const weeklyPartySize = [
    { day: "Mo", v: 3.1 }, { day: "Tu", v: 3.2 }, { day: "We", v: 3.3 },
    { day: "Th", v: 3.4 }, { day: "Fr", v: 3.5 }, { day: "Sa", v: 3.6 }, { day: "Su", v: 3.4 },
];

const bookingsByDow = [
    { day: "Mon", v: 170 }, { day: "Tue", v: 210 }, { day: "Wed", v: 175 },
    { day: "Thu", v: 260 }, { day: "Fri", v: 300 }, { day: "Sat", v: 420 }, { day: "Sun", v: 310 },
];

const bookingsBySource = [
    { name: "Online", value: 72, color: "#6366f1" },
    { name: "Walk-in", value: 16, color: "#c7d2fe" },
    { name: "Referral", value: 9, color: "#f97316" },
    { name: "Other", value: 3, color: "#10b981" },
];

const countries = [
    { flag: "ES", name: "Spain", pct: 48, count: 885, color: "#6366f1" },
    { flag: "GB", name: "United Kingdom", pct: 18, count: 332, color: "#818cf8" },
    { flag: "US", name: "United States", pct: 10, count: 184, color: "#93c5fd" },
    { flag: "FR", name: "France", pct: 7, count: 129, color: "#34d399" },
    { flag: "DE", name: "Germany", pct: 5, count: 92, color: "#fbbf24" },
    { flag: "IT", name: "Italy", pct: 4, count: 74, color: "#f87171" },
    { flag: "NL", name: "Netherlands", pct: 3, count: 55, color: "#a78bfa" },
    { flag: "SE", name: "Sweden", pct: 2, count: 37, color: "#60a5fa" },
    { flag: "AU", name: "Australia", pct: 1, count: 18, color: "#4ade80" },
    { flag: "🌐", name: "Other", pct: 2, count: 36, color: "#94a3b8" },
];

const partyRows = [
    { pax: "1", reserv: 92, pct: "5.0%", covers: 92, avg: 48, vsLY: "+2.1%", pos: true },
    { pax: "2", reserv: 554, pct: "30.1%", covers: 1108, avg: 72, vsLY: "+4.8%", pos: true },
    { pax: "3", reserv: 386, pct: "21.0%", covers: 1158, avg: 68, vsLY: "+3.2%", pos: true },
    { pax: "4", reserv: 332, pct: "18.0%", covers: 1328, avg: 75, vsLY: "+6.1%", pos: true },
    { pax: "5", reserv: 184, pct: "10.0%", covers: 920, avg: 71, vsLY: "+5.4%", pos: true },
    { pax: "6", reserv: 147, pct: "8.0%", covers: 882, avg: 78, vsLY: "+8.2%", pos: true },
    { pax: "7", reserv: 55, pct: "3.0%", covers: 385, avg: 82, vsLY: "+7.8%", pos: true },
    { pax: "8", reserv: 37, pct: "2.0%", covers: 296, avg: 85, vsLY: "+9.4%", pos: true },
    { pax: "9", reserv: 18, pct: "1.0%", covers: 162, avg: 88, vsLY: "+11.2%", pos: true },
    { pax: "10+", reserv: 37, pct: "2.0%", covers: 463, avg: 95, vsLY: "+14.2%", pos: true },
];

const peakHours = [
    { h: "13h", v: 80 }, { h: "14h", v: 100 }, { h: "15h", v: 90 },
    { h: "16h", v: 70 }, { h: "17h", v: 85 }, { h: "18h", v: 110 },
    { h: "19h", v: 160 }, { h: "20h", v: 210 }, { h: "21h", v: 240 },
    { h: "22h", v: 200 }, { h: "23h", v: 130 },
];

// ── Sub-components ───────────────────────────────────────────────────────────

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div
        style={{
            background: "#fff",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
        className={className}
    >
        {children}
    </div>
);

const ArrowIcon = ({ dir = "right" }: { dir?: "right" }) => (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#b0b8c9" strokeWidth={2}>
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const UpArrow = () => (
    <span style={{ color: "#10b981", fontSize: 11, fontWeight: 700 }}>▲</span>
);
const DownArrow = () => (
    <span style={{ color: "#ef4444", fontSize: 11, fontWeight: 700 }}>▼</span>
);

// ── Stat Card ────────────────────────────────────────────────────────────────

type ChartVariant = "line" | "area";

function StatCard({
    label, value, badge, badgeColor, badgeBg, sub, data, lineColor, areaColor,
    yTicks, xKey, variant,
}: {
    label: string; value: string; badge: string; badgeColor: string; badgeBg?: string;
    sub?: string; data: { day: string; v: number }[]; lineColor: string; areaColor?: string;
    yTicks: number[]; xKey?: string; variant: ChartVariant;
}) {
    const yDomain: [number, number] = [yTicks[0], yTicks[yTicks.length - 1]];
    return (
        <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontSize: 10, letterSpacing: 1, color: "#a0a8b8", textTransform: "uppercase", margin: 0 }}>
                    {label}
                </p>
                <ArrowIcon />
            </div>
            <p style={{ fontSize: 36, fontWeight: 700, color: "#1a1f36", margin: "6px 0 2px", lineHeight: 1 }}>
                {value}
            </p>
            {badge ? (
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: badgeBg || "transparent",
                    borderRadius: 6, padding: badgeBg ? "2px 8px" : 0,
                    marginBottom: 10,
                }}>
                    <span style={{ fontSize: 11, color: badgeColor, fontWeight: 600 }}>{badge}</span>
                </div>
            ) : null}
            {sub && <p style={{ fontSize: 11, color: "#a0a8b8", margin: "0 0 10px" }}>{sub}</p>}
            <ResponsiveContainer width="100%" height={70}>
                {variant === "area" ? (
                    <AreaChart data={data} margin={{ top: 4, right: 36, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`grad-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={areaColor || lineColor} stopOpacity={0.22} />
                                <stop offset="100%" stopColor={areaColor || lineColor} stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="day" tick={{ fontSize: 9.5, fill: "#b0b8c9" }}
                            axisLine={false} tickLine={false}
                        />
                        <YAxis
                            domain={yDomain} ticks={yTicks}
                            tick={{ fontSize: 9.5, fill: "#b0b8c9" }} axisLine={false} tickLine={false}
                            orientation="right" width={24}
                        />
                        <Area
                            type="monotone" dataKey="v"
                            stroke={lineColor} strokeWidth={1.5}
                            fill={`url(#grad-${label.replace(/\s/g, "")})`}
                            dot={{ r: 2.5, fill: lineColor, strokeWidth: 0 }}
                        />
                    </AreaChart>
                ) : (
                    <LineChart data={data} margin={{ top: 4, right: 36, left: 0, bottom: 0 }}>
                        <XAxis
                            dataKey="day" tick={{ fontSize: 9.5, fill: "#b0b8c9" }}
                            axisLine={false} tickLine={false}
                        />
                        <YAxis
                            domain={yDomain} ticks={yTicks}
                            tick={{ fontSize: 9.5, fill: "#b0b8c9" }} axisLine={false} tickLine={false}
                            orientation="right" width={24}
                        />
                        <Line
                            type="monotone" dataKey="v" stroke={lineColor}
                            strokeWidth={1.5} dot={{ r: 2.5, fill: lineColor, strokeWidth: 0 }}
                        />
                    </LineChart>
                )}
            </ResponsiveContainer>
        </Card>
    );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

export default function ReservationsDashboard() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f0f2f8",
                padding: "24px",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                boxSizing: "border-box",
            }}
        >
            {/* Row 1 – Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
                <StatCard
                    label="Total Reservations" value="1,842"
                    badge="▲ +8.3% vs LW" badgeColor="#10b981" badgeBg="#d1fae5"
                    data={weeklyReservations} lineColor="#6366f1"
                    yTicks={[100, 200, 300]} variant="line"
                />
                <StatCard
                    label="No-Shows" value="38"
                    badge="2.1% rate" badgeColor="#ef4444"
                    data={weeklyNoShows} lineColor="#f87171" areaColor="#f87171"
                    yTicks={[2, 4, 6]} variant="area"
                />
                <StatCard
                    label="Cancellations" value="24"
                    badge="▼ −2.1% vs LW" badgeColor="#ef4444" badgeBg="#fee2e2"
                    data={weeklyCancellations} lineColor="#fb923c" areaColor="#fb923c"
                    yTicks={[2, 3, 4]} variant="area"
                />
                <StatCard
                    label="Avg Party Size" value="3.4"
                    badge="" badgeColor="#6366f1"
                    sub="pax / reservation"
                    data={weeklyPartySize} lineColor="#6366f1"
                    yTicks={[2.0, 3.5]} variant="line"
                />
            </div>

            {/* Row 2 – Bookings by Source + Bookings by Day of Week */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16, marginBottom: 16 }}>
                {/* Bookings by Source */}
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <p style={{ fontSize: 10, letterSpacing: 1, color: "#a0a8b8", textTransform: "uppercase", margin: 0 }}>
                            Bookings by Source
                        </p>
                        <ArrowIcon />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 12 }}>
                        <PieChart width={200} height={180}>
                            <Pie
                                data={bookingsBySource} dataKey="value"
                                cx={90} cy={85} innerRadius={55} outerRadius={85}
                                startAngle={90} endAngle={-270} stroke="none"
                            >
                                {bookingsBySource.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {bookingsBySource.map((s) => (
                                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                                    <span style={{ fontSize: 12, color: "#4b5563" }}>{s.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Bookings by Day of Week */}
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <p style={{ fontSize: 10, letterSpacing: 1, color: "#a0a8b8", textTransform: "uppercase", margin: 0 }}>
                            Bookings by Day of Week
                        </p>
                        <ArrowIcon />
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={bookingsByDow} barSize={42} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#a0a8b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#a0a8b8" }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: 8, fontSize: 12 }}
                                cursor={{ fill: "rgba(99,102,241,0.06)" }}
                            />
                            <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                                {bookingsByDow.map((entry) => (
                                    <Cell
                                        key={entry.day}
                                        fill={entry.day === "Sat" ? "#4f46e5" : "#c7d2fe"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Row 3 – Country / Party Size / Peak Hours */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 16 }}>
                {/* By Country */}
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                        <p style={{ fontSize: 10, letterSpacing: 1, color: "#a0a8b8", textTransform: "uppercase", margin: 0 }}>
                            By Country – Top 10
                        </p>
                        <ArrowIcon />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {countries.map((c) => (
                            <div key={c.name}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, alignItems: "center" }}>
                                    <span style={{ fontSize: 11.5, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
                                        <span style={{ fontSize: 13 }}>
                                            {c.flag === "🌐" ? "🌐" : `${c.flag}`}
                                        </span>
                                        {c.name}
                                    </span>
                                    <span style={{ fontSize: 10.5, color: "#6b7280" }}>
                                        {c.pct}% · {c.count}
                                    </span>
                                </div>
                                <div style={{ background: "#f3f4f6", borderRadius: 999, height: 4 }}>
                                    <div
                                        style={{
                                            width: `${c.pct}%`, height: 4, borderRadius: 999,
                                            background: c.color, transition: "width .4s",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* By Party Size */}
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <p style={{ fontSize: 10, letterSpacing: 1, color: "#a0a8b8", textTransform: "uppercase", margin: 0 }}>
                            By Party Size
                        </p>
                        <ArrowIcon />
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                                {["PAX", "RESERV.", "%", "COVERS", "AVG €", "VS LY"].map((h) => (
                                    <th key={h} style={{ padding: "4px 6px", color: "#a0a8b8", fontWeight: 600, fontSize: 10, letterSpacing: 0.5, textAlign: h === "PAX" ? "left" : "right" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {partyRows.map((r) => (
                                <tr key={r.pax} style={{ borderBottom: "1px solid #f9fafb" }}>
                                    <td style={{ padding: "5px 6px", color: r.pax === "10+" ? "#6366f1" : "#1a1f36", fontWeight: r.pax === "10+" ? 700 : 400 }}>{r.pax}</td>
                                    <td style={{ padding: "5px 6px", textAlign: "right", color: "#374151" }}>{r.reserv.toLocaleString()}</td>
                                    <td style={{ padding: "5px 6px", textAlign: "right", color: r.pct === "30.1%" ? "#6366f1" : "#6b7280", fontWeight: r.pct === "30.1%" ? 700 : 400 }}>{r.pct}</td>
                                    <td style={{ padding: "5px 6px", textAlign: "right", color: "#374151" }}>{r.covers.toLocaleString()}</td>
                                    <td style={{ padding: "5px 6px", textAlign: "right", color: "#374151" }}>€ {r.avg}</td>
                                    <td style={{ padding: "5px 6px", textAlign: "right", color: "#10b981", fontWeight: 600 }}>{r.vsLY}</td>
                                </tr>
                            ))}
                            <tr style={{ borderTop: "2px solid #e5e7eb", background: "#f9fafb" }}>
                                <td style={{ padding: "6px 6px", fontWeight: 700, color: "#374151" }}>Σ</td>
                                <td style={{ padding: "6px 6px", textAlign: "right", fontWeight: 700, color: "#1a1f36" }}>1,842</td>
                                <td />
                                <td style={{ padding: "6px 6px", textAlign: "right", fontWeight: 700, color: "#1a1f36" }}>6,794</td>
                                <td style={{ padding: "6px 6px", textAlign: "right", fontWeight: 700, color: "#1a1f36" }}>€ 74</td>
                                <td />
                            </tr>
                        </tbody>
                    </table>
                </Card>

                {/* Peak Hours */}
                <Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <p style={{ fontSize: 10, letterSpacing: 1, color: "#a0a8b8", textTransform: "uppercase", margin: 0 }}>
                            Peak Hours
                        </p>
                        <ArrowIcon />
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={peakHours} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                            <defs>
                                <linearGradient id="peakGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="h" tick={{ fontSize: 10, fill: "#a0a8b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: "#a0a8b8" }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            <Area
                                type="monotone" dataKey="v" stroke="#f97316" strokeWidth={2}
                                fill="url(#peakGrad)"
                                dot={{ r: 3, fill: "#f97316", strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}