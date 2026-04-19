"use client";
import { useState } from "react";

type Tab = "reviews" | "negative" | "social";

// Clean sparkline — no dots, right-side y-axis labels, day labels at bottom
const Sparkline = ({
    points,
    color,
    fill = false,
    yLabels,
    gridCount = 0,
}: {
    points: string;
    color: string;
    fill?: boolean;
    yLabels?: string[];
    gridCount?: number;
}) => {
    // Chart area: x 0–140, y 8–52 (leaving room for labels)
    const W = 155; // extra right margin for y-axis labels
    const H = 62;
    const chartRight = 130;
    const chartBottom = 52;
    const chartTop = 8;

    // Build fill polygon closing at bottom of chart area
    const ptArr = points.trim().split(" ").map((p) => p.split(",").map(Number));
    const firstX = ptArr[0][0];
    const lastX = ptArr[ptArr.length - 1][0];
    const fillPoly = points + ` ${lastX},${chartBottom} ${firstX},${chartBottom}`;

    // Grid lines (evenly spaced between chartTop and chartBottom)
    const gridLines = gridCount > 0
        ? Array.from({ length: gridCount }, (_, i) =>
            chartTop + (i * (chartBottom - chartTop)) / (gridCount - 1)
        )
        : [];

    return (
        <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="w-full mt-2" style={{ height: 62 }}>
            {/* Grid lines */}
            {gridLines.map((gy, i) => (
                <line key={i} x1="0" y1={gy} x2={chartRight} y2={gy} stroke="#ececec" strokeWidth="1" />
            ))}

            {/* Fill area */}
            {fill && (
                <polygon points={fillPoly} fill={`${color}1a`} />
            )}

            {/* Line */}
            <polyline points={points} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />

            {/* Y-axis labels on right */}
            {yLabels && gridLines.map((gy, i) => (
                <text key={i} x={chartRight + 4} y={gy + 3} fontSize="7.5" fill="#ccc" textAnchor="start">
                    {yLabels[i]}
                </text>
            ))}

            {/* Day labels */}
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d, i) => (
                <text key={d} x={i * (chartRight / 6)} y={H - 1} fontSize="7.5" fill="#ccc" textAnchor="middle">
                    {d}
                </text>
            ))}
        </svg>
    );
};

// Total Reviews sparkline — purple line with dots, 3 horizontal grid lines, right-side y-axis (100/200/300)
const TotalReviewsSparkline = () => {
    const W = 155;
    const H = 62;
    const chartRight = 130;
    const chartBottom = 52;
    const chartTop = 8;
    // 3 grid lines at 300 (top), 200 (mid), 100 (bottom)
    const gridYs = [chartTop, (chartTop + chartBottom) / 2, chartBottom];
    const yLabels = ["300", "200", "100"];
    // data points scaled: 300→top(8), 100→bottom(52)
    const raw = [220, 240, 230, 250, 260, 245, 270, 280];
    const scale = (v: number) => chartBottom - ((v - 100) / 200) * (chartBottom - chartTop);
    const xs = raw.map((_, i) => i * (chartRight / (raw.length - 1)));
    const pts = raw.map((v, i) => `${xs[i]},${scale(v)}`).join(" ");

    return (
        <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="w-full mt-2" style={{ height: 62 }}>
            {gridYs.map((gy, i) => (
                <line key={i} x1="0" y1={gy} x2={chartRight} y2={gy} stroke="#ececec" strokeWidth="1" />
            ))}
            <polyline points={pts} stroke="#9b8df8" strokeWidth="1.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {raw.map((v, i) => (
                <circle key={i} cx={xs[i]} cy={scale(v)} r="2.5" fill="#fff" stroke="#9b8df8" strokeWidth="1.5" />
            ))}
            {gridYs.map((gy, i) => (
                <text key={i} x={chartRight + 4} y={gy + 3} fontSize="7.5" fill="#ccc" textAnchor="start">{yLabels[i]}</text>
            ))}
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d, i) => (
                <text key={d} x={i * (chartRight / 6)} y={H - 1} fontSize="7.5" fill="#ccc" textAnchor="middle">{d}</text>
            ))}
        </svg>
    );
};

const RatingBars = () => {
    const bars = [
        { star: "5★", pct: 68, color: "#22a06b" },
        { star: "4★", pct: 20, color: "#86c765" },
        { star: "3★", pct: 6, color: "#f5a623" },
        { star: "2★", pct: 4, color: "#f07d58" },
        { star: "1★", pct: 2, color: "#e5534b" },
    ];
    return (
        <div className="mt-2 space-y-1">
            {bars.map(({ star, pct, color }) => (
                <div key={star} className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 w-5">{star}</span>
                    <div className="flex-1 bg-gray-100 rounded h-1.5">
                        <div className="h-1.5 rounded" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-[10px] text-gray-300 w-7 text-right">{pct}%</span>
                </div>
            ))}
        </div>
    );
};

const StatCard = ({
    label,
    value,
    sub,
    badge,
    badgeColor,
    secondary,
    children,
}: {
    label: string;
    value: string;
    sub?: string;
    badge?: string;
    badgeColor?: "green" | "red" | "orange";
    secondary?: string;
    children?: React.ReactNode;
}) => {
    const badgeStyles: Record<string, string> = {
        green: "text-emerald-600 bg-emerald-50",
        red: "text-red-500 bg-red-50",
        orange: "text-amber-600 bg-amber-50",
    };
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm flex-1 min-w-0">
            <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">{label}</div>
            <div
                className="text-3xl font-bold leading-none"
                style={{ color: badgeColor === "red" ? "#e5534b" : badgeColor === "orange" ? "#f5a623" : "#111" }}
            >
                {value}
            </div>
            {badge && (
                <div className="mt-1">
                    <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${badgeStyles[badgeColor || "green"]}`}>
                        {badge}
                    </span>
                </div>
            )}
            {secondary && <div className="text-[11px] text-gray-400 mt-1">{secondary}</div>}
            {sub && <div className="text-[11px] text-gray-400 mt-1">{sub}</div>}
            {children}
        </div>
    );
};

// ─── REVIEWS TAB ────────────────────────────────────────────────────────────

const reviews = [
    {
        name: "James Williams",
        stars: 5,
        source: "GOOGLE",
        responded: true,
        text: "Exceptional experience from start to finish. The Black Cod was perfectly prepared and the service was impeccable. Will definitely return.",
        date: "08 Mar 2026",
        venue: "El Comedor · Night",
    },
    {
        name: "Maria Garcia",
        stars: 5,
        source: "SEVENROOMS",
        responded: true,
        text: "The Jacqueline Signature cocktail alone is worth the visit. Atmosphere is incredible, staff very attentive. Perfect for our anniversary.",
        date: "07 Mar 2026",
        venue: "Private Club · Night",
    },
    {
        name: "Akira Chen",
        stars: 5,
        source: "SEVENROOMS",
        responded: true,
        text: "Best corporate dinner venue in Barcelona. VIP table service was flawless. Don Julio pairing was inspired. Will bring clients again.",
        date: "06 Mar 2026",
        venue: "Private Club · Night",
    },
];

const ReviewsTab = () => {
    const [activeFilter, setActiveFilter] = useState("All ★");
    const filters = ["All ★", "★★★★★", "★★★★", "★★★", "★★", "★"];
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
                <input
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-400 w-40 outline-none"
                    placeholder="🔍 Search reviews..."
                />
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`border rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${activeFilter === f
                            ? "bg-gray-900 text-white border-gray-900"
                            : "border-gray-200 text-gray-500 hover:text-gray-900"
                            }`}
                    >
                        {f}
                    </button>
                ))}
                <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600 bg-white outline-none">
                    <option>All Sources</option>
                    <option>Google</option>
                    <option>SevenRooms</option>
                </select>
                <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600 bg-white outline-none">
                    <option>All Status</option>
                    <option>Responded</option>
                    <option>Pending</option>
                </select>
                <span className="ml-auto text-xs text-gray-300">10 reviews</span>
            </div>
            <div>
                {reviews.map((r) => (
                    <div key={r.name} className="border-t border-gray-100 py-4 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-900">{r.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-gray-400 font-semibold tracking-wider">{r.source}</span>
                                {r.responded && (
                                    <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                                        ● Responded
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-amber-400 text-sm tracking-wider">{"★".repeat(r.stars)}</div>
                        <div className="text-[13px] text-gray-500 leading-relaxed">&quot;{r.text}&quot;</div>
                        <div className="flex gap-2 mt-1">
                            <span className="bg-gray-100 text-gray-500 rounded-md px-2.5 py-0.5 text-[11px]">{r.date}</span>
                            <span className="bg-gray-100 text-gray-500 rounded-md px-2.5 py-0.5 text-[11px]">{r.venue}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── NEGATIVE ANALYSIS TAB ──────────────────────────────────────────────────

const foodItems = [
    { rank: 1, name: "Mariscada (Seafood Platter)", cat: "Seafood", res: 8, avg: 1.9, signal: "High", complaint: "Cold on arrival · Long wait after starter" },
    { rank: 2, name: "Wagyu Steak", cat: "Food Mains", res: 5, avg: 2.2, signal: "High", complaint: "Portion size vs price expectation" },
    { rank: 3, name: "Black Cod Jacqueline", cat: "Food Mains", res: 4, avg: 2.4, signal: "Med", complaint: "Inconsistent preparation · Sauce" },
    { rank: 4, name: "Ceviche", cat: "Food Starters", res: 3, avg: 2.6, signal: "Med", complaint: "Citrus balance · Temperature" },
    { rank: 5, name: "Truffle Pasta", cat: "Food Mains", res: 3, avg: 2.5, signal: "Med", complaint: "Truffle intensity · Portion" },
    { rank: 6, name: "Foie Gras", cat: "Food Starters", res: 2, avg: 2.8, signal: "Low", complaint: "Portion size · Accompaniment" },
    { rank: 7, name: "Oysters G.", cat: "Food Starters", res: 2, avg: 2.3, signal: "Low", complaint: "Freshness concern" },
    { rank: 8, name: "Steak Tartare", cat: "Food Mains", res: 2, avg: 2.7, signal: "Low", complaint: "Seasoning · Presentation" },
    { rank: 9, name: "Burrata", cat: "Food Starters", res: 1, avg: 2.8, signal: "Low", complaint: "Quality inconsistency" },
    { rank: 10, name: "Tuna Tataki", cat: "Food Mains", res: 1, avg: 2.8, signal: "Low", complaint: "Searing level · Texture" },
];

const issues = [
    { name: "Service / Wait Time", pct: 42, color: "#e5534b" },
    { name: "Food Temperature", pct: 28, color: "#f5a623" },
    { name: "Portion vs Price", pct: 16, color: "#f5c842" },
    { name: "Reservation Mgmt", pct: 10, color: "#9b8df8" },
    { name: "Noise Level", pct: 4, color: "#ccc" },
];

const SignalBadge = ({ signal }: { signal: string }) => {
    const styles: Record<string, string> = {
        High: "text-red-500",
        Med: "text-amber-500",
        Low: "text-gray-400",
    };
    return <span className={`text-[11px] font-bold ${styles[signal]}`}>● {signal}</span>;
};

const NegativeTab = () => (
    <div className="space-y-3.5">
        {/* Top row */}
        <div className="grid grid-cols-2 gap-3.5">
            {/* Rating Evolution */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-3">Rating Evolution</div>
                <svg viewBox="0 0 460 120" fill="none" className="w-full h-28">
                    {[10, 28, 46, 64, 82, 100].map((y) => (
                        <line key={y} x1="20" y1={y} x2="460" y2={y} stroke="#f0f0f0" strokeWidth="1" />
                    ))}
                    {["5.0", "4.8", "4.6", "4.4", "4.2", "4.0"].map((l, i) => (
                        <text key={l} x="0" y={14 + i * 18} fontSize="9" fill="#bbb">{l}</text>
                    ))}
                    <polyline points="20,70 85,68 150,65 215,60 280,55 345,50 410,47 460,44" stroke="#9b8df8" strokeWidth="2" fill="none" />
                    {[20, 85, 150, 215, 280, 345, 410].map((x, i) => (
                        <circle key={i} cx={x} cy={[70, 68, 65, 60, 55, 50, 47][i]} r="3" fill="#9b8df8" />
                    ))}
                    <polyline points="20,84 85,83 150,82 215,78 280,74 345,68 410,62 460,56" stroke="#f5a067" strokeWidth="2" fill="none" />
                    {[20, 85, 150, 215, 280, 345, 410].map((x, i) => (
                        <circle key={i} cx={x} cy={[84, 83, 82, 78, 74, 68, 62][i]} r="3" fill="#f5a067" />
                    ))}
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, i) => (
                        <text key={m} x={16 + i * 66} y="116" fontSize="9" fill="#bbb">{m}</text>
                    ))}
                    <circle cx="260" cy="8" r="4" fill="#9b8df8" />
                    <text x="268" y="12" fontSize="9" fill="#666">SevenRooms</text>
                    <circle cx="340" cy="8" r="4" fill="#f5a067" />
                    <text x="348" y="12" fontSize="9" fill="#666">Google</text>
                </svg>
            </div>
            {/* Top Issues */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-4">Top Issues in Negative Reviews</div>
                <div className="space-y-3">
                    {issues.map(({ name, pct, color }) => (
                        <div key={name} className="flex items-center gap-3">
                            <div className="w-32 text-xs text-gray-500">{name}</div>
                            <div className="flex-1 bg-gray-100 rounded h-2">
                                <div className="h-2 rounded" style={{ width: `${pct}%`, background: color }} />
                            </div>
                            <div className="w-8 text-right text-xs text-gray-500 font-semibold">{pct}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Mid row: food table + negatives by source */}
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "1fr 280px" }}>
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">Negative Food Match – Products in Low-Food-Rated Bills</div>
                <div className="text-[10px] text-gray-300 mb-4">
                    <span className="bg-blue-50 text-blue-500 font-semibold rounded px-1.5 py-0.5 mr-2">SEVENROOMS</span>
                    Food rating ≤3★ · Items ordered in those reservations · Excludes service &amp; ambiance scores
                </div>
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr>
                            {["Food Item (from Bill)", "Category", "Reservations", "Avg Food ★", "Signal", "Recurring Complaint"].map((h) => (
                                <th key={h} className="text-left text-[10px] uppercase tracking-wider text-gray-300 font-semibold pb-2 border-b border-gray-100 px-2">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.map((item) => (
                            <tr key={item.rank} className="border-b border-gray-50">
                                <td className="px-2 py-2 font-medium text-gray-800">{item.rank}. {item.name}</td>
                                <td className="px-2 py-2"><span className="bg-gray-100 text-gray-500 rounded px-2 py-0.5 text-[11px]">{item.cat}</span></td>
                                <td className="px-2 py-2 text-gray-500">
                                    <span className="inline-block h-1.5 rounded mr-1" style={{ width: `${item.res * 5}px`, background: item.signal === "High" ? "#e5534b" : "#f5a623", verticalAlign: "middle" }} />
                                    {item.res}
                                </td>
                                <td className="px-2 py-2 text-gray-700 font-semibold">★ {item.avg}</td>
                                <td className="px-2 py-2"><SignalBadge signal={item.signal} /></td>
                                <td className="px-2 py-2 text-gray-400">{item.complaint}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Negatives by Source */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-[10px] tracking-widest text-gray-400 uppercase mb-3">Negatives by Source</div>
                <svg viewBox="0 0 220 160" fill="none" className="w-full h-40">
                    <line x1="30" y1="10" x2="30" y2="130" stroke="#f0f0f0" strokeWidth="1" />
                    <line x1="30" y1="130" x2="210" y2="130" stroke="#f0f0f0" strokeWidth="1" />
                    {[["40", 40, "90", "#e5534b"], ["75", 65, "65", "#f07d58"], ["110", 80, "50", "#f5a067"], ["145", 95, "35", "#f5b88a"], ["180", 108, "22", "#fad3bb"]].map(([x, y, h, c], i) => (
                        <rect key={i} x={x} y={y} width="25" height={h} rx="4" fill={c as string} />
                    ))}
                    {["6", "4", "2", "0"].map((l, i) => (
                        <text key={l} x="0" y={45 + i * 30} fontSize="8" fill="#bbb">{l}</text>
                    ))}
                    {[["36", "🇬🇧 UK"], ["70", "🇫🇷 FR"], ["105", "🇩🇪 DE"], ["140", "🇺🇸 US"], ["177", "🇪🇸 ES"]].map(([x, l]) => (
                        <text key={l} x={x} y="148" fontSize="8" fill="#bbb">{l}</text>
                    ))}
                </svg>
            </div>
        </div>

        {/* Pattern Detection */}
        <div className="grid grid-cols-3 gap-3.5">
            <div className="rounded-xl p-4 bg-red-50 border border-red-100">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-red-700">🔴 Mariscada</span>
                    <span className="text-xs font-bold text-red-700">8 mentions</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Keywords: cold, wait time, late delivery<br />
                    Shift: Fri–Sat Night · 21h–23h<br />
                    Countries: 🇬🇧 UK (3) · 🇫🇷 FR (2) · 🇩🇪 DE (2) · 🇺🇸 US (1)
                </div>
            </div>
            <div className="rounded-xl p-4 bg-amber-50 border border-amber-100">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-amber-700">🟡 Service Speed</span>
                    <span className="text-xs font-bold text-amber-700">6 mentions</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Keywords: slow, waited, 35–45 min<br />
                    Shift: Saturday Night · Full occupancy<br />
                    Countries: 🇬🇧 UK (4) · 🇪🇸 ES (2)
                </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "#fdf4f8", border: "1px solid #f5d0e5" }}>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-sm" style={{ color: "#9b3066" }}>🔺 Wagyu Steak</span>
                    <span className="text-xs font-bold" style={{ color: "#9b3066" }}>3 mentions</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Keywords: portion size, price ratio<br />
                    All from 🇺🇸 US guests<br />
                    Likely cultural expectation gap
                </div>
            </div>
        </div>
    </div>
);

// ─── SOCIAL MONITORING TAB ──────────────────────────────────────────────────

const socialCards = [
    {
        type: "Negative comment — Instagram",
        icon: "⚠️",
        tone: "negative",
        text: '@user_thomas_h: "Just left @jacquelinebar — waited 45min for the seafood platter 🦐 not what I expected for this price range. #disappointed"',
        date: "8 Mar 2026 · 23:14",
        match: "Thomas H. · #0441",
        matchColor: "#9b59b6",
        action: { label: "View Profile →", style: "default" },
    },
    {
        type: "Viral post — neutral/mixed",
        icon: "⚡",
        tone: "neutral",
        text: '@food_bcn: "The vibe at @jacquelinebar is 🔥 but the mariscada needs work imo. Drinks were 10/10 though. #barcelona #food"',
        date: "6 Mar 2026 · 3.2K likes",
        match: null,
        noMatch: true,
        action: { label: "Monitor →", style: "monitor" },
    },
    {
        type: "Positive mention — Instagram",
        icon: "✔️",
        tone: "positive",
        text: '@lifestyle_mag_bcn: "If you haven\'t been to @jacquelinebar you\'re missing out. Best cocktail bar in Barcelona hands down 🌟"',
        date: "5 Mar 2026 · 12.4K likes",
        likes: "● 12.4K likes",
        match: null,
        action: null,
    },
    {
        type: "Service complaint — Instagram DM",
        icon: "⚠️",
        tone: "negative",
        text: '@sophie_l_paris: "My reservation was double-booked on Saturday and we were left waiting 20 min with no explanation from staff."',
        date: "1 Mar 2026",
        match: "Sophie Laurent · #0412",
        matchColor: "#9b59b6",
        action: { label: "Respond →", style: "respond" },
    },
];

const toneStyles: Record<string, string> = {
    negative: "bg-red-50 border border-red-100",
    positive: "bg-emerald-50 border border-emerald-100",
    neutral: "bg-amber-50 border border-amber-100",
};
const toneTextStyles: Record<string, string> = {
    negative: "text-red-600",
    positive: "text-emerald-600",
    neutral: "text-amber-600",
};
const actionStyles: Record<string, string> = {
    default: "border-gray-200 text-gray-500",
    respond: "border-red-300 text-red-500",
    monitor: "border-amber-300 text-amber-600",
};

const SocialTab = () => (
    <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-xs text-gray-400 mr-1">Monitoring:</span>
            {["@jacquelinebar", "#jacqueline", "#jacquelinebcn"].map((k) => (
                <span key={k} className="bg-gray-100 text-gray-500 rounded-md px-2.5 py-1 text-xs font-medium">{k}</span>
            ))}
            <button className="ml-auto border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 bg-white">+ Add keyword</button>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
            {socialCards.map((card) => (
                <div key={card.type} className={`rounded-xl p-4 ${toneStyles[card.tone]}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{card.icon}</span>
                        <span className={`font-bold text-[13px] ${toneTextStyles[card.tone]}`}>{card.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{card.text}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-gray-400">{card.date}</span>
                        {card.likes && <span className="text-[11px] text-emerald-500 font-semibold">{card.likes}</span>}
                        {card.match && (
                            <span className="bg-gray-100 rounded px-2 py-0.5 text-[11px] text-gray-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: card.matchColor }} />
                                Matched: {card.match}
                            </span>
                        )}
                        {card.noMatch && (
                            <span className="bg-gray-100 rounded px-2 py-0.5 text-[11px] text-gray-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block" />No match
                            </span>
                        )}
                        {card.action && (
                            <button className={`border rounded-md px-2.5 py-0.5 text-[11px] font-semibold bg-white ml-auto ${actionStyles[card.action.style]}`}>
                                {card.action.label}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────────────

export default function RestaurantDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("reviews");

    return (
        <div className="p-5 bg-gray-100 min-h-screen" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            <div className="w-100% mx-auto space-y-4">

                {/* STAT CARDS */}
                <div className="flex gap-3.5">
                    <StatCard label="Avg Rating" value="4.7/5" badge="▲ +0.2 vs LM" badgeColor="green">
                        <RatingBars />
                    </StatCard>
                    <StatCard label="Total Reviews" value="284" sub="Last 30 days">
                        <TotalReviewsSparkline />
                    </StatCard>
                    <StatCard label="Negative Reviews" value="18" badge="6.3% of total" badgeColor="red">
                        <Sparkline
                            points="0,20 21.7,18 43.3,23 65,21 86.7,26 108.3,23 130,22"
                            color="#e5534b"
                            fill
                            yLabels={["25", "20", "15"]}
                            gridCount={3}
                        />
                    </StatCard>
                    <StatCard label="Response Rate" value="78%" badge="▲ +4pp vs LM" badgeColor="green" secondary="14 pending reply">
                        <Sparkline
                            points="0,38 21.7,34 43.3,30 65,28 86.7,24 108.3,28 130,22"
                            color="#22a06b"
                        />
                    </StatCard>
                    <StatCard label="Social Alerts" value="7" badge="⚠ Unreviewed" badgeColor="orange">
                        <Sparkline
                            points="0,10 21.7,16 43.3,13 65,20 86.7,16 108.3,19 130,18"
                            color="#f5a623"
                            yLabels={["10", "8", "6", "4"]}
                            gridCount={4}
                        />
                    </StatCard>
                </div>

                {/* TABS */}
                <div className="flex gap-1">
                    {(["reviews", "negative", "social"] as Tab[]).map((tab) => {
                        const labels: Record<Tab, string> = {
                            reviews: "Reviews",
                            negative: "Negative Analysis",
                            social: "Social Monitoring",
                        };
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${activeTab === tab
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "text-gray-500 border-transparent hover:text-gray-900"
                                    }`}
                            >
                                {labels[tab]}
                            </button>
                        );
                    })}
                </div>

                {/* TAB CONTENT */}
                {activeTab === "reviews" && <ReviewsTab />}
                {activeTab === "negative" && <NegativeTab />}
                {activeTab === "social" && <SocialTab />}
            </div>
        </div>
    );
}