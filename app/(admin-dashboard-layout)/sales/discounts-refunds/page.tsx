"use client";
import {
    ResponsiveContainer,
    Tooltip,
    YAxis,
    CartesianGrid,
    Area,
    AreaChart,
} from "recharts";

const weekData = [
    { day: "Mo", discounts: 380, refunds: 60, impact: 420 },
    { day: "Tu", discounts: 340, refunds: 50, impact: 380 },
    { day: "We", discounts: 340, refunds: 60, impact: 390 },
    { day: "Th", discounts: 360, refunds: 70, impact: 410 },
    { day: "Fr", discounts: 340, refunds: 60, impact: 390 },
    { day: "Sa", discounts: 340, refunds: 70, impact: 400 },
    { day: "Su", discounts: 380, refunds: 80, impact: 500 },
];

const tableData = [
    { name: "Staff Meal", type: "Discount", timesApplied: 142, amount: 426 },
    { name: "Manager Comp", type: "Discount", timesApplied: 38, amount: 840 },
    { name: "Loyalty Reward", type: "Discount", timesApplied: 64, amount: 512 },
    { name: "Happy Hour", type: "Discount", timesApplied: 210, amount: 420 },
    { name: "Group Discount", type: "Discount", timesApplied: 12, amount: 200 },
    { name: "Complaint Refund", type: "Refund", timesApplied: 8, amount: 280 },
    { name: "Wrong Item Refund", type: "Refund", timesApplied: 5, amount: 120 },
    { name: "N/C Tasting", type: "N/C", timesApplied: 20, amount: 120 },
];

const typeBadge: Record<string, { label: string; color: string }> = {
    Discount: { label: "Discount", color: "#22c55e" },
    Refund: { label: "Refund", color: "#f97316" },
    "N/C": { label: "N/C", color: "#eab308" },
};

function MiniChart({
    dataKey,
    color,
    yTicks,
}: {
    dataKey: string;
    color: string;
    yTicks: number[];
}) {
    const maxTick = Math.max(...yTicks);
    const minTick = Math.min(...yTicks);

    return (
        <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={weekData} margin={{ top: 4, right: 14, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} horizontal stroke="#eceef2" strokeWidth={1} />
                <YAxis
                    domain={[minTick, maxTick]}
                    ticks={yTicks}
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    width={26}
                    tick={{ fontSize: 11, fill: "#b8bec9", fontFamily: "'DM Sans', sans-serif" }}
                />
                <Tooltip
                    contentStyle={{
                        background: "#fff",
                        border: "1px solid #f0f0f0",
                        borderRadius: 6,
                        fontSize: 11,
                        padding: "2px 8px",
                    }}
                    itemStyle={{ color: "#111" }}
                    formatter={(value) => {
                        const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                        return [`€${numericValue}`, ""];
                    }}
                    labelFormatter={(label) => String(label ?? "")}
                />
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={1.7}
                    fill={`url(#grad-${dataKey})`}
                    dot={{ r: 2.8, fill: color, stroke: "#fff", strokeWidth: 1.5 }}
                    activeDot={{ r: 4 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

function StatCard({
    label,
    value,
    sub,
    subColor,
    dataKey,
    yTicks,
}: {
    label: string;
    value: string;
    sub: string;
    subColor: string;
    dataKey: string;
    yTicks: number[];
}) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 28px 16px",
                flex: 1,
                minWidth: 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <span
                style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#aaa",
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                {label}
            </span>
            <span
                style={{
                    fontSize: 36,
                    fontWeight: 300,
                    color: "#e5393a",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                }}
            >
                {value}
            </span>
            <span
                style={{
                    display: "inline-block",
                    background: "#fde8e8",
                    color: subColor,
                    fontSize: 11,
                    fontWeight: 500,
                    borderRadius: 4,
                    padding: "2px 8px",
                    width: "fit-content",
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 6,
                }}
            >
                {sub}
            </span>
            <MiniChart dataKey={dataKey} color="#ef4444" yTicks={yTicks} />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 2,
                }}
            >
                {weekData.map((d) => (
                    <span
                        key={d.day}
                        style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {d.day}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function DiscountsRefundsDashboard() {
    const totalApplied = tableData.reduce((s, r) => s + r.timesApplied, 0);
    const totalAmount = tableData.reduce((s, r) => s + r.amount, 0);

    return (
        <div
            style={{
                background: "#f5f5f5",
                minHeight: "100vh",
                padding: "32px 32px",
                fontFamily: "'DM Sans', sans-serif",
                boxSizing: "border-box",
            }}
        >
            {/* Google Font import */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

            {/* Top KPI Cards */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <StatCard
                    label="Total Discounts"
                    value="€ 2,398"
                    sub="Applied this period"
                    subColor="#e5393a"
                    dataKey="discounts"
                    yTicks={[380, 360, 340]}
                />
                <StatCard
                    label="Total Refunds"
                    value="€ 480"
                    sub="Refunded this period"
                    subColor="#e5393a"
                    dataKey="refunds"
                    yTicks={[80, 60, 40]}
                />
                <StatCard
                    label="Total Impact"
                    value="– €2,998"
                    sub="Net revenue reduction"
                    subColor="#e5393a"
                    dataKey="impact"
                    yTicks={[500, 400, 300]}
                />
            </div>

            {/* Table Card */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: "24px 28px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 18,
                    }}
                >
                    <span
                        style={{
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#aaa",
                            fontWeight: 600,
                        }}
                    >
                        Discounts &amp; Refunds Detail
                    </span>
                    <span style={{ color: "#aaa", fontSize: 16, cursor: "pointer" }}>→</span>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Name", "Type", "Times Applied", "Amount Discounted"].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        textAlign: "left",
                                        fontSize: 10,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        color: "#bbb",
                                        fontWeight: 600,
                                        paddingBottom: 12,
                                        borderBottom: "1px solid #f0f0f0",
                                        paddingRight: 16,
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, i) => {
                            const badge = typeBadge[row.type];
                            return (
                                <tr
                                    key={row.name}
                                    style={{
                                        borderBottom:
                                            i < tableData.length - 1 ? "1px solid #f7f7f7" : "none",
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: "14px 16px 14px 0",
                                            fontSize: 14,
                                            color: "#222",
                                            fontWeight: 400,
                                        }}
                                    >
                                        {row.name}
                                    </td>
                                    <td style={{ padding: "14px 16px 14px 0" }}>
                                        <span
                                            style={{
                                                color: badge.color,
                                                fontSize: 12,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {badge.label}
                                        </span>
                                    </td>
                                    <td
                                        style={{
                                            padding: "14px 16px 14px 0",
                                            fontSize: 14,
                                            color: "#444",
                                        }}
                                    >
                                        {row.timesApplied}
                                    </td>
                                    <td
                                        style={{
                                            padding: "14px 0 14px 0",
                                            fontSize: 14,
                                            color: "#e5393a",
                                            textAlign: "left",
                                        }}
                                    >
                                        – € {row.amount.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                        {/* Total row */}
                        <tr style={{ borderTop: "1px solid #f0f0f0" }}>
                            <td
                                style={{
                                    paddingTop: 14,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#222",
                                }}
                            >
                                Total
                            </td>
                            <td />
                            <td
                                style={{
                                    paddingTop: 14,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#222",
                                }}
                            >
                                {totalApplied}
                            </td>
                            <td
                                style={{
                                    paddingTop: 14,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#e5393a",
                                }}
                            >
                                – € {totalAmount.toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}