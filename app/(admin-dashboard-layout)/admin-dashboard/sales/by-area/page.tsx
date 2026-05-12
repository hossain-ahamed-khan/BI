"use client";
import React, { useState, useMemo } from "react";
import { useRange } from "@/components/range-context";
import { useSalesByArea } from "@/hooks/use-metrics";
import { SalesByAreaData } from "@/lib/types/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface KpiCardData {
    label: string;
    value: string;
    vsLY: string;
    vsLYPositive: boolean;
    ytd?: string;
}

interface TableRow {
    label: string;
    cols: { value: string; vs?: string; vsPositive?: boolean }[];
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
    root: { fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: "#f4f5f7", minHeight: "100vh", padding: "0" },
    card: { background: "#fff", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" },
    topNav: { display: "flex", gap: 4, padding: "12px 20px", borderBottom: "1px solid #f0f0f0", background: "#fff", borderRadius: "16px 16px 0 0" },
    subNav: { display: "flex", gap: 0, padding: "12px 20px 0", background: "#fff" },
    sectionLabel: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#aaa", padding: "16px 20px 8px", textTransform: "uppercase" },
    kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, padding: "0 20px 20px" },
    kpiCard: { background: "#fff", border: "1px solid #ebebeb", borderRadius: 12, padding: "16px 18px" },
    kpiLabel: { fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#aaa", marginBottom: 8, textTransform: "uppercase" },
    kpiValue: { fontSize: 32, fontWeight: 300, color: "#1a1a1a", marginBottom: 6 },
    kpiYtd: { fontSize: 11, color: "#bbb" },
    tableWrap: { overflowX: "auto", padding: "0 20px 20px" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
    th: { textAlign: "left", fontSize: 10, fontWeight: 600, color: "#aaa", letterSpacing: "0.07em", padding: "6px 10px", textTransform: "uppercase", borderBottom: "1px solid #f0f0f0" },
    td: { padding: "9px 10px", color: "#333", borderBottom: "1px solid #f8f8f8" },
    tdLabel: { padding: "9px 10px", color: "#888", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #f8f8f8" },
};

// Dynamic style functions
const dynStyles = {
    topNavBtn: (active: boolean): React.CSSProperties => ({
        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
        background: active ? "#6c47ff" : "transparent", color: active ? "#fff" : "#555",
        fontWeight: active ? 600 : 400, fontSize: 14, transition: "all 0.15s",
    }),
    subNavBtn: (active: boolean): React.CSSProperties => ({
        padding: "8px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400,
        color: active ? "#6c47ff" : "#666", background: "transparent",
        borderBottom: active ? "2px solid #6c47ff" : "2px solid transparent", transition: "all 0.15s",
    }),
    kpiBadge: (positive: boolean): React.CSSProperties => ({
        display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11, fontWeight: 600,
        color: positive ? "#12b76a" : "#f04438", marginBottom: 4,
    }),
    badge: (positive: boolean): React.CSSProperties => ({
        fontSize: 11, fontWeight: 600, color: positive ? "#12b76a" : "#f04438",
        padding: "9px 10px", borderBottom: "1px solid #f8f8f8",
    }),
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function KpiCard({ kpi }: { kpi: KpiCardData }) {
    return (
        <div style={styles.kpiCard}>
            <div style={styles.kpiLabel}>{kpi.label}</div>
            <div style={styles.kpiValue}>{kpi.value}</div>
            <div style={dynStyles.kpiBadge(kpi.vsLYPositive)}>
                {kpi.vsLYPositive ? "▲" : "▼"}{kpi.vsLY.replace("+", "").replace("-", "")}
            </div>
            {kpi.ytd && <div style={styles.kpiYtd}>{kpi.ytd}</div>}
        </div>
    );
}

function DataTable({ headers, rows }: { headers: string[]; rows: TableRow[] }) {
    return (
        <div style={styles.tableWrap}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} style={styles.th}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            <td style={styles.tdLabel}>{row.label}</td>
                            {row.cols.map((col, ci) => (
                                <td key={ci} style={col.vsPositive !== undefined ? dynStyles.badge(col.vsPositive) : styles.td}>
                                    {col.value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function VenueDashboard() {
    const { activeRange, customStart, customEnd } = useRange();
    const { data: apiData, isLoading, error } = useSalesByArea(activeRange, customStart, customEnd);

    const [activeSection, setActiveSection] = useState("Restaurants");
    const [activeAreaName, setActiveAreaName] = useState<string | null>(null);

    // Grouping Logic
    const groupedData = useMemo(() => {
        if (!apiData) return { Restaurants: [], Bars: [], "VIP Tables": [] };

        const restaurants = ["El Comedor", "Japanese Restaurant", "Jazz Club", "Mesas Altas", "Walk-in / Bar"];
        const bars = ["Other / Bar"];
        const vips = ["Private Club"];

        return {
            Restaurants: apiData.table.filter(a => restaurants.includes(a.area)),
            Bars: apiData.table.filter(a => bars.includes(a.area)),
            "VIP Tables": apiData.table.filter(a => vips.includes(a.area)),
        };
    }, [apiData]);

    const sections = [
        { name: "Restaurants", icon: "🍽", data: groupedData.Restaurants },
        { name: "Bars", icon: "🍸", data: groupedData.Bars },
        { name: "VIP Tables", icon: "✦", data: groupedData["VIP Tables"] },
    ];

    const currentSection = sections.find(s => s.name === activeSection) || sections[0];
    
    // Auto-select first area in section if none selected
    const activeArea = useMemo(() => {
        if (!currentSection.data.length) return null;
        return currentSection.data.find(a => a.area === activeAreaName) || currentSection.data[0];
    }, [currentSection, activeAreaName]);

    if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading Sales Data...</div>;
    if (error || !apiData) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error loading data. Please try again.</div>;

    const kpis: KpiCardData[] = activeArea ? [
        { label: "GROSS REVENUE", value: `€${Math.round(activeArea.revenue).toLocaleString()}`, vsLY: `${activeArea.growth_ly >= 0 ? '+' : ''}${activeArea.growth_ly}% vs LY`, vsLYPositive: activeArea.growth_ly >= 0 },
        { label: "NET REVENUE", value: `€${Math.round(activeArea.revenue * 0.88).toLocaleString()}`, vsLY: "0% vs LY", vsLYPositive: true },
        { label: "ORDERS", value: activeArea.order_count.toString(), vsLY: "0% vs LY", vsLYPositive: true },
        { label: "AVG ORDER", value: `€${activeArea.avg_order_value.toFixed(1)}`, vsLY: "0% vs LY", vsLYPositive: true },
        { label: "PERC OF TOTAL", value: `${activeArea.perc_of_total}%`, vsLY: "0% vs LY", vsLYPositive: true },
    ] : [];

    // Mocking rows for the table since the API doesn't provide historical breakdown yet
    const tableHeaders = ["DATE", "REVENUE", "ORDERS", "AVG ORDER"];
    const tableRows: TableRow[] = apiData?.chart.data.map(d => ({
        label: d.date,
        cols: [
            { value: `€${Math.round(d[activeArea?.area || ''] || 0).toLocaleString()}` },
            { value: "-" },
            { value: "-" },
        ]
    })) || [];

    return (
        <div style={styles.root}>
            <div style={{ width: "100%", margin: "24px 0", padding: "0 24px" }}>
                <div style={styles.card}>
                    {/* Top nav */}
                    <div style={styles.topNav}>
                        {sections.map((s, i) => (
                            <button key={i} style={dynStyles.topNavBtn(s.name === activeSection)} onClick={() => { setActiveSection(s.name); setActiveAreaName(null); }}>
                                <span>{s.icon}</span>
                                {s.name}
                            </button>
                        ))}
                    </div>

                    {/* Sub nav */}
                    {currentSection.data.length > 1 && (
                        <div style={styles.subNav}>
                            {currentSection.data.map((area, i) => (
                                <button key={i} style={dynStyles.subNavBtn(area.area === activeArea?.area)} onClick={() => setActiveAreaName(area.area)}>
                                    {area.area}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Section label */}
                    <div style={styles.sectionLabel}>{activeArea?.area}</div>

                    {/* KPI cards */}
                    <div style={styles.kpiGrid}>
                        {kpis.map((kpi, i) => (
                            <KpiCard key={i} kpi={kpi} />
                        ))}
                    </div>

                    {/* Data table */}
                    <DataTable headers={tableHeaders} rows={tableRows} />
                </div>
            </div>
        </div>
    );
}
