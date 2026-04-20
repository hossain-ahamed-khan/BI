"use client";
import { useState } from "react";

const trendData = {
    absenteeism: [2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3],
    costBajas: [4400, 4600, 4800, 5000, 5200, 5400, 5568],
    sickLeaves: [1, 2, 2, 2, 3, 3, 3],
    overtime: [100, 110, 118, 125, 130, 138, 142],
    punctuality: [92, 93, 93, 94, 94, 94, 94.2],
};

function MiniLineChart({
    data,
    color,
    filled = false,
}: {
    data: number[];
    color: string;
    filled?: boolean;
}) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 180;
    const h = 40;
    const pts = data.map(
        (v, i) =>
            `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`
    );
    const polyline = pts.join(" ");
    const area = `${pts[0].split(",")[0]},${h} ${polyline} ${pts[pts.length - 1].split(",")[0]},${h}`;

    return (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 40 }}>
            {filled && (
                <polygon
                    points={area}
                    fill={color}
                    opacity={0.15}
                />
            )}
            <polyline
                points={polyline}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            {data.map((_, i) => {
                const [x, y] = pts[i].split(",").map(Number);
                return (
                    <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
                );
            })}
        </svg>
    );
}

const absenceWeeks = [
    { s: "S1", sick: 40, workAcc: 20, paid: 10, mat: 0 },
    { s: "S2", sick: 60, workAcc: 30, paid: 15, mat: 0 },
    { s: "S3", sick: 50, workAcc: 40, paid: 20, mat: 0 },
    { s: "S4", sick: 80, workAcc: 50, paid: 25, mat: 0 },
    { s: "S5", sick: 90, workAcc: 60, paid: 30, mat: 50 },
    { s: "S6", sick: 100, workAcc: 70, paid: 20, mat: 200 },
    { s: "S7", sick: 80, workAcc: 50, paid: 10, mat: 350 },
    { s: "S8", sick: 40, workAcc: 30, paid: 5, mat: 550 },
];

function AbsenceBar({ week }: { week: (typeof absenceWeeks)[0] }) {
    const maxH = 120;
    const scale = maxH / 800;
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    height: maxH,
                    width: 18,
                    gap: 1,
                    justifyContent: "flex-start",
                }}
            >
                {week.sick > 0 && (
                    <div style={{ background: "#FF6B6B", height: week.sick * scale, borderRadius: 2 }} />
                )}
                {week.workAcc > 0 && (
                    <div style={{ background: "#FFA726", height: week.workAcc * scale, borderRadius: 2 }} />
                )}
                {week.paid > 0 && (
                    <div style={{ background: "#AB47BC", height: week.paid * scale, borderRadius: 2 }} />
                )}
                {week.mat > 0 && (
                    <div style={{ background: "#26C6DA", height: week.mat * scale, borderRadius: 2 }} />
                )}
            </div>
            <span style={{ fontSize: 10, color: "#999" }}>{week.s}</span>
        </div>
    );
}

const absenceData = [
    {
        name: "A. Fernández",
        dept: "Kitchen",
        type: "Sick Leave",
        typeColor: "#FF6B6B",
        start: "03 Mar",
        days: 10,
        hours: "80h",
        cost: "€ 640",
        status: "Active",
        statusColor: "#FF6B6B",
    },
    {
        name: "C. Martínez",
        dept: "Floor",
        type: "Work Accident",
        typeColor: "#FFA726",
        start: "28 Feb",
        days: 13,
        hours: "104h",
        cost: "€ 832",
        status: "Active",
        statusColor: "#FF6B6B",
    },
    {
        name: "L. García",
        dept: "Bar",
        type: "Paid Leave",
        typeColor: "#AB47BC",
        start: "10 Mar",
        days: 3,
        hours: "24h",
        cost: "€ 192",
        status: "Closed",
        statusColor: "#26C6DA",
    },
    {
        name: "M. López",
        dept: "Kitchen",
        type: "Maternity",
        typeColor: "#26C6DA",
        start: "15 Ene",
        days: 56,
        hours: "448h",
        cost: "€ 3,584",
        status: "Active",
        statusColor: "#FF6B6B",
    },
    {
        name: "R. Torres",
        dept: "Floor",
        type: "Sick Leave",
        typeColor: "#FF6B6B",
        start: "08 Mar",
        days: 5,
        hours: "40h",
        cost: "€ 320",
        status: "Closed",
        statusColor: "#26C6DA",
    },
];

const productivityData = [
    { name: "J. Pérez", dept: "Kitchen", contract: "160h", worked: "168h", extra: "+8h", extraColor: "#4CAF50", prod: "€ 68.4", punct: "98%", punctColor: "#4CAF50", cost: "€ 2,940" },
    { name: "M. López", dept: "Kitchen", contract: "160h", worked: "0h", extra: "–", extraColor: "#999", prod: "–", punct: "On leave", punctColor: "#FFA726", cost: "€ 3,584" },
    { name: "S. Ruiz", dept: "Floor", contract: "160h", worked: "162h", extra: "+2h", extraColor: "#4CAF50", prod: "€ 71.2", punct: "100%", punctColor: "#4CAF50", cost: "€ 2,500" },
    { name: "C. Martínez", dept: "Floor", contract: "160h", worked: "56h", extra: "–", extraColor: "#999", prod: "–", punct: "Partial leave", punctColor: "#FFA726", cost: "€ 2,192" },
    { name: "P. Navarro", dept: "Bar", contract: "160h", worked: "174h", extra: "+14h", extraColor: "#4CAF50", prod: "€ 74.8", punct: "96%", punctColor: "#4CAF50", cost: "€ 2,800" },
    { name: "A. Fernández", dept: "Kitchen", contract: "160h", worked: "80h", extra: "–", extraColor: "#999", prod: "–", punct: "Partial leave", punctColor: "#FFA726", cost: "€ 1,900" },
    { name: "L. García", dept: "Bar", contract: "160h", worked: "158h", extra: "-2h", extraColor: "#FF6B6B", prod: "€ 62.1", punct: "94%", punctColor: "#4CAF50", cost: "€ 2,240" },
];

const shiftRanking = [
    { rank: 1, shift: "Saturday night · Kitchen", person: "A. Fernández · Baja IT", cost: "€640", costColor: "#FF6B6B" },
    { rank: 2, shift: "Friday night · Floor", person: "C. Martínez · Work Accident", cost: "€512", costColor: "#FF6B6B" },
    { rank: 3, shift: "Saturday night · Bar", person: "P. Navarro · +14h extra", cost: "€420", costColor: "#FFA726" },
    { rank: 4, shift: "Sunday night · Floor", person: "R. Torres · Baja cerrada", cost: "€320", costColor: "#FFA726" },
    { rank: 5, shift: "Thursday day · Kitchen", person: "J. Pérez · +8h extra", cost: "€240", costColor: "#FFA726" },
];

const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 16,
    padding: "16px 20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
};

const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.08em",
    color: "#aaa",
    textTransform: "uppercase",
    marginBottom: 4,
};

export default function HRDashboard() {
    return (
        <div
            style={{
                background: "#F5F6FA",
                minHeight: "100vh",
                padding: 20,
                fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
                boxSizing: "border-box",
            }}
        >
            {/* TOP KPI CARDS */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 16,
                    marginBottom: 16,
                }}
            >
                {/* Absenteeism */}
                <div style={cardStyle}>
                    <div style={labelStyle}>Absenteeism Rate</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#222", lineHeight: 1.1 }}>3.3%</div>
                    <div style={{ fontSize: 12, color: "#FF6B6B", marginTop: 2 }}>▲ +0.6pp vs LM</div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 6 }}>Hs. ausencia / Hs. contrato</div>
                    <MiniLineChart data={trendData.absenteeism} color="#FF6B6B" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#ccc", marginTop: 2 }}>
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => <span key={d}>{d}</span>)}
                    </div>
                </div>

                {/* Cost Bajas */}
                <div style={cardStyle}>
                    <div style={labelStyle}>Cost Bajas Laborales</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#222", lineHeight: 1.1 }}>€5,568</div>
                    <div style={{ fontSize: 12, color: "#FF6B6B", marginTop: 2 }}>▲ +€1,240 vs LM</div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 6 }}>696h no trabajadas</div>
                    <MiniLineChart data={trendData.costBajas} color="#FF6B6B" filled />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#ccc", marginTop: 2 }}>
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => <span key={d}>{d}</span>)}
                    </div>
                </div>

                {/* Active Sick Leaves */}
                <div style={cardStyle}>
                    <div style={labelStyle}>Active Sick Leaves</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#222", lineHeight: 1.1 }}>3</div>
                    <div style={{ fontSize: 12, color: "#FFA726", marginTop: 2 }}>▲ En curso</div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 6 }}>2 Sick Leave · 1 Maternity</div>
                    <MiniLineChart data={trendData.sickLeaves} color="#FFA726" filled />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#ccc", marginTop: 2 }}>
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => <span key={d}>{d}</span>)}
                    </div>
                </div>

                {/* Overtime */}
                <div style={cardStyle}>
                    <div style={labelStyle}>Accum. Overtime</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#222", lineHeight: 1.1 }}>142h</div>
                    <div style={{ fontSize: 12, color: "#FFA726", marginTop: 2 }}>▲ +18h vs LM</div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 6 }}>€ 2,840 additional cost</div>
                    <MiniLineChart data={trendData.overtime} color="#FFA726" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#ccc", marginTop: 2 }}>
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => <span key={d}>{d}</span>)}
                    </div>
                </div>

                {/* Punctuality */}
                <div style={cardStyle}>
                    <div style={labelStyle}>Punctuality Rate</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "#222", lineHeight: 1.1 }}>94.2%</div>
                    <div style={{ fontSize: 12, color: "#4CAF50", marginTop: 2 }}>▲ +1.1pp vs LM</div>
                    <div style={{ fontSize: 11, color: "#bbb", marginBottom: 6 }}>Fichajes a tiempo / total</div>
                    <MiniLineChart data={trendData.punctuality} color="#4CAF50" />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#ccc", marginTop: 2 }}>
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => <span key={d}>{d}</span>)}
                    </div>
                </div>
            </div>

            {/* MIDDLE ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, marginBottom: 16 }}>
                {/* Paid Absence Tracking Table */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={labelStyle}>Paid Absence Tracking</div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            {[
                                { label: "Sick Leave", color: "#FF6B6B" },
                                { label: "Work Accident", color: "#FFA726" },
                                { label: "Licencias", color: "#AB47BC" },
                                { label: "Mat/Pat", color: "#26C6DA" },
                            ].map((t) => (
                                <span key={t.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#666" }}>
                                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, display: "inline-block" }} />
                                    {t.label}
                                </span>
                            ))}
                            <span style={{ fontSize: 16, color: "#bbb", cursor: "pointer" }}>→</span>
                        </div>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ color: "#aaa", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                <th style={{ textAlign: "left", paddingBottom: 8, fontWeight: 600 }}>Employee</th>
                                <th style={{ textAlign: "left", paddingBottom: 8, fontWeight: 600 }}>Department</th>
                                <th style={{ textAlign: "left", paddingBottom: 8, fontWeight: 600 }}>Type</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Start Date</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Days</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Hs.</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Cost</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {absenceData.map((row, i) => (
                                <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                                    <td style={{ padding: "10px 0", fontWeight: 600, color: "#222" }}>{row.name}</td>
                                    <td style={{ color: "#666" }}>{row.dept}</td>
                                    <td>
                                        <span style={{
                                            background: row.typeColor + "22",
                                            color: row.typeColor,
                                            borderRadius: 20,
                                            padding: "2px 10px",
                                            fontSize: 12,
                                            fontWeight: 500,
                                            whiteSpace: "nowrap",
                                        }}>
                                            • {row.type}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: "right", color: "#666" }}>{row.start}</td>
                                    <td style={{ textAlign: "right", color: "#666" }}>{row.days}</td>
                                    <td style={{ textAlign: "right", color: "#666" }}>{row.hours}</td>
                                    <td style={{ textAlign: "right", color: "#222", fontWeight: 600 }}>{row.cost}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <span style={{ color: row.statusColor, fontWeight: 600, fontSize: 12 }}>{row.status}</span>
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ borderTop: "2px solid #EEE" }}>
                                <td colSpan={4} style={{ paddingTop: 10, fontWeight: 600, color: "#444" }}>Total period</td>
                                <td style={{ textAlign: "right", fontWeight: 700, color: "#222" }}>87 días</td>
                                <td style={{ textAlign: "right", fontWeight: 700, color: "#222" }}>696h</td>
                                <td style={{ textAlign: "right", fontWeight: 700, color: "#FF6B6B", fontSize: 15 }}>€ 5,568</td>
                                <td />
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Absence Evolution Chart */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div style={labelStyle}>Absence Evolution – Last 8 Weeks</div>
                        <span style={{ fontSize: 16, color: "#bbb", cursor: "pointer" }}>→</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                        {[
                            { label: "Sick Leave", color: "#FF6B6B" },
                            { label: "Work Accident", color: "#FFA726" },
                            { label: "Paid Leave", color: "#AB47BC" },
                            { label: "Mat/Pat", color: "#26C6DA" },
                        ].map((t) => (
                            <span key={t.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#666" }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, display: "inline-block" }} />
                                {t.label}
                            </span>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 140 }}>
                        {absenceWeeks.map((w) => (
                            <div key={w.s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <AbsenceBar week={w} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
                {/* Productivity Table */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={labelStyle}>Individual Productivity & Performance</div>
                        <span style={{ fontSize: 16, color: "#bbb", cursor: "pointer" }}>→</span>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                            <tr style={{ color: "#aaa", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                                <th style={{ textAlign: "left", paddingBottom: 8, fontWeight: 600 }}>Employee</th>
                                <th style={{ textAlign: "left", paddingBottom: 8, fontWeight: 600 }}>Dept.</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Hs. Contrato</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Hs. Trabajadas</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Hs. Extra</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Productividad €/H</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Punctuality</th>
                                <th style={{ textAlign: "right", paddingBottom: 8, fontWeight: 600 }}>Cost Turno</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productivityData.map((row, i) => (
                                <tr key={i} style={{ borderTop: "1px solid #F0F0F0" }}>
                                    <td style={{ padding: "9px 0", fontWeight: 600, color: "#222" }}>{row.name}</td>
                                    <td style={{ color: "#666" }}>{row.dept}</td>
                                    <td style={{ textAlign: "right", color: "#666" }}>{row.contract}</td>
                                    <td style={{ textAlign: "right", color: "#666" }}>{row.worked}</td>
                                    <td style={{ textAlign: "right", color: row.extraColor, fontWeight: 600 }}>{row.extra}</td>
                                    <td style={{ textAlign: "right" }}>
                                        {row.prod !== "–" ? (
                                            <span style={{ background: "#E8F5E9", color: "#388E3C", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{row.prod}</span>
                                        ) : <span style={{ color: "#ccc" }}>–</span>}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        {row.punct === "On leave" || row.punct === "Partial leave" ? (
                                            <span style={{ background: "#FFF3E0", color: "#F57C00", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>{row.punct}</span>
                                        ) : (
                                            <span style={{ color: row.punctColor, fontWeight: 700 }}>{row.punct}</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "right", color: "#222", fontWeight: 600 }}>{row.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Shift Ranking */}
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div style={labelStyle}>Highest Unproductive Cost – Shift Ranking</div>
                        <span style={{ fontSize: 16, color: "#bbb", cursor: "pointer" }}>→</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {shiftRanking.map((r) => (
                            <div key={r.rank} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 13, color: "#aaa", fontWeight: 600, width: 14, textAlign: "right" }}>{r.rank}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: "#222", fontSize: 13 }}>{r.shift}</div>
                                    <div style={{ fontSize: 11, color: "#aaa" }}>{r.person}</div>
                                </div>
                                <span style={{ fontWeight: 700, color: r.costColor, fontSize: 14 }}>{r.cost}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: "1px solid #EEE", marginTop: 14, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#aaa" }}>Total unproductive cost</span>
                        <span style={{ fontWeight: 700, color: "#FF6B6B", fontSize: 15 }}>€ 2,132</span>
                    </div>
                </div>
            </div>
        </div>
    );
}