"use client";
import React, { useState, useCallback, CSSProperties } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CategoryItem {
    name: string;
    productsSold: number;
    grossRevenue: number;
    netRevenue: number;
    pctOfTotal: number;
}

interface Category extends CategoryItem {
    items: CategoryItem[];
}

interface Series {
    label: string;
    color: string;
    values: number[];
}

type SortKey = keyof Omit<CategoryItem, "name">;
type SortDir = "asc" | "desc";

// ── Data ───────────────────────────────────────────────────────────────────────

const DAYS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SERIES: Series[] = [
    { label: "Bar & Cocktails", color: "#7c6fcd", values: [4.8, 4.9, 5.1, 6.0, 7.3, 8.1, 7.8] },
    { label: "Food Mains", color: "#f97316", values: [4.4, 4.6, 4.8, 5.8, 6.9, 7.5, 7.2] },
    { label: "Spirits", color: "#10b981", values: [4.1, 4.2, 4.4, 5.2, 6.2, 6.7, 6.5] },
    { label: "Champagne & Wine", color: "#059669", values: [3.8, 3.9, 4.1, 4.9, 5.8, 6.2, 6.1] },
    { label: "Food Starters", color: "#8b5cf6", values: [3.3, 3.4, 3.6, 4.4, 5.1, 5.4, 5.2] },
    { label: "Soft Drinks", color: "#fb923c", values: [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8] },
];

const CATEGORIES: Category[] = [
    {
        name: "Bar & Cocktails", productsSold: 3285, grossRevenue: 49275, netRevenue: 43362, pctOfTotal: 24.6,
        items: [
            { name: "Jacqueline Sig.", productsSold: 900, grossRevenue: 13500, netRevenue: 11880, pctOfTotal: 6.7 },
            { name: "Spicy Margarita", productsSold: 750, grossRevenue: 11250, netRevenue: 9900, pctOfTotal: 5.6 },
            { name: "Pornstar Martini", productsSold: 620, grossRevenue: 9300, netRevenue: 8184, pctOfTotal: 4.6 },
            { name: "Espresso Martini", productsSold: 405, grossRevenue: 6075, netRevenue: 5346, pctOfTotal: 3.0 },
        ],
    },
    {
        name: "Food Mains", productsSold: 1760, grossRevenue: 44800, netRevenue: 39424, pctOfTotal: 22.3,
        items: [
            { name: "Black Cod", productsSold: 520, grossRevenue: 10400, netRevenue: 9152, pctOfTotal: 5.2 },
            { name: "Wagyu Steak", productsSold: 180, grossRevenue: 9000, netRevenue: 7920, pctOfTotal: 4.5 },
            { name: "Steak Tartare", productsSold: 370, grossRevenue: 9000, netRevenue: 7920, pctOfTotal: 4.5 },
            { name: "Ceviche", productsSold: 415, grossRevenue: 8225, netRevenue: 5478, pctOfTotal: 3.1 },
        ],
    },
    {
        name: "Spirits", productsSold: 180, grossRevenue: 36000, netRevenue: 31680, pctOfTotal: 17.9,
        items: [
            { name: "Don Julio 1942", productsSold: 18, grossRevenue: 14400, netRevenue: 12672, pctOfTotal: 7.2 },
            { name: "Macallan 18", productsSold: 12, grossRevenue: 7200, netRevenue: 6336, pctOfTotal: 3.6 },
            { name: "Grey Goose", productsSold: 80, grossRevenue: 6400, netRevenue: 5632, pctOfTotal: 3.2 },
        ],
    },
    {
        name: "Champagne & Wine", productsSold: 210, grossRevenue: 34500, netRevenue: 30360, pctOfTotal: 17.2,
        items: [
            { name: "Dom Pérignon", productsSold: 24, grossRevenue: 12000, netRevenue: 10500, pctOfTotal: 6.0 },
            { name: "Vega Sicilia", productsSold: 36, grossRevenue: 9000, netRevenue: 7920, pctOfTotal: 4.5 },
            { name: "Ruinart Blanc", productsSold: 30, grossRevenue: 7500, netRevenue: 6600, pctOfTotal: 3.7 },
        ],
    },
    {
        name: "Food Starters", productsSold: 1840, grossRevenue: 27600, netRevenue: 24288, pctOfTotal: 13.8,
        items: [
            { name: "Oysters", productsSold: 325, grossRevenue: 7800, netRevenue: 6864, pctOfTotal: 3.9 },
            { name: "Foie Gras", productsSold: 210, grossRevenue: 6300, netRevenue: 5544, pctOfTotal: 3.1 },
            { name: "Burrata", productsSold: 240, grossRevenue: 3600, netRevenue: 3168, pctOfTotal: 1.8 },
        ],
    },
    {
        name: "Soft Drinks", productsSold: 2100, grossRevenue: 8400, netRevenue: 7392, pctOfTotal: 4.2,
        items: [
            { name: "Still Water", productsSold: 800, grossRevenue: 3200, netRevenue: 2816, pctOfTotal: 1.6 },
            { name: "Sparkling", productsSold: 600, grossRevenue: 2400, netRevenue: 2112, pctOfTotal: 1.2 },
            { name: "Juices", productsSold: 700, grossRevenue: 2100, netRevenue: 1848, pctOfTotal: 1.0 },
        ],
    },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtEur(n: number): string {
    return "€ " + n.toLocaleString("de-DE", { minimumFractionDigits: 0 });
}

function fmtNum(n: number): string {
    return n.toLocaleString("de-DE");
}

// Chart viewport constants
const CHART_W = 800;
const CHART_H = 170;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 10;
const PAD_B = 30;
const MAX_VAL = 10;

function toX(index: number): number {
    return PAD_L + (index / (DAYS.length - 1)) * (CHART_W - PAD_L - PAD_R);
}

function toY(value: number): number {
    return PAD_T + (1 - value / MAX_VAL) * (CHART_H - PAD_T - PAD_B);
}

function buildPolyPoints(values: number[]): string {
    return values.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
}

// ── Shared styles ──────────────────────────────────────────────────────────────

const cardStyle: CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const sectionTitleStyle: CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: "#9aa0ac",
    textTransform: "uppercase",
    marginBottom: 16,
};

const thBaseStyle: CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    color: "#9aa0ac",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    padding: "6px 8px",
    borderBottom: "1px solid #f0f0f0",
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
};

// ── LegendDot ──────────────────────────────────────────────────────────────────

interface LegendDotProps {
    color: string;
}

const LegendDot: React.FC<LegendDotProps> = ({ color }) => (
    <span
        style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: color,
            marginRight: 6,
            flexShrink: 0,
        }}
    />
);

// ── SortIndicator ──────────────────────────────────────────────────────────────

interface SortIndicatorProps {
    column: SortKey;
    activeKey: SortKey | null;
    dir: SortDir;
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ column, activeKey, dir }) => {
    if (activeKey !== column) return <> ↕</>;
    return <> {dir === "asc" ? "↑" : "↓"}</>;
};

// ── LineChart ──────────────────────────────────────────────────────────────────

const LineChart: React.FC = () => (
    <div style={{ width: "100%" }}>
        {/* Legend */}
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px 20px",
                justifyContent: "center",
                marginBottom: 14,
            }}
        >
            {SERIES.map((s) => (
                <div
                    key={s.label}
                    style={{ display: "flex", alignItems: "center", fontSize: 11, color: "#555" }}
                >
                    <LegendDot color={s.color} />
                    {s.label}
                </div>
            ))}
        </div>

        {/* SVG chart */}
        <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            style={{ width: "100%", height: "auto", display: "block" }}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Grid lines */}
            {([0, 5, 10] as const).map((v) => (
                <line
                    key={v}
                    x1={PAD_L}
                    y1={toY(v)}
                    x2={CHART_W - PAD_R}
                    y2={toY(v)}
                    stroke="#efefef"
                    strokeWidth={1}
                />
            ))}

            {/* Y-axis labels */}
            {(
                [
                    { v: 10, label: "€10k" },
                    { v: 5, label: "€5k" },
                    { v: 0, label: "€0k" },
                ] as const
            ).map(({ v, label }) => (
                <text
                    key={v}
                    x={PAD_L - 6}
                    y={toY(v) + 4}
                    textAnchor="end"
                    fontSize={10}
                    fill="#aaa"
                >
                    {label}
                </text>
            ))}

            {/* Series polylines + dots */}
            {SERIES.map((s) => (
                <g key={s.label}>
                    <polyline
                        points={buildPolyPoints(s.values)}
                        fill="none"
                        stroke={s.color}
                        strokeWidth={2}
                        strokeLinejoin="round"
                    />
                    {s.values.map((v, i) => (
                        <circle key={i} cx={toX(i)} cy={toY(v)} r={3.5} fill={s.color} />
                    ))}
                </g>
            ))}

            {/* X-axis labels */}
            {DAYS.map((day, i) => (
                <text
                    key={day}
                    x={toX(i)}
                    y={CHART_H - 4}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#aaa"
                >
                    {day}
                </text>
            ))}
        </svg>
    </div>
);

// ── SalesTable ─────────────────────────────────────────────────────────────────

const SalesTable: React.FC = () => {
    const [expanded, setExpanded] = useState<Set<string>>(
        () => new Set(CATEGORIES.map((c) => c.name))
    );
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const toggleExpand = useCallback((name: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            return next;
        });
    }, []);

    const handleSort = useCallback(
        (key: SortKey) => {
            if (sortKey === key) {
                setSortDir((d) => (d === "asc" ? "desc" : "asc"));
            } else {
                setSortKey(key);
                setSortDir("desc");
            }
        },
        [sortKey]
    );

    const sortedCategories: Category[] = sortKey
        ? [...CATEGORIES].sort((a, b) => {
            const diff = a[sortKey] - b[sortKey];
            return sortDir === "asc" ? diff : -diff;
        })
        : CATEGORIES;

    const thLeft: CSSProperties = { ...thBaseStyle, textAlign: "left" };
    const thRight: CSSProperties = { ...thBaseStyle, textAlign: "right" };

    return (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
                <tr>
                    <th style={thLeft}>Category</th>
                    <th style={thRight} onClick={() => handleSort("productsSold")}>
                        Products Sold
                        <SortIndicator column="productsSold" activeKey={sortKey} dir={sortDir} />
                    </th>
                    <th style={thRight} onClick={() => handleSort("grossRevenue")}>
                        Gross Revenue
                        <SortIndicator column="grossRevenue" activeKey={sortKey} dir={sortDir} />
                    </th>
                    <th style={thRight} onClick={() => handleSort("netRevenue")}>
                        Net Revenue
                        <SortIndicator column="netRevenue" activeKey={sortKey} dir={sortDir} />
                    </th>
                    <th style={thRight} onClick={() => handleSort("pctOfTotal")}>
                        % of Total
                        <SortIndicator column="pctOfTotal" activeKey={sortKey} dir={sortDir} />
                    </th>
                </tr>
            </thead>
            <tbody>
                {sortedCategories.map((cat) => {
                    const isOpen = expanded.has(cat.name);
                    return (
                        <React.Fragment key={cat.name}>
                            {/* Category row */}
                            <tr
                                style={{ borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}
                                onClick={() => toggleExpand(cat.name)}
                            >
                                <td style={{ padding: "12px 8px 6px", fontWeight: 600, color: "#222", fontSize: 12 }}>
                                    {cat.name}
                                    <span style={{ fontSize: 10, color: "#aaa", marginLeft: 4 }}>
                                        {isOpen ? "▴" : "▾"}
                                    </span>
                                </td>
                                <td style={{ padding: "12px 8px 6px", textAlign: "right", color: "#333" }}>
                                    {fmtNum(cat.productsSold)}
                                </td>
                                <td style={{ padding: "12px 8px 6px", textAlign: "right", color: "#333" }}>
                                    {fmtEur(cat.grossRevenue)}
                                </td>
                                <td style={{ padding: "12px 8px 6px", textAlign: "right", color: "#333" }}>
                                    {fmtEur(cat.netRevenue)}
                                </td>
                                <td style={{ padding: "12px 8px 6px", textAlign: "right", color: "#6366f1", fontWeight: 500 }}>
                                    {cat.pctOfTotal.toFixed(1)}%
                                </td>
                            </tr>

                            {/* Item rows */}
                            {isOpen &&
                                cat.items.map((item) => (
                                    <tr key={item.name} style={{ borderBottom: "1px solid #f9f9f9" }}>
                                        <td style={{ padding: "8px 8px 8px 24px", color: "#666", fontSize: 12 }}>
                                            ↳ {item.name}
                                        </td>
                                        <td style={{ padding: "8px", textAlign: "right", color: "#666" }}>
                                            {fmtNum(item.productsSold)}
                                        </td>
                                        <td style={{ padding: "8px", textAlign: "right", color: "#666" }}>
                                            {fmtEur(item.grossRevenue)}
                                        </td>
                                        <td style={{ padding: "8px", textAlign: "right", color: "#666" }}>
                                            {fmtEur(item.netRevenue)}
                                        </td>
                                        <td style={{ padding: "8px", textAlign: "right", color: "#6366f1", fontSize: 11 }}>
                                            {item.pctOfTotal.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
};

// ── RevenueDashboard (root) ────────────────────────────────────────────────────

const RevenueDashboard: React.FC = () => (
    <div
        style={{
            background: "#f4f5f7",
            padding: 16,
            minHeight: "100vh",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
    >
        {/* Chart card */}
        <div style={cardStyle}>
            <p style={sectionTitleStyle}>Revenue by Category – Over Time</p>
            <LineChart />
        </div>

        {/* Table card */}
        <div style={cardStyle}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                }}
            >
                <p style={{ ...sectionTitleStyle, marginBottom: 0 }}>Sales by Category</p>
                <span style={{ fontSize: 10, color: "#9aa0ac" }}>↕ Click columns to sort</span>
            </div>
            <SalesTable />
        </div>
    </div>
);

export default RevenueDashboard;