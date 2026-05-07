import React, { useState } from 'react';
import { Badge, SparkPlaceholder } from '../ui/SharedUI';

// ── CLIENT PROFILE MODAL ──
interface ClientModalProps {
  open: boolean;
  onClose: () => void;
}
const ClientModal: React.FC<ClientModalProps> = ({ open, onClose }) => (
  <div className={`modal-overlay${open ? ' open' : ''}`} onClick={onClose}>
    <div className="modal" onClick={e => e.stopPropagation()}>
      <div className="modal-hdr">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="modal-avatar">JW</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>James Williams</div>
            <div style={{ marginTop: 4 }}><span className="tier tier-vip">VIP</span></div>
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="modal-section">
        <div className="modal-sec-title">Contact</div>
        <div className="modal-row"><span>Phone</span><span>+44 7911 123456</span></div>
        <div className="modal-row"><span>Email</span><span>j.williams@acme.com</span></div>
        <div className="modal-row"><span>Company</span><span>Acme Group Ltd.</span></div>
        <div className="modal-row"><span>Country</span><span>🇬🇧 United Kingdom</span></div>
      </div>
      <div className="modal-section">
        <div className="modal-sec-title">Activity</div>
        <div className="modal-row"><span>Total Visits</span><span>8</span></div>
        <div className="modal-row"><span>Total Spend</span><span>€ 3,840</span></div>
        <div className="modal-row"><span>Spend / Visit</span><span>€ 480</span></div>
        <div className="modal-row"><span>Last Visit</span><span>05 Mar 2026</span></div>
        <div className="modal-row"><span>Avg Frequency</span><span>Every 18 days</span></div>
        <div className="modal-row"><span>Preferred Area</span><span>Private Club</span></div>
      </div>
      <div className="modal-section">
        <div className="modal-sec-title">Profile Tags</div>
        <div>
          {['Champagne lover', 'Large groups', 'Business dinners', 'Allergic: shellfish'].map(t => (
            <span key={t} className="modal-tag">{t}</span>
          ))}
        </div>
      </div>
      <div className="modal-section">
        <div className="modal-sec-title">Notes</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, background: 'var(--bg)', borderRadius: 8, padding: 10 }}>
          Prefers table 12 in Private Club. Always orders Dom Perignon. Brings corporate clients for deal closings. Allergic to shellfish — always notify kitchen. Has referred 3 new clients.
        </div>
      </div>
      <div className="modal-section">
        <div className="modal-sec-title">Visit History</div>
        <div>
          {[
            { date: '05 Mar 2026', desc: 'Private Club, 6 pax, Night', amt: '€ 620', color: 'var(--accent)' },
            { date: '14 Feb 2026', desc: 'Private Club, 4 pax, Night', amt: '€ 480', color: 'var(--accent2)' },
            { date: '20 Jan 2026', desc: 'El Comedor, 2 pax, Night', amt: '€ 290', color: 'var(--accent2)' },
            { date: '28 Dec 2025', desc: 'Jazz Club, 8 pax, Night', amt: '€ 980', color: 'var(--text3)' },
          ].map((v, i) => (
            <div key={i} className="visit-row">
              <div className="visit-dot" style={{ background: v.color }} />
              <div style={{ flex: 1 }}><span style={{ fontWeight: 500 }}>{v.date}</span> — {v.desc}</div>
              <span className="mono" style={{ fontSize: 12 }}>{v.amt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── CRM CLIENTS PAGE ──
export const CrmClientsPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const clients = [
    { initials: 'JW', name: 'James Williams', email: 'j.williams@acme.com', tier: 'vip', visits: 8, spend: '€ 3,840', lastVisit: '05 Mar 2026', area: 'Private Club' },
    { initials: 'SC', name: 'Sophie Chen', email: 's.chen@globalinv.com', tier: 'super', visits: 14, spend: '€ 8,960', lastVisit: '08 Mar 2026', area: 'Private Club' },
    { initials: 'AR', name: 'Alexandre Rossi', email: 'a.rossi@rossi.it', tier: 'loyal', visits: 6, spend: '€ 2,160', lastVisit: '02 Mar 2026', area: 'El Comedor' },
    { initials: 'ML', name: 'Marie Laurent', email: 'm.laurent@mb.fr', tier: 'vip', visits: 9, spend: '€ 4,320', lastVisit: '07 Mar 2026', area: 'Jazz Club' },
    { initials: 'DK', name: 'David Kim', email: 'd.kim@techco.kr', tier: 'potential', visits: 3, spend: '€ 840', lastVisit: '10 Mar 2026', area: 'Cocktail Bar' },
    { initials: 'EP', name: 'Elena Petrova', email: 'e.petrova@luxe.ru', tier: 'loyal', visits: 5, spend: '€ 1,800', lastVisit: '01 Mar 2026', area: 'El Comedor' },
    { initials: 'TA', name: 'Tom Anderson', email: 't.anderson@pe.uk', tier: 'new', visits: 1, spend: '€ 280', lastVisit: '11 Mar 2026', area: 'La Barra Jap.' },
  ];

  const tierColorMap: Record<string, string> = {
    super: 'linear-gradient(135deg,#c0392b,#e84545)',
    vip: 'linear-gradient(135deg,var(--accent),var(--accent2))',
    loyal: 'linear-gradient(135deg,var(--success),var(--teal))',
    potential: 'linear-gradient(135deg,var(--accent2),#7c8cf8)',
    new: 'linear-gradient(135deg,var(--text3),var(--text2))',
  };

  return (
    <div className="jbi-page">
      <ClientModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="g4">
        {[
          { label: 'Total Clients', value: '3,842', badge: <Badge type="up">▲ +128 this month</Badge> },
          { label: 'VIP Clients', value: '248', badge: <Badge type="up">6.5% of total</Badge> },
          { label: 'Avg LTV', value: '€ 1,240', badge: <Badge type="up">▲ +4.2% vs LY</Badge> },
          { label: 'Churn Risk', value: '82', badge: <Badge type="dn">⚠ At risk</Badge> },
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
        <div className="jbi-card-header">
          <span className="jbi-card-label">Client Directory</span>
          <div className="search-bar" style={{ maxWidth: 220 }}>
            <span style={{ color: 'var(--text3)', fontSize: 13 }}>⌕</span>
            <input type="text" placeholder="Search client…" />
          </div>
        </div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <table className="dt">
            <thead><tr>
              <th>Client</th><th>Tier</th><th>Visits</th>
              <th>Total Spend</th><th>Last Visit</th><th>Fav. Area</th><th></th>
            </tr></thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={i} style={{ cursor: 'pointer' }} onClick={() => setModalOpen(true)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: tierColorMap[c.tier] || 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0 }}>{c.initials}</div>
                      <div>
                        <div className="tm" style={{ fontSize: 13 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`tier tier-${c.tier}`}>{c.tier.toUpperCase()}</span></td>
                  <td className="mono">{c.visits}</td>
                  <td className="mono">{c.spend}</td>
                  <td>{c.lastVisit}</td>
                  <td>{c.area}</td>
                  <td><span style={{ color: 'var(--accent)', fontSize: 13, cursor: 'pointer' }}>›</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── CRM LOYALTY PAGE ──
export const CrmLoyaltyPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Total Members', value: '3,842', badge: <Badge type="up">▲ +128 this month</Badge> },
        { label: 'Active Members', value: '2,641', badge: <Badge type="up">68.7% active rate</Badge> },
        { label: 'VIP+ Members', value: '314', badge: <Badge type="up">8.2% of total</Badge> },
        { label: 'Avg Frequency', value: '18 days', badge: <Badge type="up">▼ -1.2 days vs LY</Badge> },
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
        <div className="jbi-card-header"><span className="jbi-card-label">Loyalty Tiers — Funnel</span></div>
        <div className="jbi-card-body">
          {[
            { label: 'New', count: '1,240', pct: 100, delta: '+82', deltaType: 'up', color: '#4a6cf7' },
            { label: 'Potential', count: '920', pct: 74, delta: '+34', deltaType: 'up', color: 'var(--accent)' },
            { label: 'Loyal', count: '680', pct: 55, delta: '+18', deltaType: 'up', color: 'var(--success)' },
            { label: 'VIP', count: '248', pct: 20, delta: '+8', deltaType: 'up', color: '#c47d00' },
            { label: 'Super VIP', count: '66', pct: 5, delta: '+2', deltaType: 'up', color: '#c0392b' },
            { label: 'At Risk', count: '82', pct: 7, delta: '-12', deltaType: 'dn', color: 'var(--warning)' },
          ].map((tier, i) => (
            <div key={i} className="loy-tier-row">
              <span className={`tier tier-${tier.label.toLowerCase().replace(' ', '-')}`} style={{ minWidth: 72 }}>{tier.label}</span>
              <div className="loy-bar-track">
                <div className="loy-bar-fill" style={{ width: `${tier.pct}%`, background: tier.color }} />
              </div>
              <span className="loy-count">{tier.count}</span>
              <span className={`loy-delta ${tier.deltaType}`}>{tier.delta}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Member Growth</span></div>
        <div className="jbi-card-body">
          <div style={{ height: 240, background: 'var(--bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 300 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,200 L50,185 L100,170 L150,155 L200,130 L250,110 L300,90 L300,240 L0,240 Z" fill="url(#gMem)" />
              <polyline points="0,200 50,185 100,170 150,155 200,130 250,110 300,90" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── CRM SATISFACTION PAGE ──
export const CrmSatisfactionPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Overall Score', value: <span>4.6<span style={{ fontSize: 20, fontWeight: 300, color: 'var(--text3)' }}>/5</span></span>, badge: <Badge type="up">▲ +0.2 vs LY</Badge> },
        { label: 'Total Reviews', value: '1,248', badge: <Badge type="up">▲ +84 this month</Badge> },
        { label: 'Negative Reviews', value: '38', badge: <Badge type="dn">3.0% of total</Badge> },
        { label: 'Response Rate', value: '94%', badge: <Badge type="up">▲ +2pp vs LM</Badge> },
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { stars: 5, label: 'Excellent', pct: 68, count: '848', color: '#2ecc71' },
          { stars: 4, label: 'Good', pct: 22, count: '274', color: '#27ae60' },
          { stars: 3, label: 'Average', pct: 7, count: '87', color: 'var(--warning)' },
          { stars: 2, label: 'Poor', pct: 2, count: '25', color: 'var(--orange)' },
          { stars: 1, label: 'Terrible', pct: 1, count: '14', color: 'var(--danger)' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', gap: 2, minWidth: 72 }}>
              {Array.from({ length: r.stars }).map((_, j) => <span key={j} style={{ color: '#f39c12', fontSize: 11 }}>★</span>)}
              {Array.from({ length: 5 - r.stars }).map((_, j) => <span key={j} style={{ color: 'var(--border)', fontSize: 11 }}>★</span>)}
            </div>
            <div style={{ flex: 1, height: 6, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${r.pct}%`, height: '100%', background: r.color, borderRadius: 4 }} />
            </div>
            <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text2)', minWidth: 28 }}>{r.pct}%</span>
            <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: 'var(--text3)', minWidth: 32 }}>{r.count}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { cls: 'negative', stars: 2, author: 'Anonymous', text: 'Service was slow and the food arrived cold. Disappointing for the price point.', platform: 'Google', date: '10 Mar' },
          { cls: 'warning', stars: 3, author: 'T. Johnson', text: 'Good cocktails but the noise level in the bar was too high. Would prefer a quieter setting.', platform: 'TripAdvisor', date: '09 Mar' },
          { cls: '', stars: 5, author: 'S. Chen', text: 'Outstanding evening. The black cod is extraordinary, and the service was impeccable.', platform: 'Google', date: '08 Mar' },
        ].map((r, i) => (
          <div key={i} className={`review-card ${r.cls}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{r.author}</span>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>{r.platform} · {r.date}</span>
            </div>
            <div className="review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
            <div className="review-text">{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── CRM SERVICE PAGE ──
export const CrmServicePage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Open Tickets', value: '12', badge: <Badge type="dn">⚠ 3 high priority</Badge> },
        { label: 'Avg Response Time', value: '1.8h', badge: <Badge type="up">▼ -0.4h vs LW</Badge> },
        { label: 'Resolution Rate', value: '87%', badge: <Badge type="up">▲ +2pp vs LW</Badge> },
        { label: 'CSAT Score', value: '4.3/5', badge: <Badge type="nt">This week</Badge> },
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
      <div className="jbi-card-header"><span className="jbi-card-label">Open Tickets — by Channel & Age</span><span className="jbi-card-action">→</span></div>
      <div className="jbi-card-body" style={{ paddingTop: 8 }}>
        <table className="dt">
          <thead><tr><th>#</th><th>Subject</th><th>Channel</th><th>Age</th><th>Priority</th></tr></thead>
          <tbody>
            {[
              { id: 'T-048', subject: 'Reservation change Sat 14', channel: 'Email', age: '3 days', ageType: 'dn', priority: 'High', priType: 'dn' },
              { id: 'T-049', subject: 'Complaint mariscada', channel: 'Instagram', age: '2 days', ageType: 'dn', priority: 'High', priType: 'dn' },
              { id: 'T-050', subject: 'Allergy info request', channel: 'Email', age: '1 day', ageType: 'warn', priority: 'Medium', priType: 'nt' },
              { id: 'T-051', subject: 'VIP table request', channel: 'Phone', age: '2h', ageType: 'up', priority: 'Low', priType: 'nt' },
              { id: 'T-052', subject: 'Lost item report', channel: 'Instagram', age: '4h', ageType: 'up', priority: 'Medium', priType: 'nt' },
            ].map((t, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 10 }}>{t.id}</td>
                <td className="tm">{t.subject}</td>
                <td>{t.channel}</td>
                <td><Badge type={t.ageType as any}>{t.age}</Badge></td>
                <td><Badge type={t.priType as any}>{t.priority}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
