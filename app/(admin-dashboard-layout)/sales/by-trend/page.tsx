"use client";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SparklinePoint {
    value: number;
}

interface TopItem {
    rank: number;
    name: string;
    qty: number;
}

interface ParetoItem {
    rank: number;
    name: string;
    category: string;
    qty: number;
    grossRevenue: number;
    percentOfTotal: number;
    cumulative: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const foodSparkData: SparklinePoint[] = [
    { value: 60000 }, { value: 62000 }, { value: 65000 }, { value: 63000 },
    { value: 68000 }, { value: 70000 }, { value: 72400 },
];

const drinkSparkData: SparklinePoint[] = [
    { value: 120000 }, { value: 118000 }, { value: 115000 }, { value: 113000 },
    { value: 112000 }, { value: 111000 }, { value: 111920 },
];

const splitSparkData: SparklinePoint[] = [
    { value: 40 }, { value: 40 }, { value: 39 }, { value: 39 },
    { value: 39 }, { value: 39 }, { value: 39 },
];

const avgPriceSparkData: SparklinePoint[] = [
    { value: 27 }, { value: 27.5 }, { value: 28 }, { value: 27.8 },
    { value: 28 }, { value: 28.2 }, { value: 28.4 },
];

const topDishes: TopItem[] = [
    { rank: 1, name: "Black Cod Jac.", qty: 520 },
    { rank: 2, name: "Truffle Pasta", qty: 480 },
    { rank: 3, name: "Ceviche", qty: 415 },
    { rank: 4, name: "Steak Tartare", qty: 370 },
    { rank: 5, name: "Oysters G.", qty: 325 },
    { rank: 6, name: "Wagyu Steak", qty: 290 },
    { rank: 7, name: "Tuna Tataki", qty: 265 },
    { rank: 8, name: "Burrata", qty: 240 },
    { rank: 9, name: "Foie Gras", qty: 210 },
    { rank: 10, name: "Salmon Tiradito", qty: 195 },
];

const topCocktails: TopItem[] = [
    { rank: 1, name: "Jacqueline Sig.", qty: 900 },
    { rank: 2, name: "Spicy Margarita", qty: 750 },
    { rank: 3, name: "Pornstar Martini", qty: 620 },
    { rank: 4, name: "Negroni", qty: 450 },
    { rank: 5, name: "Espresso Martini", qty: 405 },
    { rank: 6, name: "Paloma Rosa", qty: 380 },
    { rank: 7, name: "Old Fashioned", qty: 320 },
    { rank: 8, name: "Yuzu Sour", qty: 285 },
    { rank: 9, name: "Hibiscus Collins", qty: 240 },
    { rank: 10, name: "Dry Martini", qty: 210 },
];

const topWines: TopItem[] = [
    { rank: 1, name: "Dom Pérignon 2015", qty: 48 },
    { rank: 2, name: "Vega Sicilia Único", qty: 36 },
    { rank: 3, name: "Ruinart Blanc", qty: 30 },
    { rank: 4, name: "Marqués de Murrieta", qty: 28 },
    { rank: 5, name: "Chablis 1er Cru", qty: 24 },
    { rank: 6, name: "Albariño Rías Baixas", qty: 22 },
    { rank: 7, name: "Ribera del Duero RR", qty: 20 },
    { rank: 8, name: "Sancerre Blanc", qty: 18 },
    { rank: 9, name: "Priorat Les Terrasses", qty: 16 },
    { rank: 10, name: "Puligny-Montrachet", qty: 14 },
];

const paretoItems: ParetoItem[] = [
    { rank: 1, name: "Don Julio 1942", category: "Spirits", qty: 18, grossRevenue: 14400, percentOfTotal: 8, cumulative: 8 },
    { rank: 2, name: "Dom Pérignon 2015", category: "Champagne", qty: 48, grossRevenue: 14400, percentOfTotal: 8, cumulative: 16 },
    { rank: 3, name: "Jacqueline Signature", category: "Cocktail", qty: 900, grossRevenue: 13500, percentOfTotal: 7.5, cumulative: 23.5 },
    { rank: 4, name: "Vega Sicilia Único", category: "Wine", qty: 36, grossRevenue: 12600, percentOfTotal: 7, cumulative: 30.5 },
    { rank: 5, name: "Spicy Margarita", category: "Cocktail", qty: 750, grossRevenue: 11250, percentOfTotal: 6.25, cumulative: 36.8 },
    { rank: 6, name: "Black Cod Jacqueline", category: "Food", qty: 520, grossRevenue: 10400, percentOfTotal: 5.8, cumulative: 42.6 },
    { rank: 7, name: "Pornstar Martini", category: "Cocktail", qty: 620, grossRevenue: 9300, percentOfTotal: 5.17, cumulative: 47.8 },
    { rank: 8, name: "Wagyu Steak", category: "Food", qty: 180, grossRevenue: 9000, percentOfTotal: 5, cumulative: 52.8 },
    { rank: 9, name: "Steak Tartare", category: "Food", qty: 370, grossRevenue: 9000, percentOfTotal: 5, cumulative: 57.8 },
    { rank: 10, name: "Mariscada", category: "Seafood", qty: 142, grossRevenue: 8520, percentOfTotal: 4.73, cumulative: 62.5 },
    { rank: 11, name: "Truffle Pasta", category: "Food", qty: 480, grossRevenue: 8200, percentOfTotal: 4.56, cumulative: 67.1 },
    { rank: 12, name: "Negroni Sbagliato", category: "Cocktail", qty: 580, grossRevenue: 8120, percentOfTotal: 4.51, cumulative: 71.6 },
    { rank: 13, name: "Oysters G.", category: "Seafood", qty: 325, grossRevenue: 7800, percentOfTotal: 1.82, cumulative: 85.5 },
    { rank: 14, name: "Ruinart Blanc de Blancs", category: "Champagne", qty: 30, grossRevenue: 7500, percentOfTotal: 4.17, cumulative: 75.8 },
    { rank: 15, name: "Don Julio Paloma", category: "Cocktail", qty: 420, grossRevenue: 7140, percentOfTotal: 3.97, cumulative: 79.8 },
    { rank: 16, name: "Foie Gras", category: "Starters", qty: 440, grossRevenue: 7040, percentOfTotal: 3.91, cumulative: 83.7 },
    { rank: 17, name: "Marqués de Murrieta Res.", category: "Wine", qty: 58, grossRevenue: 6960, percentOfTotal: 1.62, cumulative: 87.1 },
    { rank: 18, name: "Ceviche", category: "Starters", qty: 620, grossRevenue: 6820, percentOfTotal: 1.59, cumulative: 88.7 },
    { rank: 19, name: "Aperol Spritz", category: "Cocktail", qty: 680, grossRevenue: 6800, percentOfTotal: 1.58, cumulative: 90.3 },
    { rank: 20, name: "Chablis 1er Cru", category: "Wine", qty: 64, grossRevenue: 6400, percentOfTotal: 1.49, cumulative: 91.8 },
    { rank: 21, name: "Espresso Martini", category: "Cocktail", qty: 440, grossRevenue: 6160, percentOfTotal: 1.43, cumulative: 93.2 },
    { rank: 22, name: "Burrata", category: "Starters", qty: 740, grossRevenue: 5920, percentOfTotal: 1.38, cumulative: 94.6 },
    { rank: 23, name: "Albariño Rías Baixas", category: "Wine", qty: 72, grossRevenue: 5760, percentOfTotal: 1.34, cumulative: 95.9 },
    { rank: 24, name: "Old Fashioned", category: "Cocktail", qty: 380, grossRevenue: 5700, percentOfTotal: 1.33, cumulative: 97.2 },
    { rank: 25, name: "Tuna Tataki", category: "Food", qty: 310, grossRevenue: 5580, percentOfTotal: 1.3, cumulative: 98.5 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEuro(value: number): string {
    return `€${value.toLocaleString("de-DE").replace(",", ".")}`;
}

function getCumulativeColor(value: number): string {
    if (value <= 80) return "#10b981";
    return "#f97316";
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({
    data,
    color,
    fillColor,
    xLabels,
    yTicks,
    yTickFormat,
    width = 300,
    height = 74,
}: {
    data: SparklinePoint[];
    color: string;
    fillColor: string;
    xLabels?: string[];
    yTicks?: number[];
    yTickFormat?: (value: number) => string;
    width?: number;
    height?: number;
}) {
    const values = data.map((d) => d.value);
    const chartLeft = 8;
    const chartRight = 42;
    const chartTop = 8;
    const chartBottom = 42;
    const innerWidth = width - chartLeft - chartRight;
    const innerHeight = chartBottom - chartTop;

    const yReferenceTicks = yTicks && yTicks.length > 0 ? yTicks : [Math.max(...values), (Math.max(...values) + Math.min(...values)) / 2, Math.min(...values)];
    const domainMax = Math.max(...yReferenceTicks, ...values);
    const domainMin = Math.min(...yReferenceTicks, ...values);
    const range = domainMax - domainMin || 1;

    const getY = (v: number) => chartTop + ((domainMax - v) / range) * innerHeight;

    const points = values.map((v, i) => {
        const x = chartLeft + (i / (values.length - 1)) * innerWidth;
        const y = getY(v);
        return [x, y];
    });

    const linePath = points
        .map((point, i) => {
            if (i === 0) return `M${point[0]},${point[1]}`;
            const prev = points[i - 1];
            const cpX = (prev[0] + point[0]) / 2;
            return `C${cpX},${prev[1]} ${cpX},${point[1]} ${point[0]},${point[1]}`;
        })
        .join(" ");
    const fillPath = `${linePath} L${points[points.length - 1][0]},${chartBottom} L${points[0][0]},${chartBottom} Z`;
    const formatTick = yTickFormat || ((value: number) => value.toLocaleString("en-US"));
    const labels = xLabels && xLabels.length === values.length ? xLabels : [];

    return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: "visible" }}>
            <defs>
                <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={fillColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={fillColor} stopOpacity="0.02" />
                </linearGradient>
            </defs>

            {yReferenceTicks.map((tick) => {
                const y = getY(tick);
                return (
                    <g key={tick}>
                        <line x1={chartLeft} y1={y} x2={width - chartRight + 2} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                        <text x={width - 2} y={y + 3} textAnchor="end" fontSize="9" fill="#9ca3af" fontWeight="500">
                            {formatTick(tick)}
                        </text>
                    </g>
                );
            })}

            <path d={fillPath} fill={`url(#grad-${color.replace("#", "")})`} />
            <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
            {points.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2" fill={color} stroke="#ffffff" strokeWidth="0.9" />
            ))}

            {labels.map((label, i) => {
                const x = chartLeft + (i / (labels.length - 1)) * innerWidth;
                return (
                    <text key={`${label}-${i}`} x={x} y={height - 8} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="600">
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({
    title,
    value,
    change,
    changeUp,
    valueNote,
    data,
    color,
    fillColor,
    xLabels,
    yTicks,
    yTickFormat,
    suffix,
}: {
    title: string;
    value: string;
    change?: string;
    changeUp?: boolean;
    valueNote?: string;
    data: SparklinePoint[];
    color: string;
    fillColor: string;
    xLabels?: string[];
    yTicks?: number[];
    yTickFormat?: (value: number) => string;
    suffix?: string;
}) {
    return (
        <div style={styles.kpiCard}>
            <div style={styles.kpiHeader}>
                <span style={styles.kpiTitle}>{title}</span>
                <span style={styles.kpiArrow}>→</span>
            </div>
            <div style={styles.kpiValue}>{value}{suffix && <span style={styles.kpiSuffix}>{suffix}</span>}</div>
            {valueNote && <div style={styles.kpiPill}>{valueNote}</div>}
            {change && (
                <div style={{ ...styles.kpiBadge, color: changeUp ? "#10b981" : "#ef4444" }}>
                    <span>{changeUp ? "▲" : "▼"}</span>
                    <span style={{ marginLeft: 3 }}>{change}</span>
                </div>
            )}
            <div style={{ marginTop: 12 }}>
                <Sparkline
                    data={data}
                    color={color}
                    fillColor={fillColor}
                    xLabels={xLabels}
                    yTicks={yTicks}
                    yTickFormat={yTickFormat}
                />
            </div>
        </div>
    );
}

// ─── Top List ─────────────────────────────────────────────────────────────────

function TopList({
    title,
    items,
    qtyLabel = "QTY",
}: {
    title: string;
    items: TopItem[];
    qtyLabel?: string;
}) {
    return (
        <div style={styles.listCard}>
            <div style={styles.listHeader}>
                <span style={styles.listTitle}>{title}</span>
            </div>
            <div style={styles.listTableHeader}>
                <span style={{ ...styles.listCol, width: 24, color: "#9ca3af" }}>#</span>
                <span style={{ ...styles.listCol, flex: 1, color: "#9ca3af" }}>
                    {title.includes("WINE") ? "WINE" : title.includes("COCKTAIL") ? "COCKTAIL" : "DISH"}
                </span>
                <span style={{ ...styles.listColRight, color: "#9ca3af" }}>{qtyLabel}</span>
            </div>
            {items.map((item, i) => (
                <div
                    key={i}
                    style={{
                        ...styles.listRow,
                        backgroundColor: i === 1 ? "#f3f4f6" : "transparent",
                    }}
                >
                    <span style={{ ...styles.listCol, width: 24, color: "#6366f1", fontWeight: 600, fontSize: 13 }}>
                        {item.rank}
                    </span>
                    <span style={{ ...styles.listCol, flex: 1, fontSize: 13, color: "#111827" }}>
                        {item.name}
                    </span>
                    <span style={{ ...styles.listColRight, fontSize: 13, color: "#374151" }}>
                        {item.qty}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Pareto Table ─────────────────────────────────────────────────────────────

function ParetoTable({ items }: { items: ParetoItem[] }) {
    const [page, setPage] = useState(1);
    const perPage = 25;
    const totalPages = Math.ceil(items.length / perPage);
    const visibleItems = items.slice((page - 1) * perPage, page * perPage);

    return (
        <div style={styles.paretoCard}>
            <div style={styles.listHeader}>
                <span style={styles.listTitle}>REVENUE PARETO ANALYSIS — 80/20 RULE</span>
                <span style={styles.kpiArrow}>→</span>
            </div>
            <table style={styles.paretoTable}>
                <thead>
                    <tr>
                        {["#", "ITEM NAME ↑↓", "CATEGORY", "QTY ↑↓", "GROSS REVENUE ↓", "% OF TOTAL ↑↓", "CUMULATIVE %"].map((h) => (
                            <th key={h} style={styles.thCell}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {visibleItems.map((item, i) => (
                        <tr
                            key={i}
                            style={{
                                ...styles.paretoRow,
                                backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa",
                            }}
                        >
                            <td style={styles.tdCell}>{item.rank}</td>
                            <td style={{ ...styles.tdCell, fontWeight: 500, color: "#111827" }}>{item.name}</td>
                            <td style={{ ...styles.tdCell, color: "#6b7280" }}>{item.category}</td>
                            <td style={styles.tdCell}>{item.qty}</td>
                            <td style={styles.tdCell}>€ {item.grossRevenue.toLocaleString("de-DE")}</td>
                            <td style={styles.tdCell}>{item.percentOfTotal}%</td>
                            <td style={{ ...styles.tdCell, color: getCumulativeColor(item.cumulative), fontWeight: 600 }}>
                                {item.cumulative}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={styles.pagination}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#6b7280", fontSize: 13 }}>
                    <span>Show</span>
                    <select style={styles.pageSelect} defaultValue={25}>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    <span>per page</span>
                </div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>
                    {(page - 1) * perPage + 1}–{Math.min(page * perPage, items.length)} of {items.length} items
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        style={{ ...styles.pageBtn, color: page === 1 ? "#d1d5db" : "#374151" }}
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            style={{
                                ...styles.pageBtn,
                                backgroundColor: page === i + 1 ? "#6366f1" : "transparent",
                                color: page === i + 1 ? "#fff" : "#374151",
                                borderRadius: 4,
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        style={{ ...styles.pageBtn, color: page === totalPages ? "#d1d5db" : "#374151" }}
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function RestaurantDashboard() {
    const weekLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    return (
        <div style={styles.root}>
            {/* KPI Row */}
            <div style={styles.kpiRow}>
                <KpiCard
                    title="FOOD SALES"
                    value="€72.400"
                    change="+8.2% vs LY"
                    changeUp={true}
                    data={foodSparkData}
                    color="#10b981"
                    fillColor="#10b981"
                    xLabels={weekLabels}
                    yTicks={[80000, 60000, 40000]}
                    yTickFormat={(v) => v.toLocaleString("en-US")}
                />
                <KpiCard
                    title="DRINK SALES"
                    value="€111.920"
                    change="-1.4% vs LY"
                    changeUp={false}
                    data={drinkSparkData}
                    color="#ef4444"
                    fillColor="#ef4444"
                    xLabels={weekLabels}
                    yTicks={[120000, 100000, 80000]}
                    yTickFormat={(v) => v.toLocaleString("en-US")}
                />
                <KpiCard
                    title="FOOD / DRINK SPLIT"
                    value="39/61"
                    valueNote="Food% / Drink%"
                    data={splitSparkData}
                    color="#8b5cf6"
                    fillColor="#8b5cf6"
                    xLabels={weekLabels}
                    yTicks={[40, 39.5, 39]}
                    yTickFormat={(v) => v.toFixed(1)}
                />
                <KpiCard
                    title="AVG DISH PRICE"
                    value="€28.40"
                    change="+2.1% vs LY"
                    changeUp={true}
                    data={avgPriceSparkData}
                    color="#6366f1"
                    fillColor="#6366f1"
                    xLabels={weekLabels}
                    yTicks={[29, 28, 27]}
                    yTickFormat={(v) => v.toFixed(0)}
                />
            </div>

            {/* Top Lists Row */}
            <div style={styles.listsRow}>
                <TopList title="TOP 10 DISHES (QTY)" items={topDishes} />
                <TopList title="TOP 10 COCKTAILS (QTY)" items={topCocktails} />
                <TopList title="TOP 10 WINES (QTY)" items={topWines} qtyLabel="BTLS" />
            </div>

            {/* Pareto Table */}
            <ParetoTable items={paretoItems} />
        </div>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    root: {
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: "#f1f2f4",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxSizing: "border-box",
    },
    kpiRow: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
    },
    kpiCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
    },
    kpiHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    kpiTitle: {
        fontSize: 10,
        letterSpacing: "0.08em",
        fontWeight: 600,
        color: "#9ca3af",
        textTransform: "uppercase" as const,
    },
    kpiArrow: {
        fontSize: 12,
        color: "#d1d5db",
    },
    kpiValue: {
        fontSize: 36,
        fontWeight: 300,
        color: "#111827",
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        marginBottom: 4,
    },
    kpiSuffix: {
        fontSize: 16,
        color: "#6b7280",
    },
    kpiBadge: {
        display: "flex",
        alignItems: "center",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
    },
    kpiPill: {
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        fontSize: 11,
        fontWeight: 600,
        color: "#6b7280",
        backgroundColor: "#eef0f4",
        borderRadius: 999,
        padding: "3px 8px",
        marginTop: 2,
    },
    listsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
    },
    listCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    listHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 10,
        letterSpacing: "0.08em",
        fontWeight: 600,
        color: "#9ca3af",
        textTransform: "uppercase" as const,
    },
    listTableHeader: {
        display: "flex",
        alignItems: "center",
        paddingBottom: 8,
        borderBottom: "1px solid #f3f4f6",
        marginBottom: 4,
        fontSize: 10,
        letterSpacing: "0.06em",
        fontWeight: 600,
    },
    listRow: {
        display: "flex",
        alignItems: "center",
        padding: "7px 8px",
        borderRadius: 6,
    },
    listCol: {
        display: "flex" as const,
        alignItems: "center" as const,
    },
    listColRight: {
        marginLeft: "auto",
        fontWeight: 500,
    },
    paretoCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    paretoTable: {
        width: "100%",
        borderCollapse: "collapse" as const,
        fontSize: 13,
    },
    thCell: {
        textAlign: "left" as const,
        fontSize: 10,
        letterSpacing: "0.06em",
        fontWeight: 600,
        color: "#9ca3af",
        padding: "8px 10px",
        borderBottom: "1px solid #e5e7eb",
        textTransform: "uppercase" as const,
    },
    tdCell: {
        padding: "9px 10px",
        color: "#374151",
        fontSize: 13,
        borderBottom: "1px solid #f3f4f6",
    },
    paretoRow: {
        transition: "background 0.15s",
    },
    pagination: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        paddingTop: 12,
        borderTop: "1px solid #f3f4f6",
    },
    pageSelect: {
        border: "1px solid #e5e7eb",
        borderRadius: 4,
        padding: "2px 6px",
        fontSize: 13,
        color: "#374151",
    },
    pageBtn: {
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e5e7eb",
        background: "transparent",
        cursor: "pointer",
        fontSize: 13,
        borderRadius: 4,
        fontFamily: "inherit",
    },
};