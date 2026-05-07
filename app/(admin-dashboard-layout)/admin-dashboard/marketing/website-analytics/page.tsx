"use client";
import React from "react";

/* ─────────────────────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────────────────────── */
interface SparklineProps {
    points: number[];
    min: number;
    max: number;
    color: string;
    yLabels: string[];
    xLabels: string[];
}

function Sparkline({ points, min, max, color, yLabels, xLabels }: SparklineProps) {
    const W = 200, H = 72, padR = 40, padB = 14, padT = 4;
    const chartW = W - padR, chartH = H - padT - padB;
    const n = points.length;
    const xs = points.map((_, i) => (i / (n - 1)) * chartW);
    const ys = points.map((v) => padT + chartH - ((v - min) / (max - min)) * chartH);
    const linePts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
    const areaPts = [
        ...xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`),
        `${xs[n - 1].toFixed(1)},${(padT + chartH).toFixed(1)}`,
        `0,${(padT + chartH).toFixed(1)}`,
    ].join(" ");
    const gridYs = [padT, padT + chartH / 2, padT + chartH];
    // eslint-disable-next-line react-hooks/purity
    const uid = `sp${color.replace(/[^a-z0-9]/gi, "").slice(0, 6)}${Math.random().toString(36).slice(2, 5)}`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
            <defs>
                <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            {gridYs.map((gy, i) => (
                <line key={i} x1={0} y1={gy} x2={chartW} y2={gy} stroke="#eff0f5" strokeWidth={0.8} />
            ))}
            {yLabels.map((lbl, i) => (
                <text key={i} x={W - 2} y={gridYs[i] + 3.5} fontSize={7.5} fill="#c9ccd6" textAnchor="end">{lbl}</text>
            ))}
            <polygon points={areaPts} fill={`url(#${uid})`} />
            <polyline points={linePts} fill="none" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
            {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r={2.6} fill={color} />)}
            {xLabels.map((lbl, i) => (
                <text key={i} x={xs[i]} y={H - 1} fontSize={7.5} fill="#c9ccd6" textAnchor="middle">{lbl}</text>
            ))}
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────────────────────── */
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface KpiCardProps {
    label: string; value: string; delta: string; up: boolean; sub?: string;
    pts: number[]; min: number; max: number; color: string; yLbls: string[];
}

function KpiCard({ label, value, delta, up, sub, pts, min, max, color, yLbls }: KpiCardProps) {
    return (
        <div style={s.kpiCard}>
            <div style={s.cardHeader}>
                <span style={s.cardLabel}>{label}</span>
                <span style={s.arrow}>→</span>
            </div>
            <div style={s.kpiValue}>{value}</div>
            <div style={{ ...s.badge, background: up ? "#e8faf0" : "#fff4ed", color: up ? "#1a9c4e" : "#d45f1a" }}>
                {up ? "▲" : "▼"} {delta}
            </div>
            {sub && <div style={s.kpiSub}>{sub}</div>}
            <div style={{ marginTop: 8 }}>
                <Sparkline points={pts} min={min} max={max} color={color} yLabels={yLbls} xLabels={DAYS} />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   BAR CHART
───────────────────────────────────────────────────────────── */
const barData = [
    { day: "Mon", users: 900, sessions: 1400 },
    { day: "Tue", users: 1100, sessions: 2200 },
    { day: "Wed", users: 1000, sessions: 2000 },
    { day: "Thu", users: 1300, sessions: 2600 },
    { day: "Fri", users: 1200, sessions: 2400 },
    { day: "Sat", users: 1500, sessions: 3200 },
    { day: "Sun", users: 700, sessions: 2700 },
];

function BarChart() {
    const W = 660, H = 210, padL = 46, padB = 24, padR = 12, padT = 22;
    const chartW = W - padL - padR, chartH = H - padT - padB;
    const maxVal = 4000, yTicks = [0, 1000, 2000, 3000, 4000];
    const n = barData.length, slotW = chartW / n;
    const barW = slotW * 0.26, gap = 5;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
            {/* Legend top-right */}
            <circle cx={W - 170} cy={padT - 8} r={4} fill="#6366f1" />
            <text x={W - 162} y={padT - 4.5} fontSize={9} fill="#9ca3af">Users</text>
            <circle cx={W - 112} cy={padT - 8} r={4} fill="#c7d2fe" />
            <text x={W - 104} y={padT - 4.5} fontSize={9} fill="#9ca3af">Sessions</text>

            {/* Y grid + labels */}
            {yTicks.map((v) => {
                const y = padT + chartH - (v / maxVal) * chartH;
                return (
                    <g key={v}>
                        <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f0f1f6" strokeWidth={0.8} />
                        <text x={padL - 6} y={y + 3.5} fontSize={9} fill="#c9ccd6" textAnchor="end">
                            {v === 0 ? "0" : `${v / 1000},000`}
                        </text>
                    </g>
                );
            })}

            {/* Bars */}
            {barData.map((d, i) => {
                const cx = padL + i * slotW + slotW / 2;
                const sh = (d.sessions / maxVal) * chartH;
                const uh = (d.users / maxVal) * chartH;
                return (
                    <g key={d.day}>
                        <rect x={cx - barW - gap / 2} y={padT + chartH - sh} width={barW} height={sh} rx={3} fill="#c7d2fe" />
                        <rect x={cx + gap / 2} y={padT + chartH - uh} width={barW} height={uh} rx={3} fill="#6366f1" />
                        <text x={cx} y={H - 6} fontSize={9} fill="#b0b4c3" textAnchor="middle">{d.day}</text>
                    </g>
                );
            })}
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────
   WAVE CHART
───────────────────────────────────────────────────────────── */
const waveData = [
    { day: "Mon", avg: 4.0, bounce: 0.4 },
    { day: "Tue", avg: 2.4, bounce: 2.9 },
    { day: "Wed", avg: 3.6, bounce: 1.7 },
    { day: "Thu", avg: 2.0, bounce: 3.6 },
    { day: "Fri", avg: 3.2, bounce: 1.1 },
    { day: "Sat", avg: 4.2, bounce: 0.1 },
    { day: "Sun", avg: 3.1, bounce: 2.9 },
];

function smooth(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        d += ` C ${mx},${pts[i].y} ${mx},${pts[i + 1].y} ${pts[i + 1].x},${pts[i + 1].y}`;
    }
    return d;
}

function WaveChart() {
    const W = 660, H = 210, padL = 10, padR = 10, padT = 22, padB = 24;
    const chartW = W - padL - padR, chartH = H - padT - padB;
    const n = waveData.length, minV = 0, maxV = 4.5;
    const toY = (v: number) => padT + chartH - ((v - minV) / (maxV - minV)) * chartH;

    const avgPts = waveData.map((d, i) => ({ x: padL + (i / (n - 1)) * chartW, y: toY(d.avg) }));
    const bncPts = waveData.map((d, i) => ({ x: padL + (i / (n - 1)) * chartW, y: toY(d.bounce) }));
    const avgPath = smooth(avgPts);
    const bncPath = smooth(bncPts);
    const areaPath = avgPath + ` L ${avgPts[n - 1].x},${padT + chartH} L ${avgPts[0].x},${padT + chartH} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
            <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb923c" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
                </linearGradient>
            </defs>

            {/* Legend */}
            <circle cx={W - 232} cy={padT - 8} r={4} fill="#fb923c" />
            <text x={W - 224} y={padT - 4.5} fontSize={9} fill="#9ca3af">Avg Time (min)</text>
            <circle cx={W - 120} cy={padT - 8} r={4} fill="#ef4444" />
            <text x={W - 112} y={padT - 4.5} fontSize={9} fill="#9ca3af">Bounce Rate %</text>

            <path d={areaPath} fill="url(#wg)" />
            <path d={avgPath} fill="none" stroke="#fb923c" strokeWidth={2.2} />
            {avgPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#fb923c" />)}
            <path d={bncPath} fill="none" stroke="#ef4444" strokeWidth={2.2} />
            {bncPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#ef4444" />)}

            {waveData.map((d, i) => (
                <text key={i} x={padL + (i / (n - 1)) * chartW} y={H - 6} fontSize={9} fill="#b0b4c3" textAnchor="middle">{d.day}</text>
            ))}
        </svg>
    );
}

/* ─────────────────────────────────────────────────────────────
   LANGUAGE ROW
───────────────────────────────────────────────────────────── */
function LangRow({ code, name, pct, visits, color }: { code: string; name: string; pct: number; visits: string; color: string }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>
                    <span style={{ fontSize: 9, color: "#9ca3af", marginRight: 4 }}>{code}</span>{name}
                </span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{pct}% · {visits}</span>
            </div>
            <div style={{ height: 5, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────────────────────── */
export default function AnalyticsDashboard() {
    return (
        <div style={s.root}>

            {/* ROW 1 – KPI */}
            <div style={s.kpiRow}>
                <KpiCard label="SITE VISITS" value="14,820" delta="+18.3% vs LW" up sub="Users: 9,240"
                    pts={[10000, 10800, 11400, 12100, 13000, 14200, 14820]} min={5000} max={15000} color="#818cf8" yLbls={["15,000", "10,000", "5,000"]} />
                <KpiCard label="UNIQUE USERS" value="9,240" delta="+14.1% vs LW" up sub="New: 6,840 (74%)"
                    pts={[5000, 5800, 6800, 7400, 8200, 8800, 9240]} min={5000} max={10000} color="#818cf8" yLbls={["10,000", "7,500", "5,000"]} />
                <KpiCard label="AVG. TIME ON SITE" value="3m 48s" delta="+0.4% vs LW" up
                    pts={[3.0, 3.2, 3.4, 3.5, 3.6, 3.75, 3.8]} min={3.0} max={4.0} color="#fb923c" yLbls={["4.0", "3.5", "3.0"]} />
                <KpiCard label="BOUNCE RATE" value="42.1%" delta="-2.4pp vs LW" up={false}
                    pts={[47, 46.5, 46, 45.5, 44.5, 43.5, 42.1]} min={40} max={50} color="#f87171" yLbls={["50", "45", "40"]} />
                <KpiCard label="PAGES / SESSION" value="3.8" delta="+0.3 vs LW" up
                    pts={[3.0, 3.2, 3.4, 3.5, 3.6, 3.7, 3.8]} min={3.0} max={4.0} color="#34d399" yLbls={["4.0", "3.5", "3.0"]} />
            </div>

            {/* ROW 2 – Charts */}
            <div style={s.chartsRow}>
                <div style={s.chartCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>SITE VISITS BY USERS – DAILY</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <BarChart />
                </div>
                <div style={s.chartCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>AVG. TIME SPENT – DAILY (MIN)</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <WaveChart />
                </div>
            </div>

            {/* ROW 3 – Tables */}
            <div style={s.tablesRow}>
                {/* Country */}
                <div style={s.tableCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>VISITS BY COUNTRY</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>COUNTRY</th>
                                <th style={{ ...s.th, textAlign: "right" }}>VISITS</th>
                                <th style={{ ...s.th, textAlign: "right" }}>%</th>
                                <th style={{ ...s.th, textAlign: "right" }}>AVG TIME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { code: "ES", name: "Spain", v: "7,706", p: "52%", t: "4m 12s" },
                                { code: "GB", name: "UK", v: "2,668", p: "18%", t: "3m 58s" },
                                { code: "US", name: "USA", v: "1,778", p: "12%", t: "3m 22s" },
                                { code: "DE", name: "Germany", v: "1,186", p: "8%", t: "3m 44s" },
                                { code: "FR", name: "France", v: "742", p: "5%", t: "3m 15s" },
                                { code: "IT", name: "Italy", v: "446", p: "3%", t: "2m 58s" },
                                { code: "", name: "Other", v: "294", p: "2%", t: "2m 44s" },
                            ].map((r) => (
                                <tr key={r.name}>
                                    <td style={s.td}><span style={{ fontSize: 9, color: "#9ca3af", marginRight: 4 }}>{r.code}</span>{r.name}</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.v}</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.p}</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.t}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* City */}
                <div style={s.tableCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>VISITS BY CITY</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <table style={s.table}>
                        <thead>
                            <tr>
                                <th style={s.th}>CITY</th>
                                <th style={{ ...s.th, textAlign: "right" }}>VISITS</th>
                                <th style={{ ...s.th, textAlign: "right" }}>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: "Madrid", v: "5,420", p: "36.6%" },
                                { name: "London", v: "2,100", p: "14.2%" },
                                { name: "Barcelona", v: "1,480", p: "9.9%" },
                                { name: "New York", v: "920", p: "6.2%" },
                                { name: "Berlin", v: "740", p: "4.9%" },
                                { name: "Paris", v: "620", p: "4.2%" },
                                { name: "Dubai", v: "480", p: "3.2%" },
                                { name: "Other", v: "3,060", p: "20.6%" },
                            ].map((r) => (
                                <tr key={r.name}>
                                    <td style={s.td}>🏙 {r.name}</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.v}</td>
                                    <td style={{ ...s.td, textAlign: "right" }}>{r.p}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Language */}
                <div style={s.tableCard}>
                    <div style={s.cardHeader}>
                        <span style={s.cardLabel}>VISITS BY LANGUAGE</span>
                        <span style={s.arrow}>→</span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <LangRow code="ES" name="Spanish" pct={48} visits="7,114" color="#6366f1" />
                        <LangRow code="GB" name="English" pct={34} visits="5,039" color="#818cf8" />
                        <LangRow code="DE" name="German" pct={7} visits="1,037" color="#f97316" />
                        <LangRow code="FR" name="French" pct={5} visits="741" color="#22c55e" />
                        <LangRow code="IT" name="Italian" pct={3} visits="445" color="#06b6d4" />
                        <LangRow code="—" name="Other" pct={3} visits="444" color="#60a5fa" />
                    </div>
                </div>
            </div>

        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
    root: {
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        background: "#f4f5fb",
        minHeight: "100vh",
        padding: 16,
        boxSizing: "border-box",
    },
    kpiRow: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 12 },
    chartsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
    tablesRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
    kpiCard: { background: "#fff", borderRadius: 14, padding: "16px 16px 10px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    chartCard: { background: "#fff", borderRadius: 14, padding: "18px 18px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    tableCard: { background: "#fff", borderRadius: 14, padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    cardLabel: { fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", color: "#adb2c3", textTransform: "uppercase" },
    arrow: { fontSize: 13, color: "#d1d5db" },
    kpiValue: { fontSize: 30, fontWeight: 700, color: "#111827", letterSpacing: "-0.5px", lineHeight: 1.05, marginBottom: 6 },
    badge: { display: "inline-flex", alignItems: "center", borderRadius: 4, padding: "2px 6px", fontSize: 9.5, fontWeight: 700, marginBottom: 4 },
    kpiSub: { fontSize: 10, color: "#9ca3af", marginBottom: 4 },
    table: { width: "100%", borderCollapse: "collapse", marginTop: 4 },
    th: { fontSize: 9, fontWeight: 700, color: "#6366f1", letterSpacing: "0.07em", textTransform: "uppercase", paddingBottom: 8, textAlign: "left", borderBottom: "1px solid #f3f4f6" },
    td: { fontSize: 12, color: "#374151", padding: "8px 0", borderBottom: "1px solid #f9fafb" },
};