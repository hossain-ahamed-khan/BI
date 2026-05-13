"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRange } from "@/components/range-context";
import { useSalesByArea } from "@/hooks/use-metrics";

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    root: { fontFamily: "'Inter', sans-serif", background: "#f8fafc", minHeight: "100vh", padding: "24px" },
    card: { background: "#fff", borderRadius: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9", overflow: "hidden" },
    
    topTabs: { display: "flex", gap: 32, padding: "0 28px", borderBottom: "1px solid #f1f5f9", background: "#fff" },
    topTab: { padding: "16px 4px", border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#94a3b8", position: "relative", transition: "all 0.2s" },
    topTabActive: { color: "#6366f1" },
    topTabIndicator: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#6366f1" },

    content: { padding: "28px" },
    areaTabs: { display: "flex", gap: 12, marginBottom: 28 },
    areaTab: { padding: "8px 20px", borderRadius: 99, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#64748b", transition: "all 0.2s" },
    areaTabActive: { background: "#6366f1", color: "#fff", border: "1px solid #6366f1" },

    kpiRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 },
    kpiCard: { padding: "20px 24px", borderRadius: 16, border: "1px solid #f1f5f9", background: "#fff", display: "flex", flexDirection: "column", gap: 4 },
    kpiLabel: { fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" },
    kpiValue: { fontSize: 24, fontWeight: 600, color: "#1e293b" },
    kpiGrowth: { fontSize: 11, fontWeight: 700 },

    tableCard: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" },
    td: { padding: "16px", fontSize: 13, color: "#1e293b", borderBottom: "1px solid #f8fafc" },
};

function fmtEur(n: number) { return "€ " + n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

export default function SalesByAreaPage() {
    const { activeRange } = useRange();
    const { data: apiData, isLoading, error } = useSalesByArea(activeRange);
    const [activeTab, setActiveTab] = useState("Restaurants");

    const categories: ("Restaurants" | "Bars" | "VIP Tables")[] = ["Restaurants", "Bars", "VIP Tables"];
    
    const areas = useMemo(() => {
        if (!apiData?.table) return [];
        // Heuristic to group areas
        return apiData.table.map(area => {
            let cat = "Restaurants";
            if (["Other / Bar", "Cocktail Bar", "Walk-in / Bar"].includes(area.area)) cat = "Bars";
            if (["Private Club"].includes(area.area)) cat = "VIP Tables";
            return { ...area, category: cat };
        });
    }, [apiData]);

    const activeAreas = useMemo(() => areas.filter(a => a.category === activeTab), [areas, activeTab]);
    const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
    const activeArea = activeAreas.find(a => a.area === selectedAreaName) || activeAreas[0];

    useEffect(() => { if (activeAreas.length > 0 && !selectedAreaName) setSelectedAreaName(activeAreas[0].area); }, [activeAreas, selectedAreaName]);

    if (isLoading) return <div>Loading...</div>;
    if (error || !apiData) return <div>Error...</div>;

    return (
        <div style={styles.root}>
            <div style={styles.card}>
                <div style={styles.topTabs}>
                    {categories.map(cat => (
                        <button key={cat} style={{...styles.topTab, ...(activeTab === cat ? styles.topTabActive : {})}} onClick={() => { setActiveTab(cat); setSelectedAreaName(null); }}>
                            {cat} {activeTab === cat && <div style={styles.topTabIndicator} />}
                        </button>
                    ))}
                </div>
                <div style={styles.content}>
                    <div style={styles.areaTabs}>
                        {activeAreas.map(area => (
                            <button key={area.area} style={{...styles.areaTab, ...(activeArea?.area === area.area ? styles.areaTabActive : {})}} onClick={() => setSelectedAreaName(area.area)}>
                                {area.area}
                            </button>
                        ))}
                    </div>

                    {activeArea && (
                        <>
                            <div style={styles.kpiRow}>
                                <div style={styles.kpiCard}><span style={styles.kpiLabel}>GROSS REVENUE</span><span style={styles.kpiValue}>{fmtEur(activeArea.gross_revenue)}</span><span style={{...styles.kpiGrowth, color: activeArea.gross_revenue_ly_growth >= 0 ? '#10b981' : '#ef4444'}}>▲ {activeArea.gross_revenue_ly_growth}% vs LY</span></div>
                                <div style={styles.kpiCard}><span style={styles.kpiLabel}>NET REVENUE</span><span style={styles.kpiValue}>{fmtEur(activeArea.net_revenue)}</span><span style={{...styles.kpiGrowth, color: activeArea.net_revenue_ly_growth >= 0 ? '#10b981' : '#ef4444'}}>▲ {activeArea.net_revenue_ly_growth}% vs LY</span></div>
                                <div style={styles.kpiCard}><span style={styles.kpiLabel}>COVERS</span><span style={styles.kpiValue}>{activeArea.covers}</span></div>
                                <div style={styles.kpiCard}><span style={styles.kpiLabel}>AVG TICKET</span><span style={styles.kpiValue}>{fmtEur(activeArea.avg_ticket)}</span></div>
                            </div>

                            <div style={styles.tableCard}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>WEEK</th>
                                            <th style={styles.th}>GROSS REV</th>
                                            <th style={styles.th}>NET REV</th>
                                            <th style={styles.th}>DISCOUNTS</th>
                                            <th style={styles.th}>COVERS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeArea.trends.map((t, i) => (
                                            <tr key={i}>
                                                <td style={styles.td}>{t.period}</td>
                                                <td style={styles.td}>{fmtEur(t.gross_revenue)}</td>
                                                <td style={styles.td}>{fmtEur(t.net_revenue)}</td>
                                                <td style={styles.td}>{fmtEur(t.discounts)}</td>
                                                <td style={styles.td}>{t.covers}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
