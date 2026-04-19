"use client"

import { useState, type ReactNode } from "react"
import {
    Area,
    AreaChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

const monthlyData = [
    {
        m: "J",
        gr: 72,
        nr: 63,
        tc: 2100,
        cr: 4.8,
        ns: 2.5,
        lc: 22.8,
        fb: 24.8,
        cs: 4.4,
        rg: 36,
    },
    {
        m: "F",
        gr: 78,
        nr: 68,
        tc: 2200,
        cr: 4.5,
        ns: 2.3,
        lc: 23.0,
        fb: 24.5,
        cs: 4.4,
        rg: 36.5,
    },
    {
        m: "M",
        gr: 82,
        nr: 72,
        tc: 2350,
        cr: 4.3,
        ns: 2.2,
        lc: 22.9,
        fb: 24.2,
        cs: 4.5,
        rg: 37,
    },
    {
        m: "A",
        gr: 88,
        nr: 77,
        tc: 2400,
        cr: 4.6,
        ns: 2.4,
        lc: 23.1,
        fb: 24.0,
        cs: 4.5,
        rg: 37.2,
    },
    {
        m: "M",
        gr: 91,
        nr: 80,
        tc: 2500,
        cr: 4.4,
        ns: 2.1,
        lc: 23.2,
        fb: 23.8,
        cs: 4.5,
        rg: 37.5,
    },
    {
        m: "J",
        gr: 95,
        nr: 83,
        tc: 2600,
        cr: 4.2,
        ns: 2.0,
        lc: 23.0,
        fb: 24.0,
        cs: 4.6,
        rg: 37.8,
    },
    {
        m: "J",
        gr: 100,
        nr: 88,
        tc: 2700,
        cr: 4.1,
        ns: 2.0,
        lc: 23.1,
        fb: 24.1,
        cs: 4.6,
        rg: 38,
    },
    {
        m: "A",
        gr: 98,
        nr: 86,
        tc: 2680,
        cr: 4.3,
        ns: 2.2,
        lc: 23.3,
        fb: 24.2,
        cs: 4.6,
        rg: 38.2,
    },
    {
        m: "S",
        gr: 96,
        nr: 85,
        tc: 2720,
        cr: 4.2,
        ns: 2.1,
        lc: 23.2,
        fb: 24.1,
        cs: 4.6,
        rg: 38.3,
    },
    {
        m: "O",
        gr: 99,
        nr: 87,
        tc: 2800,
        cr: 4.1,
        ns: 2.0,
        lc: 23.1,
        fb: 24.0,
        cs: 4.6,
        rg: 38.4,
    },
    {
        m: "N",
        gr: 102,
        nr: 90,
        tc: 2830,
        cr: 4.2,
        ns: 2.1,
        lc: 23.2,
        fb: 24.1,
        cs: 4.6,
        rg: 38.4,
    },
    {
        m: "D",
        gr: 107,
        nr: 94,
        tc: 2847,
        cr: 4.2,
        ns: 2.1,
        lc: 23.2,
        fb: 24.1,
        cs: 4.6,
        rg: 38.4,
    },
]

const weeklyData = [
    { d: "Mon", total: 20000, day: 12000, night: 8000 },
    { d: "Tue", total: 26000, day: 15000, night: 11000 },
    { d: "Wed", total: 29000, day: 16500, night: 12500 },
    { d: "Thu", total: 33000, day: 19000, night: 14000 },
    { d: "Fri", total: 38000, day: 21000, night: 17000 },
    { d: "Sat", total: 43000, day: 24000, night: 19000 },
    { d: "Sun", total: 30000, day: 18000, night: 12000 },
]

const performanceByArea = [
    {
        unit: "El Comedor",
        revenue: "EUR 64,512",
        occ: "82%",
        vsLY: "+12.5%",
        vsLYPos: true,
        ret: "42%",
    },
    {
        unit: "Jazz Club",
        revenue: "EUR 27,648",
        occ: "74%",
        vsLY: "+5.2%",
        vsLYPos: true,
        ret: "31%",
    },
    {
        unit: "La Barra Jap.",
        revenue: "EUR 18,432",
        occ: "68%",
        vsLY: "+8.4%",
        vsLYPos: true,
        ret: "28%",
    },
    {
        unit: "Cocktail Bar",
        revenue: "EUR 36,864",
        occ: "91%",
        vsLY: "-2.1%",
        vsLYPos: false,
        ret: "35%",
    },
    {
        unit: "Private Club",
        revenue: "EUR 36,864",
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
            gap: 2,
        }}
    >
        {positive ? "▲" : "▼"} {children}
    </span>
)

const MiniChart = ({
    data,
    dataKey,
    color,
    type = "line",
}: {
    data: Array<Record<string, number | string>>
    dataKey: string
    color: string
    type?: "line" | "area"
}) => (
    <ResponsiveContainer width="100%" height={60}>
        {type === "area" ? (
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={1.5}
                    fill={`url(#grad-${dataKey})`}
                    dot={false}
                />
            </AreaChart>
        ) : (
            <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={1.5}
                    dot={{ r: 2, fill: color }}
                />
            </LineChart>
        )}
    </ResponsiveContainer>
)

const KPICard = ({
    label,
    value,
    badge,
    badgePositive,
    sub,
    dataKey,
    color,
    isArea = true,
}: {
    label: string
    value: string
    badge: string
    badgePositive: boolean
    sub?: string
    dataKey: string
    color: string
    isArea?: boolean
}) => (
    <div
        style={{
            background: "#fff",
            borderRadius: 12,
            padding: "16px 18px 10px",
            border: "1px solid #f1f5f9",
            flex: 1,
            minWidth: 0,
        }}
    >
        <p
            style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#94a3b8",
                textTransform: "uppercase",
                margin: "0 0 6px",
            }}
        >
            {label}
        </p>
        <p
            style={{
                fontSize: 26,
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 2px",
                letterSpacing: -1,
            }}
        >
            {value}
        </p>
        <Badge positive={badgePositive}>{badge}</Badge>
        {sub && <p style={{ fontSize: 10, color: "#94a3b8", margin: "2px 0 0" }}>{sub}</p>}
        <div style={{ marginTop: 6 }}>
            <MiniChart
                data={monthlyData}
                dataKey={dataKey}
                color={color}
                type={isArea ? "area" : "line"}
            />
        </div>
    </div>
)

export default function DashboardHomePage() {
    const [activeWeek] = useState<"total" | "day" | "night">("total")

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
                    value="EUR 184.320"
                    badge="+12.4% vs LY"
                    badgePositive
                    sub="YTD: EUR 1,024,800"
                    dataKey="gr"
                    color="#6366f1"
                />
                <KPICard
                    label="Net Revenue"
                    value="EUR 161.480"
                    badge="+9.7% vs LY"
                    badgePositive
                    sub="YTD: EUR 897,200"
                    dataKey="nr"
                    color="#6366f1"
                />
                <KPICard
                    label="Total Covers"
                    value="2,847"
                    badge="+6.2% vs LY"
                    badgePositive
                    sub="YTD: 16,240"
                    dataKey="tc"
                    color="#10b981"
                />
                <KPICard
                    label="Cancellation Rate"
                    value="4.2%"
                    badge="-0.3pp vs LY"
                    badgePositive={false}
                    sub="YTD avg: 3.8%"
                    dataKey="cr"
                    color="#ef4444"
                    isArea={false}
                />
                <KPICard
                    label="No-Show Rate"
                    value="2.1%"
                    badge="-0.4pp vs LY"
                    badgePositive={false}
                    sub="YTD avg: 2.6%"
                    dataKey="ns"
                    color="#f97316"
                    isArea={false}
                />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "16px 18px 10px",
                        border: "1px solid #f1f5f9",
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <p
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: 1,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            margin: "0 0 6px",
                        }}
                    >
                        Labour Cost %
                    </p>
                    <p
                        style={{
                            fontSize: 26,
                            fontWeight: 700,
                            color: "#0f172a",
                            margin: "0 0 2px",
                            letterSpacing: -1,
                        }}
                    >
                        23.2%
                    </p>
                    <Badge positive={false}>+0.4pp vs LY</Badge>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "2px 0 6px" }}>
                        Target: &lt;22%
                    </p>
                    <MiniChart data={monthlyData} dataKey="lc" color="#eab308" type="area" />
                </div>

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "16px 18px 10px",
                        border: "1px solid #f1f5f9",
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <p
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: 1,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            margin: "0 0 6px",
                        }}
                    >
                        F&B Cost Rate
                    </p>
                    <p
                        style={{
                            fontSize: 26,
                            fontWeight: 700,
                            color: "#0f172a",
                            margin: "0 0 2px",
                            letterSpacing: -1,
                        }}
                    >
                        24.1%
                    </p>
                    <Badge positive>-0.4pp vs LY</Badge>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "2px 0 6px" }}>
                        Target: &lt;26%
                    </p>
                    <MiniChart data={monthlyData} dataKey="fb" color="#10b981" type="area" />
                </div>

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "16px 18px 10px",
                        border: "1px solid #f1f5f9",
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <p
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: 1,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            margin: "0 0 6px",
                        }}
                    >
                        Customer Satisfaction
                    </p>
                    <p
                        style={{
                            fontSize: 26,
                            fontWeight: 700,
                            color: "#0f172a",
                            margin: "0 0 2px",
                            letterSpacing: -1,
                        }}
                    >
                        4.6
                        <span style={{ fontSize: 14, color: "#94a3b8" }}>/5</span>
                    </p>
                    <Badge positive>+0.2 vs LY</Badge>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "2px 0 6px" }}>
                        1,248 reviews
                    </p>
                    <MiniChart data={monthlyData} dataKey="cs" color="#6366f1" type="area" />
                </div>

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 12,
                        padding: "16px 18px 10px",
                        border: "1px solid #f1f5f9",
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <p
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: 1,
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            margin: "0 0 6px",
                        }}
                    >
                        Returning Guests
                    </p>
                    <p
                        style={{
                            fontSize: 26,
                            fontWeight: 700,
                            color: "#0f172a",
                            margin: "0 0 2px",
                            letterSpacing: -1,
                        }}
                    >
                        38.4%
                    </p>
                    <Badge positive>+2pp vs LY</Badge>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "2px 0 6px" }}>
                        of total covers
                    </p>
                    <MiniChart data={monthlyData} dataKey="rg" color="#6366f1" type="area" />
                </div>
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
                        <AreaChart data={weeklyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
                                tickFormatter={(v) => `EUR ${v / 1000}k`}
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

                                    return Number.isFinite(num) ? `EUR ${(num / 1000).toFixed(1)}k` : "EUR 0.0k"
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
                            { label: "TOTAL", val: "EUR 2.196k", badge: "+13% vs LY", color: "#6366f1" },
                            { label: "DAY", val: "EUR 1.192k", badge: "+11% vs LY", color: "#3b82f6" },
                            {
                                label: "NIGHT",
                                val: "EUR 1.004k",
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
                            EUR 184,320
                        </p>
                        <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>
                            Total received this week
                        </p>
                    </div>
                    <div style={{ flex: 1 }}>
                        {[
                            { label: "Card", pct: 76, val: "EUR 140,083", color: "#6366f1" },
                            { label: "Gift Card", pct: 2, val: "EUR 3,686", color: "#10b981" },
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
                            { label: "Cash", pct: 10, val: "EUR 18,432", color: "#f97316" },
                            { label: "Other", pct: 12, val: "EUR 22,118", color: "#94a3b8" },
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
