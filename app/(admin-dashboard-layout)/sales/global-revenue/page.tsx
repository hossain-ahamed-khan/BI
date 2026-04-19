// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────
const MONTHS_SHORT = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTHS_FULL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const grossLine = [62, 63, 65, 66, 68, 70, 71, 73, 75, 80, 85, 100];
const netLine = [63, 64, 65, 67, 68, 70, 72, 73, 75, 78, 82, 100];
const tipsLine = [52, 54, 55, 55, 56, 58, 60, 62, 64, 68, 72, 80];
const cancelLine = [13, 14, 13, 14, 14, 13, 13, 12, 13, 13, 12, 9];

const weeklyDay = [1600, 1700, 2000, 2400, 2200, 1900, 1700, 1800, 1600, 1800, 1500, 1600];
const weeklyNight = [1200, 1100, 1300, 1500, 1400, 1300, 1200, 1200, 1100, 1200, 1000, 1100];
const weeklyTotal = weeklyDay.map((d, i) => d + weeklyNight[i]);

const noShowVals = [80, 50, 30, 90, 110, 70, 2700, 120, 90, 220, 70, 110];

const BUS_UNITS = [
  { name: "El Comedor", gross: "€ 64,512", gvs: "+10.2%", net: "€ 56,730", nvs: "+8.4%", pct: "35%", occ: "82%", ret: "42%", rvs: "+3.2pp" },
  { name: "Jazz Club", gross: "€ 27,648", gvs: "+5.2%", net: "€ 24,320", nvs: "+4.1%", pct: "15%", occ: "74%", ret: "31%", rvs: "+0.4pp" },
  { name: "La Barra Japonesa", gross: "€ 18,432", gvs: "+8.4%", net: "€ 16,200", nvs: "+6.9%", pct: "10%", occ: "68%", ret: "28%", rvs: "-1.1pp" },
  { name: "Mesas Altas", gross: "€ 14,400", gvs: "+3.1%", net: "€ 12,600", nvs: "+2.4%", pct: "8%", occ: "61%", ret: "24%", rvs: "+0.8pp" },
  { name: "Cocktail Bar", gross: "€ 36,864", gvs: "-2.1%", net: "€ 32,440", nvs: "-1.8%", pct: "20%", occ: "91%", ret: "35%", rvs: "-2.4pp" },
  { name: "Private Club", gross: "€ 36,864", gvs: "+22.0%", net: "€ 32,440", nvs: "+18.4%", pct: "20%", occ: "88%", ret: "61%", rvs: "+8.4pp" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  green: "#22c47a",
  red: "#e85454",
  redLight: "#f5c5c5",
  purple: "#7c74db",
  purpleLight: "#c8c4f5",
  purpleDark: "#4038a8",
  orange: "#e8956e",
  orangeLight: "rgba(232,149,110,0.12)",
  purpleFill: "rgba(124,116,219,0.10)",
  redFill: "rgba(232,84,84,0.08)",
  bg: "#f4f4f6",
  card: "#ffffff",
  border: "#efefef",
  labelMuted: "#c0c0c0",
  labelDim: "#a8a8a8",
  text: "#191926",
  textMid: "#555",
};

function pctColor(s: string) { return s.startsWith("-") ? C.red : C.green; }

// ─────────────────────────────────────────────────────────────────────────────
// Smooth curve helper (catmull-rom → cubic bezier)
// ─────────────────────────────────────────────────────────────────────────────
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI Sparkline — matches reference: line + fill + dots + RIGHT y-axis labels
// ─────────────────────────────────────────────────────────────────────────────
function KpiSparkline({
  vals, stroke, fillColor, yLabels,
}: { vals: number[]; stroke: string; fillColor: string; yLabels: string[] }) {
  const W = 300, H = 52;
  const PAD_R = 26; // space for right-side y-axis labels
  const PAD_B = 16; // space for month labels
  const PAD_T = 4;
  const innerW = W - PAD_R;
  const innerH = H - PAD_B - PAD_T;

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const px = (i: number) => (i / (vals.length - 1)) * innerW;
  const py = (v: number) => PAD_T + innerH - ((v - min) / range) * innerH;

  const pts: [number, number][] = vals.map((v, i) => [px(i), py(v)]);
  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L${innerW},${PAD_T + innerH} L0,${PAD_T + innerH} Z`;

  // Y-axis: map yLabels to evenly-spaced positions on the right
  const yLabelCount = yLabels.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}
      style={{ display: "block", overflow: "visible" }}>
      {/* Shaded fill */}
      <path d={areaPath} fill={fillColor} />
      {/* Line */}
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={1.4} />
      {/* Dots */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.3} fill={stroke} />
      ))}
      {/* Right-side Y-axis labels */}
      {yLabels.map((lbl, i) => {
        const frac = i / (yLabelCount - 1);
        const y = PAD_T + frac * innerH;
        return (
          <text key={lbl} x={W - 2} y={y + 3.5}
            textAnchor="end" fontSize={7.5} fill={C.labelMuted}>{lbl}</text>
        );
      })}
      {/* Month labels */}
      {MONTHS_SHORT.map((m, i) => (
        <text key={i} x={px(i)} y={H - 2}
          textAnchor="middle" fontSize={7.5} fill={C.labelMuted}>{m}</text>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI Card
// ─────────────────────────────────────────────────────────────────────────────
interface KpiProps {
  label: string; value: string;
  badge: string; badgePos: boolean; sub: string;
  vals: number[]; stroke: string; fillColor: string; yLabels: string[];
}
function KpiCard({ label, value, badge, badgePos, sub, vals, stroke, fillColor, yLabels }: KpiProps) {
  return (
    <div style={{
      background: C.card, borderRadius: 16, border: `1px solid ${C.border}`,
      padding: "18px 20px 14px", flex: 1, minWidth: 0,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, letterSpacing: "0.09em", color: C.labelDim, textTransform: "uppercase", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color: C.labelMuted }}>→</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 300, color: C.text, letterSpacing: "-1.5px", lineHeight: 1.1, marginTop: 10 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: badgePos ? C.green : C.red, marginTop: 5 }}>{badge}</div>
      <div style={{ fontSize: 10, color: C.labelMuted, marginTop: 3, marginBottom: 12 }}>{sub}</div>
      <div style={{ flex: 1 }}>
        <KpiSparkline vals={vals} stroke={stroke} fillColor={fillColor} yLabels={yLabels} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Weekly Evolution Chart
// ─────────────────────────────────────────────────────────────────────────────
function WeeklyChart() {
  const W = 700, H = 230;
  const PAD_L = 46, PAD_B = 22, PAD_T = 10;
  const innerW = W - PAD_L;
  const innerH = H - PAD_B - PAD_T;
  const MAX = 6000;
  const BW = 26; // total bar group width
  const step = innerW / 11;

  const bx = (i: number) => PAD_L + i * step;
  const by = (v: number) => PAD_T + innerH - (v / MAX) * innerH;

  const totalPts: [number, number][] = weeklyTotal.map((v, i) => [bx(i), by(v)]);
  const totalLine = smoothPath(totalPts);

  const yTicks = [6000, 4000, 2000, 0];

  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: "18px 20px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.09em", color: C.labelDim, textTransform: "uppercase", fontWeight: 500 }}>
          Weekly Evolution — Day / Night / Total
        </span>
        <span style={{ fontSize: 13, color: C.labelMuted }}>→</span>
      </div>
      <div style={{ display: "flex", gap: 18, marginBottom: 12 }}>
        {([[C.purple, "Day"], [C.purpleLight, "Night"], [C.purpleDark, "Total"]] as [string, string][]).map(([col, lbl]) => (
          <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: col }} />
            {lbl}
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
        {/* Y grid + labels */}
        {yTicks.map(tick => {
          const y = PAD_T + innerH - (tick / MAX) * innerH;
          return (
            <g key={tick}>
              <line x1={PAD_L} x2={W} y1={y} y2={y} stroke="#f0f0f0" strokeWidth={1} />
              <text x={PAD_L - 5} y={y + 3.5} textAnchor="end" fontSize={8.5} fill={C.labelMuted}>
                €{tick === 0 ? "0k" : `${tick / 1000}k`}
              </text>
            </g>
          );
        })}
        {/* Bars */}
        {weeklyDay.map((_, i) => {
          const cx = bx(i);
          const dh = (weeklyDay[i] / MAX) * innerH;
          const nh = (weeklyNight[i] / MAX) * innerH;
          const hw = BW / 2 - 1;
          const base = PAD_T + innerH;
          return (
            <g key={i}>
              <rect x={cx - BW / 2} y={base - dh} width={hw} height={dh} fill={C.purple} rx={2} />
              <rect x={cx - BW / 2 + hw + 1} y={base - nh} width={hw} height={nh} fill={C.purpleLight} rx={2} />
            </g>
          );
        })}
        {/* Total smooth line */}
        <path d={totalLine} fill="none" stroke={C.purpleDark} strokeWidth={2.2} />
        {totalPts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.2} fill={C.purpleDark} />
        ))}
        {/* X labels */}
        {MONTHS_FULL.map((m, i) => (
          <text key={m} x={bx(i)} y={H - 5} textAnchor="middle" fontSize={8.5} fill={C.labelMuted}>{m}</text>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// No-Show Rate Chart
// ─────────────────────────────────────────────────────────────────────────────
function NoShowChart() {
  const W = 440, H = 180;
  const PAD_L = 38, PAD_B = 22, PAD_T = 10;
  const innerW = W - PAD_L;
  const innerH = H - PAD_B - PAD_T;
  const MAX = 3000;
  const BW = 18;
  const step = innerW / 11;
  const bx = (i: number) => PAD_L + i * step;
  const bh = (v: number) => (Math.min(v, MAX) / MAX) * innerH;
  const base = PAD_T + innerH;
  const yTicks = [3000, 2000, 1000, 0];

  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: "18px 20px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, letterSpacing: "0.09em", color: C.labelDim, textTransform: "uppercase", fontWeight: 500 }}>No-Show Rate</span>
        <span style={{ fontSize: 13, color: C.labelMuted }}>→</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 300, color: C.text, letterSpacing: "-1.5px", lineHeight: 1.1, margin: "8px 0 4px" }}>2.1%</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.red, marginBottom: 14 }}>▼ −0.4pp vs LW</div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", overflow: "visible" }}>
        {yTicks.map(tick => {
          const y = PAD_T + innerH - (tick / MAX) * innerH;
          return (
            <g key={tick}>
              <line x1={PAD_L} x2={W} y1={y} y2={y} stroke="#f0f0f0" strokeWidth={1} />
              <text x={PAD_L - 4} y={y + 3.5} textAnchor="end" fontSize={8} fill={C.labelMuted}>
                {tick === 0 ? "0" : `${(tick / 1000).toFixed(0)},000`}
              </text>
            </g>
          );
        })}
        {noShowVals.map((v, i) => {
          const h = bh(v);
          const isSpike = v > 500;
          return (
            <rect key={i}
              x={bx(i) - BW / 2} y={base - (h || 1)}
              width={BW} height={h || 1}
              fill={isSpike ? C.red : C.redLight} rx={2}
            />
          );
        })}
        {MONTHS_FULL.map((m, i) => (
          <text key={m} x={bx(i)} y={H - 5} textAnchor="middle" fontSize={8} fill={C.labelMuted}>{m}</text>
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Performance Table
// ─────────────────────────────────────────────────────────────────────────────
function PerformanceTable() {
  const heads = ["Business Unit", "Gross Revenue", "vs LY", "Net Revenue", "vs LY", "% of Total", "Occ. Rate", "Return. Rate", "vs LY"];
  return (
    <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, padding: "18px 20px 4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 10, letterSpacing: "0.09em", color: C.labelDim, textTransform: "uppercase", fontWeight: 500 }}>
          Consolidated Performance by Area
        </span>
        <span style={{ fontSize: 13, color: C.labelMuted }}>→</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed", minWidth: 720 }}>
          <colgroup>
            <col style={{ width: "18%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>
          <thead>
            <tr>
              {heads.map((h, i) => (
                <th key={h + i} style={{
                  textAlign: i === 0 ? "left" : "right",
                  padding: "0 10px 10px",
                  fontSize: 9, color: C.labelDim,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  fontWeight: 500, borderBottom: `1px solid ${C.border}`,
                  whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BUS_UNITS.map((row, i) => (
              <tr key={row.name} style={{ borderBottom: i < BUS_UNITS.length - 1 ? `1px solid #f8f8f8` : "none" }}>
                <td style={{ padding: "12px 10px", color: C.text, fontWeight: 500 }}>{row.name}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", color: C.textMid }}>{row.gross}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", color: pctColor(row.gvs), fontWeight: 600 }}>{row.gvs}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", color: C.textMid }}>{row.net}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", color: pctColor(row.nvs), fontWeight: 600 }}>{row.nvs}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", color: "#888" }}>{row.pct}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", color: "#888" }}>{row.occ}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", color: pctColor(row.rvs), fontWeight: 600 }}>{row.ret}</td>
                <td style={{ padding: "12px 10px", textAlign: "right", color: pctColor(row.rvs), fontWeight: 600 }}>{row.rvs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────────────────────────────────
export default function RestaurantDashboard() {
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: C.bg, minHeight: "100vh", padding: 16, boxSizing: "border-box",
    }}>
      {/* Row 1 — KPI cards */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <KpiCard
          label="Gross Revenue" value="€184.320"
          badge="▲ +12.4% vs LY" badgePos={true} sub="YTD: € 1.024,800"
          vals={grossLine} stroke={C.purple} fillColor={C.purpleFill}
          yLabels={["100", "80", "60"]}
        />
        <KpiCard
          label="Net Revenue" value="€161.480"
          badge="▲ +9.7% vs LY" badgePos={true} sub="YTD: € 897.200"
          vals={netLine} stroke={C.purple} fillColor={C.purpleFill}
          yLabels={["100", "80", "60"]}
        />
        <KpiCard
          label="Tips" value="€ 8.240"
          badge="▲ +4.1% vs LY" badgePos={true} sub="YTD: € 42.800"
          vals={tipsLine} stroke={C.orange} fillColor={C.orangeLight}
          yLabels={["80", "60", "40"]}
        />
        <KpiCard
          label="Cancellation Rate" value="4.2%"
          badge="▼ −0.3pp vs LY" badgePos={false} sub="YTD avg: 3.8%"
          vals={cancelLine} stroke={C.red} fillColor={C.redFill}
          yLabels={["20", "10", "0"]}
        />
      </div>

      {/* Row 2 — Weekly + No-show */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 12, marginBottom: 12 }}>
        <WeeklyChart />
        <NoShowChart />
      </div>

      {/* Row 3 — Table */}
      <PerformanceTable />
    </div>
  );
}