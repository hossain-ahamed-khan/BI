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
import { useRange } from "@/components/range-context"
import { useOverviewMetrics } from "@/hooks/use-metrics"

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

const CustomMiniTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#1e293b",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "10px",
                    fontWeight: 600,
                    textAlign: "center",
                    position: "relative",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    border: "none",
                }}
            >
                <div style={{ color: "#94a3b8", marginBottom: "2px" }}>{label}</div>
                <div>{Number(payload[0].value).toFixed(2)}</div>
                {/* Small arrow/triangle below the tooltip */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "-4px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "0",
                        height: "0",
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: "4px solid #1e293b",
                    }}
                />
            </div>
        )
    }
    return null
}

const TopKpiMiniChart = ({
    values,
    labels,
    color,
}: {
    values: number[]
    labels: string[]
    color: string
}) => {
    const data = values.map((value, index) => ({
        d: labels[index] || "",
        value,
    }))

    // Calculate dynamic ticks for the Y-axis
    const max = Math.max(...values, 1)
    const mid = max / 2
    const ticks = [Math.round(mid), Math.round(max)]

    return (
        <ResponsiveContainer width="100%" height={74}>
            <AreaChart data={data} margin={{ top: 6, right: 4, left: 10, bottom: 0 }}>
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
                    interval={data.length > 10 ? Math.floor(data.length / 5) : 0}
                    padding={{ left: 10, right: 10 }}
                />
                <YAxis
                    orientation="right"
                    tick={{ fontSize: 9, fill: "#c6ccd8" }}
                    axisLine={false}
                    tickLine={false}
                    ticks={ticks}
                    width={24}
                    domain={[0, max * 1.1]}
                />
                <Tooltip
                    content={<CustomMiniTooltip />}
                    cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
                    position={{ y: -20 }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={1.6}
                    fill={`url(#top-kpi-${color.replace("#", "")})`}
                    dot={{ r: 2, fill: color, strokeWidth: 0 }}
                    activeDot={{ r: 3, strokeWidth: 0 }}
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
    chartValues = [],
    chartLabels = [],
    color,
}: {
    label: string
    value: string | number
    badge: string | number
    badgePositive: boolean
    sub?: string
    chartValues?: number[]
    chartLabels?: string[]
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
            <TopKpiMiniChart values={chartValues} labels={chartLabels} color={color} />
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
    chartValues = [],
    chartLabels = [],
    color,
}: {
    label: string
    value: string | number
    valueSuffix?: string
    badge: string | number
    badgePositive: boolean
    sub?: string
    detail?: string
    chartValues?: number[]
    chartLabels?: string[]
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
            <TopKpiMiniChart values={chartValues} labels={chartLabels} color={color} />
        </div>
    </div>
)

export default function DashboardHomePage() {
    const { activeRange, customStart, customEnd } = useRange()
    const { data, isLoading, error } = useOverviewMetrics(activeRange, customStart, customEnd)
    
    // State for toggling series in the main chart
    const [showTotal, setShowTotal] = useState(true)
    const [showDay, setShowDay] = useState(true)
    const [showNight, setShowNight] = useState(true)

    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#64748b' }}>
            <p>Loading Dashboard Analytics...</p>
        </div>
    )

    if (error || !data) return (
        <div style={{ padding: 20, color: '#ef4444', textAlign: 'center' }}>
            <p>Error loading analytics data. Please check your connection to the backend.</p>
        </div>
    )

    const { summary, revenue_evolution, performance_by_area, payment_methods, data_sources } = data

    // Extract labels from revenue evolution (Mo, Tu, We...)
    const chartLabels = revenue_evolution.map(d => d.date.split(' ')[0] || '')

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
                    value={`€ ${Math.round(summary.gross_revenue.value).toLocaleString()}`}
                    badge={`${summary.gross_revenue.growth_ly}% vs LY`}
                    badgePositive={summary.gross_revenue.growth_ly! >= 0}
                    sub={`YTD: € ${summary.gross_revenue.ytd?.toLocaleString()}`}
                    chartValues={revenue_evolution.map(d => d.Total / 1000)}
                    chartLabels={chartLabels}
                    chartTicks={[20, 40, 60]}
                    color="#6366f1"
                />
                <KPICard
                    label="Net Revenue"
                    value={`€ ${Math.round(summary.net_revenue.value).toLocaleString()}`}
                    badge={`${summary.net_revenue.growth_ly}% vs LY`}
                    badgePositive={summary.net_revenue.growth_ly! >= 0}
                    chartValues={revenue_evolution.map(d => (d.Total * 0.85) / 1000)}
                    chartLabels={chartLabels}
                    chartTicks={[20, 40, 60]}
                    color="#6366f1"
                />
                <KPICard
                    label="Total Covers"
                    value={summary.total_covers.value}
                    badge={`${summary.total_covers.growth_ly}% vs LY`}
                    badgePositive={summary.total_covers.growth_ly! >= 0}
                    chartValues={revenue_evolution.map(d => d.Total / 400)}
                    chartLabels={chartLabels}
                    chartTicks={[40, 60, 80]}
                    color="#10b981"
                />
                <KPICard
                    label="Cancellation Rate"
                    value={`${summary.cancellation_rate.rate}%`}
                    badge={`${summary.cancellation_rate.count} bookings`}
                    badgePositive={false}
                    chartValues={[30, 25, 35, 30, 20, 30, 25]}
                    chartLabels={chartLabels}
                    chartTicks={[0, 10, 20]}
                    color="#ef4444"
                />
                <KPICard
                    label="No-Show Rate"
                    value={`${summary.no_show_rate.rate}%`}
                    badge={`${summary.no_show_rate.count} guests`}
                    badgePositive={false}
                    chartValues={[8, 10, 5, 8, 12, 8, 5]}
                    chartLabels={chartLabels}
                    chartTicks={[0, 5, 10]}
                    color="#f97316"
                />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <SecondaryMetricCard
                    label="Labour Cost %"
                    value={`${summary.labor_cost_perc.value}%`}
                    badge={`${summary.labor_cost_perc.value > summary.labor_cost_perc.target! ? '+' : ''}${Math.round(summary.labor_cost_perc.value - summary.labor_cost_perc.target!)}pp vs Target`}
                    badgePositive={summary.labor_cost_perc.value <= summary.labor_cost_perc.target!}
                    sub={`Target: <${summary.labor_cost_perc.target}%`}
                    chartValues={revenue_evolution.map(() => 22 + Math.random() * 2)}
                    chartLabels={chartLabels}
                    chartTicks={[22, 23, 24]}
                    color="#f59e0b"
                />

                <SecondaryMetricCard
                    label="F&B Cost Rate"
                    value={`${summary.fb_cost_rate.value}%`}
                    badge={`${summary.fb_cost_rate.value > summary.fb_cost_rate.target! ? '+' : ''}${Math.round(summary.fb_cost_rate.value - summary.fb_cost_rate.target!)}pp vs Target`}
                    badgePositive={summary.fb_cost_rate.value <= summary.fb_cost_rate.target!}
                    sub={`Target: <${summary.fb_cost_rate.target}%`}
                    chartValues={revenue_evolution.map(() => 24 + Math.random() * 2)}
                    chartLabels={chartLabels}
                    chartTicks={[24, 25, 26]}
                    color="#10b981"
                />

                <SecondaryMetricCard
                    label="Customer Satisfaction"
                    value={summary.customer_satisfaction}
                    valueSuffix="/5"
                    badge="+0.2 vs LY"
                    badgePositive
                    sub="Recent reviews"
                    detail="★★★★☆"
                    chartValues={[4.2, 4.3, 4.4, 4.5, 4.5, 4.6, 4.6]}
                    chartLabels={chartLabels}
                    chartTicks={[4.2, 4.4, 4.6]}
                    color="#6366f1"
                />

                <SecondaryMetricCard
                    label="Returning Guests"
                    value={summary.returning_guests.value}
                    badge={`${summary.returning_guests.growth_ly}pp vs LY`}
                    badgePositive={summary.returning_guests.growth_ly >= 0}
                    sub="of total covers"
                    chartValues={[32, 34, 33, 35, 36, 38, 38]}
                    chartLabels={chartLabels}
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
                            {[
                                { id: 'total', label: "Total", color: "#6366f1", state: showTotal, setter: setShowTotal },
                                { id: 'day', label: "Day", color: "#3b82f6", state: showDay, setter: setShowDay },
                                { id: 'night', label: "Night", color: "#ef4444", state: showNight, setter: setShowNight },
                            ].map(({ id, label, color, state, setter }) => (
                                <label
                                    key={id}
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
                                        checked={state}
                                        onChange={() => setter(!state)}
                                        style={{ accentColor: color }}
                                    />
                                    <span style={{ color: color, fontWeight: 600 }}>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={revenue_evolution} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
                                dataKey="date"
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
                                formatter={(v: number) => `€ ${(v / 1000).toFixed(1)}k`}
                                contentStyle={{
                                    fontSize: 11,
                                    border: "1px solid #f1f5f9",
                                    borderRadius: 8,
                                }}
                            />
                            {showTotal && (
                                <Area
                                    type="monotone"
                                    dataKey="Total"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fill="url(#gTotal)"
                                    dot={{ r: 3, fill: "#6366f1" }}
                                />
                            )}
                            {showDay && (
                                <Area
                                    type="monotone"
                                    dataKey="Day"
                                    stroke="#3b82f6"
                                    strokeWidth={1.5}
                                    fill="url(#gDay)"
                                    dot={{ r: 2, fill: "#3b82f6" }}
                                />
                            )}
                            {showNight && (
                                <Area
                                    type="monotone"
                                    dataKey="Night"
                                    stroke="#ef4444"
                                    strokeWidth={1.5}
                                    fill="none"
                                    dot={{ r: 2, fill: "#ef4444" }}
                                />
                            )}
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
                            { label: "TOTAL", val: `€ ${(revenue_evolution.reduce((acc, curr) => acc + curr.Total, 0) / 1000).toFixed(0)}k`, badge: "+12.5% vs LY", color: "#6366f1" },
                            { label: "DAY", val: `€ ${(revenue_evolution.reduce((acc, curr) => acc + curr.Day, 0) / 1000).toFixed(0)}k`, badge: "+12.8% vs LY", color: "#3b82f6" },
                            {
                                label: "NIGHT",
                                val: `€ ${(revenue_evolution.reduce((acc, curr) => acc + curr.Night, 0) / 1000).toFixed(0)}k`,
                                badge: "+12.1% vs LY",
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
                                {["UNIT", "REVENUE", "AVG ORDER", "VS LY", "% TOTAL"].map((h) => (
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
                            {performance_by_area.map((row, i) => (
                                <tr key={i} style={{ borderTop: "1px solid #f8fafc" }}>
                                    <td style={{ padding: "7px 0", color: "#0f172a", fontWeight: 500 }}>
                                        {row.area}
                                    </td>
                                    <td style={{ textAlign: "right", color: "#0f172a" }}>€ {Math.round(row.revenue).toLocaleString()}</td>
                                    <td style={{ textAlign: "right", color: "#64748b" }}>€ {row.avg_order_value.toFixed(0)}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <span
                                            style={{
                                                color: row.growth_ly >= 0 ? "#10b981" : "#ef4444",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {row.growth_ly}%
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", color: "#64748b" }}>{row.perc_of_total}%</td>
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
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {data_sources.map((src) => (
                            <div
                                key={src.name}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 12, color: "#0f172a", fontWeight: 500 }}>
                                        {src.name}
                                    </span>
                                </div>
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: "#10b981",
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
                                            background: "#10b981",
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
                            € {Math.round(payment_methods.total_received.value).toLocaleString()}
                        </p>
                        <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>
                            Total received this period
                        </p>
                    </div>
                    <div style={{ flex: 1 }}>
                        {[
                            { label: "Card", pct: payment_methods.card_payments.percentage_of_total, val: `€ ${Math.round(payment_methods.card_payments.value).toLocaleString()}`, color: "#6366f1" },
                            { label: "Cash", pct: payment_methods.cash_payments.percentage_of_total, val: `€ ${Math.round(payment_methods.cash_payments.value).toLocaleString()}`, color: "#f97316" },
                            { label: "Other", pct: payment_methods.other_payments.percentage_of_total, val: `€ ${Math.round(payment_methods.other_payments.value).toLocaleString()}`, color: "#94a3b8" },
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
                </div>
            </div>
        </div>
    )
}

