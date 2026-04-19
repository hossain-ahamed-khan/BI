"use client";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Category = "Bar" | "Food" | "Wine" | "Champagne" | "Spirits";
type SortKey = "product" | "unitsSold" | "grossRevenue" | "netRevenue";
type SortDir = "asc" | "desc";

interface Product {
    name: string;
    category: Category;
    unitsSold: number;
    grossRevenue: number;
    netRevenue: number;
}

// ── Data ───────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
    { name: "Jacqueline Signature", category: "Bar", unitsSold: 900, grossRevenue: 13500, netRevenue: 11880 },
    { name: "Spicy Margarita", category: "Bar", unitsSold: 750, grossRevenue: 11250, netRevenue: 9900 },
    { name: "Pornstar Martini", category: "Bar", unitsSold: 620, grossRevenue: 9300, netRevenue: 8184 },
    { name: "Black Cod Jac.", category: "Food", unitsSold: 520, grossRevenue: 10400, netRevenue: 9152 },
    { name: "Truffle Pasta", category: "Food", unitsSold: 480, grossRevenue: 8200, netRevenue: 7216 },
    { name: "Negroni", category: "Bar", unitsSold: 450, grossRevenue: 6750, netRevenue: 5940 },
    { name: "Ceviche", category: "Food", unitsSold: 415, grossRevenue: 6225, netRevenue: 5478 },
    { name: "Espresso Martini", category: "Bar", unitsSold: 405, grossRevenue: 6075, netRevenue: 5346 },
    { name: "Paloma Rosa", category: "Bar", unitsSold: 380, grossRevenue: 5700, netRevenue: 5016 },
    { name: "Steak Tartare", category: "Food", unitsSold: 370, grossRevenue: 9000, netRevenue: 7920 },
    { name: "Oysters G.", category: "Food", unitsSold: 325, grossRevenue: 7800, netRevenue: 6864 },
    { name: "Old Fashioned", category: "Bar", unitsSold: 320, grossRevenue: 4800, netRevenue: 4224 },
    { name: "Tuna Tataki", category: "Food", unitsSold: 265, grossRevenue: 5300, netRevenue: 4664 },
    { name: "Burrata", category: "Food", unitsSold: 240, grossRevenue: 3360, netRevenue: 2957 },
    { name: "Foie Gras", category: "Food", unitsSold: 210, grossRevenue: 6300, netRevenue: 5544 },
    { name: "Wagyu Steak", category: "Food", unitsSold: 180, grossRevenue: 9000, netRevenue: 7920 },
    { name: "Vega Sicilia Único", category: "Wine", unitsSold: 36, grossRevenue: 9000, netRevenue: 7920 },
    { name: "Ruinart Blanc", category: "Champagne", unitsSold: 30, grossRevenue: 7500, netRevenue: 6600 },
    { name: "Dom Pérignon 2015", category: "Champagne", unitsSold: 24, grossRevenue: 12000, netRevenue: 10560 },
    { name: "Don Julio 1942", category: "Spirits", unitsSold: 18, grossRevenue: 14400, netRevenue: 12672 },
];

// ── Sparkline helpers ──────────────────────────────────────────────────────
interface SparklineProps {
    points: [number, number][];   // [x, y] in viewBox coords (0-200, 0-48)
    color: string;
    gradientId: string;
    labels?: { right: string[]; bottom: string[] };
}

function Sparkline({ points, color, gradientId, labels }: SparklineProps) {
    const d = points.map((p, i) => `${i === 0 ? "M" : "C"}${p[0]},${p[1]}`).join(" ");

    // Build smooth path
    const pathD = points.reduce((acc, p, i) => {
        if (i === 0) return `M${p[0]},${p[1]}`;
        const prev = points[i - 1];
        const cx1 = prev[0] + (p[0] - prev[0]) / 2;
        const cy1 = prev[1];
        const cx2 = prev[0] + (p[0] - prev[0]) / 2;
        const cy2 = p[1];
        return `${acc} C${cx1},${cy1} ${cx2},${cy2} ${p[0]},${p[1]}`;
    }, "");

    const areaD =
        pathD +
        ` L${points[points.length - 1][0]},48 L${points[0][0]},48 Z`;

    return (
        <svg
            viewBox="0 0 200 48"
            preserveAspectRatio="none"
            style={{ width: "100%", height: 48, overflow: "visible", display: "block" }}
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#${gradientId})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth={1.8} />
            {points.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={color} />
            ))}
            {labels?.right.map((label, i) => (
                <text
                    key={i}
                    x={196}
                    y={8 + i * 14}
                    fontSize={9}
                    fill="#9ca3af"
                    textAnchor="end"
                >
                    {label}
                </text>
            ))}
            {labels?.bottom.map((label, i) => (
                <text
                    key={i}
                    x={[0, 35, 72, 108, 142, 170, 192][i]}
                    y={48}
                    fontSize={9}
                    fill="#c4c4d0"
                >
                    {label}
                </text>
            ))}
        </svg>
    );
}

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// ── KPI Card ───────────────────────────────────────────────────────────────
interface KpiCardProps {
    label: string;
    value: string;
    badge?: { text: string; variant: "green" | "gray" };
    sparkPoints: [number, number][];
    color: string;
    gradientId: string;
    rightLabels: string[];
}

const BADGE: Record<string, React.CSSProperties> = {
    green: { background: "#e6f9f0", color: "#16a34a" },
    gray: { background: "#f3f4f6", color: "#6b7280" },
};

function KpiCard({ label, value, badge, sparkPoints, color, gradientId, rightLabels }: KpiCardProps) {
    return (
        <div style={{
            background: "#fff",
            borderRadius: 16,
            padding: "20px 22px 14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            flex: 1,
            minWidth: 0,
        }}>
            <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9b9bae", fontWeight: 600, marginBottom: 6 }}>
                {label}
            </div>
            <div style={{ fontSize: label === "Top Category" ? 22 : 28, fontWeight: 700, color: "#18181b", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                {value}
            </div>
            {badge && (
                <div style={{ marginTop: 6 }}>
                    <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
                        ...BADGE[badge.variant],
                    }}>
                        {badge.text}
                    </span>
                </div>
            )}
            <div style={{ marginTop: 10 }}>
                <Sparkline
                    points={sparkPoints}
                    color={color}
                    gradientId={gradientId}
                    labels={{ right: rightLabels, bottom: DAYS }}
                />
            </div>
        </div>
    );
}

// ── Category Pill ──────────────────────────────────────────────────────────
const CAT_STYLES: Record<Category, React.CSSProperties> = {
    Bar: { background: "#ede9fe", color: "#6d28d9" },
    Food: { background: "#fef3c7", color: "#b45309" },
    Wine: { background: "#fce7f3", color: "#be185d" },
    Champagne: { background: "#f0fdf4", color: "#166534" },
    Spirits: { background: "#fff7ed", color: "#9a3412" },
};

function CategoryPill({ cat }: { cat: Category }) {
    return (
        <span style={{
            display: "inline-block", padding: "2px 10px", borderRadius: 99,
            fontSize: 11, fontWeight: 500, ...CAT_STYLES[cat],
        }}>
            {cat}
        </span>
    );
}

// ── Format helpers ─────────────────────────────────────────────────────────
function fmtEur(n: number) {
    return "€ " + n.toLocaleString("de-DE");
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function SalesDashboard() {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("grossRevenue");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [perPage, setPerPage] = useState(25);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => (d === "asc" ? "desc" : "asc"));
        else { setSortKey(key); setSortDir("desc"); }
    };

    const sortIcon = (key: SortKey) => {
        if (sortKey !== key) return <span style={{ color: "#c0c0cc" }}> ↕</span>;
        return <span style={{ color: "#6b7280" }}> {sortDir === "asc" ? "↑" : "↓"}</span>;
    };

    const filtered = PRODUCTS
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const mult = sortDir === "asc" ? 1 : -1;
            if (sortKey === "product") return mult * a.name.localeCompare(b.name);
            if (sortKey === "unitsSold") return mult * (a.unitsSold - b.unitsSold);
            if (sortKey === "grossRevenue") return mult * (a.grossRevenue - b.grossRevenue);
            return mult * (a.netRevenue - b.netRevenue);
        })
        .slice(0, perPage);

    const thStyle: React.CSSProperties = {
        padding: "8px 22px", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
        textTransform: "uppercase", color: "#9b9bae", textAlign: "left", cursor: "pointer",
        whiteSpace: "nowrap",
    };

    const tdStyle: React.CSSProperties = {
        padding: "11px 22px", fontSize: 13, color: "#18181b",
        borderBottom: "1px solid #f3f4f6",
    };

    return (
        <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", background: "#f4f4f6", minHeight: "100vh", padding: 24 }}>

            {/* KPI Row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <KpiCard
                    label="Total SKUs"
                    value="248"
                    badge={{ text: "Active products", variant: "gray" }}
                    sparkPoints={[[0, 38], [50, 35], [100, 31], [150, 25], [200, 20]]}
                    color="#818cf8"
                    gradientId="g1"
                    rightLabels={["250", "240", "230"]}
                />
                <KpiCard
                    label="Units Sold"
                    value="18.420"
                    badge={{ text: "▲ +8.1% vs LW", variant: "green" }}
                    sparkPoints={[[0, 30], [50, 28], [100, 26], [150, 18], [200, 10]]}
                    color="#818cf8"
                    gradientId="g2"
                    rightLabels={["20.000", "15.000", "10.000"]}
                />
                <KpiCard
                    label="Top Category"
                    value="Cocktails"
                    badge={{ text: "38% of units", variant: "green" }}
                    sparkPoints={[[0, 36], [60, 22], [120, 14], [200, 16]]}
                    color="#fb923c"
                    gradientId="g3"
                    rightLabels={["38", "37", "36"]}
                />
                <KpiCard
                    label="Avg Price / Unit"
                    value="€18.40"
                    badge={{ text: "This week", variant: "gray" }}
                    sparkPoints={[[0, 32], [50, 30], [100, 26], [150, 20], [200, 16]]}
                    color="#2dd4bf"
                    gradientId="g4"
                    rightLabels={["19", "18", "17"]}
                />
            </div>

            {/* Table Card */}
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                {/* Table Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px 14px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9b9bae" }}>
                        Sales by Product
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Search */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 6,
                            border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 10px",
                            fontSize: 12, color: "#9b9bae",
                        }}>
                            <svg width={12} height={12} viewBox="0 0 16 16" fill="none">
                                <circle cx="6.5" cy="6.5" r="5" stroke="#9b9bae" strokeWidth="1.5" />
                                <path d="M10.5 10.5L14 14" stroke="#9b9bae" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search product..."
                                style={{ border: "none", outline: "none", fontSize: 12, color: "#18181b", background: "transparent", width: 120 }}
                            />
                        </div>
                        <div style={{ fontSize: 10, color: "#c0c0cc", textAlign: "right", lineHeight: 1.3 }}>
                            ↑↓ Click<br />columns to<br />sort
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderTop: "1px solid #f1f1f4", borderBottom: "1px solid #f1f1f4" }}>
                            <th style={thStyle} onClick={() => toggleSort("product")}>Product{sortIcon("product")}</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle} onClick={() => toggleSort("unitsSold")}>Units Sold{sortIcon("unitsSold")}</th>
                            <th style={thStyle} onClick={() => toggleSort("grossRevenue")}>Gross Revenue{sortIcon("grossRevenue")}</th>
                            <th style={thStyle} onClick={() => toggleSort("netRevenue")}>Net Revenue{sortIcon("netRevenue")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p, i) => (
                            <tr key={p.name} style={{ background: i % 2 === 0 ? "#fafafb" : "#fff" }}>
                                <td style={{ ...tdStyle, fontWeight: 600 }}>{p.name}</td>
                                <td style={tdStyle}><CategoryPill cat={p.category} /></td>
                                <td style={tdStyle}>{p.unitsSold}</td>
                                <td style={tdStyle}>{fmtEur(p.grossRevenue)}</td>
                                <td style={{ ...tdStyle, borderBottom: i === filtered.length - 1 ? "none" : "1px solid #f3f4f6" }}>
                                    {fmtEur(p.netRevenue)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div style={{ padding: "14px 22px", fontSize: 12, color: "#9b9bae", display: "flex", alignItems: "center", gap: 8 }}>
                    Show
                    <select
                        value={perPage}
                        onChange={e => setPerPage(Number(e.target.value))}
                        style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: "2px 6px", fontSize: 12, color: "#18181b" }}
                    >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    per page
                </div>
            </div>
        </div>
    );
}