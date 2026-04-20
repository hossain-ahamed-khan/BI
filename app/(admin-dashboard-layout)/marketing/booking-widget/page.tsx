"use client";
import { useState } from "react";
import {
    ComposedChart,
    AreaChart,
    Area,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

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
    fontSize: 36,
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
    fontWeight: 500,
    color: positive === null ? "#888" : positive ? "#16a34a" : "#dc2626",
    background: positive === null ? "#f3f4f6" : positive ? "#f0fdf4" : "#fef2f2",
    borderRadius: 6,
    padding: "2px 7px",
});

const subLabelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#9a9a9a",
    marginTop: 2,
};

const sectionLabelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "#b0b0b0",
    textTransform: "uppercase",
    marginBottom: 12,
};

const PURPLE = "#9b9cf0";
const GREEN_LINE = "#3bbf9a";
const ORANGE = "#f4a261";
const SALMON = "#f4a07a";
const PURPLE_DIM = "#c5c6f7";

// --- Mini sparkline matching the image:
//   - Two lines: current (colored) + previous week (light gray)
//   - Soft area fill under current line
//   - Small dots on current line
//   - Right-side Y-axis with 3 tick values
//   - X-axis day labels (Mo–Su)
// ---
function Sparkline({
    data,
    stroke,
    fillColor,
    yTicks,
}: {
    data: { day: string; v: number; prev: number }[];
    stroke: string;
    fillColor: string;
    yTicks: number[];
}) {
    const gradId = `grad-${stroke.replace("#", "")}`;
    return (
        <ResponsiveContainer width="100%" height={72}>
            <ComposedChart data={data} margin={{ top: 4, right: 36, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={fillColor} stopOpacity={0.22} />
                        <stop offset="100%" stopColor={fillColor} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "#c0c0c0" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                />
                <YAxis
                    orientation="right"
                    domain={[Math.min(...yTicks), Math.max(...yTicks)]}
                    ticks={yTicks}
                    tick={{ fontSize: 10, fill: "#c0c0c0" }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                />
                {/* Previous week — gray dashed */}
                <Line
                    type="monotone"
                    dataKey="prev"
                    stroke="#d8d8d8"
                    strokeWidth={1.2}
                    dot={false}
                    strokeDasharray="3 2"
                />
                {/* Area fill under current */}
                <Area
                    type="monotone"
                    dataKey="v"
                    stroke="none"
                    fill={`url(#${gradId})`}
                    strokeWidth={0}
                    dot={false}
                    activeDot={false}
                    legendType="none"
                />
                {/* Current week — colored */}
                <Line
                    type="monotone"
                    dataKey="v"
                    stroke={stroke}
                    strokeWidth={1.8}
                    dot={{ r: 2.5, fill: stroke, strokeWidth: 0 }}
                    activeDot={{ r: 3 }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}

// --- Metric KPI Card ---
function KpiCard({
    label,
    value,
    badge,
    positive,
    subLabel,
    sparkData,
    sparkColor,
    sparkFill,
    yTicks,
}: {
    label: string;
    value: string;
    badge?: string;
    positive?: boolean | null;
    subLabel?: string;
    sparkData?: { day: string; v: number; prev: number }[];
    sparkColor?: string;
    sparkFill?: string;
    yTicks?: number[];
}) {
    return (
        <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={labelStyle}>{label}</span>
                <ArrowIcon />
            </div>
            <div style={bigNumStyle}>{value}</div>
            {badge && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <span style={badgeStyle(positive ?? null)}>
                        {positive === true ? "▲" : positive === false ? "▼" : ""}
                        {badge}
                    </span>
                </div>
            )}
            {subLabel && <div style={subLabelStyle}>{subLabel}</div>}
            {sparkData && sparkColor && yTicks && (
                <div style={{ marginTop: 4 }}>
                    <Sparkline
                        data={sparkData}
                        stroke={sparkColor}
                        fillColor={sparkFill ?? sparkColor}
                        yTicks={yTicks}
                    />
                </div>
            )}
        </div>
    );
}

// Weekly sparklines — shape: { day, v (current), prev (last week) }
const reservationsSpark = [
    { day: "Mo", v: 320, prev: 290 },
    { day: "Tu", v: 310, prev: 300 },
    { day: "We", v: 350, prev: 320 },
    { day: "Th", v: 370, prev: 340 },
    { day: "Fr", v: 390, prev: 360 },
    { day: "Sa", v: 415, prev: 375 },
    { day: "Su", v: 428, prev: 391 },
];
const widgetSpark = [
    { day: "Mo", v: 2800, prev: 2500 },
    { day: "Tu", v: 2950, prev: 2620 },
    { day: "We", v: 2900, prev: 2700 },
    { day: "Th", v: 3200, prev: 2850 },
    { day: "Fr", v: 3450, prev: 3000 },
    { day: "Sa", v: 3700, prev: 3200 },
    { day: "Su", v: 3840, prev: 3430 },
];
const availSpark = [
    { day: "Mo", v: 73, prev: 71 },
    { day: "Tu", v: 71.5, prev: 70 },
    { day: "We", v: 70.5, prev: 70.5 },
    { day: "Th", v: 70, prev: 71 },
    { day: "Fr", v: 69, prev: 71.5 },
    { day: "Sa", v: 68.5, prev: 71 },
    { day: "Su", v: 68.4, prev: 71.6 },
];
const advanceSpark = [
    { day: "Mo", v: 6.2, prev: 6.0 },
    { day: "Tu", v: 6.8, prev: 6.5 },
    { day: "We", v: 7.4, prev: 7.0 },
    { day: "Th", v: 7.9, prev: 7.2 },
    { day: "Fr", v: 8.1, prev: 7.4 },
    { day: "Sa", v: 8.3, prev: 7.5 },
    { day: "Su", v: 8.4, prev: 7.2 },
];
const partySpark = [
    { day: "Mo", v: 2.8, prev: 3.2 },
    { day: "Tu", v: 2.9, prev: 3.1 },
    { day: "We", v: 3.0, prev: 3.0 },
    { day: "Th", v: 3.1, prev: 3.0 },
    { day: "Fr", v: 3.1, prev: 2.9 },
    { day: "Sa", v: 3.2, prev: 2.8 },
    { day: "Su", v: 3.2, prev: 2.8 },
];

// Widget Searches by Day (1–14) vs Availability Rate
const searchesByDay = [
    { day: "1", searches: 230, avail: 71 },
    { day: "2", searches: 270, avail: 72 },
    { day: "3", searches: 250, avail: 72.5 },
    { day: "4", searches: 290, avail: 73 },
    { day: "5", searches: 300, avail: 73.5 },
    { day: "6", searches: 340, avail: 73 },
    { day: "7", searches: 320, avail: 72 },
    { day: "8", searches: 310, avail: 71.5 },
    { day: "9", searches: 305, avail: 70.5 },
    { day: "10", searches: 295, avail: 70 },
    { day: "11", searches: 290, avail: 69.5 },
    { day: "12", searches: 335, avail: 70 },
    { day: "13", searches: 330, avail: 70.5 },
    { day: "14", searches: 320, avail: 71 },
];

// Searches by Day of Week vs Availability Rate
const searchesByDow = [
    { day: "Mon", searches: 220, avail: 76 },
    { day: "Tue", searches: 235, avail: 75.5 },
    { day: "Wed", searches: 230, avail: 75 },
    { day: "Thu", searches: 260, avail: 73 },
    { day: "Fri", searches: 290, avail: 71 },
    { day: "Sat", searches: 340, avail: 70 },
    { day: "Sun", searches: 330, avail: 70.5 },
];

// Searches & Availability by Party Size
const byPartySize = [
    { size: "1 pax", searches: 80, avail: 88 },
    { size: "2 pax", searches: 380, avail: 80 },
    { size: "3 pax", searches: 310, avail: 72 },
    { size: "4 pax", searches: 260, avail: 65 },
    { size: "5 pax", searches: 200, avail: 58 },
    { size: "6 pax", searches: 110, avail: 51 },
    { size: "7+ pax", searches: 60, avail: 42 },
];

// Demand & Availability by Days in Advance
const byAdvance = [
    { adv: "Same day", searches: 180, avail: 52 },
    { adv: "1d", searches: 200, avail: 58 },
    { adv: "2d", searches: 210, avail: 62 },
    { adv: "3d", searches: 220, avail: 67 },
    { adv: "4–7d", searches: 340, avail: 72 },
    { adv: "8–14d", searches: 300, avail: 75 },
    { adv: "15–30d", searches: 280, avail: 78 },
    { adv: "+30d", searches: 130, avail: 82 },
];

const chartCardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    border: "0.5px solid #e5e5e5",
    padding: "18px 20px 10px",
};

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
    <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#666", marginBottom: 8 }}>
        {items.map((item) => (
            <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {item.type === "line" ? (
                    <span
                        style={{
                            display: "inline-block",
                            width: 16,
                            height: 2,
                            background: item.color,
                            borderRadius: 2,
                            position: "relative",
                            top: 1,
                        }}
                    />
                ) : (
                    <span
                        style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            background: item.color,
                            borderRadius: 2,
                        }}
                    />
                )}
                {item.label}
            </span>
        ))}
    </div>
);

// --- Reservations by Country/City/Source tables ---
const byCountry = [
    { flag: "🇪🇸", name: "Spain", res: 224, pct: "52.3%" },
    { flag: "🇬🇧", name: "UK", res: 82, pct: "19.2%" },
    { flag: "🇺🇸", name: "USA", res: 48, pct: "11.2%" },
    { flag: "🇩🇪", name: "Germany", res: 28, pct: "6.5%" },
    { flag: "🇫🇷", name: "France", res: 22, pct: "5.1%" },
    { flag: "🌍", name: "Other", res: 24, pct: "5.7%" },
];

const byCity = [
    { icon: "🏙", name: "Madrid", res: 186, pct: "43.5%" },
    { icon: "🏙", name: "London", res: 72, pct: "16.8%" },
    { icon: "🏙", name: "Barcelona", res: 42, pct: "9.8%" },
    { icon: "🏙", name: "New York", res: 34, pct: "7.9%" },
    { icon: "🏙", name: "Dubai", res: 28, pct: "6.5%" },
    { icon: "🏙", name: "Other", res: 66, pct: "15.4%" },
];

const bySource = [
    { color: "#4f46e5", name: "Direct Web", pct: 48, count: 206, bar: "#4f46e5" },
    { color: "#f97316", name: "Instagram", pct: 21, count: 90, bar: "#f97316" },
    { color: "#3b82f6", name: "Google", pct: 14, count: 60, bar: "#3b82f6" },
    { color: "#22c55e", name: "Email", pct: 9, count: 39, bar: "#22c55e" },
    { color: "#a855f7", name: "Phone", pct: 5, count: 21, bar: "#a855f7" },
    { color: "#6b7280", name: "Other", pct: 3, count: 12, bar: "#6b7280" },
];

const tableHeaderStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.07em",
    color: "#b0b0b0",
    textTransform: "uppercase",
    paddingBottom: 8,
    borderBottom: "0.5px solid #ececec",
};

function TableSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{ ...cardStyle, flex: 1, minWidth: 0 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                }}
            >
                <span style={sectionLabelStyle}>{title}</span>
                <ArrowIcon />
            </div>
            {children}
        </div>
    );
}

// BarSource row
function SourceRow({ src }: { src: (typeof bySource)[0] }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                }}
            >
                <span style={{ fontSize: 13, color: "#1a1a1a" }}>{src.name}</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                    {src.pct}% · {src.count}
                </span>
            </div>
            <div
                style={{
                    height: 4,
                    background: "#f3f4f6",
                    borderRadius: 4,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${src.pct * 2}%`,
                        background: src.bar,
                        borderRadius: 4,
                    }}
                />
            </div>
        </div>
    );
}

export default function ReservationDashboard() {
    return (
        <div
            style={{
                background: "#f6f6f4",
                minHeight: "100vh",
                padding: "24px 20px",
                fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
                boxSizing: "border-box",
            }}
        >
            {/* KPI Row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 12,
                    marginBottom: 14,
                }}
            >
                <KpiCard
                    label="Total Reservations"
                    value="428"
                    badge="+9.4% vs LW"
                    positive={true}
                    subLabel="YTD: 2,184"
                    sparkData={reservationsSpark}
                    sparkColor="#6366f1"
                    sparkFill="#6366f1"
                    yTicks={[200, 400, 600]}
                />
                <KpiCard
                    label="Widget Searches"
                    value="3,840"
                    badge="+12.1% vs LW"
                    positive={true}
                    subLabel="Conv. rate: 11.1%"
                    sparkData={widgetSpark}
                    sparkColor="#6366f1"
                    sparkFill="#6366f1"
                    yTicks={[2000, 3000, 4000]}
                />
                <KpiCard
                    label="Availability Rate"
                    value="68.4%"
                    badge="–3.2pp vs LW"
                    positive={false}
                    subLabel="searches w/ avail."
                    sparkData={availSpark}
                    sparkColor="#ef4444"
                    sparkFill="#ef4444"
                    yTicks={[65, 70, 75]}
                />
                <KpiCard
                    label="Avg. Advance (Days)"
                    value="8.4d"
                    badge="+1.2d vs LW"
                    positive={true}
                    sparkData={advanceSpark}
                    sparkColor="#3bbf9a"
                    sparkFill="#3bbf9a"
                    yTicks={[6, 8, 10]}
                />
                <KpiCard
                    label="Avg. Party Size"
                    value="3.2"
                    subLabel="pax per booking"
                    sparkData={partySpark}
                    sparkColor="#f4a261"
                    sparkFill="#f4a261"
                    yTicks={[1.8, 3.0, 3.2]}
                />
            </div>

            {/* Two main chart rows */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 14,
                }}
            >
                {/* Widget Searches by Day */}
                <div style={chartCardStyle}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 4,
                        }}
                    >
                        <span style={sectionLabelStyle}>
                            Widget Searches by Day — vs Availability Rate
                        </span>
                        <ArrowIcon />
                    </div>
                    <ChartLegend
                        items={[
                            { color: PURPLE, label: "Searches", type: "bar" },
                            { color: GREEN_LINE, label: "Avail. Rate %", type: "line" },
                        ]}
                    />
                    <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart
                            data={searchesByDay}
                            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 11, fill: "#bbb" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                domain={[0, 450]}
                                tick={{ fontSize: 10, fill: "#bbb" }}
                                axisLine={false}
                                tickLine={false}
                                hide
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[60, 80]}
                                tick={{ fontSize: 10, fill: "#bbb" }}
                                axisLine={false}
                                tickLine={false}
                                hide
                            />
                            <Tooltip
                                contentStyle={{
                                    border: "0.5px solid #e5e5e5",
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                            />
                            <Bar
                                yAxisId="left"
                                dataKey="searches"
                                fill={PURPLE}
                                radius={[3, 3, 0, 0]}
                                maxBarSize={22}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="avail"
                                stroke={GREEN_LINE}
                                dot={{ r: 3, fill: GREEN_LINE, strokeWidth: 0 }}
                                strokeWidth={2}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Searches by Day of Week */}
                <div style={chartCardStyle}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 4,
                        }}
                    >
                        <span style={sectionLabelStyle}>
                            Searches by Day of Week — vs Availability Rate
                        </span>
                        <ArrowIcon />
                    </div>
                    <ChartLegend
                        items={[
                            { color: PURPLE, label: "Searches", type: "bar" },
                            { color: ORANGE, label: "Avail. Rate %", type: "line" },
                        ]}
                    />
                    <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart
                            data={searchesByDow}
                            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 11, fill: "#bbb" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                domain={[0, 420]}
                                tick={{ fontSize: 10, fill: "#bbb" }}
                                axisLine={false}
                                tickLine={false}
                                hide
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[65, 80]}
                                tick={{ fontSize: 10, fill: "#bbb" }}
                                axisLine={false}
                                tickLine={false}
                                hide
                            />
                            <Tooltip
                                contentStyle={{
                                    border: "0.5px solid #e5e5e5",
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                            />
                            <Bar
                                yAxisId="left"
                                dataKey="searches"
                                fill={PURPLE}
                                radius={[3, 3, 0, 0]}
                                maxBarSize={32}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="avail"
                                stroke={ORANGE}
                                dot={{ r: 3, fill: ORANGE, strokeWidth: 0 }}
                                strokeWidth={2}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Third chart row */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 14,
                }}
            >
                {/* Searches & Availability by Party Size */}
                <div style={chartCardStyle}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 4,
                        }}
                    >
                        <span style={sectionLabelStyle}>
                            Searches & Availability by Party Size
                        </span>
                        <ArrowIcon />
                    </div>
                    <ChartLegend
                        items={[
                            { color: PURPLE, label: "Searches", type: "bar" },
                            { color: GREEN_LINE, label: "Avail. Rate %", type: "line" },
                        ]}
                    />
                    <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart
                            data={byPartySize}
                            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="size"
                                tick={{ fontSize: 11, fill: "#bbb" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                domain={[0, 450]}
                                tick={false}
                                axisLine={false}
                                tickLine={false}
                                hide
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[30, 100]}
                                tick={false}
                                axisLine={false}
                                tickLine={false}
                                hide
                            />
                            <Tooltip
                                contentStyle={{
                                    border: "0.5px solid #e5e5e5",
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                            />
                            <Bar
                                yAxisId="left"
                                dataKey="searches"
                                fill={PURPLE}
                                radius={[3, 3, 0, 0]}
                                maxBarSize={32}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="avail"
                                stroke={GREEN_LINE}
                                dot={{ r: 3, fill: GREEN_LINE, strokeWidth: 0 }}
                                strokeWidth={2}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Demand & Availability by Days Searched in Advance */}
                <div style={chartCardStyle}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 4,
                        }}
                    >
                        <span style={sectionLabelStyle}>
                            Demand & Availability by Days Searched in Advance
                        </span>
                        <ArrowIcon />
                    </div>
                    <ChartLegend
                        items={[
                            { color: SALMON, label: "Searches", type: "bar" },
                            { color: PURPLE_DIM, label: "Avail. Rate %", type: "line" },
                        ]}
                    />
                    <ResponsiveContainer width="100%" height={200}>
                        <ComposedChart
                            data={byAdvance}
                            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                        >
                            <CartesianGrid vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="adv"
                                tick={{ fontSize: 10, fill: "#bbb" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="left"
                                domain={[0, 420]}
                                tick={false}
                                axisLine={false}
                                tickLine={false}
                                hide
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[40, 95]}
                                tick={false}
                                axisLine={false}
                                tickLine={false}
                                hide
                            />
                            <Tooltip
                                contentStyle={{
                                    border: "0.5px solid #e5e5e5",
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                            />
                            <Bar
                                yAxisId="left"
                                dataKey="searches"
                                fill={SALMON}
                                radius={[3, 3, 0, 0]}
                                maxBarSize={32}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="avail"
                                stroke={PURPLE_DIM}
                                dot={{ r: 3, fill: PURPLE_DIM, strokeWidth: 0 }}
                                strokeWidth={2}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom table row */}
            <div style={{ display: "flex", gap: 12 }}>
                {/* Reservations by Country */}
                <TableSection title="Reservations by Country">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ ...tableHeaderStyle, textAlign: "left" }}>Country</th>
                                <th style={{ ...tableHeaderStyle, textAlign: "right" }}>
                                    Reservations
                                </th>
                                <th style={{ ...tableHeaderStyle, textAlign: "right" }}>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {byCountry.map((row) => (
                                <tr
                                    key={row.name}
                                    style={{ borderBottom: "0.5px solid #f0f0f0" }}
                                >
                                    <td
                                        style={{ fontSize: 13, color: "#1a1a1a", padding: "9px 0" }}
                                    >
                                        <span style={{ marginRight: 6 }}>{row.flag}</span>
                                        {row.name}
                                    </td>
                                    <td
                                        style={{
                                            fontSize: 13,
                                            color: "#1a1a1a",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.res}
                                    </td>
                                    <td
                                        style={{
                                            fontSize: 13,
                                            color: "#6b7280",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.pct}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableSection>

                {/* Reservations by City */}
                <TableSection title="Reservations by City">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ ...tableHeaderStyle, textAlign: "left" }}>City</th>
                                <th style={{ ...tableHeaderStyle, textAlign: "right" }}>
                                    Reservations
                                </th>
                                <th style={{ ...tableHeaderStyle, textAlign: "right" }}>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {byCity.map((row) => (
                                <tr
                                    key={row.name}
                                    style={{ borderBottom: "0.5px solid #f0f0f0" }}
                                >
                                    <td
                                        style={{ fontSize: 13, color: "#1a1a1a", padding: "9px 0" }}
                                    >
                                        <span style={{ marginRight: 6, fontSize: 12 }}>
                                            {row.icon}
                                        </span>
                                        {row.name}
                                    </td>
                                    <td
                                        style={{
                                            fontSize: 13,
                                            color: "#1a1a1a",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.res}
                                    </td>
                                    <td
                                        style={{
                                            fontSize: 13,
                                            color: "#6b7280",
                                            textAlign: "right",
                                        }}
                                    >
                                        {row.pct}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableSection>

                {/* Reservations by Source */}
                <TableSection title="Reservations by Source">
                    {bySource.map((src) => (
                        <SourceRow key={src.name} src={src} />
                    ))}
                </TableSection>
            </div>
        </div>
    );
}