import React, { useState } from 'react';
import { Badge, SparkPlaceholder } from '../ui/SharedUI';

// ── RESERVATIONS PAGE ──
export const ReservationsPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Total Reservations', value: '482', badge: <Badge type="up">▲ +6.4% vs LW</Badge>, sub: 'This week' },
        { label: 'Covers Expected', value: '2,970', badge: <Badge type="up">▲ +5.8% vs LW</Badge> },
        { label: 'Cancellation Rate', value: '4.2%', badge: <Badge type="dn">▼ -0.3pp vs LW</Badge> },
        { label: 'No-Show Rate', value: '2.1%', badge: <Badge type="up">▼ -0.4pp vs LW</Badge> },
      ].map((k, i) => (
        <div key={i} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span></div>
          <div className="jbi-card-body">
            <div className="kn sm">{k.value}</div>{k.badge}
            {k.sub && <div className="ks" style={{ marginTop: 3 }}>{k.sub}</div>}
            <SparkPlaceholder height={60} />
          </div>
        </div>
      ))}
    </div>

    <div className="g2">
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Upcoming Reservations</span><span className="jbi-card-action">→</span></div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <table className="dt">
            <thead><tr><th>Date</th><th>Time</th><th>Client</th><th>Area</th><th>Covers</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { date: 'Fri 13', time: '20:00', client: 'James Williams', area: 'Private Club', covers: 6, status: 'ok' },
                { date: 'Fri 13', time: '20:30', client: 'Marie Laurent', area: 'El Comedor', covers: 4, status: 'ok' },
                { date: 'Sat 14', time: '14:00', client: 'Corp. Event', area: 'Jazz Club', covers: 24, status: 'ok' },
                { date: 'Sat 14', time: '21:00', client: 'Sophie Chen', area: 'Private Club', covers: 8, status: 'wn' },
                { date: 'Sun 15', time: '13:30', client: 'A. Rossi', area: 'La Barra Jap.', covers: 2, status: 'ok' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="mono">{r.date}</td>
                  <td className="mono">{r.time}</td>
                  <td className="tm">{r.client}</td>
                  <td>{r.area}</td>
                  <td className="mono">{r.covers}</td>
                  <td><span className={`sp ${r.status}`}>{r.status === 'ok' ? '✓ Confirmed' : '⚠ Pending'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Occupancy by Day</span></div>
        <div className="jbi-card-body">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const pcts = [62, 68, 71, 78, 92, 98, 84];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--text3)', minWidth: 26 }}>{day}</span>
                <div style={{ flex: 1, height: 6, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pcts[i]}%`, height: '100%', background: pcts[i] > 90 ? 'var(--success)' : 'var(--accent)', borderRadius: 4, transition: 'width 1s ease' }} />
                </div>
                <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text2)', minWidth: 32 }}>{pcts[i]}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

// ── MARKETING: WEBSITE ANALYTICS PAGE ──
export const MktWebPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Sessions', value: '12,840', badge: <Badge type="up">▲ +8.4% vs LW</Badge> },
        { label: 'Users', value: '9,620', badge: <Badge type="up">▲ +6.2% vs LW</Badge> },
        { label: 'Avg Session Time', value: '3m 52s', badge: <Badge type="up">▲ +14s vs LW</Badge> },
        { label: 'Bounce Rate', value: '41.2%', badge: <Badge type="up">▼ -1.8pp vs LW</Badge> },
      ].map((k, i) => (
        <div key={i} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span></div>
          <div className="jbi-card-body">
            <div className="kn sm">{k.value}</div>{k.badge}
            <SparkPlaceholder height={60} />
          </div>
        </div>
      ))}
    </div>
    <div className="jbi-card">
      <div className="jbi-card-header"><span className="jbi-card-label">Traffic Evolution</span></div>
      <div className="jbi-card-body">
        <div style={{ height: 200, background: 'var(--bg)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
            <path d="M0,160 L86,145 L172,152 L258,120 L344,100 L430,80 L516,92 L600,72 L600,200 L0,200 Z" fill="rgba(108,92,231,0.1)" />
            <polyline points="0,160 86,145 172,152 258,120 344,100 430,80 516,92 600,72" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
    </div>
    <div className="g3">
      {[
        { label: 'Top Pages', rows: [['/', 'Homepage', '4,820'], ['/reservations', 'Reservations', '2,640'], ['/menu', 'Menu', '1,980'], ['/private-club', 'Private Club', '1,420']] },
        { label: 'Traffic Sources', rows: [['Organic', 'Google Search', '42%'], ['Direct', 'Direct', '28%'], ['Social', 'Instagram', '18%'], ['Paid', 'Google Ads', '12%']] },
        { label: 'Device Breakdown', rows: [['Mobile', 'iOS/Android', '58%'], ['Desktop', 'Mac/PC', '34%'], ['Tablet', 'iPad/etc.', '8%']] },
      ].map((card, ci) => (
        <div key={ci} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{card.label}</span></div>
          <div className="jbi-card-body" style={{ paddingTop: 8 }}>
            <table className="dt">
              <tbody>
                {card.rows.map((r, i) => (
                  <tr key={i}><td style={{ color: 'var(--text3)', fontSize: 10, fontFamily: 'DM Mono' }}>{r[0]}</td><td className="tm">{r[1]}</td><td className="mono" style={{ textAlign: 'right' }}>{r[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── MARKETING: BOOKING WIDGET PAGE ──
export const MktBookingPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Widget Searches', value: '2,840', badge: <Badge type="up">▲ +12.4% vs LW</Badge> },
        { label: 'Availability Shown', value: '68%', badge: <Badge type="nt">Of all searches</Badge> },
        { label: 'Bookings Made', value: '482', badge: <Badge type="up">17.0% conversion</Badge> },
        { label: 'Direct Revenue', value: '€ 142,400', badge: <Badge type="up">77.3% of total</Badge> },
      ].map((k, i) => (
        <div key={i} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span></div>
          <div className="jbi-card-body">
            <div className="kn sm">{k.value}</div>{k.badge}
            <SparkPlaceholder height={60} />
          </div>
        </div>
      ))}
    </div>
    <div className="g2">
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Booking Funnel</span></div>
        <div className="jbi-card-body">
          {[
            { label: 'Searches', count: '2,840', pct: 100, color: 'var(--accent)' },
            { label: 'Availability Shown', count: '1,931', pct: 68, color: 'var(--accent2)' },
            { label: 'Date Selected', count: '1,124', pct: 40, color: 'var(--orange)' },
            { label: 'Form Completed', count: '624', pct: 22, color: 'var(--teal)' },
            { label: 'Confirmed', count: '482', pct: 17, color: 'var(--success)' },
          ].map((step, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
                <span>{step.label}</span>
                <span className="mono">{step.count} ({step.pct}%)</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${step.pct}%`, height: '100%', background: step.color, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Widget Traffic — Daily</span></div>
        <div className="jbi-card-body">
          <div style={{ height: 240, background: 'var(--bg)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 300 240" preserveAspectRatio="none">
              {[0.35, 0.42, 0.38, 0.48, 0.72, 0.95, 0.78].map((h, i) => (
                <rect key={i} x={i * 42 + 4} y={240 - h * 200} width={34} height={h * 200} fill={i === 5 ? 'var(--accent)' : 'var(--accent-bg)'} rx={4} />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── MARKETING: PAID MEDIA PAGE ──
export const MktPaidPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g3">
      {[
        { label: 'Total Ad Spend', value: '€ 2,240', badge: <Badge type="nt">This week</Badge> },
        { label: 'Total Conversions', value: '238', badge: <Badge type="up">▲ +14% vs LW</Badge> },
        { label: 'Blended CPA', value: '€ 9.41', badge: <Badge type="up">▼ -€ 0.80 vs LW</Badge> },
      ].map((k, i) => (
        <div key={i} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span></div>
          <div className="jbi-card-body">
            <div className="kn sm">{k.value}</div>{k.badge}
            <SparkPlaceholder height={60} />
          </div>
        </div>
      ))}
    </div>

    <div className="g3">
      {[
        {
          name: 'Google Ads', color: '#4285f4', spend: '€ 840',
          stats: [['Impressions', '84,200'], ['Clicks', '2,840'], ['CTR', '3.37%'], ['CPC', '€ 0.65'], ['Conversions', '128'], ['CPA', '€ 14.4']],
        },
        {
          name: 'Meta Ads', color: '#e1306c', spend: '€ 980',
          stats: [['Reach', '42,100'], ['Impressions', '98,400'], ['CPM', '€ 9.96'], ['CTR', '1.95%'], ['Conversions', '86'], ['CPA', '€ 11.4']],
        },
        {
          name: 'TikTok Ads', color: '#010101', spend: '€ 420',
          stats: [['Views', '248K'], ['Link Clicks', '1,240'], ['Engagement', '4.2%'], ['CTR', '0.50%'], ['Conversions', '24'], ['CPA', '€ 17.5']],
        },
      ].map((ch, ci) => (
        <div key={ci} className="jbi-card">
          <div className="jbi-card-header" style={{ borderBottom: `3px solid ${ch.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: ch.color }} />
              <span className="jbi-card-label">{ch.name}</span>
            </div>
            <span className="jbi-card-action">→</span>
          </div>
          <div className="jbi-card-body">
            <div className="kn sm">{ch.spend}</div>
            <div className="ks" style={{ marginBottom: 14 }}>Spend this week</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {ch.stats.map(([label, val], i) => (
                <div key={i} style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>{val}</div>
                </div>
              ))}
            </div>
            <SparkPlaceholder height={140} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── STAFF: LABOUR COST PAGE ──
export const LabourPage: React.FC = () => (
  <div className="jbi-page">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14 }}>
      {[
        { label: 'Labour Cost', value: '€ 42,800', badge: <Badge type="dn">▲ +2.1% vs LM</Badge>, sub: 'YTD: € 298,600' },
        { label: 'Labour Cost %', value: '23.2%', badge: <Badge type="dn">▲ +0.4pp vs LM</Badge>, sub: 'Target: < 22%' },
        { label: 'Hours Worked', value: '1,168h', badge: <Badge type="up">▼ -1.8% vs LM</Badge>, sub: 'Current week' },
        { label: 'Total Headcount', value: '48', badge: <Badge type="nt">Active this week</Badge> },
        { label: 'Paid Absence Hrs', value: <span style={{ color: 'var(--danger)' }}>38h</span>, badge: <Badge type="dn">↑ +12h vs LM</Badge>, sub: '3.3% del total' },
        { label: 'Unproductive Cost', value: <span style={{ color: 'var(--danger)' }}>€ 1,240</span>, badge: <Badge type="dn">Unworked hours</Badge>, sub: '2.9% masa salarial' },
      ].map((k, i) => (
        <div key={i} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span><span className="jbi-card-action">→</span></div>
          <div className="jbi-card-body">
            <div className="kn">{k.value}</div>{k.badge}
            {k.sub && <div className="ks" style={{ marginTop: 3 }}>{k.sub}</div>}
            <SparkPlaceholder height={60} />
          </div>
        </div>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Performance Indicators — Current Week</span><span className="jbi-card-action">→</span></div>
        <div className="jbi-card-body" style={{ padding: 0 }}>
          <div className="scroll-x">
            <table className="dt staff-week-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 160, position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>Metric</th>
                  {['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13', 'Sat 14', 'Sun 15', 'Total'].map(d => (
                    <th key={d} style={{ textAlign: 'center', fontWeight: d === 'Total' ? 700 : undefined }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Hours Contracted', '168', '168', '168', '168', '168', '168', '168', '1,176'],
                  ['Hours Worked', '152', '156', '148', '160', '172', '192', '188', '1,168'],
                  ['Labour Cost €', '€ 5,200', '€ 5,400', '€ 5,100', '€ 5,600', '€ 6,200', '€ 7,800', '€ 7,500', '€ 42,800'],
                  ['Revenue €', '€ 22k', '€ 28k', '€ 25k', '€ 31k', '€ 38k', '€ 42k', '€ 35k', '€ 221k'],
                  ['Labour Cost %', '23.6%', '19.3%', '20.4%', '18.1%', '16.3%', '18.6%', '21.4%', '19.4%'],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className={j === 0 ? 'tm' : 'mono'} style={j === row.length - 1 ? { fontWeight: 700, color: 'var(--text)', background: 'var(--bg)' } : {}}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Labour Cost por Dept.</span><span className="jbi-card-action">→</span></div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <table className="dt">
            <thead><tr><th>Department</th><th>Staff</th><th>Hours</th><th>Cost</th><th>MS%</th></tr></thead>
            <tbody>
              {[
                ['Kitchen', 16, '612h', '€ 14,800', '34.6%'],
                ['Floor', 14, '520h', '€ 12,200', '28.5%'],
                ['Bar', 10, '390h', '€ 9,400', '22.0%'],
                ['Management', 5, '200h', '€ 4,800', '11.2%'],
                ['Security', 3, '120h', '€ 1,600', '3.7%'],
              ].map((r, i) => (
                <tr key={i}><td className="tm">{r[0]}</td><td className="mono">{r[1]}</td><td className="mono">{r[2]}</td><td className="mono">{r[3]}</td><td><Badge type="nt">{r[4] as string}</Badge></td></tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--border)', fontWeight: 600 }}>
                <td>Total</td><td className="mono">48</td><td className="mono">1,842h</td><td className="mono">€ 42,800</td><td><Badge type="dn">23.2%</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div className="jbi-card">
      <div className="jbi-card-header"><span className="jbi-card-label">Labour Cost vs Revenue Evolution</span><span className="jbi-card-action">→</span></div>
      <div className="jbi-card-body">
        <div style={{ height: 220, background: 'var(--bg)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 220" preserveAspectRatio="none">
            <polyline points="0,160 86,145 172,155 258,130 344,105 430,85 516,95 600,78" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
            <polyline points="0,180 86,175 172,178 258,170 344,162 430,155 516,158 600,150" fill="none" stroke="var(--danger)" strokeWidth="1.8" strokeDasharray="5,3" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

// ── STAFF: ABSENCES PAGE ──
export const LabourPerfPage: React.FC = () => (
  <div className="jbi-page">
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
      {[
        { label: 'Absenteeism Rate', value: '3.3%', badge: <Badge type="dn">▲ +0.6pp vs LM</Badge>, sub: 'Hs. ausencia / Hs. contrato' },
        { label: 'Cost Bajas Laborales', value: <span style={{ color: 'var(--danger)' }}>€ 5,568</span>, badge: <Badge type="dn">▲ +€ 1,240 vs LM</Badge>, sub: '696h no trabajadas' },
        { label: 'Active Sick Leaves', value: <span style={{ color: 'var(--warning)' }}>3</span>, badge: <Badge type="warn">⚠ En curso</Badge> },
        { label: 'Absences This Month', value: '12', badge: <Badge type="dn">▲ +3 vs LM</Badge> },
        { label: 'Punctuality Rate', value: '94.2%', badge: <Badge type="up">▼ -0.8pp vs LM</Badge> },
      ].map((k, i) => (
        <div key={i} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span><span className="jbi-card-action">→</span></div>
          <div className="jbi-card-body">
            <div className="kn">{k.value}</div>{k.badge}
            {k.sub && <div className="ks" style={{ marginTop: 3 }}>{k.sub}</div>}
            <SparkPlaceholder height={60} />
          </div>
        </div>
      ))}
    </div>
    <div className="g2">
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Absences by Department</span></div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <table className="dt">
            <thead><tr><th>Department</th><th>Absences</th><th>Hours Lost</th><th>Cost</th><th>Rate</th></tr></thead>
            <tbody>
              {[['Kitchen', 5, '128h', '€ 2,240', '4.1%', 'dn'], ['Floor', 4, '96h', '€ 1,680', '3.8%', 'dn'], ['Bar', 2, '48h', '€ 840', '2.5%', 'nt'], ['Management', 1, '24h', '€ 808', '2.4%', 'nt']].map((r, i) => (
                <tr key={i}><td className="tm">{r[0]}</td><td className="mono">{r[1]}</td><td className="mono">{r[2]}</td><td className="mono">{r[3]}</td><td><Badge type={r[5] as any}>{r[4] as string}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Absenteeism Trend</span></div>
        <div className="jbi-card-body">
          <div style={{ height: 200, background: 'var(--bg)', borderRadius: 8 }} />
        </div>
      </div>
    </div>
  </div>
);

// ── F&B PERFORMANCE PAGE ──
export const FbPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'F&B Cost Rate', value: '24.1%', badge: <Badge type="up">▼ -0.6pp vs LY</Badge>, sub: 'Target: < 26%' },
        { label: 'Food Cost %', value: '28.5%', badge: <Badge type="nt">Target: 28%</Badge> },
        { label: 'Drink Cost %', value: '18.2%', badge: <Badge type="up">On target</Badge> },
        { label: 'Waste Rate', value: '2.8%', badge: <Badge type="up">▼ -0.3pp vs LM</Badge> },
      ].map((k, i) => (
        <div key={i} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span></div>
          <div className="jbi-card-body">
            <div className="kn sm">{k.value}</div>{k.badge}
            {k.sub && <div className="ks" style={{ marginTop: 3 }}>{k.sub}</div>}
            <SparkPlaceholder height={60} />
          </div>
        </div>
      ))}
    </div>
    <div className="g2">
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">F&B Cost Evolution</span></div>
        <div className="jbi-card-body">
          <div style={{ height: 200, background: 'var(--bg)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              <polyline points="0,150 72,140 144,145 216,130 288,125 360,118 432,122 500,115" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
              <polyline points="0,170 72,165 144,168 216,158 288,152 360,148 432,150 500,145" fill="none" stroke="var(--orange)" strokeWidth="1.8" />
            </svg>
          </div>
        </div>
      </div>
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Top Waste Items</span></div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <table className="dt">
            <thead><tr><th>Item</th><th>Waste %</th><th>Cost</th></tr></thead>
            <tbody>
              {[['Fresh Fish', '4.2%', '€ 280'], ['Herbs & Garnish', '12.8%', '€ 96'], ['Dairy', '3.1%', '€ 140'], ['Bread', '8.4%', '€ 62']].map((r, i) => (
                <tr key={i}><td className="tm">{r[0]}</td><td className="mono">{r[1]}</td><td className="mono">{r[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

// ── F&B STOCK PAGE ──
export const FbStockPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'food' | 'drinks'>('food');
  return (
    <div className="jbi-page">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
        {[
          { label: 'Total Stock Value', value: '€ 48,200', badge: <Badge type="nt">Frozen liquidity</Badge>, sub: 'Food: € 18,400 · Drinks: € 29,800' },
          { label: 'Monthly Purchases', value: '€ 18,000', badge: <Badge type="dn">▲ +3.2% vs LM</Badge>, sub: 'Food: € 7,200 · Drinks: € 10,800' },
          { label: 'Food Cost %', value: '28.5%', badge: <Badge type="nt">Target: 28%</Badge>, sub: '▲ +0.5pp vs LM' },
          { label: 'Drink Cost %', value: '18.2%', badge: <Badge type="up">On target</Badge>, sub: '▼ -0.3pp vs LM' },
          { label: 'Price Alerts', value: <span style={{ color: 'var(--warning)' }}>8</span>, badge: <Badge type="warn">⚠ Price increases</Badge>, sub: 'vs previous purchase' },
        ].map((k, i) => (
          <div key={i} className="jbi-card">
            <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span></div>
            <div className="jbi-card-body">
              <div className="kn">{k.value}</div>{k.badge}
              <div className="ks" style={{ marginTop: 3 }}>{k.sub}</div>
              <SparkPlaceholder height={60} />
            </div>
          </div>
        ))}
      </div>

      <div className="sub-tabs">
        <div className={`sub-tab${activeTab === 'food' ? ' active' : ''}`} onClick={() => setActiveTab('food')}>🍽 Food</div>
        <div className={`sub-tab${activeTab === 'drinks' ? ' active' : ''}`} onClick={() => setActiveTab('drinks')}>🍸 Drinks</div>
      </div>

      <div className="jbi-card">
        <div className="jbi-card-header">
          <span className="jbi-card-label">{activeTab === 'food' ? 'Food' : 'Drinks'} Stock — Purchasing Prices</span>
          <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono', letterSpacing: '.06em' }}>Last purchase vs previous · ↑ increase · ↓ decrease</span>
        </div>
        <div className="jbi-card-body" style={{ paddingTop: 4 }}>
          <div className="scroll-x">
            <table className="dt">
              <thead><tr>
                <th>Product</th><th>Category</th>
                <th style={{ textAlign: 'right' }}>Stock</th>
                <th style={{ textAlign: 'right' }}>Last Purchase</th>
                <th style={{ textAlign: 'right' }}>Prev. Purchase</th>
                <th style={{ textAlign: 'center' }}>Δ Price</th>
                <th style={{ textAlign: 'center' }}>% Change</th>
                <th style={{ textAlign: 'right' }}>Stock Value</th>
                <th style={{ textAlign: 'center' }}>Alert</th>
              </tr></thead>
              <tbody>
                {(activeTab === 'food' ? [
                  { product: 'Black Cod', cat: 'Fresh Fish', stock: '12 kg', last: '€ 42.00/kg', prev: '€ 38.00/kg', delta: '+€ 4.00', pct: '+10.5%', value: '€ 504', alert: 'dn' },
                  { product: 'Wagyu A5', cat: 'Beef', stock: '8 kg', last: '€ 180.00/kg', prev: '€ 175.00/kg', delta: '+€ 5.00', pct: '+2.9%', value: '€ 1,440', alert: 'nt' },
                  { product: 'Truffle (Black)', cat: 'Fungi', stock: '0.8 kg', last: '€ 1,200/kg', prev: '€ 1,100/kg', delta: '+€ 100', pct: '+9.1%', value: '€ 960', alert: 'dn' },
                  { product: 'Oysters (dz)', cat: 'Shellfish', stock: '48', last: '€ 28.00/dz', prev: '€ 28.00/dz', delta: '—', pct: '0.0%', value: '€ 1,344', alert: 'up' },
                  { product: 'Salmon', cat: 'Fresh Fish', stock: '15 kg', last: '€ 18.50/kg', prev: '€ 19.20/kg', delta: '−€ 0.70', pct: '-3.6%', value: '€ 278', alert: 'up' },
                ] : [
                  { product: 'Dom Pérignon 2015', cat: 'Champagne', stock: '24 btl', last: '€ 220', prev: '€ 210', delta: '+€ 10', pct: '+4.8%', value: '€ 5,280', alert: 'nt' },
                  { product: 'Vega Sicilia', cat: 'Red Wine', stock: '12 btl', last: '€ 380', prev: '€ 370', delta: '+€ 10', pct: '+2.7%', value: '€ 4,560', alert: 'nt' },
                  { product: 'Patrón Silver', cat: 'Tequila', stock: '8 btl', last: '€ 58', prev: '€ 52', delta: '+€ 6', pct: '+11.5%', value: '€ 464', alert: 'dn' },
                  { product: 'Hendricks Gin', cat: 'Gin', stock: '12 btl', last: '€ 38', prev: '€ 38', delta: '—', pct: '0.0%', value: '€ 456', alert: 'up' },
                  { product: 'Ruinart Blanc', cat: 'Champagne', stock: '18 btl', last: '€ 82', prev: '€ 80', delta: '+€ 2', pct: '+2.5%', value: '€ 1,476', alert: 'nt' },
                ]).map((r, i) => (
                  <tr key={i}>
                    <td className="tm">{r.product}</td>
                    <td>{r.cat}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{r.stock}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{r.last}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{r.prev}</td>
                    <td className="mono" style={{ textAlign: 'center', color: r.delta.startsWith('+') ? 'var(--danger)' : r.delta.startsWith('−') ? 'var(--success)' : 'var(--text3)' }}>{r.delta}</td>
                    <td style={{ textAlign: 'center' }}><Badge type={r.alert as any}>{r.pct}</Badge></td>
                    <td className="mono" style={{ textAlign: 'right' }}>{r.value}</td>
                    <td style={{ textAlign: 'center' }}>{r.alert === 'dn' ? '⚠' : r.alert === 'nt' ? '●' : '✓'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── REPORTS PAGE ──
export const ReportsPage: React.FC = () => {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleExport = (type: string) => {
    setGenerating(type);
    setTimeout(() => setGenerating(null), 2000);
  };

  return (
    <div className="jbi-page">
      {/* Auto-send status bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--success-bg)', borderRadius: 10, border: '1px solid rgba(0,176,122,.15)' }}>
        <div style={{ fontSize: 12, color: 'var(--text2)' }}>Export weekly and monthly reports as PDF · Auto-generated every Monday & 1st of month</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--success)', fontWeight: 500, flexShrink: 0 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
          Auto-send active · Next: Mon 23 Mar 2026
        </div>
      </div>

      {/* Report cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16 }}>
        {[
          {
            type: 'weekly', label: 'Weekly', title: 'Weekly Pulse', desc: 'Key KPIs · Revenue by Area · Alerts & Actions',
            color: 'var(--accent)', includes: ['Revenue & Operations KPIs with VS LY + YTD', 'Revenue breakdown by space', 'Top 3 highlights · Top 3 action alerts', 'Satisfaction & Labour cost summary'],
            icon: '📊', format: '2 pages · PDF · English',
          },
          {
            type: 'monthly', label: 'Monthly', title: 'Monthly Review', desc: 'Full performance · Trends · Strategic Insights',
            color: 'var(--orange)', includes: ['Full KPI dashboard with trends', 'Area & product breakdown', 'YTD vs LY comparison', 'Staff & F&B performance'],
            icon: '📈', format: '6 pages · PDF · English',
          },
        ].map((r, i) => (
          <div key={i} className="jbi-card" style={{ overflow: 'hidden' }}>
            <div style={{ height: 5, background: `linear-gradient(90deg,${r.color},${r.color}88)` }} />
            <div className="jbi-card-body" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: 8.5, letterSpacing: '.14em', textTransform: 'uppercase', color: r.color, marginBottom: 6 }}>{r.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>{r.desc}</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{r.icon}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                {r.includes.map((inc, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text2)' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span> {inc}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border2)' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>Format: {r.format}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>Last exported: Mon 16 Mar 2026</div>
                </div>
                <button
                  onClick={() => handleExport(r.type)}
                  style={{ padding: '9px 20px', background: generating === r.type ? 'var(--success)' : r.color, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, transition: 'background .3s' }}
                >
                  {generating === r.type ? '✓ PDF Ready' : '↓ Export PDF'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent exports */}
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Export History</span></div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <table className="dt">
            <thead><tr><th>Report</th><th>Period</th><th>Generated</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {[
                { name: 'Weekly Pulse', period: 'Week 10, Mar 2026', date: 'Mon 16 Mar 2026', status: 'ok' },
                { name: 'Monthly Review', period: 'February 2026', date: '01 Mar 2026', status: 'ok' },
                { name: 'Weekly Pulse', period: 'Week 9, Mar 2026', date: 'Mon 09 Mar 2026', status: 'ok' },
                { name: 'Weekly Pulse', period: 'Week 8, Feb 2026', date: 'Mon 02 Mar 2026', status: 'ok' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="tm">{r.name}</td>
                  <td>{r.period}</td>
                  <td style={{ color: 'var(--text3)' }}>{r.date}</td>
                  <td><span className="sp ok">✓ Delivered</span></td>
                  <td><button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer', color: 'var(--text2)', fontFamily: 'inherit' }}>↓ Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
