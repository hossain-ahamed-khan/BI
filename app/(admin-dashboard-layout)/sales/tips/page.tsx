"use client";
import { useState } from "react";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    YAxis,
} from "recharts";

// --- Data ---
const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const totalTipsData = [
    { day: "Mo", value: 48 },
    { day: "Tu", value: 52 },
    { day: "We", value: 55 },
    { day: "Th", value: 50 },
    { day: "Fr", value: 58 },
    { day: "Sa", value: 68 },
    { day: "Su", value: 75 },
];

const avgTipData = [
    { day: "Mo", value: 2.4 },
    { day: "Tu", value: 2.6 },
    { day: "We", value: 2.7 },
    { day: "Th", value: 2.5 },
    { day: "Fr", value: 2.8 },
    { day: "Sa", value: 3.0 },
    { day: "Su", value: 2.9 },
];

const tipRateData = [
    { day: "Mo", value: 4.1 },
    { day: "Tu", value: 4.3 },
    { day: "We", value: 4.4 },
    { day: "Th", value: 4.2 },
    { day: "Fr", value: 4.5 },
    { day: "Sa", value: 5.0 },
    { day: "Su", value: 4.8 },
];

const cashTipsData = [
    { day: "Mo", value: 180 },
    { day: "Tu", value: 200 },
    { day: "We", value: 155 },
    { day: "Th", value: 190 },
    { day: "Fr", value: 175 },
    { day: "Sa", value: 185 },
    { day: "Su", value: 195 },
];

const areaData = [
    { area: "El Comedor", total: "€ 2,840", avg: "€ 3.20", rate: "4.4%" },
    { area: "Jazz Club", total: "€ 1,120", avg: "€ 2.80", rate: "4.1%" },
    { area: "Cocktail Bar", total: "€ 1,860", avg: "€ 3.80", rate: "5.0%" },
    { area: "Private Club", total: "€ 1,640", avg: "€ 4.20", rate: "4.4%" },
    { area: "La Barra Jap.", total: "€ 780", avg: "€ 2.40", rate: "4.2%" },
];

// --- Sub-components ---

interface MiniChartProps {
    data: { day: string; value: number }[];
    color: string;
    domain?: [number, number];
    showArea?: boolean;
}

function MiniChart({ data, color, domain, showArea = true }: MiniChartProps) {
    return (
        <div style={{ width: "100%", height: 70, marginTop: 4 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                    {domain && <YAxis domain={domain} hide />}
                    <Tooltip
                        contentStyle={{
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 6,
                            fontSize: 11,
                            padding: "2px 8px",
                        }}
                        itemStyle={{ color: "#374151" }}
                        labelStyle={{ color: "#9ca3af", fontSize: 10 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={1.5}
                        dot={{ r: 2.5, fill: color, strokeWidth: 0 }}
                        activeDot={{ r: 4, fill: color }}
                    />
                </LineChart>
            </ResponsiveContainer>
            {/* Day labels */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingLeft: 4,
                    paddingRight: 4,
                    marginTop: -2,
                }}
            >
                {weekDays.map((d) => (
                    <span key={d} style={{ fontSize: 9, color: "#9ca3af" }}>
                        {d}
                    </span>
                ))}
            </div>
        </div>
    );
}

interface KPICardProps {
    label: string;
    value: string;
    badge: string;
    badgeColor: string;
    sub: string;
    data: { day: string; value: number }[];
    lineColor: string;
    domain?: [number, number];
}

function KPICard({
    label,
    value,
    badge,
    badgeColor,
    sub,
    data,
    lineColor,
    domain,
}: KPICardProps) {
    return (
        <div style={styles.card}>
            <p style={styles.cardLabel}>{label}</p>
            <p style={styles.cardValue}>{value}</p>
            <span style={{ ...styles.badge, color: badgeColor }}>
                <span style={{ marginRight: 2 }}>▲</span>
                {badge}
            </span>
            <p style={styles.cardSub}>{sub}</p>
            <MiniChart data={data} color={lineColor} domain={domain} />
        </div>
    );
}

// --- Main Dashboard ---
export default function TipsDashboard() {
    return (
        <div style={styles.container}>
            {/* Top KPI row */}
            <div style={styles.kpiRow}>
                <KPICard
                    label="TOTAL TIPS"
                    value="€ 8.240"
                    badge="+4.1% vs LY"
                    badgeColor="#10b981"
                    sub="YTD: € 42,800"
                    data={totalTipsData}
                    lineColor="#f97316"
                    domain={[40, 80]}
                />
                <KPICard
                    label="AVG TIP / COVER"
                    value="€ 2.89"
                    badge="+3.2% vs LY"
                    badgeColor="#10b981"
                    sub=""
                    data={avgTipData}
                    lineColor="#818cf8"
                    domain={[2.0, 3.0]}
                />
                <KPICard
                    label="TIP RATE"
                    value="4.5%"
                    badge="+0.3pp vs LY"
                    badgeColor="#10b981"
                    sub="% of Gross Revenue"
                    data={tipRateData}
                    lineColor="#14b8a6"
                    domain={[4.0, 5.0]}
                />
                <KPICard
                    label="CASH TIPS"
                    value="€ 1.240"
                    badge=""
                    badgeColor="#10b981"
                    sub="15% of total"
                    data={cashTipsData}
                    lineColor="#eab308"
                    domain={[140, 220]}
                />
            </div>

            {/* Bottom row */}
            <div style={styles.bottomRow}>
                {/* Tips by Area */}
                <div style={{ ...styles.card, flex: 1 }}>
                    <div style={styles.tableHeader}>
                        <span style={styles.cardLabel}>TIPS BY AREA</span>
                        <span style={styles.arrow}>→</span>
                    </div>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ ...styles.th, textAlign: "left" }}>AREA</th>
                                <th style={styles.th}>TOTAL TIPS</th>
                                <th style={styles.th}>AVG / COVER</th>
                                <th style={styles.th}>TIP RATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areaData.map((row, i) => (
                                <tr key={i}>
                                    <td style={{ ...styles.td, textAlign: "left", fontWeight: 500 }}>
                                        {row.area}
                                    </td>
                                    <td style={styles.td}>{row.total}</td>
                                    <td style={styles.td}>{row.avg}</td>
                                    <td style={styles.td}>{row.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Tips by Payment & Shift */}
                <div style={{ ...styles.card, flex: 1 }}>
                    <div style={styles.tableHeader}>
                        <span style={styles.cardLabel}>TIPS BY PAYMENT &amp; SHIFT</span>
                        <span style={styles.arrow}>→</span>
                    </div>

                    <p style={styles.sectionTitle}>BY PAYMENT METHOD</p>

                    {/* Card */}
                    <div style={styles.barRow}>
                        <span style={styles.barLabel}>Card</span>
                        <div style={styles.barTrack}>
                            <div
                                style={{ ...styles.barFill, width: "85%", background: "#6366f1" }}
                            />
                        </div>
                        <span style={styles.barMeta}>85% · € 7,004</span>
                    </div>

                    {/* Cash */}
                    <div style={styles.barRow}>
                        <span style={styles.barLabel}>Cash</span>
                        <div style={styles.barTrack}>
                            <div
                                style={{ ...styles.barFill, width: "15%", background: "#f97316" }}
                            />
                        </div>
                        <span style={styles.barMeta}>15% · € 1,236</span>
                    </div>

                    <p style={{ ...styles.sectionTitle, marginTop: 20 }}>BY SHIFT</p>

                    {/* Day */}
                    <div style={styles.barRow}>
                        <span style={styles.barLabel}>Day</span>
                        <div style={styles.barTrack}>
                            <div
                                style={{ ...styles.barFill, width: "32%", background: "#14b8a6" }}
                            />
                        </div>
                        <span style={styles.barMeta}>32% · € 2,637</span>
                    </div>

                    {/* Night */}
                    <div style={styles.barRow}>
                        <span style={styles.barLabel}>Night</span>
                        <div style={styles.barTrack}>
                            <div
                                style={{ ...styles.barFill, width: "68%", background: "#818cf8" }}
                            />
                        </div>
                        <span style={styles.barMeta}>68% · € 5,603</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
    container: {
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
        boxSizing: "border-box",
    },
    kpiRow: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 16,
    },
    bottomRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
    },
    card: {
        background: "#ffffff",
        borderRadius: 14,
        padding: "18px 20px 14px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    cardLabel: {
        fontSize: 10,
        letterSpacing: "0.08em",
        color: "#9ca3af",
        fontWeight: 600,
        margin: 0,
        marginBottom: 6,
    },
    cardValue: {
        fontSize: 30,
        fontWeight: 300,
        color: "#111827",
        margin: 0,
        lineHeight: 1.1,
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 600,
        marginTop: 4,
    },
    cardSub: {
        fontSize: 11,
        color: "#9ca3af",
        margin: "2px 0 0",
    },
    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    arrow: {
        color: "#9ca3af",
        fontSize: 16,
        cursor: "pointer",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        fontSize: 10,
        letterSpacing: "0.07em",
        color: "#9ca3af",
        fontWeight: 600,
        textAlign: "right",
        paddingBottom: 8,
        borderBottom: "1px solid #f3f4f6",
    },
    td: {
        fontSize: 13,
        color: "#374151",
        textAlign: "right",
        padding: "10px 0",
        borderBottom: "1px solid #f9fafb",
    },
    sectionTitle: {
        fontSize: 10,
        letterSpacing: "0.07em",
        color: "#9ca3af",
        fontWeight: 600,
        margin: "0 0 10px",
    },
    barRow: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    barLabel: {
        fontSize: 13,
        color: "#374151",
        width: 40,
        flexShrink: 0,
    },
    barTrack: {
        flex: 1,
        height: 6,
        background: "#f3f4f6",
        borderRadius: 99,
        overflow: "hidden",
    },
    barFill: {
        height: "100%",
        borderRadius: 99,
    },
    barMeta: {
        fontSize: 12,
        color: "#6b7280",
        whiteSpace: "nowrap",
        minWidth: 90,
        textAlign: "right",
    },
};