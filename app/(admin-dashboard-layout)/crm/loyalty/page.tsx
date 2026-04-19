"use client";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface TierBadgeProps {
    tier: "New" | "Potential" | "Loyal" | "VIP" | "Super Loyal" | "At Risk";
}

interface SparklineProps {
    data: number[];
    color: string;
    fill?: boolean;
    width?: number;
    height?: number;
}

// ── Card Sparkline (matches reference: area chart with axes) ───────────────
function Sparkline({
    data,
    color,
    fill = false,
    width = 260,
    height = 72,
    xLabels,
    yLabels,
}: SparklineProps & { xLabels?: string[]; yLabels?: string[] }) {
    const padL = 4, padR = yLabels ? 36 : 4, padT = 6, padB = xLabels ? 18 : 4;
    const W = width - padL - padR;
    const H = height - padT - padB;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const toX = (i: number) => padL + (i / (data.length - 1)) * W;
    const toY = (v: number) => padT + H - ((v - min) / range) * H;

    const pts = data.map((v, i) => `${toX(i)},${toY(v)}`);
    const polyline = pts.join(" ");
    const areaPath = `${toX(0)},${padT + H} ${polyline} ${toX(data.length - 1)},${padT + H}`;

    return (
        <svg
            width="100%"
            viewBox={`0 0 ${width} ${height}`}
            style={{ overflow: "visible", display: "block" }}
        >
            <defs>
                <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
            </defs>

            {/* Filled area */}
            {fill && (
                <polygon
                    points={areaPath}
                    fill={`url(#grad-${color.replace("#", "")})`}
                />
            )}

            {/* Line */}
            <polyline
                points={polyline}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* Dots */}
            {data.map((v, i) => (
                <circle
                    key={i}
                    cx={toX(i)}
                    cy={toY(v)}
                    r={3}
                    fill="#fff"
                    stroke={color}
                    strokeWidth={1.8}
                />
            ))}

            {/* X-axis labels */}
            {xLabels &&
                xLabels.map((lbl, i) => (
                    <text
                        key={i}
                        x={toX(i)}
                        y={height - 2}
                        fontSize={9}
                        fill="#b0b7c3"
                        textAnchor="middle"
                        fontFamily="inherit"
                    >
                        {lbl}
                    </text>
                ))}

            {/* Y-axis labels (right side) */}
            {yLabels &&
                yLabels.map((lbl, i) => {
                    const fraction = i / (yLabels.length - 1);
                    const y = padT + H - fraction * H;
                    return (
                        <text
                            key={i}
                            x={width - 2}
                            y={y + 3}
                            fontSize={9}
                            fill="#b0b7c3"
                            textAnchor="end"
                            fontFamily="inherit"
                        >
                            {lbl}
                        </text>
                    );
                })}
        </svg>
    );
}

// ── Tier Badge ─────────────────────────────────────────────────────────────
function TierBadge({ tier }: TierBadgeProps) {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
        New: { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
        Potential: { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" },
        Loyal: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
        VIP: { bg: "#fefce8", color: "#ca8a04", border: "#fde68a" },
        "Super Loyal": { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" },
        "At Risk": { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
    };
    const s = styles[tier] ?? styles["Loyal"];
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 10px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
                whiteSpace: "nowrap",
            }}
        >
            {tier === "At Risk" && "⚠ "}
            {tier}
        </span>
    );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
    label,
    value,
    sub,
    subColor,
    sparkData,
    sparkColor,
    rightLabel,
    rightSub,
    xLabels,
    yLabels,
}: {
    label: string;
    value: string | number;
    sub: string;
    subColor: string;
    sparkData: number[];
    sparkColor: string;
    rightLabel?: string;
    rightSub?: string;
    xLabels?: string[];
    yLabels?: string[];
}) {
    const isAmber = subColor === "#f59e0b";
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                padding: "20px 24px 0px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
            }}
        >
            {/* Label */}
            <span style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.09em", color: "#b0b7c3", textTransform: "uppercase", marginBottom: 6 }}>
                {label}
            </span>

            {/* Value */}
            <span style={{ fontSize: 38, fontWeight: 700, color: isAmber ? "#f59e0b" : "#111827", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
                {value}
            </span>

            {/* Badge + subtitle */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background: isAmber ? "#fffbeb" : `${sparkColor}18`,
                        color: subColor,
                        fontSize: 11.5,
                        fontWeight: 700,
                        border: `1px solid ${sparkColor}30`,
                    }}
                >
                    {sub}
                </span>
            </div>
            {(rightLabel || rightSub) && (
                <span style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>
                    {rightSub ?? rightLabel}
                </span>
            )}

            {/* Chart flush to bottom */}
            <div style={{ marginTop: "auto", paddingTop: 8 }}>
                <Sparkline
                    data={sparkData}
                    color={sparkColor}
                    fill
                    width={260}
                    height={80}
                    xLabels={xLabels}
                    yLabels={yLabels}
                />
            </div>
        </div>
    );
}

// ── Funnel Bar ─────────────────────────────────────────────────────────────
function FunnelBar({
    label,
    color,
    labelColor,
    labelBg,
    value,
    max,
    change,
    changeUp,
}: {
    label: string;
    color: string;
    labelColor: string;
    labelBg: string;
    value: number;
    max: number;
    change: string;
    changeUp: boolean | null;
}) {
    const pct = Math.max(4, (value / max) * 100);
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 96, flexShrink: 0 }}>
                <span
                    style={{
                        display: "inline-block",
                        padding: "2px 10px",
                        borderRadius: 20,
                        background: labelBg,
                        color: labelColor,
                        fontSize: 12,
                        fontWeight: 600,
                        border: `1px solid ${color}30`,
                    }}
                >
                    {label}
                </span>
            </div>
            <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 8, height: 10 }}>
                <div
                    style={{
                        width: `${pct}%`,
                        background: color,
                        borderRadius: 8,
                        height: "100%",
                        transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
                    }}
                />
            </div>
            <span style={{ width: 48, textAlign: "right", fontSize: 13, fontWeight: 700, color: "#111827" }}>
                {value.toLocaleString()}
            </span>
            <span
                style={{
                    width: 56,
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: 600,
                    color: changeUp === null ? "#ef4444" : changeUp ? "#16a34a" : "#ef4444",
                }}
            >
                {changeUp === null ? "▼" : changeUp ? "▲" : "▼"} {change}
            </span>
        </div>
    );
}

// ── Line Chart (6-month evolution) ────────────────────────────────────────
function EvolutionChart() {
    const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    const series = [
        { label: "Loyal", color: "#10b981", data: [400, 415, 410, 430, 440, 460] },
        { label: "VIP", color: "#6366f1", data: [190, 200, 195, 210, 215, 220] },
        { label: "Super", color: "#f97316", data: [30, 45, 35, 40, 50, 60] },
        { label: "At Risk", color: "#ef4444", data: [15, 25, 20, 18, 22, 24], dashed: true },
    ];

    const W = 860, H = 160, pad = { t: 10, r: 20, b: 28, l: 36 };
    const chartW = W - pad.l - pad.r;
    const chartH = H - pad.t - pad.b;
    const allVals = series.flatMap((s) => s.data);
    const min = 0, max = Math.max(...allVals) + 40;

    const toX = (i: number) => pad.l + (i / (months.length - 1)) * chartW;
    const toY = (v: number) => pad.t + chartH - ((v - min) / (max - min)) * chartH;

    return (
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase" }}>
                    Loyalty Evolution — Last 6 Months
                </span>
                <div style={{ display: "flex", gap: 16 }}>
                    {series.map((s) => (
                        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, display: "inline-block" }} />
                            <span style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
                {/* Grid lines */}
                {[0, 200, 400].map((v) => (
                    <line
                        key={v}
                        x1={pad.l} x2={W - pad.r}
                        y1={toY(v)} y2={toY(v)}
                        stroke="#f3f4f6" strokeWidth={1}
                    />
                ))}
                {[0, 200, 400].map((v) => (
                    <text key={`lbl-${v}`} x={pad.l - 6} y={toY(v) + 4} fontSize={10} fill="#d1d5db" textAnchor="end">{v}</text>
                ))}
                {/* Series */}
                {series.map((s) => {
                    const pts = s.data.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
                    const areaBottom = toY(0);
                    const area = `${toX(0)},${areaBottom} ${pts} ${toX(s.data.length - 1)},${areaBottom}`;
                    return (
                        <g key={s.label}>
                            {!("dashed" in s && s.dashed) && (
                                <polygon points={area} fill={s.color} fillOpacity={0.07} />
                            )}
                            <polyline
                                points={pts}
                                fill="none"
                                stroke={s.color}
                                strokeWidth={2}
                                strokeDasharray={"dashed" in s && s.dashed ? "5 4" : undefined}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            {s.data.map((v, i) => (
                                <circle key={i} cx={toX(i)} cy={toY(v)} r={3.5} fill={s.color} />
                            ))}
                        </g>
                    );
                })}
                {/* X axis labels */}
                {months.map((m, i) => (
                    <text key={m} x={toX(i)} y={H - 4} fontSize={11} fill="#9ca3af" textAnchor="middle">{m}</text>
                ))}
            </svg>
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function LoyaltyDashboard() {
    const [tab] = useState("overview");

    const funnelBars = [
        { label: "At Risk", color: "#f59e0b", labelColor: "#d97706", labelBg: "#fffbeb", value: 23, change: "2 new", changeUp: null as boolean | null },
        { label: "New Client", color: "#6366f1", labelColor: "#4f46e5", labelBg: "#eef2ff", value: 8640, change: "3.2%", changeUp: true as boolean | null },
        { label: "Potential Loyal", color: "#8b5cf6", labelColor: "#7c3aed", labelBg: "#f5f3ff", value: 1980, change: "5.1%", changeUp: true as boolean | null },
        { label: "Loyal", color: "#10b981", labelColor: "#059669", labelBg: "#f0fdf4", value: 492, change: "4.7%", changeUp: true as boolean | null },
        { label: "Silver Loyal", color: "#eab308", labelColor: "#ca8a04", labelBg: "#fefce8", value: 224, change: "2.8%", changeUp: true as boolean | null },
        { label: "Gold Loyal", color: "#ef4444", labelColor: "#dc2626", labelBg: "#fef2f2", value: 88, change: "6.0%", changeUp: true as boolean | null },
    ];

    const tierMovements = [
        { guest: "M. García", from: "Potential" as TierBadgeProps["tier"], to: "Loyal" as TierBadgeProps["tier"], date: "07 Mar", driver: "4th visit" },
        { guest: "J. Williams", from: "Loyal" as TierBadgeProps["tier"], to: "VIP" as TierBadgeProps["tier"], date: "05 Mar", driver: "€ 2,400 spend" },
        { guest: "A. Chen", from: "VIP" as TierBadgeProps["tier"], to: "Super Loyal" as TierBadgeProps["tier"], date: "03 Mar", driver: "10th visit" },
        { guest: "R. Patel", from: "Loyal" as TierBadgeProps["tier"], to: "At Risk" as TierBadgeProps["tier"], date: "01 Mar", driver: "90 days no visit" },
        { guest: "S. Müller", from: "New" as TierBadgeProps["tier"], to: "Potential" as TierBadgeProps["tier"], date: "28 Feb", driver: "2nd visit" },
        { guest: "L. Martín", from: "Loyal" as TierBadgeProps["tier"], to: "At Risk" as TierBadgeProps["tier"], date: "24 Feb", driver: "75 days no visit" },
    ];

    const atRisk = [
        { guest: "R. Patel", tier: "Loyal" as TierBadgeProps["tier"], lastVisit: "01 Jan", inactive: 90, freq: 22, spend: "€ 1,840", action: "Contact", actionColor: "#6366f1" },
        { guest: "L. Martin", tier: "Loyal" as TierBadgeProps["tier"], lastVisit: "25 Jan", inactive: 45, freq: 18, spend: "€ 2,240", action: "Contact", actionColor: "#6366f1" },
        { guest: "H. Tanaka", tier: "VIP" as TierBadgeProps["tier"], lastVisit: "18 Jan", inactive: 52, freq: 14, spend: "€ 4,600", action: "Urgent", actionColor: "#ef4444" },
        { guest: "C. Dupont", tier: "Loyal" as TierBadgeProps["tier"], lastVisit: "10 Feb", inactive: 30, freq: 20, spend: "€ 980", action: "Monitor", actionColor: "#f59e0b" },
    ];

    const inactiveBadge = (days: number) => {
        const color = days >= 60 ? "#ef4444" : days >= 45 ? "#f97316" : "#f59e0b";
        return (
            <span style={{ background: `${color}18`, color, border: `1px solid ${color}40`, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>
                {days} days
            </span>
        );
    };

    return (
        <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", background: "#f9fafb", minHeight: "100vh", padding: 24 }}>
            {/* ── Top KPI Cards ── */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "stretch", height: 210 }}>
                <StatCard
                    label="Total Loyal+"
                    value="1,842"
                    sub="▲ +4.1% vs LM"
                    subColor="#10b981"
                    sparkData={[1500, 1560, 1600, 1650, 1700, 1750, 1842]}
                    sparkColor="#10b981"
                    rightSub="Loyal / VIP / Super"
                    xLabels={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
                    yLabels={["1,500", "2,000"]}
                />
                <StatCard
                    label="New Promotions"
                    value="48"
                    sub="▲ this month"
                    subColor="#10b981"
                    sparkData={[30, 32, 35, 38, 42, 45, 48]}
                    sparkColor="#818cf8"
                    rightLabel="Tier upgrade events"
                    xLabels={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
                    yLabels={["30", "50"]}
                />
                <StatCard
                    label="At Risk"
                    value="23"
                    sub="▲ Loyal – Risk"
                    subColor="#f59e0b"
                    sparkData={[18, 19, 21, 22, 23, 22, 23]}
                    sparkColor="#f59e0b"
                    rightLabel="Detect before they churn"
                    xLabels={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
                    yLabels={["15", "25"]}
                />
                <StatCard
                    label="Conversions LM"
                    value="112"
                    sub="New → Potential Loyal"
                    subColor="#6366f1"
                    sparkData={[80, 85, 90, 95, 100, 107, 112]}
                    sparkColor="#6366f1"
                    xLabels={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
                    yLabels={["80", "120"]}
                />
            </div>

            {/* ── Middle Row ── */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                {/* Loyalty Funnel */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "20px 24px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        flex: "0 0 560px",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase" }}>
                            Loyalty Funnel — Current Distribution
                        </span>
                        <span style={{ color: "#9ca3af", fontSize: 18 }}>→</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {funnelBars.map((b) => (
                            <FunnelBar key={b.label} {...b} max={8640} />
                        ))}
                    </div>
                </div>

                {/* Tier Movements */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: "20px 24px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                        flex: 1,
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase" }}>
                            Tier Movements — This Month
                        </span>
                        <span style={{ color: "#9ca3af", fontSize: 18 }}>→</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {["Guest", "From", "To", "Date", "Driver"].map((h) => (
                                    <th key={h} style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textAlign: "left", paddingBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tierMovements.map((row, i) => (
                                <tr key={i} style={{ borderTop: "1px solid #f3f4f6" }}>
                                    <td style={{ padding: "9px 0", fontSize: 13, fontWeight: 600, color: "#111827" }}>{row.guest}</td>
                                    <td style={{ padding: "9px 8px" }}><TierBadge tier={row.from} /></td>
                                    <td style={{ padding: "9px 8px" }}><TierBadge tier={row.to} /></td>
                                    <td style={{ padding: "9px 8px", fontSize: 12, color: "#6b7280" }}>{row.date}</td>
                                    <td style={{ padding: "9px 0", fontSize: 12, color: "#6b7280" }}>{row.driver}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── At Risk Table ── */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#f59e0b", textTransform: "uppercase" }}>
                        ⚠ At-Risk Loyal Clients — Action Required
                    </span>
                    <span style={{ color: "#9ca3af", fontSize: 18 }}>→</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Guest", "Tier", "Last Visit", "Days Inactive", "Avg Frequency", "Total Spend", "Action"].map((h) => (
                                <th key={h} style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textAlign: "left", paddingBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {atRisk.map((row, i) => (
                            <tr key={i} style={{ borderTop: "1px solid #f3f4f6" }}>
                                <td style={{ padding: "12px 0", fontSize: 13, fontWeight: 600, color: "#111827" }}>{row.guest}</td>
                                <td style={{ padding: "12px 8px" }}><TierBadge tier={row.tier} /></td>
                                <td style={{ padding: "12px 8px", fontSize: 13, color: "#6b7280" }}>{row.lastVisit}</td>
                                <td style={{ padding: "12px 8px" }}>{inactiveBadge(row.inactive)}</td>
                                <td style={{ padding: "12px 8px", fontSize: 13, color: "#6b7280" }}>{row.freq} days</td>
                                <td style={{ padding: "12px 8px", fontSize: 13, fontWeight: 600, color: "#111827" }}>{row.spend}</td>
                                <td style={{ padding: "12px 0" }}>
                                    <button
                                        style={{
                                            padding: "4px 14px",
                                            borderRadius: 20,
                                            border: `1px solid ${row.actionColor}`,
                                            background: "transparent",
                                            color: row.actionColor,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {row.action} →
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Evolution Chart ── */}
            <EvolutionChart />
        </div>
    );
}