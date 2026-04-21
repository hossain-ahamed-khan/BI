"use client";
import type { ReactNode } from "react";
import {
    Area,
    CartesianGrid,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const weeklyData = [
    { day: "Mo", total: 62, cards: 48, cash: 6, other: 8 },
    { day: "Tu", total: 70, cards: 54, cash: 7, other: 9 },
    { day: "We", total: 68, cards: 52, cash: 7, other: 9 },
    { day: "Th", total: 80, cards: 62, cash: 8, other: 10 },
    { day: "Fr", total: 85, cards: 65, cash: 8, other: 12 },
    { day: "Sa", total: 90, cards: 70, cash: 9, other: 11 },
    { day: "Su", total: 100, cards: 80, cash: 15, other: 20 },
];

const pieData = [
    { name: "Visa", value: 84050, color: "#6366f1" },
    { name: "Mastercard", value: 35021, color: "#a5b4fc" },
    { name: "Amex", value: 14008, color: "#f59e0b" },
    { name: "Other Cards", value: 7004, color: "#14b8a6" },
    { name: "Cash", value: 18432, color: "#22c55e" },
    { name: "Gift Card", value: 1000, color: "#c084fc" },
    { name: "Other", value: 24805, color: "#ef4444" },
];

const cardDetails = [
    { name: "Visa", amount: "€ 84,050", pct: "60%" },
    { name: "Mastercard", amount: "€ 35,021", pct: "25%" },
    { name: "Amex", amount: "€ 14,008", pct: "10%" },
    { name: "Other cards", amount: "€ 7,004", pct: "5%" },
];

function MiniChart({
    dataKey,
    color,
    areaColor,
}: {
    dataKey: string;
    color: string;
    areaColor: string;
}) {
    return (
        <ResponsiveContainer width="100%" height={62}>
            <LineChart data={weeklyData} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
                <defs>
                    <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={areaColor} stopOpacity={0.24} />
                        <stop offset="100%" stopColor={areaColor} stopOpacity={0.0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="0" />
                <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "inherit" }}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                />
                <YAxis
                    orientation="right"
                    domain={["auto", "auto"]}
                    axisLine={false}
                    tickLine={false}
                    width={22}
                    tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "inherit" }}
                />
                <Tooltip
                    contentStyle={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        fontSize: 11,
                        padding: "2px 8px",
                    }}
                    itemStyle={{ color: "#374151" }}
                />
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    fill={`url(#grad-${dataKey})`}
                    stroke="none"
                    isAnimationActive={false}
                />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3, fill: color, stroke: "#ffffff", strokeWidth: 1 }}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

function StatCard({
    label,
    value,
    sub,
    subColor,
    dataKey,
    lineColor,
    areaColor,
}: {
    label: string;
    value: string;
    sub: ReactNode;
    subColor?: string;
    dataKey: string;
    lineColor: string;
    areaColor: string;
}) {
    return (
        <div
            style={{
                background: "#f3f4f6",
                borderRadius: 16,
                padding: "20px 20px 8px 20px",
                flex: 1,
                minWidth: 0,
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 6px rgba(15, 23, 42, 0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <p
                style={{
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    margin: 0,
                    fontFamily: "inherit",
                }}
            >
                {label}
            </p>
            <p
                style={{
                    fontSize: 30,
                    fontWeight: 300,
                    color: "#111827",
                    margin: "4px 0 0 0",
                    letterSpacing: "-0.02em",
                    fontFamily: "inherit",
                }}
            >
                {value}
            </p>
            <div style={{ color: subColor || "#6b7280", fontSize: 11, margin: "2px 0 4px 0" }}>
                {sub}
            </div>
            <MiniChart dataKey={dataKey} color={lineColor} areaColor={areaColor} />
        </div>
    );
}

const LEGEND = [
    { label: "Visa", color: "#6366f1" },
    { label: "Mastercard", color: "#a5b4fc" },
    { label: "Amex", color: "#f59e0b" },
    { label: "Other Cards", color: "#14b8a6" },
    { label: "Cash", color: "#22c55e" },
    { label: "Gift Card", color: "#c084fc" },
    { label: "Other", color: "#ef4444" },
];

export default function PaymentDashboard() {
    return (
        <div
            style={{
                background: "#e5e7eb",
                minHeight: "100vh",
                padding: 24,
                fontFamily:
                    "'DM Sans', 'Geist', 'Helvetica Neue', Arial, sans-serif",
                boxSizing: "border-box",
            }}
        >
            {/* Top row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <StatCard
                    label="Total Received"
                    value="€184,320"
                    sub={
                        <span
                            style={{
                                color: "#10b981",
                                fontWeight: 600,
                                background: "#d1fae5",
                                borderRadius: 999,
                                padding: "2px 8px",
                                display: "inline-block",
                            }}
                        >
                            ▲ +12.4% vs LY
                        </span>
                    }
                    dataKey="total"
                    lineColor="#818cf8"
                    areaColor="#818cf8"
                />
                <StatCard
                    label="Card Payments"
                    value="€140,083"
                    sub={
                        <span
                            style={{
                                color: "#6b7280",
                                background: "#e5e7eb",
                                borderRadius: 999,
                                padding: "2px 8px",
                                display: "inline-block",
                            }}
                        >
                            76% of total
                        </span>
                    }
                    dataKey="cards"
                    lineColor="#818cf8"
                    areaColor="#818cf8"
                />
                <StatCard
                    label="Cash"
                    value="€18,432"
                    sub={
                        <span
                            style={{
                                color: "#6b7280",
                                background: "#e5e7eb",
                                borderRadius: 999,
                                padding: "2px 8px",
                                display: "inline-block",
                            }}
                        >
                            10% of total
                        </span>
                    }
                    dataKey="cash"
                    lineColor="#2dd4bf"
                    areaColor="#2dd4bf"
                />
                <StatCard
                    label="Other (GC + Other)"
                    value="€25,805"
                    sub={
                        <span
                            style={{
                                color: "#6b7280",
                                background: "#e5e7eb",
                                borderRadius: 999,
                                padding: "2px 8px",
                                display: "inline-block",
                            }}
                        >
                            14% of total
                        </span>
                    }
                    dataKey="other"
                    lineColor="#fbbf24"
                    areaColor="#fbbf24"
                />
            </div>

            {/* Bottom row */}
            <div style={{ display: "flex", gap: 16 }}>
                {/* Payment Breakdown */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "20px 24px",
                        flex: 1,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.08em",
                                color: "#9ca3af",
                                textTransform: "uppercase",
                                margin: 0,
                            }}
                        >
                            Payment Breakdown
                        </p>
                        <span style={{ color: "#9ca3af", fontSize: 16, cursor: "pointer" }}>→</span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 32,
                        }}
                    >
                        <PieChart width={220} height={220}>
                            <Pie
                                data={pieData}
                                cx={105}
                                cy={105}
                                innerRadius={68}
                                outerRadius={105}
                                dataKey="value"
                                strokeWidth={2}
                                stroke="#fff"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {LEGEND.map((item) => (
                                <div
                                    key={item.label}
                                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                                >
                                    <div
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            background: item.color,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <span style={{ fontSize: 12, color: "#374151" }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Card Type Detail */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "20px 24px",
                        flex: 1,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <p
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.08em",
                                color: "#9ca3af",
                                textTransform: "uppercase",
                                margin: 0,
                            }}
                        >
                            Card Type Detail
                        </p>
                        <span style={{ color: "#9ca3af", fontSize: 16, cursor: "pointer" }}>→</span>
                    </div>

                    {/* Card Total Header */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                            paddingBottom: 12,
                            borderBottom: "1px solid #f3f4f6",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div
                                style={{
                                    background: "#3b82f6",
                                    borderRadius: 4,
                                    width: 22,
                                    height: 14,
                                }}
                            />
                            <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
                                Card Total
                            </span>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
                            € 140,083
                        </span>
                    </div>

                    {/* Card rows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {cardDetails.map((row) => (
                            <div
                                key={row.name}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "10px 12px",
                                    borderRadius: 10,
                                    background: "#f9fafb",
                                }}
                            >
                                <span style={{ fontSize: 13, color: "#374151" }}>{row.name}</span>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <span style={{ fontSize: 13, color: "#374151" }}>{row.amount}</span>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            color: "#9ca3af",
                                            minWidth: 30,
                                            textAlign: "right",
                                        }}
                                    >
                                        · {row.pct}
                                    </span>
                                    <span style={{ color: "#d1d5db", fontSize: 12 }}>›</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}