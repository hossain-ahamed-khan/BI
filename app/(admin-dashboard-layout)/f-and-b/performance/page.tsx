"use client";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SparkPoint { value: number }

interface TopItem {
    rank: number;
    name: string;
    qty: number;
    revenue: number;
    vsLY: number;
}

interface TopWine {
    rank: number;
    name: string;
    bottles: number;
    revenue: number;
    vsLY: number;
}

interface ParetoItem {
    rank: number;
    name: string;
    category: string;
    qty: number;
    grossRevenue: number;
    pctOfTotal: number;
    cumulative: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const foodCostPoints: SparkPoint[] = [
    { value: 27.5 }, { value: 27.8 }, { value: 28.0 }, { value: 28.1 },
    { value: 28.2 }, { value: 28.3 }, { value: 28.5 },
];

const drinkCostPoints: SparkPoint[] = [
    { value: 19.0 }, { value: 18.8 }, { value: 18.6 }, { value: 18.5 },
    { value: 18.4 }, { value: 18.3 }, { value: 18.2 },
];

const stockPoints: SparkPoint[] = [
    { value: 40000 }, { value: 41000 }, { value: 42500 }, { value: 44000 },
    { value: 46000 }, { value: 47000 }, { value: 48200 },
];

const purchasesPoints: SparkPoint[] = [
    { value: 14000 }, { value: 14500 }, { value: 15200 }, { value: 15800 },
    { value: 16500 }, { value: 17200 }, { value: 18000 },
];

const topDishes: TopItem[] = [
    { rank: 1, name: "Black Cod Jacqueline", qty: 520, revenue: 10400, vsLY: 12.4 },
    { rank: 2, name: "Wagyu Steak", qty: 180, revenue: 9000, vsLY: 8.6 },
    { rank: 3, name: "Steak Tartare", qty: 370, revenue: 9000, vsLY: 5.2 },
    { rank: 4, name: "Mariscada", qty: 142, revenue: 8520, vsLY: 3.1 },
    { rank: 5, name: "Truffle Pasta", qty: 480, revenue: 8200, vsLY: 4.2 },
    { rank: 6, name: "Foie Gras", qty: 440, revenue: 7040, vsLY: 9.4 },
    { rank: 7, name: "Oysters G.", qty: 325, revenue: 7800, vsLY: 6.8 },
    { rank: 8, name: "Ceviche", qty: 620, revenue: 6820, vsLY: 7.8 },
    { rank: 9, name: "Tuna Tataki", qty: 310, revenue: 5580, vsLY: 5.8 },
    { rank: 10, name: "Burrata", qty: 740, revenue: 5920, vsLY: 6.1 },
];

const topCocktails: TopItem[] = [
    { rank: 1, name: "Jacqueline Signature", qty: 900, revenue: 13500, vsLY: 14.2 },
    { rank: 2, name: "Spicy Margarita", qty: 750, revenue: 11250, vsLY: 9.8 },
    { rank: 3, name: "Pornstar Martini", qty: 620, revenue: 9300, vsLY: 6.4 },
    { rank: 4, name: "Negroni Sbagliato", qty: 580, revenue: 8120, vsLY: 4.8 },
    { rank: 5, name: "Don Julio Paloma", qty: 420, revenue: 7140, vsLY: 18.6 },
    { rank: 6, name: "Aperol Spritz", qty: 680, revenue: 6800, vsLY: 2.1 },
    { rank: 7, name: "Espresso Martini", qty: 440, revenue: 6160, vsLY: 7.2 },
    { rank: 8, name: "Old Fashioned", qty: 380, revenue: 5700, vsLY: 5.4 },
    { rank: 9, name: "Mezcal Sour", qty: 310, revenue: 5270, vsLY: 12.8 },
    { rank: 10, name: "Dry Martini", qty: 290, revenue: 4350, vsLY: 1.8 },
];

const topWines: TopWine[] = [
    { rank: 1, name: "Dom Pérignon 2015", bottles: 48, revenue: 14400, vsLY: 18.2 },
    { rank: 2, name: "Vega Sicilia Único", bottles: 36, revenue: 12600, vsLY: 8.4 },
    { rank: 3, name: "Ruinart Blanc de Blancs", bottles: 30, revenue: 7500, vsLY: 5.6 },
    { rank: 4, name: "Marqués de Murrieta Res.", bottles: 58, revenue: 6960, vsLY: 4.2 },
    { rank: 5, name: "Chablis 1er Cru", bottles: 64, revenue: 6400, vsLY: 7.1 },
    { rank: 6, name: "Albariño Rías Baixas", bottles: 72, revenue: 5760, vsLY: 9.8 },
    { rank: 7, name: "Ribera del Duero RR", bottles: 60, revenue: 5400, vsLY: 3.6 },
    { rank: 8, name: "Sancerre Blanc", bottles: 54, revenue: 5130, vsLY: 6.2 },
    { rank: 9, name: "Priorat Les Terrasses", bottles: 50, revenue: 4500, vsLY: -1.2 },
    { rank: 10, name: "Puligny-Montrachet", bottles: 38, revenue: 4180, vsLY: 11.4 },
];

const paretoItems: ParetoItem[] = [
    { rank: 1, name: "Don Julio 1942", category: "Spirits", qty: 18, grossRevenue: 14400, pctOfTotal: 8.0, cumulative: 8.0 },
    { rank: 2, name: "Dom Pérignon 2015", category: "Champagne", qty: 48, grossRevenue: 14400, pctOfTotal: 8.0, cumulative: 16.0 },
    { rank: 3, name: "Jacqueline Signature", category: "Cocktail", qty: 900, grossRevenue: 13500, pctOfTotal: 7.5, cumulative: 23.5 },
    { rank: 4, name: "Black Cod Jacqueline", category: "Food", qty: 520, grossRevenue: 10400, pctOfTotal: 6.1, cumulative: 29.6 },
    { rank: 5, name: "Vega Sicilia Único", category: "Wine", qty: 36, grossRevenue: 12600, pctOfTotal: 5.8, cumulative: 35.4 },
    { rank: 6, name: "Spicy Margarita", category: "Cocktail", qty: 750, grossRevenue: 11250, pctOfTotal: 5.2, cumulative: 40.6 },
    { rank: 7, name: "Wagyu Steak", category: "Food", qty: 180, grossRevenue: 9000, pctOfTotal: 4.2, cumulative: 44.8 },
    { rank: 8, name: "Steak Tartare", category: "Food", qty: 370, grossRevenue: 9000, pctOfTotal: 4.2, cumulative: 49.0 },
    { rank: 9, name: "Pornstar Martini", category: "Cocktail", qty: 620, grossRevenue: 9300, pctOfTotal: 4.0, cumulative: 53.0 },
    { rank: 10, name: "Negroni Sbagliato", category: "Cocktail", qty: 580, grossRevenue: 8120, pctOfTotal: 3.8, cumulative: 56.8 },
    { rank: 11, name: "Mariscada", category: "Food", qty: 142, grossRevenue: 8520, pctOfTotal: 3.5, cumulative: 60.3 },
    { rank: 12, name: "Don Julio Paloma", category: "Cocktail", qty: 420, grossRevenue: 7140, pctOfTotal: 3.3, cumulative: 63.6 },
    { rank: 13, name: "Truffle Pasta", category: "Food", qty: 480, grossRevenue: 8200, pctOfTotal: 3.2, cumulative: 66.8 },
    { rank: 14, name: "Ruinart Blanc de Blancs", category: "Wine", qty: 30, grossRevenue: 7500, pctOfTotal: 2.8, cumulative: 69.6 },
    { rank: 15, name: "Foie Gras", category: "Food", qty: 440, grossRevenue: 7040, pctOfTotal: 2.5, cumulative: 72.1 },
    { rank: 16, name: "Oysters G.", category: "Starters", qty: 325, grossRevenue: 7800, pctOfTotal: 2.2, cumulative: 74.3 },
    { rank: 17, name: "Marqués de Murrieta Res.", category: "Wine", qty: 58, grossRevenue: 6960, pctOfTotal: 1.98, cumulative: 76.3 },
    { rank: 18, name: "Ceviche", category: "Starters", qty: 620, grossRevenue: 6820, pctOfTotal: 1.59, cumulative: 88.6 },
    { rank: 19, name: "Aperol Spritz", category: "Cocktail", qty: 680, grossRevenue: 6800, pctOfTotal: 1.58, cumulative: 90.2 },
    { rank: 20, name: "Chablis 1er Cru", category: "Wine", qty: 64, grossRevenue: 6400, pctOfTotal: 1.49, cumulative: 91.7 },
    { rank: 21, name: "Espresso Martini", category: "Cocktail", qty: 440, grossRevenue: 6160, pctOfTotal: 1.43, cumulative: 93.1 },
    { rank: 22, name: "Burrata", category: "Starters", qty: 740, grossRevenue: 5920, pctOfTotal: 1.38, cumulative: 94.5 },
    { rank: 23, name: "Albariño Rías Baixas", category: "Wine", qty: 72, grossRevenue: 5760, pctOfTotal: 1.34, cumulative: 95.8 },
    { rank: 24, name: "Old Fashioned", category: "Cocktail", qty: 380, grossRevenue: 5700, pctOfTotal: 1.33, cumulative: 97.2 },
    { rank: 25, name: "Tuna Tataki", category: "Food", qty: 310, grossRevenue: 5580, pctOfTotal: 1.3, cumulative: 98.5 },
];

// ─── Sparkline ────────────────────────────────────────────────────────────────
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function Sparkline({
    points, color, gradientId, yLabels,
}: {
    points: SparkPoint[];
    color: string;
    gradientId: string;
    yLabels: string[];
}) {
    const totalW = 320;
    const totalH = 80;
    const padLeft = 4;
    const padRight = 44; // room for y-axis labels on right
    const padTop = 6;
    const padBottom = 18; // room for x-axis labels

    const chartW = totalW - padLeft - padRight;
    const chartH = totalH - padTop - padBottom;

    const vals = points.map(p => p.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;

    const coords = vals.map((v, i) => ({
        x: padLeft + (i / (vals.length - 1)) * chartW,
        y: padTop + chartH - ((v - min) / range) * chartH,
    }));

    const linePath = coords
        .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`)
        .join(" ");

    const areaPath =
        linePath +
        ` L${coords[coords.length - 1].x.toFixed(2)},${(padTop + chartH).toFixed(2)}` +
        ` L${coords[0].x.toFixed(2)},${(padTop + chartH).toFixed(2)} Z`;

    // y-axis label positions (top=max, mid, bottom=min)
    const yPositions = [
        { label: yLabels[0], y: padTop },
        { label: yLabels[1], y: padTop + chartH / 2 },
        { label: yLabels[2], y: padTop + chartH },
    ];

    return (
        <svg
            width="100%"
            viewBox={`0 0 ${totalW} ${totalH}`}
            style={{ display: "block", overflow: "visible" }}
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.03" />
                </linearGradient>
            </defs>

            {/* Area fill */}
            <path d={areaPath} fill={`url(#${gradientId})`} />

            {/* Line */}
            <path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {/* Dots */}
            {coords.map((c, i) => (
                <circle key={i} cx={c.x} cy={c.y} r="3" fill={color} />
            ))}

            {/* X-axis day labels */}
            {coords.map((c, i) => (
                <text
                    key={i}
                    x={c.x}
                    y={totalH - 2}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#c4c9d4"
                    fontFamily="DM Sans, sans-serif"
                >
                    {DAYS[i]}
                </text>
            ))}

            {/* Y-axis labels on right */}
            {yPositions.map((yp, i) => (
                <text
                    key={i}
                    x={padLeft + chartW + 6}
                    y={yp.y + 3}
                    fontSize="8"
                    fill="#c4c9d4"
                    fontFamily="DM Sans, sans-serif"
                >
                    {yp.label}
                </text>
            ))}
        </svg>
    );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
    title, value, subtitle, badge, badgeColor, points, lineColor, gradientId, yLabels,
}: {
    title: string;
    value: string;
    subtitle?: string;
    badge?: string;
    badgeColor?: string;
    points: SparkPoint[];
    lineColor: string;
    gradientId: string;
    yLabels: string[];
}) {
    return (
        <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: "20px 22px 12px",
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            minWidth: 0,
            flex: 1,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase" }}>
                    {title}
                </span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>→</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 300, color: "#111", lineHeight: 1.1 }}>{value}</div>
            {badge && (
                <div style={{ fontSize: 11, color: badgeColor ?? "#22c55e", fontWeight: 500 }}>{badge}</div>
            )}
            {subtitle && (
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{subtitle}</div>
            )}
            <div style={{ marginTop: 6 }}>
                <Sparkline points={points} color={lineColor} gradientId={gradientId} yLabels={yLabels} />
            </div>
        </div>
    );
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────
const rankColors: Record<number, string> = {
    1: "#ef4444", 2: "#f97316", 3: "#3b82f6",
};
function RankBadge({ rank }: { rank: number }) {
    const color = rankColors[rank] ?? "#9ca3af";
    return (
        <span style={{ fontWeight: 700, color, minWidth: 20, display: "inline-block" }}>
            {rank}
        </span>
    );
}

// ─── VS LY Badge ─────────────────────────────────────────────────────────────
function VsLY({ value }: { value: number }) {
    const color = value >= 0 ? "#22c55e" : "#ef4444";
    return (
        <span style={{
            fontSize: 11, fontWeight: 600, color,
            background: value >= 0 ? "#f0fdf4" : "#fef2f2",
            padding: "2px 6px", borderRadius: 4,
        }}>
            {value >= 0 ? "+" : ""}{value}%
        </span>
    );
}

// ─── Top Items Table ──────────────────────────────────────────────────────────
function TopItemsTable({
    title, items, colHeader = "QTY",
}: {
    title: string;
    items: TopItem[];
    colHeader?: string;
}) {
    return (
        <div style={{
            background: "#fff", borderRadius: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
            padding: "18px 20px", flex: 1, minWidth: 0,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase" }}>
                    {title}
                </span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>→</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                    <tr style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <th style={{ textAlign: "left", paddingBottom: 8, width: 24 }}>#</th>
                        <th style={{ textAlign: "left", paddingBottom: 8 }}>ITEM</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>{colHeader}</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>REVENUE</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>VS LY</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.rank} style={{ borderTop: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "8px 0" }}><RankBadge rank={item.rank} /></td>
                            <td style={{ padding: "8px 4px", color: "#111", fontWeight: 400 }}>{item.name}</td>
                            <td style={{ textAlign: "right", color: "#6b7280" }}>{item.qty.toLocaleString()}</td>
                            <td style={{ textAlign: "right", color: "#6b7280" }}>€ {item.revenue.toLocaleString()}</td>
                            <td style={{ textAlign: "right" }}><VsLY value={item.vsLY} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Top Wines Table ─────────────────────────────────────────────────────────
function TopWinesTable({ wines }: { wines: TopWine[] }) {
    return (
        <div style={{
            background: "#fff", borderRadius: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
            padding: "18px 20px", flex: 1, minWidth: 0,
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase" }}>
                    Top 10 Wines
                </span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>→</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                    <tr style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <th style={{ textAlign: "left", paddingBottom: 8, width: 24 }}>#</th>
                        <th style={{ textAlign: "left", paddingBottom: 8 }}>WINE</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>BOTTLES</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>REVENUE</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>VS LY</th>
                    </tr>
                </thead>
                <tbody>
                    {wines.map(w => (
                        <tr key={w.rank} style={{ borderTop: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "8px 0" }}><RankBadge rank={w.rank} /></td>
                            <td style={{ padding: "8px 4px", color: "#111" }}>{w.name}</td>
                            <td style={{ textAlign: "right", color: "#6b7280" }}>{w.bottles}</td>
                            <td style={{ textAlign: "right", color: "#6b7280" }}>€ {w.revenue.toLocaleString()}</td>
                            <td style={{ textAlign: "right" }}><VsLY value={w.vsLY} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Pareto Table ─────────────────────────────────────────────────────────────
function ParetoTable({ items }: { items: ParetoItem[] }) {
    const [page, setPage] = useState(1);
    const perPage = 25;
    const totalPages = Math.ceil(items.length / perPage);
    const visible = items.slice((page - 1) * perPage, page * perPage);

    return (
        <div style={{
            background: "#fff", borderRadius: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,.06)",
            padding: "18px 20px",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase" }}>
                    Revenue Pareto Analysis – 80/20 Rule
                </span>
                <span style={{ fontSize: 11, color: "#9ca3af" }}>
                    Sorted by revenue · Cumulative % recalculated across full dataset
                </span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                    <tr style={{ color: "#9ca3af", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <th style={{ textAlign: "left", paddingBottom: 8, width: 24 }}>#</th>
                        <th style={{ textAlign: "left", paddingBottom: 8 }}>ITEM ↑↓</th>
                        <th style={{ textAlign: "left", paddingBottom: 8 }}>CATEGORY</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>QTY ↑↓</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>GROSS REVENUE ↓</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>% OF TOTAL ↑↓</th>
                        <th style={{ textAlign: "right", paddingBottom: 8 }}>CUMULATIVE %</th>
                    </tr>
                </thead>
                <tbody>
                    {visible.map(item => {
                        const cumColor = item.cumulative <= 80 ? "#22c55e" : "#ef4444";
                        return (
                            <tr key={item.rank} style={{ borderTop: "1px solid #f3f4f6" }}>
                                <td style={{ padding: "9px 0", color: item.rank <= 3 ? rankColors[item.rank] : "#111", fontWeight: item.rank <= 3 ? 700 : 400 }}>
                                    {item.rank}
                                </td>
                                <td style={{ padding: "9px 4px", color: "#111" }}>{item.name}</td>
                                <td style={{ color: "#9ca3af" }}>{item.category}</td>
                                <td style={{ textAlign: "right", color: "#6b7280" }}>{item.qty.toLocaleString()}</td>
                                <td style={{ textAlign: "right", color: "#6b7280" }}>€ {item.grossRevenue.toLocaleString()}</td>
                                <td style={{ textAlign: "right", color: "#6b7280" }}>{item.pctOfTotal}%</td>
                                <td style={{ textAlign: "right", fontWeight: 600, color: cumColor }}>{item.cumulative}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginTop: 16, fontSize: 12, color: "#9ca3af",
            }}>
                <span>Show <strong>25</strong> per page</span>
                <span>1–{visible.length} of {items.length} items</span>
                <div style={{ display: "flex", gap: 4 }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            width: 28, height: 28, borderRadius: 6,
                            border: "1px solid #e5e7eb", background: "#fff",
                            cursor: page === 1 ? "default" : "pointer",
                            color: page === 1 ? "#d1d5db" : "#374151",
                        }}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            style={{
                                width: 28, height: 28, borderRadius: 6,
                                border: p === page ? "1.5px solid #374151" : "1px solid #e5e7eb",
                                background: p === page ? "#f9fafb" : "#fff",
                                fontWeight: p === page ? 700 : 400,
                                cursor: "pointer", color: "#374151",
                            }}>{p}</button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{
                            width: 28, height: 28, borderRadius: 6,
                            border: "1px solid #e5e7eb", background: "#fff",
                            cursor: page === totalPages ? "default" : "pointer",
                            color: page === totalPages ? "#d1d5db" : "#374151",
                        }}>›</button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function RestaurantDashboard() {
    return (
        <div style={{
            fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
            background: "#f5f6f8",
            minHeight: "100vh",
            padding: "24px",
            boxSizing: "border-box",
        }}>
            {/* KPI Cards */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                <KpiCard
                    title="Food Cost %"
                    value="28.5%"
                    subtitle="vs LY Goal: 28%"
                    badge="Target: 28%"
                    badgeColor="#9ca3af"
                    points={foodCostPoints}
                    lineColor="#f59e0b"
                    gradientId="grad-food"
                    yLabels={["28.5", "28.0", "27.5"]}
                />
                <KpiCard
                    title="Drink Cost %"
                    value="18.2%"
                    badge="On target"
                    subtitle="vs LY Goal: 18%"
                    points={drinkCostPoints}
                    lineColor="#10b981"
                    gradientId="grad-drink"
                    yLabels={["19.0", "18.5", "18.0"]}
                />
                <KpiCard
                    title="Stock Value"
                    value="€ 48.200"
                    subtitle="Frozen liquidity"
                    points={stockPoints}
                    lineColor="#8b5cf6"
                    gradientId="grad-stock"
                    yLabels={["50,000", "45,000", "40,000"]}
                />
                <KpiCard
                    title="Purchases (Month)"
                    value="€ 18.000"
                    badge="▲ +3.2% vs LM"
                    badgeColor="#ef4444"
                    points={purchasesPoints}
                    lineColor="#f97316"
                    gradientId="grad-purchases"
                    yLabels={["18,000", "16,000", "14,000"]}
                />
            </div>

            {/* Top 10 Tables */}
            <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                <TopItemsTable title="Top 10 Dishes" items={topDishes} colHeader="QTY" />
                <TopItemsTable title="Top 10 Cocktails" items={topCocktails} colHeader="QTY" />
                <TopWinesTable wines={topWines} />
            </div>

            {/* Pareto */}
            <ParetoTable items={paretoItems} />
        </div>
    );
}