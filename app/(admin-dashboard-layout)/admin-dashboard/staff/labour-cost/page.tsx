"use client";
import type { CSSProperties } from "react";
import {
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Bar,
    ComposedChart,
    Area,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

interface KPICardProps {
    title: string;
    value: string;
    delta: string;
    deltaPositive: boolean;
    subtitle: string;
    data: number[];
    color: string;
    accent?: string;
    isAlert?: boolean;
}

// ─── Tiny Sparkline ───────────────────────────────────────────────────────────

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const Spark = ({
    data,
    color,
}: {
    data: number[];
    color: string;
}) => {
    const chartData = data.map((v, i) => ({ v, day: DAY_LABELS[i] }));
    const min = Math.min(...data);
    const max = Math.max(...data);

    // Build stable unique tick values so Recharts does not emit duplicate tick keys.
    const range = max - min;
    let ticks = Array.from(
        new Set(
            [max, (min + max) / 2, min].map((value) =>
                Number(value.toFixed(2))
            )
        )
    ).sort((a, b) => b - a);

    if (ticks.length === 1) {
        const base = ticks[0];
        ticks = [
            Number((base + 0.5).toFixed(2)),
            base,
            Number((base - 0.5).toFixed(2)),
        ];
    }

    return (
        <ResponsiveContainer width="100%" height={72}>
            <ComposedChart
                data={chartData}
                margin={{ top: 4, right: 36, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.03} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="day"
                    tick={{ fontSize: 9, fill: "#bbb" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                />
                <YAxis
                    orientation="right"
                    domain={[min - range * 0.15, max + range * 0.15]}
                    ticks={ticks}
                    tick={{ fontSize: 9, fill: "#bbb" }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                    tickFormatter={(v) =>
                        v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(Math.round(v))
                    }
                />
                <Area
                    type="monotone"
                    dataKey="v"
                    fill={`url(#grad-${color.replace("#", "")})`}
                    stroke="none"
                    isAnimationActive={false}
                />
                <Line
                    type="monotone"
                    dataKey="v"
                    stroke={color}
                    strokeWidth={1.5}
                    dot={{ r: 2.5, fill: "#fff", stroke: color, strokeWidth: 1.5 }}
                    isAnimationActive={false}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const KPICard = ({
    title,
    value,
    delta,
    deltaPositive,
    subtitle,
    data,
    color,
    isAlert,
}: KPICardProps) => (
    <div style={styles.kpiCard}>
        <div style={styles.kpiHeader}>
            <span style={styles.kpiTitle}>{title}</span>
            <span style={styles.kpiArrow}>→</span>
        </div>
        <div style={{ ...styles.kpiValue, color: isAlert ? "#ef4444" : "#111827" }}>
            {value}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
            <span
                style={{
                    ...styles.kpiDelta,
                    color: deltaPositive ? "#ef4444" : "#10b981",
                }}
            >
                {delta}
            </span>
        </div>
        {subtitle && (
            <div style={styles.kpiSubtitle}>{subtitle}</div>
        )}
        <div style={{ marginTop: 4 }}>
            <Spark data={data} color={isAlert ? "#ef4444" : color} />
        </div>
    </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const weekDays = ["MON 9", "TUE 10", "WED 11", "THU 12", "FRI 13", "SAT 14", "SUN 15"];

const perfRows = [
    {
        metric: "Volumen de Negocio",
        values: ["€ 2.883", "€ 7.151", "€ 11.193", "€ 8.420", "€ 9.200", "€ 14.800", "€ 11.420"],
        total: "€ 65.067",
        bold: true,
    },
    {
        metric: "Staff",
        values: ["11", "17", "24", "24", "28", "26", "19"],
        total: "149 pers.",
        bold: true,
    },
    {
        metric: "Hours Worked",
        values: ["82h", "128.5h", "181.75h", "193.75h", "229h", "213.75h", "139.5h"],
        total: "1168.25h",
        bold: true,
    },
    {
        metric: "Labour Cost",
        values: ["€ 1.099", "€ 2.026", "€ 3.227", "€ 3.354", "€ 3.811", "€ 3.420", "€ 1.839"],
        total: "€ 18.776",
        bold: true,
    },
    {
        metric: "Labour Cost %",
        values: ["38.1%", "28.3%", "28.8%", "39.8%", "41.4%", "23.1%", "16.1%"],
        total: "28.9%",
        colored: true,
        highs: [0, 3, 4],
        lows: [5, 6],
    },
    {
        metric: "Productividad (€/h)",
        values: ["35.2 €/h", "55.6 €/h", "61.6 €/h", "43.5 €/h", "40.2 €/h", "69.3 €/h", "82 €/h"],
        total: "55.7 €/h",
        bold: true,
    },
    {
        metric: "Paid Absence Hrs",
        values: ["8h", "6h", "10h", "–", "8h", "6h", "–"],
        total: "38h",
        red: true,
    },
    {
        metric: "Absence Cost",
        values: ["€ 64", "€ 48", "€ 80", "–", "€ 64", "€ 48", "–"],
        total: "€ 304",
        red: true,
    },
];

const deptRows = [
    { dept: "Kitchen", staff: 16, hours: "612h", cost: "€ 14,800", pct: "34.6%" },
    { dept: "Floor", staff: 14, hours: "520h", cost: "€ 12,200", pct: "28.5%" },
    { dept: "Bar", staff: 10, hours: "390h", cost: "€ 9,400", pct: "22.0%" },
    { dept: "Management", staff: 5, hours: "200h", cost: "€ 4,800", pct: "11.2%" },
    { dept: "Security", staff: 3, hours: "120h", cost: "€ 1,600", pct: "3.7%" },
    { dept: "Total", staff: 48, hours: "1,842h", cost: "€ 42,800", pct: "23.2%", isTotal: true },
];

const evolutionData = [
    { month: "Jan", labour: 48000, revenue: 185000, pct: 25.9 },
    { month: "Feb", labour: 50000, revenue: 190000, pct: 26.3 },
    { month: "Mar", labour: 52000, revenue: 192000, pct: 27.1 },
    { month: "Apr", labour: 55000, revenue: 200000, pct: 27.5 },
    { month: "May", labour: 51000, revenue: 195000, pct: 26.2 },
    { month: "Jun", labour: 53000, revenue: 198000, pct: 26.8 },
    { month: "Jul", labour: 57000, revenue: 205000, pct: 27.8 },
];

const sparkLabour = [40000, 41000, 40500, 41200, 42000, 41800, 42800];
const sparkPct = [22.8, 23.0, 22.9, 23.1, 23.0, 23.2, 23.2];
const sparkHours = [1250, 1200, 1180, 1190, 1195, 1170, 1168];
const sparkHead = [46, 47, 47, 47, 48, 48, 48];
const sparkAbsence = [20, 26, 30, 35, 36, 38, 38];
const sparkUnprod = [1000, 1050, 1100, 1150, 1180, 1220, 1240];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
    root: {
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: "20px",
        color: "#111827",
        fontSize: 13,
    },
    grid6: {
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: 12,
        marginBottom: 12,
    },
    kpiCard: {
        background: "#fff",
        borderRadius: 12,
        padding: "14px 16px 10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    kpiHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    kpiTitle: {
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "#9ca3af",
    },
    kpiArrow: { fontSize: 11, color: "#d1d5db" },
    kpiValue: {
        fontSize: 26,
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.5px",
    },
    kpiDelta: {
        fontSize: 11,
        fontWeight: 600,
    },
    kpiSubtitle: { fontSize: 11, color: "#9ca3af", marginTop: 1 },
    row2: {
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: 12,
        marginBottom: 12,
    },
    card: {
        background: "#fff",
        borderRadius: 12,
        padding: "16px 20px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: "#9ca3af",
        marginBottom: 12,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse" as const,
    },
    th: {
        fontSize: 11,
        fontWeight: 700,
        color: "#6b7280",
        textAlign: "left" as const,
        paddingBottom: 8,
        borderBottom: "1px solid #f3f4f6",
    },
    thRight: {
        fontSize: 11,
        fontWeight: 700,
        color: "#6b7280",
        textAlign: "right" as const,
        paddingBottom: 8,
        borderBottom: "1px solid #f3f4f6",
    },
    td: {
        padding: "7px 6px",
        fontSize: 12,
        color: "#374151",
        borderBottom: "1px solid #f9fafb",
    },
    tdRight: {
        padding: "7px 6px",
        fontSize: 12,
        color: "#374151",
        textAlign: "right" as const,
        borderBottom: "1px solid #f9fafb",
    },
    totalRow: {
        fontWeight: 700,
        borderTop: "2px solid #e5e7eb",
    },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LabourCostDashboard() {
    return (
        <div style={styles.root}>
            {/* KPI Cards */}
            <div style={styles.grid6}>
                <KPICard
                    title="Labour Cost"
                    value="€ 42.800"
                    delta="▲ +2.1% vs LM"
                    deltaPositive={true}
                    subtitle="YTD: € 298,600"
                    data={sparkLabour}
                    color="#6366f1"
                    accent="#c7d2fe"
                />
                <KPICard
                    title="Labour Cost %"
                    value="23.2%"
                    delta="▲ +0.4pp vs LM"
                    deltaPositive={true}
                    subtitle="Target: < 22%"
                    data={sparkPct}
                    color="#f59e0b"
                    accent="#fde68a"
                />
                <KPICard
                    title="Hours Worked"
                    value="1.168h"
                    delta="▼ -1.8% vs LM"
                    deltaPositive={false}
                    subtitle="Current week"
                    data={sparkHours}
                    color="#6366f1"
                    accent="#c7d2fe"
                />
                <KPICard
                    title="Total Headcount"
                    value="48"
                    delta="Activos esta semana"
                    deltaPositive={false}
                    subtitle=""
                    data={sparkHead}
                    color="#10b981"
                    accent="#a7f3d0"
                />
                <KPICard
                    title="Paid Absence Hrs"
                    value="38h"
                    delta="+ 12h vs LM"
                    deltaPositive={true}
                    subtitle="3.3% del total"
                    data={sparkAbsence}
                    color="#ef4444"
                    isAlert
                />
                <KPICard
                    title="Unproductive Cost"
                    value="€1.240"
                    delta="Unworked hours"
                    deltaPositive={true}
                    subtitle="2.9% masa salarial"
                    data={sparkUnprod}
                    color="#ef4444"
                    isAlert
                />
            </div>

            {/* Middle row: Performance Table + Dept Table */}
            <div style={styles.row2}>
                {/* Performance Table */}
                <div style={styles.card}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <span style={styles.sectionTitle}>
                            Performance Indicators — Current Week
                        </span>
                        <span style={{ fontSize: 11, color: "#d1d5db" }}>→</span>
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ ...styles.th, width: 140 }}>Metric</th>
                                {weekDays.map((d) => (
                                    <th key={d} style={styles.thRight}>
                                        {d}
                                    </th>
                                ))}
                                <th style={styles.thRight}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {perfRows.map((row) => (
                                <tr key={row.metric}>
                                    <td style={{ ...styles.td, fontWeight: 500, color: "#374151" }}>
                                        {row.metric}
                                    </td>
                                    {row.values.map((v, i) => {
                                        let color = "#374151";
                                        if (row.colored) {
                                            if (row.highs?.includes(i)) color = "#ef4444";
                                            else if (row.lows?.includes(i)) color = "#10b981";
                                            else color = "#f59e0b";
                                        } else if (row.red) {
                                            color = "#ef4444";
                                        }
                                        return (
                                            <td
                                                key={i}
                                                style={{
                                                    ...styles.tdRight,
                                                    color,
                                                    fontWeight: row.colored || row.red ? 600 : 400,
                                                }}
                                            >
                                                {v}
                                            </td>
                                        );
                                    })}
                                    <td
                                        style={{
                                            ...styles.tdRight,
                                            fontWeight: 700,
                                            color: row.red ? "#ef4444" : "#111827",
                                        }}
                                    >
                                        {row.total}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Dept Table */}
                <div style={styles.card}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
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
                            {deptRows.map((r) => (
                                <tr key={r.dept} style={r.isTotal ? styles.totalRow : undefined}>
                                    <td
                                        style={{
                                            ...styles.td,
                                            fontWeight: r.isTotal ? 700 : 500,
                                            borderBottom: r.isTotal ? "none" : "1px solid #f9fafb",
                                        }}
                                    >
                                        {r.dept}
                                    </td>
                                    <td
                                        style={{
                                            ...styles.tdRight,
                                            fontWeight: r.isTotal ? 700 : 400,
                                            borderBottom: r.isTotal ? "none" : "1px solid #f9fafb",
                                        }}
                                    >
                                        {r.staff}
                                    </td>
                                    <td
                                        style={{
                                            ...styles.tdRight,
                                            fontWeight: r.isTotal ? 700 : 400,
                                            borderBottom: r.isTotal ? "none" : "1px solid #f9fafb",
                                        }}
                                    >
                                        {r.hours}
                                    </td>
                                    <td
                                        style={{
                                            ...styles.tdRight,
                                            fontWeight: r.isTotal ? 700 : 400,
                                            borderBottom: r.isTotal ? "none" : "1px solid #f9fafb",
                                        }}
                                    >
                                        {r.cost}
                                    </td>
                                    <td
                                        style={{
                                            ...styles.tdRight,
                                            color: r.isTotal ? "#ef4444" : "#374151",
                                            fontWeight: r.isTotal ? 700 : 400,
                                            borderBottom: r.isTotal ? "none" : "1px solid #f9fafb",
                                        }}
                                    >
                                        {r.pct}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom: Labour Cost vs Revenue Evolution */}
            <div style={styles.card}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <span style={styles.sectionTitle}>Labour Cost vs Revenue Evolution</span>
                    <span style={{ fontSize: 11, color: "#d1d5db" }}>→</span>
                </div>

                {/* Legend */}
                <div
                    style={{
                        display: "flex",
                        gap: 20,
                        marginBottom: 12,
                        justifyContent: "center",
                    }}
                >
                    {[
                        { color: "#6366f1", label: "Labour Cost" },
                        { color: "#10b981", label: "Revenue" },
                        { color: "#fca5a5", label: "LC% of Revenue" },
                    ].map(({ color, label }) => (
                        <div
                            key={label}
                            style={{ display: "flex", alignItems: "center", gap: 6 }}
                        >
                            <div
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: color,
                                }}
                            />
                            <span style={{ fontSize: 11, color: "#6b7280" }}>{label}</span>
                        </div>
                    ))}
                </div>

                <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart
                        data={evolutionData}
                        margin={{ top: 4, right: 40, left: 10, bottom: 4 }}
                    >
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                            domain={[0, 220000]}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `${v}%`}
                            domain={[19, 27]}
                        />
                        <Tooltip
                            contentStyle={{
                                fontSize: 12,
                                borderRadius: 8,
                                border: "1px solid #e5e7eb",
                            }}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="labour"
                            fill="#fca5a5"
                            fillOpacity={0.4}
                            radius={[3, 3, 0, 0]}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="labour"
                            stroke="#6366f1"
                            strokeWidth={2}
                            dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}