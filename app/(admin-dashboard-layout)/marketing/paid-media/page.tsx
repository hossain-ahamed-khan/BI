"use client";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────



interface ChannelRow {
    name: string;
    color: string;
    spend: string;
    impressions: string;
    clicks: string;
    ctr: string;
    ctrHighlight?: boolean;
    cpc: string;
    conv: number;
    cpa: string;
    cpaColor?: string;
    roas: string;
    roasColor?: string;
    valueGenerated: string;
}

interface ReservationRow {
    name: string;
    color: string;
    booked: number;
    assisted: number;
    cancelled: number;
    cancelRate: string;
    future: number;
}

interface ChannelCard {
    name: string;
    color: string;
    dotColor: string;
    spend: string;
    metrics: { label: string; value: string; highlight?: "green" | "amber" }[];
    barColor: string;
    bars: number[];
    maxBar: number;
    yLabels: string[];
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

interface SparklineConfig {
    color: string;
    trend?: "up" | "down";
    yRight: string[];   // 3 labels top→bottom on right axis
    yLeft?: string[];   // optional left axis labels
    data: number[];     // 7 values, 0–1 normalised
}

function Sparkline({ color, trend = "up", yRight, data }: SparklineConfig) {
    const W = 200;
    const H = 52;
    const PAD_L = 4;
    const PAD_R = 32;        // room for right-axis labels
    const PAD_T = 6;
    const PAD_B = 18;        // room for day labels
    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const chartW = W - PAD_L - PAD_R;
    const chartH = H - PAD_T - PAD_B;

    // map normalised data → svg coords
    const pts = data.map((v, i) => ({
        x: PAD_L + (i / (data.length - 1)) * chartW,
        y: PAD_T + (1 - v) * chartH,
    }));

    const polyPoints = pts.map(p => `${p.x},${p.y}`).join(" ");
    const fillD = `M${pts[0].x},${pts[0].y} ` +
        pts.slice(1).map(p => `L${p.x},${p.y}`).join(" ") +
        ` L${pts[pts.length - 1].x},${PAD_T + chartH} L${pts[0].x},${PAD_T + chartH} Z`;

    const gradId = `sg-${color.replace("#", "")}-${trend}`;

    // right-axis: 3 evenly spaced labels (top, mid, bottom of chart)
    const rightAxisYs = [PAD_T, PAD_T + chartH / 2, PAD_T + chartH];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 80 }} overflow="visible">
            <defs>
                <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>

            {/* filled area */}
            <path d={fillD} fill={`url(#${gradId})`} />

            {/* line */}
            <polyline
                points={polyPoints}
                fill="none"
                stroke={color}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* dots */}
            {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2.2" fill={color} />
            ))}

            {/* right y-axis labels */}
            {yRight.map((label, i) => (
                <text
                    key={i}
                    x={W - PAD_R + 4}
                    y={rightAxisYs[i] + 3}
                    fontSize="7"
                    fill="#9ca3af"
                    dominantBaseline="middle"
                >
                    {label}
                </text>
            ))}

            {/* x-axis day labels */}
            {days.map((d, i) => (
                <text
                    key={i}
                    x={PAD_L + (i / (days.length - 1)) * chartW}
                    y={H - 2}
                    fontSize="7"
                    fill="#9ca3af"
                    textAnchor="middle"
                >
                    {d}
                </text>
            ))}
        </svg>
    );
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

function BarChart({ bars, color, maxBar, yLabels }: { bars: number[]; color: string; maxBar: number; yLabels: string[] }) {
    const h = 110;
    const barW = 16;
    const gap = 6;
    const total = bars.length * (barW + gap) - gap;

    return (
        <svg viewBox={`0 0 ${total + 30} ${h + 20}`} style={{ width: "100%", height: 130 }}>
            {yLabels.map((label, i) => {
                const y = h - (i / (yLabels.length - 1)) * h;
                return (
                    <g key={i}>
                        <line x1={28} y1={y} x2={total + 30} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
                        <text x={24} y={y + 4} textAnchor="end" fontSize="8" fill="#9ca3af">{label}</text>
                    </g>
                );
            })}
            {bars.map((val, i) => {
                const barH = (val / maxBar) * h;
                const x = 30 + i * (barW + gap);
                const y = h - barH;
                return <rect key={i} x={x} y={y} width={barW} height={barH} rx="2" fill={color} />;
            })}
        </svg>
    );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
    label,
    value,
    badge,
    badgeUp,
    sub,
    sparkColor,
    sparkTrend,
    sparkData,
    sparkYRight,
}: {
    label: string;
    value: string;
    badge?: string;
    badgeUp?: boolean;
    sub?: string;
    sparkColor: string;
    sparkTrend?: "up" | "down";
    sparkData: number[];
    sparkYRight: string[];
}) {
    return (
        <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>{label}</div>
            <div style={styles.kpiValue}>{value}</div>
            {badge && (
                <div style={{ ...styles.badge, color: badgeUp ? "#16a34a" : "#dc2626" }}>
                    {badgeUp ? "▲" : "▼"} {badge}
                </div>
            )}
            {sub && <div style={styles.kpiSub}>{sub}</div>}
            <Sparkline color={sparkColor} trend={sparkTrend} data={sparkData} yRight={sparkYRight} />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdDashboard() {
    const [activeTab] = useState(0);

    const channelRows: ChannelRow[] = [
        {
            name: "Google Ads", color: "#3b82f6",
            spend: "€ 1,840", impressions: "84,200", clicks: "2,840",
            ctr: "3.37%", ctrHighlight: true, cpc: "€ 0.65",
            conv: 128, cpa: "€14.4", roas: "4.8×", roasColor: "#16a34a",
            valueGenerated: "€ 8,832",
        },
        {
            name: "Meta Ads", color: "#ef4444",
            spend: "€ 980", impressions: "98,400", clicks: "1,920",
            ctr: "1.95%", cpc: "€ 0.51",
            conv: 86, cpa: "€11.4", roas: "3.8×", roasColor: "#16a34a",
            valueGenerated: "€ 3,724",
        },
        {
            name: "TikTok Ads", color: "#111827",
            spend: "€ 420", impressions: "248,000", clicks: "1,240",
            ctr: "0.50%", cpc: "€ 0.34",
            conv: 24, cpa: "€17.5", cpaColor: "#dc2626", roas: "2.1×",
            valueGenerated: "€ 882",
        },
    ];

    const reservationRows: ReservationRow[] = [
        { name: "Google Ads", color: "#3b82f6", booked: 128, assisted: 44, cancelled: 11, cancelRate: "8.6%", future: 38 },
        { name: "Meta Ads", color: "#ef4444", booked: 86, assisted: 32, cancelled: 9, cancelRate: "10.5%", future: 22 },
        { name: "TikTok Ads", color: "#111827", booked: 24, assisted: 18, cancelled: 5, cancelRate: "20.8%", future: 6 },
    ];

    const channelCards: ChannelCard[] = [
        {
            name: "GOOGLE ADS", color: "#3b82f6", dotColor: "#3b82f6", spend: "€1,840",
            metrics: [
                { label: "IMPRESSIONS", value: "84,200" },
                { label: "CLICKS", value: "2,840" },
                { label: "CTR", value: "3.37%", highlight: "green" },
                { label: "CPC", value: "€ 0.65" },
                { label: "CONVERSIONS", value: "128", highlight: "green" },
                { label: "CPA", value: "€14.4", highlight: "green" },
            ],
            barColor: "#93c5fd",
            bars: [110, 130, 140, 170, 160, 150, 200],
            maxBar: 300, yLabels: ["€0", "€100", "€200", "€300"],
        },
        {
            name: "META ADS", color: "#ec4899", dotColor: "#ec4899", spend: "€980",
            metrics: [
                { label: "REACH", value: "42,100" },
                { label: "IMPRESSIONS", value: "98,400" },
                { label: "CPM", value: "€9.96" },
                { label: "CTR", value: "1.95%" },
                { label: "CONVERSIONS", value: "86", highlight: "green" },
                { label: "CPA", value: "€11.4", highlight: "green" },
            ],
            barColor: "#f472b6",
            bars: [55, 75, 60, 90, 75, 65, 105],
            maxBar: 150, yLabels: ["€0", "€50", "€100", "€150"],
        },
        {
            name: "TIKTOK ADS", color: "#111827", dotColor: "#111827", spend: "€420",
            metrics: [
                { label: "VIEWS", value: "248K" },
                { label: "LINK CLICKS", value: "1,240" },
                { label: "ENGAGEMENT", value: "4.2%" },
                { label: "CTR", value: "0.50%", highlight: "amber" },
                { label: "CONVERSIONS", value: "24", highlight: "amber" },
                { label: "CPA", value: "€17.5", highlight: "amber" },
            ],
            barColor: "#374151",
            bars: [28, 35, 38, 45, 42, 32, 38],
            maxBar: 60, yLabels: ["€0", "€20", "€40", "€60"],
        },
    ];

    return (
        <div style={styles.root}>
            {/* ── KPI Row ── */}
            <div style={styles.kpiRow}>
                <KpiCard label="TOTAL AD SPEND" value="€ 3,240" sub="YTD: € 18,420" sparkColor="#f59e0b" sparkTrend="up"
                    sparkData={[0.55, 0.58, 0.60, 0.63, 0.67, 0.72, 0.78]}
                    sparkYRight={["4,000", "3,000", "2,000"]} />
                <KpiCard label="TOTAL CONVERSIONS" value="238" badge="+8.2% vs LW" badgeUp sub="Reservations booked" sparkColor="#10b981" sparkTrend="up"
                    sparkData={[0.55, 0.60, 0.63, 0.67, 0.72, 0.78, 0.85]}
                    sparkYRight={["250", "200", "150"]} />
                <KpiCard label="BLENDED CPA" value="€13.61" badge="-1.4% vs LW" badgeUp={false} sub="Cost per reservation" sparkColor="#8b5cf6" sparkTrend="down"
                    sparkData={[0.85, 0.80, 0.75, 0.72, 0.68, 0.65, 0.60]}
                    sparkYRight={["20", "15", "10"]} />
                <KpiCard label="REVENUE GENERATED" value="€16,422" badge="+9.4% vs LW" badgeUp sub="ROAS 4.2× blended" sparkColor="#10b981" sparkTrend="up"
                    sparkData={[0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.82]}
                    sparkYRight={["5", "4", "3"]} />
                <KpiCard label="BLENDED CTR" value="2.84%" badge="+0.2pp vs LW" badgeUp sparkColor="#6366f1" sparkTrend="up"
                    sparkData={[0.55, 0.58, 0.60, 0.63, 0.65, 0.68, 0.72]}
                    sparkYRight={["3.0", "2.5", "2.0"]} />
            </div>

            {/* ── Channel Performance Table ── */}
            <div style={styles.card}>
                <div style={styles.tableHeader}>
                    <span style={styles.sectionTitle}>PAID MEDIA — CHANNEL PERFORMANCE</span>
                    <span style={styles.sectionSubRight}>AD SPEND &amp; MEDIA METRICS</span>
                </div>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thead}>
                            {["CHANNEL", "SPEND", "IMPRESSIONS", "CLICKS", "CTR", "CPC", "CONV.", "CPA", "ROAS", "VALUE GENERATED"].map(h => (
                                <th key={h} style={styles.th}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {channelRows.map((row) => (
                            <tr key={row.name} style={styles.tr}>
                                <td style={styles.td}>
                                    <span style={{ ...styles.dot, background: row.color }} />
                                    {row.name}
                                </td>
                                <td style={styles.td}>{row.spend}</td>
                                <td style={styles.td}>{row.impressions}</td>
                                <td style={styles.td}>{row.clicks}</td>
                                <td style={styles.td}>
                                    <span style={row.ctrHighlight ? styles.ctrBadge : undefined}>{row.ctr}</span>
                                </td>
                                <td style={styles.td}>{row.cpc}</td>
                                <td style={styles.td}>{row.conv}</td>
                                <td style={{ ...styles.td, color: row.cpaColor || "#16a34a", fontWeight: 600 }}>{row.cpa}</td>
                                <td style={{ ...styles.td, color: row.roasColor || "#374151", fontWeight: 600 }}>{row.roas}</td>
                                <td style={styles.td}>{row.valueGenerated}</td>
                            </tr>
                        ))}
                        <tr style={{ ...styles.tr, fontWeight: 700, borderTop: "1.5px solid #e5e7eb" }}>
                            <td style={styles.td}>Total</td>
                            <td style={styles.td}>€ 3,240</td>
                            <td style={styles.td}>430,600</td>
                            <td style={styles.td}>6,000</td>
                            <td style={styles.td}>1.39%</td>
                            <td style={styles.td}>€ 0.54</td>
                            <td style={styles.td}>238</td>
                            <td style={styles.td}>€13.6</td>
                            <td style={styles.td}>4.2×</td>
                            <td style={styles.td}>€ 13,438</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ── Reservation Performance Table ── */}
            <div style={styles.card}>
                <div style={styles.tableHeader}>
                    <div>
                        <span style={styles.sectionTitle}>RESERVATION PERFORMANCE BY CHANNEL</span>
                        <div style={styles.tableMeta}>
                            Cross-referenced SevenRooms + UTM attribution &nbsp;
                            <span style={{ color: "#3b82f6", textDecoration: "underline" }}>SevenRooms data</span>
                        </div>
                    </div>
                    <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "right" }}>
                        Conv. = direct booking from ad click &nbsp;|&nbsp; Assisted = booking within 7-day click window
                    </div>
                </div>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thead}>
                            <th style={styles.th}>CHANNEL</th>
                            <th style={{ ...styles.th, color: "#16a34a" }}>BOOKED</th>
                            <th style={styles.th}>ASSISTED</th>
                            <th style={{ ...styles.th, color: "#dc2626" }}>CANCELLED</th>
                            <th style={{ ...styles.th, color: "#dc2626" }}>CANCEL. RATE</th>
                            <th style={{ ...styles.th, color: "#6366f1" }}>FUTURE RESERV.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservationRows.map((row) => (
                            <tr key={row.name} style={styles.tr}>
                                <td style={styles.td}><span style={{ ...styles.dot, background: row.color }} />{row.name}</td>
                                <td style={{ ...styles.td, color: "#16a34a", fontWeight: 600 }}>{row.booked}</td>
                                <td style={styles.td}>{row.assisted}</td>
                                <td style={{ ...styles.td, color: "#dc2626", fontWeight: 600 }}>{row.cancelled}</td>
                                <td style={{ ...styles.td, color: "#dc2626" }}>{row.cancelRate}</td>
                                <td style={{ ...styles.td, color: "#6366f1", fontWeight: 600 }}>{row.future}</td>
                            </tr>
                        ))}
                        <tr style={{ ...styles.tr, fontWeight: 700, borderTop: "1.5px solid #e5e7eb" }}>
                            <td style={styles.td}>Total</td>
                            <td style={{ ...styles.td, color: "#16a34a", fontWeight: 700 }}>238</td>
                            <td style={styles.td}>94</td>
                            <td style={{ ...styles.td, color: "#dc2626", fontWeight: 700 }}>25</td>
                            <td style={{ ...styles.td, color: "#dc2626" }}>10.5%</td>
                            <td style={{ ...styles.td, color: "#6366f1", fontWeight: 700 }}>66</td>
                        </tr>
                    </tbody>
                </table>
                <div style={styles.legend}>
                    <span><span style={{ color: "#16a34a", fontWeight: 600 }}>Confirmed</span> — reservation attended or upcoming, attributed directly to ad click</span>
                    <span><span style={{ color: "#6366f1", fontWeight: 600 }}>Assisted</span> — booking within 7-day post-click window (view-through)</span>
                    <span><span style={{ color: "#dc2626", fontWeight: 600 }}>Cancel. rate</span> — vs total confirmed reservations per channel</span>
                </div>
            </div>

            {/* ── Per-Channel Cards ── */}
            <div style={styles.channelCardsRow}>
                {channelCards.map((card) => (
                    <div key={card.name} style={{ ...styles.channelCard, borderTopColor: card.color }}>
                        <div style={styles.channelCardHeader}>
                            <span style={{ ...styles.channelDot, background: card.dotColor }} />
                            <span style={styles.channelCardLabel}>{card.name}</span>
                        </div>
                        <div style={styles.channelSpend}>{card.spend}</div>
                        <div style={styles.channelSubLabel}>Spend this week</div>
                        <div style={styles.metricsGrid}>
                            {card.metrics.map((m) => (
                                <div key={m.label} style={styles.metricCell}>
                                    <div style={styles.metricLabel}>{m.label}</div>
                                    <div style={{
                                        ...styles.metricValue,
                                        color: m.highlight === "green" ? "#16a34a" : m.highlight === "amber" ? "#d97706" : "#111827",
                                    }}>{m.value}</div>
                                </div>
                            ))}
                        </div>
                        <BarChart bars={card.bars} color={card.barColor} maxBar={card.maxBar} yLabels={card.yLabels} />
                        <div style={styles.dayLabels}>
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                                <span key={d} style={styles.dayLabel}>{d}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    root: {
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        color: "#111827",
    },
    kpiRow: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 16,
    },
    kpiCard: {
        background: "#fff",
        borderRadius: 12,
        padding: "16px 18px 8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
    kpiLabel: {
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: "#6b7280",
        textTransform: "uppercase",
        marginBottom: 4,
    },
    kpiValue: {
        fontSize: 30,
        fontWeight: 300,
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        marginBottom: 4,
    },
    badge: {
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 2,
    },
    kpiSub: {
        fontSize: 10,
        color: "#9ca3af",
        marginBottom: 4,
    },
    card: {
        background: "#fff",
        borderRadius: 12,
        padding: "18px 20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: "#374151",
        textTransform: "uppercase",
    },
    sectionSubRight: {
        fontSize: 9,
        color: "#9ca3af",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
    },
    tableMeta: {
        fontSize: 10,
        color: "#9ca3af",
        marginTop: 2,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 13,
    },
    thead: {
        borderBottom: "1px solid #e5e7eb",
    },
    th: {
        textAlign: "left" as const,
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: "#9ca3af",
        textTransform: "uppercase" as const,
        paddingBottom: 8,
        paddingRight: 12,
        whiteSpace: "nowrap" as const,
    },
    tr: {
        borderBottom: "1px solid #f3f4f6",
    },
    td: {
        padding: "10px 12px 10px 0",
        fontSize: 13,
        color: "#374151",
        whiteSpace: "nowrap" as const,
        verticalAlign: "middle" as const,
    },
    dot: {
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        marginRight: 8,
        flexShrink: 0,
    },
    ctrBadge: {
        background: "#dcfce7",
        color: "#16a34a",
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 20,
        fontSize: 12,
    },
    legend: {
        display: "flex",
        gap: 20,
        marginTop: 12,
        flexWrap: "wrap" as const,
        fontSize: 10,
        color: "#6b7280",
    },
    channelCardsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
    },
    channelCard: {
        background: "#fff",
        borderRadius: 12,
        padding: "16px 18px 12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        borderTop: "3px solid transparent",
    },
    channelCardHeader: {
        display: "flex",
        alignItems: "center",
        marginBottom: 10,
    },
    channelDot: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        display: "inline-block",
        marginRight: 8,
    },
    channelCardLabel: {
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.1em",
        color: "#6b7280",
        textTransform: "uppercase" as const,
    },
    channelSpend: {
        fontSize: 32,
        fontWeight: 300,
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
    },
    channelSubLabel: {
        fontSize: 10,
        color: "#9ca3af",
        marginBottom: 14,
    },
    metricsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px 12px",
        marginBottom: 14,
    },
    metricCell: {
        background: "#f9fafb",
        borderRadius: 8,
        padding: "8px 10px",
    },
    metricLabel: {
        fontSize: 8,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: "#9ca3af",
        textTransform: "uppercase" as const,
        marginBottom: 3,
    },
    metricValue: {
        fontSize: 16,
        fontWeight: 600,
    },
    dayLabels: {
        display: "flex",
        justifyContent: "space-around",
        paddingLeft: 30,
        marginTop: 4,
    },
    dayLabel: {
        fontSize: 9,
        color: "#9ca3af",
        flex: 1,
        textAlign: "center" as const,
    },
};