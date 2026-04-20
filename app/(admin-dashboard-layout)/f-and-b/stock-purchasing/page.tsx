"use client";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface FoodItem {
    product: string;
    category: string;
    stock: string;
    lastPurchase: number;
    prevPurchase: number;
    deltaPrice: number | null;
    pctChange: number;
    stockValue: number;
}

interface PriceAlert {
    name: string;
    type: "Food" | "Drinks";
    subCategory: string;
    pctChange: number;
    from: number;
    to: number;
    severity: "high" | "medium";
}

// ── Data ───────────────────────────────────────────────────────────────────────
const foodItems: FoodItem[] = [
    { product: "Wagyu A5 (Kagoshima)", category: "Meat", stock: "12 kg", lastPurchase: 148, prevPurchase: 136, deltaPrice: 12, pctChange: 8.8, stockValue: 1776 },
    { product: "Black Cod", category: "Fish", stock: "8 kg", lastPurchase: 42, prevPurchase: 40, deltaPrice: 2, pctChange: 5.0, stockValue: 336 },
    { product: "Foie Gras (Landes)", category: "Poultry", stock: "6 kg", lastPurchase: 72, prevPurchase: 74, deltaPrice: -2, pctChange: -2.7, stockValue: 432 },
    { product: "Mariscada (Palamós)", category: "Seafood", stock: "15 kg", lastPurchase: 38, prevPurchase: 34, deltaPrice: 4, pctChange: 11.8, stockValue: 570 },
    { product: "Truffle (Périgord)", category: "Fungi", stock: "400 g", lastPurchase: 3.2, prevPurchase: 3.1, deltaPrice: 0.1, pctChange: 3.2, stockValue: 1280 },
    { product: "Tuna (Bluefin)", category: "Fish", stock: "6 kg", lastPurchase: 55, prevPurchase: 55, deltaPrice: null, pctChange: 0, stockValue: 330 },
    { product: "Burrata (Puglia)", category: "Dairy", stock: "24 u", lastPurchase: 4.8, prevPurchase: 4.5, deltaPrice: 0.3, pctChange: 6.7, stockValue: 115 },
    { product: "Oysters (Gillardeau)", category: "Seafood", stock: "8 dz", lastPurchase: 18, prevPurchase: 17.5, deltaPrice: 0.5, pctChange: 2.9, stockValue: 144 },
    { product: "Steak (Hereford)", category: "Meat", stock: "20 kg", lastPurchase: 28, prevPurchase: 29, deltaPrice: -1, pctChange: -3.4, stockValue: 560 },
    { product: "Ceviche Mix (Citrus)", category: "Produce", stock: "30 kg", lastPurchase: 3.2, prevPurchase: 3.0, deltaPrice: 0.2, pctChange: 6.7, stockValue: 96 },
    { product: "Pasta (Artisan)", category: "Dry Goods", stock: "15 kg", lastPurchase: 8.5, prevPurchase: 8.5, deltaPrice: null, pctChange: 0, stockValue: 128 },
    { product: "Salmon (Wild Pacific)", category: "Fish", stock: "10 kg", lastPurchase: 32, prevPurchase: 30, deltaPrice: 2, pctChange: 6.7, stockValue: 320 },
    { product: "Octopus (Galicia)", category: "Seafood", stock: "8 kg", lastPurchase: 24, prevPurchase: 22, deltaPrice: 2, pctChange: 9.1, stockValue: 192 },
    { product: "Ibérico Ham", category: "Charcuterie", stock: "4 kg", lastPurchase: 68, prevPurchase: 68, deltaPrice: null, pctChange: 0, stockValue: 272 },
    { product: "Duck Breast", category: "Poultry", stock: "10 kg", lastPurchase: 18, prevPurchase: 17, deltaPrice: 1, pctChange: 5.9, stockValue: 180 },
    { product: "Ricotta (Artisan)", category: "Dairy", stock: "6 kg", lastPurchase: 9.2, prevPurchase: 9.0, deltaPrice: 0.2, pctChange: 2.2, stockValue: 55 },
    { product: "Artichoke Hearts", category: "Produce", stock: "12 kg", lastPurchase: 6.4, prevPurchase: 6.8, deltaPrice: -0.4, pctChange: -5.9, stockValue: 77 },
    { product: "Microgreens", category: "Produce", stock: "2 kg", lastPurchase: 28, prevPurchase: 26, deltaPrice: 2, pctChange: 7.7, stockValue: 56 },
    { product: "Lobster (Brittany)", category: "Seafood", stock: "6 u", lastPurchase: 42, prevPurchase: 38, deltaPrice: 4, pctChange: 10.5, stockValue: 252 },
    { product: "Brioche (Artisan)", category: "Bakery", stock: "20 u", lastPurchase: 3.8, prevPurchase: 3.8, deltaPrice: null, pctChange: 0, stockValue: 76 },
];

const priceAlerts: PriceAlert[] = [
    { name: "Mariscada (Palamós)", type: "Food", subCategory: "Seafood", pctChange: 11.8, from: 34, to: 38, severity: "high" },
    { name: "Lobster (Brittany)", type: "Food", subCategory: "Seafood", pctChange: 10.5, from: 38, to: 42, severity: "high" },
    { name: "Octopus (Galicia)", type: "Food", subCategory: "Seafood", pctChange: 9.1, from: 22, to: 24, severity: "high" },
    { name: "Wagyu A5 (Kagoshima)", type: "Food", subCategory: "Meat", pctChange: 8.8, from: 136, to: 148, severity: "high" },
    { name: "Microgreens", type: "Food", subCategory: "Produce", pctChange: 7.7, from: 26, to: 28, severity: "high" },
    { name: "Salmon (Wild Pacific)", type: "Food", subCategory: "Fish", pctChange: 6.7, from: 30, to: 32, severity: "high" },
    { name: "Burrata (Puglia)", type: "Food", subCategory: "Dairy", pctChange: 6.7, from: 4.5, to: 4.8, severity: "high" },
    { name: "Duck Breast", type: "Food", subCategory: "Poultry", pctChange: 5.9, from: 17, to: 18, severity: "high" },
    { name: "Hendrick's Gin", type: "Drinks", subCategory: "Gin", pctChange: 5.7, from: 26.5, to: 28, severity: "high" },
    { name: "Moët & Chandon", type: "Drinks", subCategory: "Champagne", pctChange: 5.6, from: 36, to: 38, severity: "high" },
    { name: "Aperol", type: "Drinks", subCategory: "Aperitif", pctChange: 5.1, from: 13.8, to: 14.5, severity: "high" },
    { name: "Black Cod", type: "Food", subCategory: "Fish", pctChange: 5.0, from: 40, to: 42, severity: "medium" },
    { name: "Prosecco Valdobbiadene", type: "Drinks", subCategory: "Sparkling", pctChange: 4.3, from: 11.5, to: 12, severity: "medium" },
    { name: "Remy Martin VSOP", type: "Drinks", subCategory: "Cognac", pctChange: 4.3, from: 46, to: 48, severity: "medium" },
    { name: "Don Julio 1942", type: "Drinks", subCategory: "Tequila", pctChange: 4.2, from: 142, to: 148, severity: "medium" },
    { name: "Tanqueray 10", type: "Drinks", subCategory: "Gin", pctChange: 4.0, from: 25, to: 26, severity: "medium" },
    { name: "Truffle (Périgord)", type: "Food", subCategory: "Fungi", pctChange: 3.2, from: 3.1, to: 3.2, severity: "medium" },
    { name: "Chablis 1er Cru", type: "Drinks", subCategory: "White Wine", pctChange: 3.2, from: 31, to: 32, severity: "medium" },
];

// ── Area Sparkline ─────────────────────────────────────────────────────────────
interface SparklineProps {
    color: string;
    trend: "up" | "down" | "flat";
    yLabels: string[];   // 3 y-axis labels, top to bottom
}

function Sparkline({ color, trend, yLabels }: SparklineProps) {
    const W = 200;
    const H = 52;
    const chartLeft = 0;
    const chartRight = W - 32; // leave room for y-axis labels
    const chartTop = 4;
    const chartBottom = H - 16; // leave room for x-axis labels
    const chartW = chartRight - chartLeft;
    const chartH = chartBottom - chartTop;

    const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    // Raw y values (0=bottom, 1=top) for each trend type
    const rawY: Record<string, number[]> = {
        up: [0.10, 0.22, 0.35, 0.48, 0.62, 0.78, 0.92],
        down: [0.92, 0.80, 0.68, 0.55, 0.42, 0.28, 0.14],
        flat: [0.50, 0.54, 0.48, 0.52, 0.50, 0.53, 0.50],
    };

    const ys = rawY[trend];
    const n = days.length;

    // Map to SVG coords
    const points = ys.map((y, i) => ({
        x: chartLeft + (i / (n - 1)) * chartW,
        y: chartTop + (1 - y) * chartH,
    }));

    // Build smooth cubic bezier path
    const linePath = points
        .map((p, i) => {
            if (i === 0) return `M ${p.x},${p.y}`;
            const prev = points[i - 1];
            const cpx = (prev.x + p.x) / 2;
            return `C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
        })
        .join(" ");

    // Close path for fill (go to bottom-right then bottom-left)
    const areaPath =
        linePath +
        ` L ${points[n - 1].x},${chartBottom} L ${points[0].x},${chartBottom} Z`;

    const gradId = `grad-${color.replace("#", "")}-${trend}`;

    // Y-axis label positions (top, middle, bottom of chart area)
    const yLabelPositions = [chartTop + 2, chartTop + chartH / 2, chartBottom - 2];
    const yLabelAnchors = ["start", "middle", "end"] as const;

    return (
        <svg
            width="100%"
            viewBox={`0 0 ${W} ${H}`}
            fill="none"
            style={{ display: "block", overflow: "visible" }}
        >
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>

            {/* Area fill */}
            <path d={areaPath} fill={`url(#${gradId})`} />

            {/* Line */}
            <path d={linePath} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Dots */}
            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2.2" fill={color} />
            ))}

            {/* X-axis day labels */}
            {days.map((d, i) => (
                <text
                    key={d}
                    x={chartLeft + (i / (n - 1)) * chartW}
                    y={H - 2}
                    fontSize="7"
                    fill="#c4c8d4"
                    textAnchor="middle"
                    fontFamily="inherit"
                >
                    {d}
                </text>
            ))}

            {/* Y-axis labels (right side) */}
            {yLabels.map((label, i) => (
                <text
                    key={i}
                    x={W - 1}
                    y={yLabelPositions[i]}
                    fontSize="7"
                    fill="#c4c8d4"
                    textAnchor="end"
                    dominantBaseline={yLabelAnchors[i] === "start" ? "hanging" : yLabelAnchors[i] === "middle" ? "middle" : "auto"}
                    fontFamily="inherit"
                >
                    {label}
                </text>
            ))}
        </svg>
    );
}

// ── KPI Card ───────────────────────────────────────────────────────────────────
function KpiCard({
    label,
    value,
    sub,
    badge,
    badgeColor,
    sparkColor,
    sparkTrend,
    yLabels,
}: {
    label: string;
    value: string;
    sub?: string;
    badge?: string;
    badgeColor?: string;
    sparkColor: string;
    sparkTrend: "up" | "down" | "flat";
    yLabels: string[];
}) {
    return (
        <div style={styles.kpiCard}>
            <p style={styles.kpiLabel}>{label}</p>
            <p style={styles.kpiValue}>{value}</p>
            {badge && (
                <span style={{ ...styles.badge, color: badgeColor || "#6b7280", borderColor: badgeColor || "#e5e7eb" }}>
                    {badge}
                </span>
            )}
            {sub && <p style={styles.kpiSub}>{sub}</p>}
            <div style={{ marginTop: 10 }}>
                <Sparkline color={sparkColor} trend={sparkTrend} yLabels={yLabels} />
            </div>
        </div>
    );
}

// ── Alert Icon ────────────────────────────────────────────────────────────────
function AlertIcon({ severity }: { severity: "high" | "medium" | "none" | "down" | "ok" }) {
    if (severity === "high") return <span style={{ color: "#ef4444", fontSize: 14 }}>⚠</span>;
    if (severity === "medium") return <span style={{ color: "#f59e0b", fontSize: 10 }}>●</span>;
    if (severity === "down") return <span style={{ color: "#10b981", fontSize: 13 }}>↓</span>;
    if (severity === "ok") return <span style={{ color: "#10b981", fontSize: 13 }}>✓</span>;
    return <span style={{ color: "#9ca3af", fontSize: 13 }}>—</span>;
}

function getAlertSeverity(item: FoodItem): "high" | "medium" | "none" | "down" | "ok" {
    if (item.pctChange > 5) return "high";
    if (item.pctChange > 0) return "medium";
    if (item.pctChange < 0) return "down";
    if (item.pctChange === 0 && item.deltaPrice === null) return "ok";
    return "none";
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function InventoryDashboard() {
    const [activeTab, setActiveTab] = useState<"Food" | "Drinks">("Food");

    return (
        <div style={styles.root}>
            {/* ── KPI Row ── */}
            <div style={styles.kpiRow}>
                <KpiCard
                    label="TOTAL STOCK VALUE"
                    value="€ 48,200"
                    badge="Frozen liquidity"
                    sub="Food: € 18,400 · Drinks: € 29,800"
                    sparkColor="#8b8fa8"
                    sparkTrend="up"
                    yLabels={["50,000", "45,000", "40,000"]}
                />
                <KpiCard
                    label="MONTHLY PURCHASES"
                    value="€ 18,000"
                    badge="▲ +3.2% vs LM"
                    badgeColor="#ef4444"
                    sub="Food: € 7,200 · Drinks: € 10,800"
                    sparkColor="#f97316"
                    sparkTrend="up"
                    yLabels={["18,000", "16,000", "14,000"]}
                />
                <KpiCard
                    label="FOOD COST %"
                    value="28.5%"
                    badge="Target: 28%"
                    badgeColor="#f59e0b"
                    sub="▲ +0.5pp vs LM"
                    sparkColor="#eab308"
                    sparkTrend="up"
                    yLabels={["28.5", "28.0", "27.5"]}
                />
                <KpiCard
                    label="DRINK COST %"
                    value="18.2%"
                    badge="On target"
                    badgeColor="#10b981"
                    sub="▼ −0.3pp vs LM"
                    sparkColor="#10b981"
                    sparkTrend="down"
                    yLabels={["19.0", "18.5", "18.0"]}
                />
                <KpiCard
                    label="PRICE ALERTS"
                    value="8"
                    badge="⚠ Price increases"
                    badgeColor="#f59e0b"
                    sub="vs previous purchase"
                    sparkColor="#ef4444"
                    sparkTrend="up"
                    yLabels={["10", "5", "0"]}
                />
            </div>

            {/* ── Tab Bar ── */}
            <div style={styles.tabBar}>
                {(["Food", "Drinks"] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        style={{
                            ...styles.tab,
                            ...(activeTab === t ? styles.tabActive : {}),
                        }}
                    >
                        <span style={{ marginRight: 5 }}>{t === "Food" ? "🍽" : "🍹"}</span>
                        {t}
                    </button>
                ))}
            </div>

            {/* ── Stock Table ── */}
            <div style={styles.card}>
                <p style={styles.tableTitle}>FOOD STOCK — PURCHASING PRICES</p>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            {["PRODUCT", "CATEGORY", "STOCK", "LAST PURCHASE", "PREV. PURCHASE", "Δ PRICE", "% CHANGE", "STOCK VALUE", "ALERT"].map(
                                (h) => (
                                    <th key={h} style={styles.th}>
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.map((item, i) => {
                            const severity = getAlertSeverity(item);
                            const isUp = item.pctChange > 0;
                            const isDown = item.pctChange < 0;
                            return (
                                <tr key={i} style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                    <td style={{ ...styles.td, fontWeight: 500, color: "#111827" }}>{item.product}</td>
                                    <td style={{ ...styles.td, color: "#6b7280" }}>{item.category}</td>
                                    <td style={{ ...styles.td, color: "#374151" }}>{item.stock}</td>
                                    <td style={styles.td}>€ {item.lastPurchase.toFixed(2)}</td>
                                    <td style={{ ...styles.td, color: "#9ca3af" }}>€ {item.prevPurchase.toFixed(2)}</td>
                                    <td style={{ ...styles.td, color: isUp ? "#ef4444" : isDown ? "#10b981" : "#9ca3af", fontWeight: 600 }}>
                                        {item.deltaPrice === null
                                            ? "—"
                                            : `${isUp ? "↑" : "↓"}${isUp ? "+" : ""}${item.deltaPrice.toFixed(2)}`}
                                    </td>
                                    <td style={{ ...styles.td, color: isUp ? "#ef4444" : isDown ? "#10b981" : "#9ca3af", fontWeight: 600 }}>
                                        {item.pctChange === 0 ? "0.0%" : `${isUp ? "+" : ""}${item.pctChange.toFixed(1)}%`}
                                    </td>
                                    <td style={{ ...styles.td, fontWeight: 500 }}>€ {item.stockValue.toLocaleString()}</td>
                                    <td style={{ ...styles.td, textAlign: "center" }}>
                                        <AlertIcon severity={severity} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div style={styles.pagination}>
                    <span style={{ color: "#9ca3af", fontSize: 12 }}>Show</span>
                    <select style={styles.select}>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    <span style={{ color: "#9ca3af", fontSize: 12 }}>per page</span>
                </div>
            </div>

            {/* ── Price Alerts Section ── */}
            <div style={styles.card}>
                <div style={styles.alertHeader}>
                    <div>
                        <p style={styles.alertTitle}>⚠ PRICE INCREASE ALERTS — VS PREVIOUS PURCHASE</p>
                        <p style={styles.alertSub}>
                            Products where purchase price has risen since last order &nbsp;
                            <span style={{ color: "#ef4444" }}>⚠ High (&gt;5%)</span>&nbsp;
                            <span style={{ color: "#f59e0b" }}>● Medium (1–5%)</span>
                        </p>
                    </div>
                    <div style={styles.alertLegend}>
                        <span style={{ color: "#ef4444", fontSize: 12, marginRight: 12 }}>⚠ &gt;5% increase</span>
                        <span style={{ color: "#f59e0b", fontSize: 12, marginRight: 12 }}>● 1–5% increase</span>
                        <span style={{ color: "#9ca3af", fontSize: 12 }}>Decreases not shown</span>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                    {priceAlerts.map((a, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.alertRow,
                                background: a.severity === "high" ? "#fff5f5" : "#fffbf0",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ color: a.severity === "high" ? "#ef4444" : "#f59e0b", fontSize: 14 }}>
                                    {a.severity === "high" ? "⚠" : "●"}
                                </span>
                                <div>
                                    <p style={styles.alertName}>{a.name}</p>
                                    <p style={styles.alertMeta}>
                                        <span style={{ color: a.type === "Food" ? "#6b7280" : "#8b5cf6" }}>■</span>{" "}
                                        {a.type} · {a.subCategory}
                                    </p>
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ color: "#ef4444", fontWeight: 700, fontSize: 13, margin: 0 }}>
                                    ↑ +{a.pctChange.toFixed(1)}%
                                </p>
                                <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>
                                    € {a.from.toFixed(2)} → € {a.to.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    root: {
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: "24px",
        boxSizing: "border-box",
        color: "#111827",
    },
    kpiRow: {
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12,
        marginBottom: 20,
    },
    kpiCard: {
        background: "#fff",
        borderRadius: 12,
        padding: "16px 18px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    kpiLabel: {
        fontSize: 9,
        letterSpacing: "0.08em",
        color: "#9ca3af",
        textTransform: "uppercase" as const,
        margin: "0 0 4px",
    },
    kpiValue: {
        fontSize: 28,
        fontWeight: 700,
        margin: "0 0 6px",
        color: "#111827",
        letterSpacing: "-0.5px",
    },
    badge: {
        display: "inline-block",
        fontSize: 10,
        border: "1px solid",
        borderRadius: 4,
        padding: "1px 6px",
        marginBottom: 4,
    },
    kpiSub: {
        fontSize: 10,
        color: "#9ca3af",
        margin: "2px 0 0",
    },
    tabBar: {
        display: "flex",
        gap: 8,
        marginBottom: 16,
    },
    tab: {
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "7px 16px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        color: "#6b7280",
        transition: "all 0.15s",
    },
    tabActive: {
        background: "#111827",
        color: "#fff",
        border: "1px solid #111827",
    },
    card: {
        background: "#fff",
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        marginBottom: 16,
        overflowX: "auto" as const,
    },
    tableTitle: {
        fontSize: 10,
        letterSpacing: "0.1em",
        color: "#9ca3af",
        textTransform: "uppercase" as const,
        marginBottom: 14,
        fontWeight: 600,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse" as const,
        fontSize: 13,
    },
    th: {
        textAlign: "left" as const,
        fontSize: 9,
        letterSpacing: "0.07em",
        color: "#9ca3af",
        fontWeight: 600,
        textTransform: "uppercase" as const,
        paddingBottom: 10,
        paddingRight: 16,
        borderBottom: "1px solid #f3f4f6",
        whiteSpace: "nowrap" as const,
    },
    td: {
        padding: "10px 16px 10px 0",
        borderBottom: "1px solid #f9fafb",
        color: "#374151",
        verticalAlign: "middle" as const,
        whiteSpace: "nowrap" as const,
    },
    rowEven: { background: "transparent" },
    rowOdd: { background: "#fafafa" },
    pagination: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 16,
    },
    select: {
        border: "1px solid #e5e7eb",
        borderRadius: 6,
        padding: "3px 8px",
        fontSize: 12,
        color: "#374151",
        background: "#fff",
    },
    alertHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap" as const,
        gap: 8,
    },
    alertTitle: {
        fontSize: 10,
        letterSpacing: "0.08em",
        color: "#ef4444",
        textTransform: "uppercase" as const,
        fontWeight: 700,
        margin: 0,
    },
    alertSub: {
        fontSize: 11,
        color: "#9ca3af",
        margin: "4px 0 0",
    },
    alertLegend: {
        display: "flex",
        alignItems: "center",
    },
    alertRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 14px",
        borderRadius: 8,
    },
    alertName: {
        fontWeight: 600,
        fontSize: 13,
        margin: 0,
        color: "#111827",
    },
    alertMeta: {
        fontSize: 11,
        color: "#9ca3af",
        margin: "2px 0 0",
    },
};