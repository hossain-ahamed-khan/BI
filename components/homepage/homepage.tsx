"use client"

import { useState, type ReactNode } from "react"
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { useRange, type RangeKey } from "@/components/range-context"

const weeklyData = [
    { d: "Mon", total: 20000, day: 12000, night: 8000 },
    { d: "Tue", total: 26000, day: 15000, night: 11000 },
    { d: "Wed", total: 29000, day: 16500, night: 12500 },
    { d: "Thu", total: 33000, day: 19000, night: 14000 },
    { d: "Fri", total: 38000, day: 21000, night: 17000 },
    { d: "Sat", total: 43000, day: 24000, night: 19000 },
    { d: "Sun", total: 30000, day: 18000, night: 12000 },
]

const scaleWeeklyData = (data: typeof weeklyData, factor: number) =>
    data.map((row) => ({
        d: row.d,
        total: Math.round(row.total * factor),
        day: Math.round(row.day * factor),
        night: Math.round(row.night * factor),
    }))

const performanceByArea = [
    {
        unit: "El Comedor",
        revenue: "€ 64,512",
        occ: "82%",
        vsLY: "+12.5%",
        vsLYPos: true,
        ret: "42%",
    },
    {
        unit: "Jazz Club",
        revenue: "€ 27,648",
        occ: "74%",
        vsLY: "+5.2%",
        vsLYPos: true,
        ret: "31%",
    },
    {
        unit: "La Barra Jap.",
        revenue: "€ 18,432",
        occ: "68%",
        vsLY: "+8.4%",
        vsLYPos: true,
        ret: "28%",
    },
    {
        unit: "Cocktail Bar",
        revenue: "€ 36,864",
        occ: "91%",
        vsLY: "-2.1%",
        vsLYPos: false,
        ret: "35%",
    },
    {
        unit: "Private Club",
        revenue: "€ 36,864",
        occ: "88%",
        vsLY: "+22.0%",
        vsLYPos: true,
        ret: "61%",
    },
]

const dataSources = [
    { name: "SquarePOS", icon: "◆", status: "Live", color: "#7c3aed" },
    { name: "SevenRooms", icon: "◇", status: "Live", color: "#94a3b8" },
    {
        name: "Haddock",
        icon: "▣",
        status: "Delayed",
        color: "#f59e0b",
        statusColor: "#f59e0b",
    },
    { name: "GA4", icon: "◎", status: "Live", color: "#ec4899" },
    { name: "Meta", icon: "◉", status: "Live", color: "#3b82f6" },
    { name: "Google Ads", icon: "⊕", status: "Live", color: "#3b82f6" },
    { name: "Skello", icon: "▤", status: "Live", color: "#10b981" },
]

const weekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const

const topKpiSeries = {
    gr: [62, 68, 82, 86, 80, 95, 98],
    nr: [50, 55, 66, 69, 65, 74, 76],
    tc: [40, 46, 60, 62, 58, 69, 71],
    cr: [11, 9.8, 9.2, 10.4, 8.9, 9.9, 4.2],
    ns: [5.2, 4.1, 8.2, 6.2, 4.3, 5.1, 2.1],
} as const

const scaleSeries = (values: readonly number[], factor: number) =>
    values.map((value) => Number((value * factor).toFixed(1)))

const secondaryKpiSeries = {
    lc: [22.0, 22.0, 23.0, 22.9, 24.0, 23.0, 23.1],
    fb: [25.0, 24.4, 24.2, 24.1, 24.3, 24.2, 24.1],
    cs: [4.3, 4.4, 4.4, 4.5, 4.5, 4.6, 4.6],
    rg: [35.2, 35.8, 36.3, 37.0, 37.2, 37.8, 38.4],
} as const

const weeklyDataByRange: Record<RangeKey, typeof weeklyData> = {
    day: scaleWeeklyData(weeklyData, 0.68),
    week: weeklyData,
    month: scaleWeeklyData(weeklyData, 1.18),
    year: scaleWeeklyData(weeklyData, 1.6),
    custom: scaleWeeklyData(weeklyData, 0.92),
}

const topKpiSeriesByRange = {
    day: {
        gr: scaleSeries(topKpiSeries.gr, 0.86),
        nr: scaleSeries(topKpiSeries.nr, 0.84),
        tc: scaleSeries(topKpiSeries.tc, 0.82),
        cr: scaleSeries(topKpiSeries.cr, 1.05),
        ns: scaleSeries(topKpiSeries.ns, 0.92),
    },
    week: topKpiSeries,
    month: {
        gr: scaleSeries(topKpiSeries.gr, 1.1),
        nr: scaleSeries(topKpiSeries.nr, 1.06),
        tc: scaleSeries(topKpiSeries.tc, 1.08),
        cr: scaleSeries(topKpiSeries.cr, 0.96),
        ns: scaleSeries(topKpiSeries.ns, 1.02),
    },
    year: {
        gr: scaleSeries(topKpiSeries.gr, 1.26),
        nr: scaleSeries(topKpiSeries.nr, 1.22),
        tc: scaleSeries(topKpiSeries.tc, 1.2),
        cr: scaleSeries(topKpiSeries.cr, 0.9),
        ns: scaleSeries(topKpiSeries.ns, 0.88),
    },
    custom: {
        gr: scaleSeries(topKpiSeries.gr, 0.98),
        nr: scaleSeries(topKpiSeries.nr, 0.97),
        tc: scaleSeries(topKpiSeries.tc, 0.96),
        cr: scaleSeries(topKpiSeries.cr, 1.02),
        ns: scaleSeries(topKpiSeries.ns, 0.94),
    },
}

const secondaryKpiSeriesByRange = {
    day: {
        lc: scaleSeries(secondaryKpiSeries.lc, 0.98),
        fb: scaleSeries(secondaryKpiSeries.fb, 0.99),
        cs: scaleSeries(secondaryKpiSeries.cs, 1.0),
        rg: scaleSeries(secondaryKpiSeries.rg, 0.96),
    },
    week: secondaryKpiSeries,
    month: {
        lc: scaleSeries(secondaryKpiSeries.lc, 1.02),
        fb: scaleSeries(secondaryKpiSeries.fb, 1.01),
        cs: scaleSeries(secondaryKpiSeries.cs, 1.02),
        rg: scaleSeries(secondaryKpiSeries.rg, 1.04),
    },
    year: {
        lc: scaleSeries(secondaryKpiSeries.lc, 1.04),
        fb: scaleSeries(secondaryKpiSeries.fb, 1.03),
        cs: scaleSeries(secondaryKpiSeries.cs, 1.03),
        rg: scaleSeries(secondaryKpiSeries.rg, 1.08),
    },
    custom: {
        lc: scaleSeries(secondaryKpiSeries.lc, 1.01),
        fb: scaleSeries(secondaryKpiSeries.fb, 1.0),
        cs: scaleSeries(secondaryKpiSeries.cs, 1.01),
        rg: scaleSeries(secondaryKpiSeries.rg, 1.02),
    },
}

const Badge = ({
    positive,
    children,
}: {
    positive: boolean
    children: ReactNode
}) => (
    <span
        style={{
            color: positive ? "#10b981" : "#ef4444",
            fontSize: 11,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
            width: "fit-content",
            padding: "3px 10px",
            borderRadius: 999,
            background: positive ? "rgba(16, 185, 129, 0.14)" : "rgba(239, 68, 68, 0.12)",
        }}
    >
        {positive ? "▲" : "▼"}
        {children}
    </span>
)

const TopKpiMiniChart = ({
    values,
    color,
    ticks,
}: {
    values: readonly number[]
    color: string
    ticks: number[]
}) => {
    const data = values.map((value, index) => ({
        d: weekdayLabels[index] ?? "",
        value,
    }))

    return (
        <ResponsiveContainer width="100%" height={74}>
            <AreaChart data={data} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`top-kpi-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="d"
                    tick={{ fontSize: 9, fill: "#a7b0bf" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                />
                <YAxis
                    orientation="right"
                    tick={{ fontSize: 9, fill: "#c6ccd8" }}
                    axisLine={false}
                    tickLine={false}
                    ticks={ticks}
                    width={24}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={1.6}
                    fill={`url(#top-kpi-${color.replace("#", "")})`}
                    dot={{ r: 2, fill: color, strokeWidth: 0 }}
                    activeDot={{ r: 3 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}

const KPICard = ({
    label,
    value,
    badge,
    badgePositive,
    sub,
    chartValues,
    chartTicks,
    color,
}: {
    label: string
    value: string
    badge: string
    badgePositive: boolean
    sub?: string
    chartValues: readonly number[]
    chartTicks: number[]
    color: string
}) => (
    <div
        style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: "16px 18px 12px",
            border: "1px solid #eef0f4",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08)",
            flex: 1,
            minWidth: 0,
        }}
    >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p
                style={{
                    fontSize: 10,
                    fontWeight: 300,
                    letterSpacing: 2,
                    color: "#9aa4b2",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                }}
            >
                {label}
            </p>
            <span style={{ color: "#c3c9d3", fontSize: 16 }}>→</span>
        </div>
        <p
            style={{
                fontSize: 36,
                // fontWeight: 300,
                color: "#2c2f3a",
                margin: "0 0 6px",
                letterSpacing: -1.4,
                lineHeight: 1.05,
            }}
        >
            {value}
        </p>
        <Badge positive={badgePositive}>{badge}</Badge>
        {sub && <p style={{ fontSize: 11, color: "#a0a8b7", margin: "6px 0 0" }}>{sub}</p>}
        <div style={{ marginTop: 8 }}>
            <TopKpiMiniChart values={chartValues} color={color} ticks={chartTicks} />
        </div>
    </div>
)

const SecondaryMetricCard = ({
    label,
    value,
    valueSuffix,
    badge,
    badgePositive,
    sub,
    detail,
    chartValues,
    chartTicks,
    color,
}: {
    label: string
    value: string
    valueSuffix?: string
    badge: string
    badgePositive: boolean
    sub?: string
    detail?: string
    chartValues: readonly number[]
    chartTicks: number[]
    color: string
}) => (
    <div
        style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: "16px 18px 12px",
            border: "1px solid #eef0f4",
            boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08)",
            flex: 1,
            minWidth: 0,
        }}
    >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p
                style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: "#9aa4b2",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                }}
            >
                {label}
            </p>
            <span style={{ color: "#c3c9d3", fontSize: 16 }}>→</span>
        </div>
        <p
            style={{
                fontSize: 36,
                fontWeight: 300,
                color: "#2c2f3a",
                margin: "0 0 6px",
                letterSpacing: -1.4,
                lineHeight: 1.05,
            }}
        >
            {value}
            {valueSuffix && <span style={{ fontSize: 30, color: "#a5adb9" }}>{valueSuffix}</span>}
        </p>
        <Badge positive={badgePositive}>{badge}</Badge>
        {sub && (
            <p style={{ fontSize: 11, color: "#a0a8b7", margin: "6px 0 0" }}>
                {sub}
                {detail && <span style={{ color: "#8f99ab" }}> · {detail}</span>}
            </p>
        )}
        <div style={{ marginTop: 8 }}>
            <TopKpiMiniChart values={chartValues} color={color} ticks={chartTicks} />
        </div>
    </div>
)

export default function DashboardHomePage() {
    const [activeWeek] = useState<"total" | "day" | "night">("total")
    const { activeRange } = useRange()

    const weeklySeries = weeklyDataByRange[activeRange]
    const topSeries = topKpiSeriesByRange[activeRange]
    const secondarySeries = secondaryKpiSeriesByRange[activeRange]

    return (
        <div
            style={{
                fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
                background: "#f8fafc",
                minHeight: "100vh",
                padding: 16,
                boxSizing: "border-box",
            }}
        >
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <KPICard
                    label="Gross Revenue"
                    value="€ 184.320"
                    badge="+12.4% vs LY"
                    badgePositive
                    sub="YTD: € 1,024,800"
                    chartValues={topSeries.gr}
                    chartTicks={[60, 80, 100]}
                    color="#6366f1"
                />
                <KPICard
                    label="Net Revenue"
                    value="€ 161.480"
                    badge="+9.7% vs LY"
                    badgePositive
                    sub="YTD: € 897,200"
                    chartValues={topSeries.nr}
                    chartTicks={[50, 80, 100]}
                    color="#6366f1"
                />
                <KPICard
                    label="Total Covers"
                    value="2,847"
                    badge="+6.2% vs LY"
                    badgePositive
                    sub="YTD: 16,240"
                    chartValues={topSeries.tc}
                    chartTicks={[40, 60, 80]}
                    color="#10b981"
                />
                <KPICard
                    label="Cancellation Rate"
                    value="4.2%"
                    badge="-0.3pp vs LY"
                    badgePositive={false}
                    sub="YTD avg: 3.8%"
                    chartValues={topSeries.cr}
                    chartTicks={[0, 10, 20]}
                    color="#ef4444"
                />
                <KPICard
                    label="No-Show Rate"
                    value="2.1%"
                    badge="-0.4pp vs LY"
                    badgePositive={false}
                    sub="YTD avg: 2.6%"
                    chartValues={topSeries.ns}
                    chartTicks={[0, 5, 10]}
                    color="#f97316"
                />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <SecondaryMetricCard
                    label="Labour Cost %"
                    value="23.2%"
                    badge="+0.4pp vs LY"
                    badgePositive={false}
                    sub="Target: <22%"
                    chartValues={secondarySeries.lc}
                    chartTicks={[22, 23, 24]}
                    color="#f59e0b"
                />

                <SecondaryMetricCard
                    label="F&B Cost Rate"
                    value="24.1%"
                    badge="-0.6pp vs LY"
                    badgePositive
                    sub="Target: <26%"
                    chartValues={secondarySeries.fb}
                    chartTicks={[24, 25, 26]}
                    color="#10b981"
                />

                <SecondaryMetricCard
                    label="Customer Satisfaction"
                    value="4.6"
                    valueSuffix="/5"
                    badge="+0.2 vs LY"
                    badgePositive
                    sub="1,248 reviews"
                    detail="★★★★☆"
                    chartValues={secondarySeries.cs}
                    chartTicks={[4.2, 4.4, 4.6]}
                    color="#6366f1"
                />

                <SecondaryMetricCard
                    label="Returning Guests"
                    value="38.4%"
                    badge="+2.1pp vs LY"
                    badgePositive
                    sub="of total covers"
                    chartValues={secondarySeries.rg}
                    chartTicks={[30, 35, 40]}
                    color="#8b83f6"
                />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "16px 18px",
                        border: "1px solid #f1f5f9",
                        flex: 2,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: 1,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                                margin: 0,
                            }}
                        >
                            Revenue Evolution
                        </p>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            {(["total", "day", "night"] as const).map((k) => {
                                const labels = { total: "Total", day: "Day", night: "Night" }
                                const colors = {
                                    total: "#6366f1",
                                    day: "#3b82f6",
                                    night: "#ef4444",
                                }
                                return (
                                    <label
                                        key={k}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                            cursor: "pointer",
                                            fontSize: 11,
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            defaultChecked={k === activeWeek || activeWeek === "total"}
                                            style={{ accentColor: colors[k] }}
                                        />
                                        <span style={{ color: colors[k], fontWeight: 600 }}>{labels[k]}</span>
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={weeklySeries} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gDay" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="d"
                                tick={{ fontSize: 10, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: "#94a3b8" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `€ ${v / 1000}k`}
                            />
                            <Tooltip
                                formatter={(v) => {
                                    const num =
                                        typeof v === "number"
                                            ? v
                                            : typeof v === "string"
                                                ? Number(v)
                                                : Array.isArray(v)
                                                    ? Number(v[0])
                                                    : NaN

                                    return Number.isFinite(num) ? `€ ${(num / 1000).toFixed(1)}k` : "€ 0.0k"
                                }}
                                contentStyle={{
                                    fontSize: 11,
                                    border: "1px solid #f1f5f9",
                                    borderRadius: 8,
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#gTotal)"
                                dot={{ r: 3, fill: "#6366f1" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="day"
                                stroke="#3b82f6"
                                strokeWidth={1.5}
                                fill="url(#gDay)"
                                dot={{ r: 2, fill: "#3b82f6" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="night"
                                stroke="#ef4444"
                                strokeWidth={1.5}
                                fill="none"
                                dot={{ r: 2, fill: "#ef4444" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: "1px solid #f1f5f9",
                        }}
                    >
                        {[
                            { label: "TOTAL", val: "€ 2.196k", badge: "+13% vs LY", color: "#6366f1" },
                            { label: "DAY", val: "€ 1.192k", badge: "+11% vs LY", color: "#3b82f6" },
                            {
                                label: "NIGHT",
                                val: "€ 1.004k",
                                badge: "+10.9% vs LY",
                                color: "#ef4444",
                            },
                        ].map(({ label, val, badge, color }) => (
                            <div key={label} style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        fontSize: 9,
                                        fontWeight: 700,
                                        letterSpacing: 1,
                                        color,
                                        margin: "0 0 2px",
                                    }}
                                >
                                    {label}
                                </p>
                                <p
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: "#0f172a",
                                        margin: "0 0 2px",
                                        letterSpacing: -0.5,
                                    }}
                                >
                                    {val}
                                </p>
                                <Badge positive>{badge}</Badge>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "16px 18px",
                        border: "1px solid #f1f5f9",
                        flex: 1.2,
                    }}
                >
                    <p
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: 1,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            margin: "0 0 12px",
                        }}
                    >
                        Performance by Area
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                        <thead>
                            <tr style={{ color: "#94a3b8", fontWeight: 600 }}>
                                {["UNIT", "REVENUE", "OCC%", "VS LY", "RETURN %"].map((h) => (
                                    <th
                                        key={h}
                                        style={{
                                            textAlign: h === "UNIT" ? "left" : "right",
                                            paddingBottom: 8,
                                            fontWeight: 700,
                                            fontSize: 9,
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {performanceByArea.map((row, i) => (
                                <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                                    <td style={{ padding: "7px 0", color: "#0f172a", fontWeight: 500 }}>
                                        {row.unit}
                                    </td>
                                    <td style={{ textAlign: "right", color: "#0f172a" }}>{row.revenue}</td>
                                    <td style={{ textAlign: "right", color: "#64748b" }}>{row.occ}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <span
                                            style={{
                                                color: row.vsLYPos ? "#10b981" : "#ef4444",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {row.vsLY}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", color: "#64748b" }}>{row.ret}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "16px 18px",
                        border: "1px solid #f1f5f9",
                        flex: 0.9,
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: 1,
                                color: "#94a3b8",
                                textTransform: "uppercase",
                                margin: 0,
                            }}
                        >
                            Data Sources
                        </p>
                        <span
                            style={{
                                fontSize: 10,
                                color: "#10b981",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "#10b981",
                                    display: "inline-block",
                                }}
                            />
                            LIVE
                        </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {dataSources.map((src) => (
                            <div
                                key={src.name}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ color: src.color, fontSize: 14 }}>{src.icon}</span>
                                    <span style={{ fontSize: 12, color: "#0f172a", fontWeight: 500 }}>
                                        {src.name}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: src.statusColor ?? "#10b981",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    <span
                                        style={{
                                            width: 5,
                                            height: 5,
                                            borderRadius: "50%",
                                            background: src.statusColor ?? "#10b981",
                                            display: "inline-block",
                                        }}
                                    />
                                    {src.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "16px 20px",
                    border: "1px solid #f1f5f9",
                }}
            >
                <p
                    style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: 1,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        margin: "0 0 10px",
                    }}
                >
                    Payment Methods
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div style={{ minWidth: 100 }}>
                        <p
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: "#0f172a",
                                margin: "0 0 2px",
                                letterSpacing: -1,
                            }}
                        >
                            € 184,320
                        </p>
                        <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>
                            Total received this week
                        </p>
                    </div>
                    <div style={{ flex: 1 }}>
                        {[
                            { label: "Card", pct: 76, val: "€ 140,083", color: "#6366f1" },
                            { label: "Gift Card", pct: 2, val: "€ 3,686", color: "#10b981" },
                        ].map(({ label, pct, val, color }) => (
                            <div key={label} style={{ marginBottom: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                    <span style={{ fontSize: 11, color: "#64748b" }}>{label}</span>
                                    <span style={{ fontSize: 11, color: "#64748b" }}>
                                        {pct}% · {val}
                                    </span>
                                </div>
                                <div style={{ height: 4, background: "#f1f5f9", borderRadius: 99 }}>
                                    <div
                                        style={{
                                            width: `${pct}%`,
                                            height: "100%",
                                            background: color,
                                            borderRadius: 99,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ flex: 1 }}>
                        {[
                            { label: "Cash", pct: 10, val: "€ 18,432", color: "#f97316" },
                            { label: "Other", pct: 12, val: "€ 22,118", color: "#94a3b8" },
                        ].map(({ label, pct, val, color }) => (
                            <div key={label} style={{ marginBottom: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                    <span style={{ fontSize: 11, color: "#64748b" }}>{label}</span>
                                    <span style={{ fontSize: 11, color: "#64748b" }}>
                                        {pct}% · {val}
                                    </span>
                                </div>
                                <div style={{ height: 4, background: "#f1f5f9", borderRadius: 99 }}>
                                    <div
                                        style={{
                                            width: `${pct * 4}%`,
                                            height: "100%",
                                            background: color,
                                            borderRadius: 99,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
