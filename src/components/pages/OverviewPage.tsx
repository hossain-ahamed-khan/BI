import React from 'react';
import { Card, Badge, SourceRow, ProgressBar, SparkPlaceholder } from '../ui/SharedUI';

const OverviewPage: React.FC = () => {
  return (
    <div className="jbi-page">
      {/* ROW 1: 6 Revenue + Core KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14 }}>
        {[
          { label: 'Gross Revenue', value: '€ 184,320', badge: <Badge type="up">▲ +12.4% vs LY</Badge>, sub: 'YTD: € 1,024,800' },
          { label: 'Net Revenue', value: '€ 161,480', badge: <Badge type="up">▲ +9.7% vs LY</Badge>, sub: 'YTD: € 897,200' },
          { label: 'Total Covers', value: '2,847', badge: <Badge type="up">▲ +6.2% vs LY</Badge>, sub: 'YTD: 16,240' },
          { label: 'Cancellation Rate', value: '4.2%', badge: <Badge type="dn">▼ -0.3pp vs LY</Badge>, sub: 'YTD avg: 3.8%' },
          { label: 'No-Show Rate', value: '2.1%', badge: <Badge type="up">▼ -0.4pp vs LY</Badge>, sub: 'YTD avg: 2.6%' },
        ].map((k, i) => (
          <div key={i} className="jbi-card">
            <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span><span className="jbi-card-action">→</span></div>
            <div className="jbi-card-body">
              <div className="kn">{k.value}</div>
              {k.badge}
              <div className="ks" style={{ marginTop: 3 }}>{k.sub}</div>
              <SparkPlaceholder height={72} />
            </div>
          </div>
        ))}
      </div>

      {/* ROW 2: Operations & People KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {[
          { label: 'Labour Cost %', value: '23.2%', badge: <Badge type="dn">▲ +0.4pp vs LY</Badge>, sub: 'Target: < 22%' },
          { label: 'F&B Cost Rate', value: '24.1%', badge: <Badge type="up">▼ -0.6pp vs LY</Badge>, sub: 'Target: < 26%' },
          {
            label: 'Customer Satisfaction',
            value: <span>4.6<span style={{ fontSize: 20, fontWeight: 300, color: 'var(--text3)' }}>/5</span></span>,
            badge: <Badge type="up">▲ +0.2 vs LY</Badge>,
            sub: '1,248 reviews · ★★★★½'
          },
          { label: 'Returning Guests', value: '38.4%', badge: <Badge type="up">▲ +2.1pp vs LY</Badge>, sub: 'of total covers' },
        ].map((k, i) => (
          <div key={i} className="jbi-card">
            <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span><span className="jbi-card-action">→</span></div>
            <div className="jbi-card-body">
              <div className="kn">{k.value}</div>
              {k.badge}
              <div className="ks" style={{ marginTop: 3 }}>{k.sub}</div>
              <SparkPlaceholder height={72} />
            </div>
          </div>
        ))}
      </div>

      {/* ROW 3: Revenue Chart + Performance Table + Data Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14 }}>
        {/* Revenue Evolution */}
        <div className="jbi-card">
          <div className="jbi-card-header">
            <span className="jbi-card-label">Revenue Evolution</span>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} /> Total
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent2)' }} /> Day
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--orange)' }} /> Night
              </label>
            </div>
            <span className="jbi-card-action">→</span>
          </div>
          <div className="jbi-card-body">
            {/* Chart placeholder */}
            <div style={{ height: 240, background: 'var(--bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <svg width="100%" height="100%" viewBox="0 0 600 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,200 L86,160 L172,175 L258,130 L344,95 L430,60 L516,80 L600,55 L600,240 L0,240 Z" fill="url(#gTotal)" />
                <polyline points="0,200 86,160 172,175 258,130 344,95 430,60 516,80 600,55" fill="none" stroke="#6c5ce7" strokeWidth="2.5" />
                <polyline points="0,210 86,185 172,195 258,170 344,150 430,125 516,140 600,115" fill="none" stroke="#a29bfe" strokeWidth="1.8" strokeDasharray="4,2" />
                <polyline points="0,220 86,200 172,208 258,190 344,175 430,155 516,165 600,145" fill="none" stroke="#fd7c4a" strokeWidth="1.8" strokeDasharray="4,2" />
              </svg>
              {/* Day labels */}
              <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
            {/* Summary row */}
            <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--border2)', marginTop: 12, paddingTop: 12 }}>
              {[
                { label: 'Mon', day: '€ 12k', night: '€ 10k', total: '€ 22k' },
                { label: 'Fri', day: '€ 18k', night: '€ 20k', total: '€ 38k' },
                { label: 'Sat', day: '€ 19k', night: '€ 23k', total: '€ 42k' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, padding: '0 12px', borderLeft: i > 0 ? '1px solid var(--border2)' : 'none' }}>
                  <div style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--text3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{s.total}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Day {s.day} · Night {s.night}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance by Area */}
        <div className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">Performance by Area</span><span className="jbi-card-action">→</span></div>
          <div className="jbi-card-body" style={{ paddingTop: 8 }}>
            <table className="dt">
              <thead><tr><th>Unit</th><th>Revenue</th><th>Occ%</th><th>VS LY</th><th>Return.%</th></tr></thead>
              <tbody>
                {[
                  { name: 'El Comedor', rev: '€ 64,512', occ: '82%', vsly: '+12.5%', ret: '42%', retType: 'up' as const },
                  { name: 'Jazz Club', rev: '€ 27,648', occ: '74%', vsly: '+5.2%', ret: '31%', retType: 'nt' as const },
                  { name: 'La Barra Jap.', rev: '€ 18,432', occ: '68%', vsly: '+8.4%', ret: '28%', retType: 'nt' as const },
                  { name: 'Cocktail Bar', rev: '€ 36,864', occ: '91%', vsly: '-2.1%', ret: '35%', retType: 'nt' as const },
                  { name: 'Private Club', rev: '€ 36,864', occ: '88%', vsly: '+22.0%', ret: '61%', retType: 'up' as const },
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="tm">{r.name}</td>
                    <td className="mono">{r.rev}</td>
                    <td>{r.occ}</td>
                    <td><Badge type={r.vsly.startsWith('+') ? 'up' : 'dn'}>{r.vsly}</Badge></td>
                    <td><Badge type={r.retType}>{r.ret}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Sources */}
        <div className="jbi-card">
          <div className="jbi-card-header">
            <span className="jbi-card-label">Data Sources</span>
            <span style={{ fontSize: 10, color: 'var(--success)' }}>● LIVE</span>
          </div>
          <div className="jbi-card-body" style={{ paddingTop: 4 }}>
            <SourceRow icon="◈" iconBg="var(--accent-bg)" iconColor="var(--accent)" name="Square POS" status="ok" statusLabel="Live" />
            <SourceRow icon="◇" iconBg="#f0f0ff" iconColor="var(--accent2)" name="SevenRooms" status="ok" statusLabel="Live" />
            <SourceRow icon="◫" iconBg="var(--warning-bg)" iconColor="var(--warning)" name="Haddock" status="wn" statusLabel="Delayed" />
            <SourceRow icon="◎" iconBg="var(--orange-bg)" iconColor="var(--orange)" name="GA4" status="ok" statusLabel="Live" />
            <SourceRow icon="◎" iconBg="#fff0e6" iconColor="#e8612a" name="Meta" status="ok" statusLabel="Live" />
            <SourceRow icon="◎" iconBg="#e8f4ff" iconColor="#1a73e8" name="Google Ads" status="ok" statusLabel="Live" />
            <SourceRow icon="▦" iconBg="var(--success-bg)" iconColor="var(--success)" name="Skello" status="ok" statusLabel="Live" />
          </div>
        </div>
      </div>

      {/* ROW 4: Payment Methods */}
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Payment Methods</span><span className="jbi-card-action">→</span></div>
        <div className="jbi-card-body" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <div className="kn">€ 184,320</div>
            <div className="ks" style={{ marginTop: 4 }}>Total received this week</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 32px' }}>
            <ProgressBar label="Card" value="76% · € 140,083" pct={76} color="var(--accent)" />
            <ProgressBar label="Cash" value="10% · € 18,432" pct={10} color="var(--orange)" />
            <ProgressBar label="Gift Card" value="2% · € 3,686" pct={2} color="var(--teal)" />
            <ProgressBar label="Other" value="12% · € 22,118" pct={12} color="var(--text3)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
