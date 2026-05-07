"use client";
import { useState } from "react";

const trendData = [12000, 11500, 12100, 11800, 12200, 12350, 12480];
const returningData = [2600, 2700, 2750, 2800, 2850, 2900, 2940];
const spendData = [270, 275, 280, 278, 282, 283, 284];
const newClientsData = [300, 320, 340, 360, 370, 385, 398];
const reservData = [60, 65, 70, 72, 75, 77, 78.4];

type LoyaltyTier = "At Risk" | "New Client" | "Potential Loyal" | "Loyal" | "Silver Loyal" | "Gold Loyal";

interface Client {
    name: string;
    phone: string;
    email: string;
    company: string;
    visits: number;
    totalSpend: string;
    spendPerVisit: string;
    loyaltyTier: LoyaltyTier;
    tags: string[];
}

const clients: Client[] = [
    { name: "R. Patel", phone: "+44 7800 654321", email: "r.patel@techcorp.io", company: "TechCorp", visits: 4, totalSpend: "1.840", spendPerVisit: "460", loyaltyTier: "At Risk", tags: ["Loyal – Risk", "Business dinners"] },
    { name: "H. Tanaka", phone: "+81 80 9876 5432", email: "h.tanaka@corp.jp", company: "Tanaka Holdings", visits: 7, totalSpend: "4.600", spendPerVisit: "657", loyaltyTier: "At Risk", tags: ["VIP", "Sake", "Corporate"] },
    { name: "Elena Sánchez", phone: "+34 699 123 456", email: "e.sanchez@corp.es", company: "—", visits: 2, totalSpend: "480", spendPerVisit: "240", loyaltyTier: "New Client", tags: ["First visit"] },
    { name: "Priya Wang", phone: "+1 646 555 0192", email: "priya.w@nyc.com", company: "—", visits: 1, totalSpend: "320", spendPerVisit: "320", loyaltyTier: "New Client", tags: ["Tourist"] },
    { name: "Sophie Laurent", phone: "+33 6 12 34 56 78", email: "s.laurent@paris.fr", company: "—", visits: 3, totalSpend: "780", spendPerVisit: "260", loyaltyTier: "Potential Loyal", tags: ["Weekend", "Groups"] },
    { name: "María García", phone: "+34 622 841 200", email: "m.garcia@gmail.com", company: "—", visits: 5, totalSpend: "1.240", spendPerVisit: "248", loyaltyTier: "Loyal", tags: ["Regular", "Cocktails", "Romance"] },
    { name: "Carlos Dupont", phone: "+33 6 98 76 54 32", email: "c.dupont@studio.fr", company: "Dupont Studio", visits: 4, totalSpend: "980", spendPerVisit: "245", loyaltyTier: "Loyal", tags: ["Design lover", "Date nights"] },
    { name: "Michael Koch", phone: "+49 151 23456789", email: "m.koch@tech.de", company: "Koch GmbH", visits: 6, totalSpend: "2.200", spendPerVisit: "367", loyaltyTier: "Loyal", tags: ["Wine enthusiast", "Groups"] },
    { name: "James Williams", phone: "+44 7911 123456", email: "j.williams@acme.co.uk", company: "Acme Group Ltd.", visits: 8, totalSpend: "3.840", spendPerVisit: "480", loyaltyTier: "Silver Loyal", tags: ["Champagne lover", "Large groups", "Allergy: shellfish"] },
    { name: "Akira Chen", phone: "+81 90 1234 5678", email: "akira.c@design.jp", company: "Koto Studio", visits: 11, totalSpend: "5.600", spendPerVisit: "509", loyaltyTier: "Gold Loyal", tags: ["VIP table", "Sake lover", "Corporate"] },
];

const tierStyles: Record<LoyaltyTier, { bg: string; text: string; border: string; icon?: string }> = {
    "At Risk": { bg: "#fff8e6", text: "#b45309", border: "#fcd34d", icon: "⚠" },
    "New Client": { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
    "Potential Loyal": { bg: "#faf5ff", text: "#7c3aed", border: "#c4b5fd" },
    "Loyal": { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
    "Silver Loyal": { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
    "Gold Loyal": { bg: "#fffbeb", text: "#b45309", border: "#fcd34d" },
};

const tagColors: Record<string, { bg: string; text: string }> = {
    "VIP": { bg: "#fef3c7", text: "#92400e" },
    "Corporate": { bg: "#e0f2fe", text: "#075985" },
    "First visit": { bg: "#f0fdf4", text: "#166534" },
    "Tourist": { bg: "#fdf4ff", text: "#7e22ce" },
    "Regular": { bg: "#f0fdf4", text: "#166534" },
    default: { bg: "#f1f5f9", text: "#475569" },
};

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function MiniChart({ data, color, gradientId }: { data: number[]; color: string; gradientId: string }) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Layout constants
    const W = 200, H = 80;
    const padL = 4, padR = 38, padT = 8, padB = 22;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const pts = data.map((v, i) => [
        padL + (i / (data.length - 1)) * chartW,
        padT + chartH - ((v - min) / range) * chartH,
    ]);

    const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
    const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(2)},${(padT + chartH).toFixed(2)} L${pts[0][0].toFixed(2)},${(padT + chartH).toFixed(2)} Z`;

    // Y-axis labels: 3 ticks (min, mid, max)
    const yTicks = [max, (max + min) / 2, min];
    const formatTick = (v: number) => v >= 1000 ? `${Math.round(v / 1000) * 1000 >= 1000 ? (v / 1000).toFixed(0) + "k" : v}` : Math.round(v).toString();
    // For the reference image style: show 3 right-side labels
    const tickLabels = [
        { y: padT, val: max },
        { y: padT + chartH / 2, val: (max + min) / 2 },
        { y: padT + chartH, val: min },
    ];

    return (
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", display: "block" }}>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
            </defs>

            {/* Shaded area */}
            <path d={areaPath} fill={`url(#${gradientId})`} />

            {/* Line */}
            <path d={linePath} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />

            {/* Dots */}
            {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill={color} />
            ))}

            {/* X-axis day labels */}
            {DAYS.map((d, i) => (
                <text
                    key={d}
                    x={padL + (i / (DAYS.length - 1)) * chartW}
                    y={H - 4}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#cbd5e1"
                    fontFamily="'DM Sans', sans-serif"
                >{d}</text>
            ))}

            {/* Y-axis labels (right side) */}
            {tickLabels.map((t, i) => (
                <text
                    key={i}
                    x={W - 2}
                    y={t.y + 3}
                    textAnchor="end"
                    fontSize={8.5}
                    fill="#cbd5e1"
                    fontFamily="'DM Sans', sans-serif"
                >{formatTick(t.val)}</text>
            ))}
        </svg>
    );
}

const filterTiers = ["All", "At Risk", "New Client", "Potential Loyal", "Loyal", "Silver Loyal", "Gold Loyal"] as const;
type FilterTier = typeof filterTiers[number];

const filterBadgeStyle: Record<string, { bg: string; text: string; border: string }> = {
    "At Risk": { bg: "#fff8e6", text: "#b45309", border: "#fcd34d" },
    "New Client": { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
    "Potential Loyal": { bg: "#faf5ff", text: "#7c3aed", border: "#c4b5fd" },
    "Loyal": { bg: "#f0fdf4", text: "#15803d", border: "#86efac" },
    "Silver Loyal": { bg: "#f8fafc", text: "#475569", border: "#cbd5e1" },
    "Gold Loyal": { bg: "#fffbeb", text: "#b45309", border: "#fcd34d" },
    "All": { bg: "#f1f5f9", text: "#334155", border: "#cbd5e1" },
};

export default function CRMDashboard() {
    const [activeFilter, setActiveFilter] = useState<FilterTier>("At Risk");
    const [search, setSearch] = useState("");

    const filtered = clients.filter((c) => {
        const matchTier = activeFilter === "All" || c.loyaltyTier === activeFilter;
        const matchSearch =
            !search ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search);
        return matchTier && matchSearch;
    });

    return (
        <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#f8f9fb", minHeight: "100vh", padding: "28px 32px", color: "#1e293b" }}>
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                    { label: "TOTAL CLIENTS", value: "12.480", badge: "▲ +3.2% vs LM", badgeColor: "#16a34a", data: trendData, color: "#818cf8", gradientId: "g1" },
                    { label: "RETURNING GUESTS", value: "2.940", badge: "▲ 23.6% rate", badgeColor: "#16a34a", data: returningData, color: "#818cf8", gradientId: "g2" },
                    { label: "AVG LIFETIME SPEND", value: "€ 284", sub: "per client", data: spendData, color: "#34d399", gradientId: "g3" },
                    { label: "NEW THIS MONTH", value: "398", badge: "▲ +12.4%", badgeColor: "#16a34a", data: newClientsData, color: "#fb923c", gradientId: "g4" },
                    { label: "RESERV. WITH SPEND", value: "78.4%", badge: "▲ +2.1pp vs LM", badgeColor: "#3b82f6", sub2: "9.784 of 12.480 records", data: reservData, color: "#818cf8", gradientId: "g5", right: "SEVENROOMS" },
                ].map((card, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "18px 20px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#94a3b8", textTransform: "uppercase" }}>{card.label}</span>
                            {card.right && <span style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.06em" }}>{card.right}</span>}
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 300, letterSpacing: "-0.02em", color: "#0f172a", lineHeight: 1.1 }}>{card.value}</div>
                        {card.sub && <div style={{ fontSize: 11, color: "#94a3b8" }}>{card.sub}</div>}
                        {card.badge && <div style={{ fontSize: 11, color: card.badgeColor, fontWeight: 600 }}>{card.badge}</div>}
                        {card.sub2 && <div style={{ fontSize: 10, color: "#94a3b8" }}>{card.sub2}</div>}
                        <div style={{ marginTop: 8 }}>
                            <MiniChart data={card.data} color={card.color} gradientId={card.gradientId} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search + Filters */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: "0 0 240px" }}>
                        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 14 }}>🔍</span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email, phone..."
                            style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#334155", background: "#f8fafc", outline: "none", boxSizing: "border-box" }}
                        />
                    </div>
                    {filterTiers.map((tier) => {
                        const active = activeFilter === tier;
                        const s = filterBadgeStyle[tier];
                        return (
                            <button
                                key={tier}
                                onClick={() => setActiveFilter(tier)}
                                style={{
                                    padding: "6px 14px",
                                    borderRadius: 20,
                                    fontSize: 13,
                                    fontWeight: active ? 600 : 500,
                                    border: `1.5px solid ${active ? s.border : "#e2e8f0"}`,
                                    background: active ? s.bg : "#fff",
                                    color: active ? s.text : "#64748b",
                                    cursor: "pointer",
                                    transition: "all 0.15s",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                }}
                            >
                                {tier === "At Risk" && <span style={{ fontSize: 12 }}>⚠</span>}
                                {tier}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Table */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                            {["FULL NAME", "PHONE", "EMAIL", "COMPANY", "VISITS", "TOTAL SPEND", "SPEND/VISIT", "LOYALTY TIER", "TAGS", ""].map((h) => (
                                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                                    {h}{h && h !== "" && ["FULL NAME", "VISITS", "TOTAL SPEND", "SPEND/VISIT"].includes(h) ? " ↕" : ""}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((client, i) => {
                            const ts = tierStyles[client.loyaltyTier];
                            return (
                                <tr key={i} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.1s" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "")}>
                                    <td style={{ padding: "13px 16px", fontWeight: 600, color: "#0f172a" }}>{client.name}</td>
                                    <td style={{ padding: "13px 16px", color: "#475569" }}>{client.phone}</td>
                                    <td style={{ padding: "13px 16px", color: "#475569" }}>{client.email}</td>
                                    <td style={{ padding: "13px 16px", color: "#475569" }}>{client.company}</td>
                                    <td style={{ padding: "13px 16px", color: "#475569" }}>{client.visits}</td>
                                    <td style={{ padding: "13px 16px", color: "#475569" }}>€ {client.totalSpend}</td>
                                    <td style={{ padding: "13px 16px", color: "#475569" }}>€ {client.spendPerVisit}</td>
                                    <td style={{ padding: "13px 16px" }}>
                                        <span style={{
                                            display: "inline-flex", alignItems: "center", gap: 4,
                                            padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                                            background: ts.bg, color: ts.text, border: `1.5px solid ${ts.border}`
                                        }}>
                                            {ts.icon && <span style={{ fontSize: 11 }}>{ts.icon}</span>}
                                            {client.loyaltyTier}
                                        </span>
                                    </td>
                                    <td style={{ padding: "13px 16px" }}>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                            {client.tags.map((tag) => {
                                                const tc = tagColors[tag] || tagColors.default;
                                                return (
                                                    <span key={tag} style={{ padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 500, background: tc.bg, color: tc.text }}>
                                                        {tag}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td style={{ padding: "13px 16px" }}>
                                        <button style={{ padding: "5px 12px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12, background: "#fff", color: "#475569", cursor: "pointer", whiteSpace: "nowrap" }}>
                                            View →
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
                        Show
                        <select style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "3px 6px", fontSize: 13 }}>
                            <option>25</option><option>50</option><option>100</option>
                        </select>
                        per page
                    </div>
                    <span style={{ fontSize: 13, color: "#64748b" }}>1–{filtered.length} of {filtered.length} clients</span>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button style={{ width: 28, height: 28, border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 14, color: "#94a3b8" }}>‹</button>
                        <button style={{ width: 28, height: 28, border: "1.5px solid #6366f1", borderRadius: 6, background: "#6366f1", cursor: "pointer", fontSize: 13, color: "#fff", fontWeight: 600 }}>1</button>
                        <button style={{ width: 28, height: 28, border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", cursor: "pointer", fontSize: 14, color: "#94a3b8" }}>›</button>
                    </div>
                </div>
            </div>
        </div>
    );
}