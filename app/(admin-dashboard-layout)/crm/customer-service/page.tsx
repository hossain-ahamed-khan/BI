"use client";
import { useId } from "react";

const teal = "#00C9A7";
const orange = "#FF6B35";
const amber = "#F7B731";
const violet = "#845EC2";
const pink = "#FF6FA8";
const red = "#FF4D4D";
const green = "#00C9A7";
const gray = "#8A94A6";
const lightGray = "#F4F6FA";
const white = "#FFFFFF";
const dark = "#1A1D2E";
const cardBg = white;
const border = "#EAECF4";

// Sparkline component
function Sparkline({
    data,
    color,
    filled = true,
    dayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
}: {
    data: number[];
    color: string;
    filled?: boolean;
    dayLabels?: string[];
}) {
    const gradientId = useId();
    const chartW = 178;
    const chartH = 28;
    const pad = { top: 8, right: 30, bottom: 18, left: 6 };
    const w = chartW + pad.left + pad.right;
    const h = chartH + pad.top + pad.bottom;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const pts = data.map((v, i) => {
        const x = pad.left + ((data.length === 1 ? 0 : i / (data.length - 1)) * chartW);
        const y = pad.top + (chartH - ((v - min) / range) * chartH);
        return [x, y];
    });

    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
    const fillPath = `${path} L${pad.left + chartW},${pad.top + chartH} L${pad.left},${pad.top + chartH} Z`;

    const ticks = [max, min + range / 2, min].map((v) => Number(v.toFixed(1)));
    const yPos = (value: number) => pad.top + (chartH - ((value - min) / range) * chartH);

    return (
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: "block" }}>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.24" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.04" />
                </linearGradient>
            </defs>

            {ticks.map((t) => (
                <line
                    key={t}
                    x1={pad.left}
                    x2={pad.left + chartW}
                    y1={yPos(t)}
                    y2={yPos(t)}
                    stroke={border}
                    strokeWidth={1}
                />
            ))}

            {filled && <path d={fillPath} fill={`url(#${gradientId})`} />}
            <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

            {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={2.6} fill={color} stroke={white} strokeWidth={1.2} />
            ))}

            {dayLabels.slice(0, data.length).map((day, i) => {
                const x = pad.left + ((data.length === 1 ? 0 : i / (data.length - 1)) * chartW);
                return (
                    <text
                        key={day + i}
                        x={x}
                        y={h - 2}
                        textAnchor="middle"
                        style={{ fontSize: 9, fill: "#B5BCC9", fontWeight: 600 }}
                    >
                        {day}
                    </text>
                );
            })}

            {ticks.map((t, i) => (
                <text
                    key={`${t}-${i}`}
                    x={w - 2}
                    y={yPos(t) + 3}
                    textAnchor="end"
                    style={{ fontSize: 9, fill: "#B5BCC9", fontWeight: 600 }}
                >
                    {t.toFixed(1)}
                </text>
            ))}
        </svg>
    );
}

// KPI Card
function KpiCard({ label, value, sub, subColor, sparkData, sparkColor }: {
    label: string; value: string; sub: string; subColor: string;
    sparkData: number[]; sparkColor: string;
}) {
    const [mainValue, tailValue] = value.split(" ");

    return (
        <div style={{
            background: cardBg, borderRadius: 16, border: `1px solid ${border}`,
            padding: "20px 22px 14px", display: "flex", flexDirection: "column", gap: 6,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)", flex: 1, minWidth: 0,
        }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: gray, textTransform: "uppercase" }}>{label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2, lineHeight: 1.1 }}>
                <span style={{ fontSize: 32, fontWeight: 300, color: dark, letterSpacing: -1 }}>{mainValue}</span>
                {tailValue && <span style={{ fontSize: 34, fontWeight: 500, color: dark }}>{tailValue}</span>}
            </div>
            <div style={{
                display: "inline-flex", alignItems: "center", width: "fit-content",
                fontSize: 11, fontWeight: 700, color: subColor,
                background: `${subColor}1F`, borderRadius: 999, padding: "4px 8px",
            }}>{sub}</div>
            <div style={{ marginTop: 2, background: "#F9FBFF", borderRadius: 10, padding: "8px 8px 2px" }}>
                <Sparkline data={sparkData} color={sparkColor} />
            </div>
        </div>
    );
}

// Mini bar chart
function MiniBar({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 74, marginTop: 12 }}>
            {data.map((v, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{
                        background: `${color}20`, borderRadius: 6, width: "100%", height: 56,
                        display: "flex", alignItems: "flex-end", overflow: "hidden",
                    }}>
                        <div style={{
                            background: color, borderRadius: 6, width: "100%",
                            height: `${(v / max) * 56}px`, transition: "height 0.3s",
                            opacity: 0.88,
                        }} />
                    </div>
                    <div style={{ fontSize: 9, color: "#B5BCC9", marginTop: 3, fontWeight: 600 }}>{days[i]}</div>
                </div>
            ))}
        </div>
    );
}

// Stat Row
function StatRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${border}` }}>
            <span style={{ fontSize: 12, color: gray }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: valueColor || dark }}>{value}</span>
        </div>
    );
}

// Channel Card
function ChannelCard({ icon, name, sub, color, stats, barData }: {
    icon: string; name: string; sub: string; color: string;
    stats: { label: string; value: string; color?: string }[];
    barData: number[];
}) {
    return (
        <div style={{
            background: cardBg, borderRadius: 16, border: `1px solid ${border}`,
            padding: "20px 22px 14px", flex: 1, minWidth: 0,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 10, background: `${color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18,
                }}>{icon}</div>
                <div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: dark }}>{name}</div>
                    <div style={{ fontSize: 10, color: gray, letterSpacing: 1, textTransform: "uppercase" }}>{sub}</div>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {stats.map((s) => (
                    <StatRow key={s.label} label={s.label} value={s.value} valueColor={s.color} />
                ))}
            </div>
            <MiniBar data={barData} color={color} />
        </div>
    );
}

// Horizontal bar chart for avg response time
function ResponseTimeBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
                width: 36, height: 120, background: `${color}20`,
                borderRadius: 8, transition: "height 0.4s",
                display: "flex", alignItems: "flex-end", overflow: "hidden",
            }}>
                <div style={{
                    width: 36, height: `${(value / max) * 120}px`, background: color,
                    borderRadius: 8, transition: "height 0.4s",
                }} />
            </div>
            <span style={{ fontSize: 11, color: "#B5BCC9", fontWeight: 600 }}>{label}</span>
        </div>
    );
}

// Ticket row
function TicketRow({ num, subject, channel, age, ageColor, priority, priorityColor }: {
    num: string; subject: string; channel: string;
    age: string; ageColor: string; priority: string; priorityColor: string;
}) {
    return (
        <tr style={{ borderBottom: `1px solid ${border}` }}>
            <td style={{ padding: "9px 10px", fontSize: 11, color: gray }}>{num}</td>
            <td style={{ padding: "9px 10px", fontSize: 12, fontWeight: 600, color: dark }}>{subject}</td>
            <td style={{ padding: "9px 10px", fontSize: 11, color: gray }}>{channel}</td>
            <td style={{ padding: "9px 10px" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: ageColor }}>{age}</span>
            </td>
            <td style={{ padding: "9px 10px" }}>
                <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                    background: `${priorityColor}18`, color: priorityColor,
                }}>{priority}</span>
            </td>
        </tr>
    );
}

export default function SupportDashboard() {
    const sparkBase = [22, 24, 21, 23, 20, 19, 18];
    const sparkUp = [80, 83, 84, 85, 86, 88, 89];
    const sparkTickets = [20, 18, 22, 16, 14, 15, 14];
    const sparkSat = [4.0, 4.1, 4.2, 4.1, 4.3, 4.3, 4.4];

    const phoneBar = [32, 28, 38, 35, 40, 36, 22];
    const emailBar = [18, 24, 20, 28, 22, 15, 10];
    const igBar = [8, 10, 9, 12, 13, 11, 6];

    return (
        <div style={{
            fontFamily: "'DM Sans', 'Nunito', sans-serif",
            background: lightGray, minHeight: "100vh", padding: 24,
            boxSizing: "border-box",
        }}>

            {/* KPI Row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <KpiCard
                    label="Avg Response Time"
                    value="1h 48m"
                    sub="▲ -12min vs LW"
                    subColor={green}
                    sparkData={sparkBase}
                    sparkColor={teal}
                />
                <KpiCard
                    label="Resolution Rate"
                    value="89%"
                    sub="▲ +2% vs LW"
                    subColor={green}
                    sparkData={sparkUp}
                    sparkColor={teal}
                />
                <KpiCard
                    label="Total Open Tickets"
                    value="14"
                    sub="Pending"
                    subColor={amber}
                    sparkData={sparkTickets}
                    sparkColor={amber}
                />
                <KpiCard
                    label="Customer Sat. Score"
                    value="4.4/5"
                    sub="▲ +0.3 vs LM"
                    subColor={green}
                    sparkData={sparkSat}
                    sparkColor={violet}
                />
            </div>

            {/* Channel Cards */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <ChannelCard
                    icon="📞"
                    name="Phone"
                    sub="Aircall"
                    color={orange}
                    barData={phoneBar}
                    stats={[
                        { label: "Total calls", value: "284" },
                        { label: "Answered", value: "92% · 261", color: green },
                        { label: "Missed", value: "22", color: red },
                        { label: "Avg duration", value: "3m 42s" },
                        { label: "Avg response", value: "< 10 sec", color: teal },
                        { label: "Peak hour", value: "19:00–21:00" },
                        { label: "Sat. score (CSAT)", value: "4.6/5", color: teal },
                    ]}
                />
                <ChannelCard
                    icon="✉️"
                    name="Email"
                    sub="Intercom"
                    color={teal}
                    barData={emailBar}
                    stats={[
                        { label: "Total emails", value: "148" },
                        { label: "Resolved", value: "88% · 130", color: green },
                        { label: "Open", value: "14", color: amber },
                        { label: "Avg first response", value: "2h 14m", color: amber },
                        { label: "Avg resolution", value: "5h 40m" },
                        { label: "Top topic", value: "Reservation change" },
                        { label: "Sat. score (CSAT)", value: "4.3/5", color: teal },
                    ]}
                />
                <ChannelCard
                    icon="📸"
                    name="Instagram DM"
                    sub="Direct Message"
                    color={pink}
                    barData={igBar}
                    stats={[
                        { label: "Total DMs", value: "63" },
                        { label: "Responded", value: "84% · 53", color: green },
                        { label: "Unanswered", value: "10", color: red },
                        { label: "Avg response", value: "4h 22m", color: amber },
                        { label: "Top topic", value: "Reservation inquiry" },
                        { label: "Complaint DMs", value: "7", color: red },
                        { label: "Sat. score (CSAT)", value: "4.0/5", color: teal },
                    ]}
                />
            </div>

            {/* Bottom Row */}
            <div style={{ display: "flex", gap: 16 }}>
                {/* Avg Response Time by Channel */}
                <div style={{
                    background: cardBg, borderRadius: 16, border: `1px solid ${border}`,
                    padding: "20px 22px", flex: 1, boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: gray, textTransform: "uppercase", marginBottom: 16 }}>
                        Avg Response Time by Channel
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 40, height: 140 }}>
                        <ResponseTimeBar label="Phone" value={10} max={300} color={violet} />
                        <ResponseTimeBar label="Email" value={134} max={300} color={orange} />
                        <ResponseTimeBar label="Instagram DM" value={262} max={300} color={pink} />
                    </div>
                </div>

                {/* Open Tickets */}
                <div style={{
                    background: cardBg, borderRadius: 16, border: `1px solid ${border}`,
                    padding: "20px 22px", flex: 2, boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: gray, textTransform: "uppercase", marginBottom: 12 }}>
                        Open Tickets — By Channel & Age
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: `2px solid ${border}` }}>
                                {["#", "Subject", "Channel", "Age", "Priority"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "6px 10px", fontSize: 10, fontWeight: 700, color: gray, letterSpacing: 0.8, textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <TicketRow num="T-048" subject="Reservation change Sat 14" channel="Email" age="3 days" ageColor={red} priority="High" priorityColor={red} />
                            <TicketRow num="T-049" subject="Complaint mariscada" channel="Instagram" age="2 days" ageColor={red} priority="High" priorityColor={red} />
                            <TicketRow num="T-050" subject="Allergy info request" channel="Email" age="1 day" ageColor={amber} priority="Medium" priorityColor={amber} />
                            <TicketRow num="T-051" subject="VIP table request" channel="Phone" age="2h" ageColor={green} priority="Low" priorityColor={gray} />
                            <TicketRow num="T-052" subject="Lost item report" channel="Instagram" age="4h" ageColor={green} priority="Medium" priorityColor={amber} />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}