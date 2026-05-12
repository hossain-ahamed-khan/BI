"use client";
import React, { useMemo } from "react";
import { useRange } from "@/components/range-context";
import { useCustomerServiceData } from "@/hooks/use-metrics";

const teal = "#00C9A7";
const orange = "#FF6B35";
const tealLight = "#00C9A7";
const violet = "#845EC2";
const pink = "#FF6FA8";
const red = "#FF4D4D";
const gray = "#8A94A6";
const lightGray = "#F4F6FA";
const white = "#FFFFFF";
const dark = "#1A1D2E";
const cardBg = white;
const border = "#EAECF4";

// Simple Sparkline for KPIs (mock trends since API doesn't have them yet)
function Sparkline({ data, color }: { data: number[]; color: string }) {
    const chartW = 180, chartH = 30;
    const pad = { top: 5, right: 5, bottom: 5, left: 5 };
    const w = chartW + pad.left + pad.right;
    const h = chartH + pad.top + pad.bottom;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const pts = data.map((v, i) => [
        pad.left + (i / (data.length - 1)) * chartW,
        pad.top + chartH - ((v - min) / range) * chartH,
    ]);

    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");

    return (
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
            <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
            {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill={color} />
            ))}
        </svg>
    );
}

// KPI Card
function KpiCard({ label, value, sub, subColor, sparkData, sparkColor }: {
    label: string; value: string | number; sub: string; subColor: string;
    sparkData: number[]; sparkColor: string;
}) {
    return (
        <div style={{
            background: cardBg, borderRadius: 16, border: `1px solid ${border}`,
            padding: "20px 22px 14px", display: "flex", flexDirection: "column", gap: 6,
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)", flex: 1, minWidth: 0,
        }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: gray, textTransform: "uppercase" }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 300, color: dark, letterSpacing: -1, lineHeight: 1.1 }}>{value}</div>
            <div style={{
                display: "inline-flex", alignItems: "center", width: "fit-content",
                fontSize: 11, fontWeight: 700, color: subColor,
                background: `${subColor}10`, borderRadius: 999, padding: "2px 8px",
            }}>{sub}</div>
            <div style={{ marginTop: 8 }}>
                <Sparkline data={sparkData} color={sparkColor} />
            </div>
        </div>
    );
}

// Channel Card
function ChannelCard({ icon, name, sub, color, stats }: {
    icon: string; name: string; sub: string; color: string;
    stats: { label: string; value: string | number; color?: string }[];
}) {
    return (
        <div style={{
            background: cardBg, borderRadius: 16, border: `1px solid ${border}`,
            padding: "20px 22px 14px", flex: 1, minWidth: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: `1px solid ${lightGray}` }}>
                        <span style={{ fontSize: 12, color: gray }}>{s.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: s.color || dark }}>{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function SupportDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data, isLoading, error } = useCustomerServiceData(activeRange, customStart, customEnd);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Customer Service Data...</div>;
    if (error || !data) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data.</div>;

    const { summary, channels } = data;

    const phoneChannel = channels.find(c => c.channel === "Phone");
    const emailChannel = channels.find(c => c.channel === "Email/Web");
    const igChannel = channels.find(c => c.channel === "Instagram DM");

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            background: "#f8fafc", minHeight: "100vh", padding: 24,
            boxSizing: "border-box",
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Customer Service Performance</h1>
                <div style={{ fontSize: 11, color: '#64748b', background: '#fff', padding: '6px 12px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
                    Data period: <span style={{ fontWeight: 700, color: '#6366f1', textTransform: 'capitalize' }}>{activeRange}</span>
                </div>
            </div>

            {/* KPI Row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <KpiCard
                    label="Avg Response Time"
                    value={summary.avg_response_time || "N/A"}
                    sub="Overall speed"
                    subColor={tealLight}
                    sparkData={[22, 24, 21, 23, 20, 19, 18]}
                    sparkColor={tealLight}
                />
                <KpiCard
                    label="Resolution Rate"
                    value="89%"
                    sub="Fixed on first reply"
                    subColor={tealLight}
                    sparkData={[80, 83, 84, 85, 86, 88, 89]}
                    sparkColor={tealLight}
                />
                <KpiCard
                    label="Total Open Tickets"
                    value={summary.total_open_tickets || "0"}
                    sub="Pending action"
                    subColor="#f59e0b"
                    sparkData={[20, 18, 22, 16, 14, 15, 14]}
                    sparkColor="#f59e0b"
                />
                <KpiCard
                    label="Overall CSAT"
                    value={`${summary.overall_csat || '0'}/5`}
                    sub="Satisfaction score"
                    subColor={violet}
                    sparkData={[4.0, 4.1, 4.2, 4.1, 4.3, 4.3, 4.4]}
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
                    stats={[
                        { label: "Successful Interactions", value: phoneChannel?.total_successful_interactions || 0 },
                        { label: "Missed Interactions", value: phoneChannel?.missed_interactions || 0, color: red },
                        { label: "Avg response", value: phoneChannel?.avg_response_time || "N/A", color: tealLight },
                        { label: "Top topic", value: phoneChannel?.top_topic || "N/A" },
                        { label: "Sat. score (CSAT)", value: `${phoneChannel?.csat_score || 0}/5`, color: tealLight },
                    ]}
                />
                <ChannelCard
                    icon="✉️"
                    name="Email/Web"
                    sub="Intercom / Website"
                    color={tealLight}
                    stats={[
                        { label: "Successful Interactions", value: emailChannel?.total_successful_interactions || 0 },
                        { label: "Resolution Rate", value: emailChannel?.resolution_rate ? `${emailChannel.resolution_rate}%` : "0%", color: tealLight },
                        { label: "Avg response", value: emailChannel?.avg_response_time || "N/A" },
                        { label: "Top topic", value: emailChannel?.top_topic || "N/A" },
                        { label: "Sat. score (CSAT)", value: `${emailChannel?.csat_score || 0}/5`, color: tealLight },
                    ]}
                />
                <ChannelCard
                    icon="📸"
                    name="Instagram DM"
                    sub="Direct Message"
                    color={pink}
                    stats={[
                        { label: "Total Interactions", value: igChannel?.total_successful_interactions || 0 },
                        { label: "Avg response", value: igChannel?.avg_response_time || "N/A" },
                        { label: "Top topic", value: igChannel?.top_topic || "N/A" },
                        { label: "Sat. score (CSAT)", value: `${igChannel?.csat_score || 0}/5`, color: tealLight },
                    ]}
                />
            </div>

            {/* Placeholder for future detailed analysis */}
            <div style={{ background: white, borderRadius: 16, padding: 24, border: `1px solid ${border}`, textAlign: 'center', color: gray }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>Detailed Ticket Log & Sentiment Analysis arriving in next update.</p>
            </div>
        </div>
    );
}
