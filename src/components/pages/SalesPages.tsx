import React, { useState } from 'react';
import { Badge, SparkPlaceholder } from '../ui/SharedUI';

// ── GLOBAL REVENUE PAGE ──
export const SalesRevenuePage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Gross Revenue', value: '€ 184,320', badge: <Badge type="up">▲ +12.4% vs LY</Badge>, sub: 'YTD: € 1,024,800' },
        { label: 'Net Revenue', value: '€ 161,480', badge: <Badge type="up">▲ +9.7% vs LY</Badge>, sub: 'YTD: € 897,200' },
        { label: 'Tips', value: '€ 8,240', badge: <Badge type="up">▲ +4.1% vs LY</Badge>, sub: 'YTD: € 42,800' },
        { label: 'Cancellation Rate', value: '4.2%', badge: <Badge type="dn">▼ -0.3pp vs LY</Badge>, sub: 'YTD avg: 3.8%' },
      ].map((k, i) => (
        <div key={i} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span><span className="jbi-card-action">→</span></div>
          <div className="jbi-card-body">
            <div className="kn">{k.value}</div>{k.badge}
            <div className="ks" style={{ marginTop: 3 }}>{k.sub}</div>
            <SparkPlaceholder height={60} />
          </div>
        </div>
      ))}
    </div>

    <div className="g2">
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Weekly Evolution — Day / Night / Total</span><span className="jbi-card-action">→</span></div>
        <div className="jbi-card-body">
          <div style={{ height: 200, background: 'var(--bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              <polyline points="0,160 72,140 144,148 216,120 288,85 360,55 432,72 500,48" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
              <polyline points="0,175 72,162 144,168 216,150 288,128 360,105 432,118 500,95" fill="none" stroke="var(--accent2)" strokeWidth="1.8" />
              <polyline points="0,185 72,175 144,180 216,168 288,152 360,135 432,145 500,125" fill="none" stroke="var(--orange)" strokeWidth="1.8" />
            </svg>
          </div>
        </div>
      </div>
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">No-Show Rate</span><span className="jbi-card-action">→</span></div>
        <div className="jbi-card-body">
          <div className="kn sm">2.1%</div>
          <Badge type="up">▼ -0.4pp vs LW</Badge>
          <div style={{ height: 130, marginTop: 12, background: 'var(--bg)', borderRadius: 8 }} />
        </div>
      </div>
    </div>

    <div className="jbi-card">
      <div className="jbi-card-header"><span className="jbi-card-label">Consolidated Performance by Area</span><span className="jbi-card-action">→</span></div>
      <div className="jbi-card-body" style={{ paddingTop: 8 }}>
        <table className="dt">
          <thead><tr>
            <th>Business Unit</th>
            <th>Gross Revenue</th><th style={{ textAlign: 'center' }}>VS LY</th>
            <th>Net Revenue</th><th style={{ textAlign: 'center' }}>VS LY</th>
            <th>% of Total</th><th>Occ. Rate</th>
            <th style={{ textAlign: 'center' }}>Return. Rate</th><th style={{ textAlign: 'center' }}>VS LY</th>
          </tr></thead>
          <tbody>
            {[
              { name: 'El Comedor', gross: '€ 64,512', gly: '+10.2%', net: '€ 56,730', nly: '+8.4%', pct: '35%', occ: '82%', ret: '42%', rly: '+3.2pp', glyt: 'up', nly2: 'up', rlt: 'up' },
              { name: 'Jazz Club', gross: '€ 27,648', gly: '+5.2%', net: '€ 24,320', nly: '+4.1%', pct: '15%', occ: '74%', ret: '31%', rly: '+0.4pp', glyt: 'up', nly2: 'up', rlt: 'nt' },
              { name: 'La Barra Japonesa', gross: '€ 18,432', gly: '+8.4%', net: '€ 16,200', nly: '+6.9%', pct: '10%', occ: '68%', ret: '28%', rly: '-1.1pp', glyt: 'up', nly2: 'up', rlt: 'dn' },
              { name: 'Mesas Altas', gross: '€ 14,400', gly: '+3.1%', net: '€ 12,600', nly: '+2.4%', pct: '8%', occ: '61%', ret: '24%', rly: '+0.8pp', glyt: 'up', nly2: 'up', rlt: 'nt' },
              { name: 'Cocktail Bar', gross: '€ 36,864', gly: '-2.1%', net: '€ 32,440', nly: '-1.8%', pct: '20%', occ: '91%', ret: '35%', rly: '-2.4pp', glyt: 'dn', nly2: 'dn', rlt: 'dn' },
              { name: 'Private Club', gross: '€ 36,864', gly: '+22.0%', net: '€ 32,440', nly: '+18.4%', pct: '20%', occ: '88%', ret: '61%', rly: '+8.4pp', glyt: 'up', nly2: 'up', rlt: 'up' },
            ].map((r, i) => (
              <tr key={i}>
                <td className="tm">{r.name}</td>
                <td className="mono">{r.gross}</td>
                <td style={{ textAlign: 'center' }}><Badge type={r.glyt as any}>{r.gly}</Badge></td>
                <td className="mono">{r.net}</td>
                <td style={{ textAlign: 'center' }}><Badge type={r.nly2 as any}>{r.nly}</Badge></td>
                <td>{r.pct}</td><td>{r.occ}</td>
                <td style={{ textAlign: 'center' }}><Badge type={r.rlt as any}>{r.ret}</Badge></td>
                <td style={{ textAlign: 'center' }}><Badge type={r.rlt as any} style={{ fontSize: 10 }}>{r.rly}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ── SALES BY AREA PAGE ──
export const SalesAreaPage: React.FC = () => {
  const [activeArea, setActiveArea] = useState<'restaurants' | 'bars' | 'vip'>('restaurants');
  const [activeVenue, setActiveVenue] = useState(0);

  const restaurants = ['El Comedor', 'Jazz Club', 'La Barra Japonesa', 'Mesas Altas'];
  const bars = ['Cocktail Bar', 'Private Club Bar'];
  const vips = ['Private Club VIP Tables'];

  const venuesByArea = { restaurants, bars, vip: vips };
  const venues = venuesByArea[activeArea];

  return (
    <div className="jbi-page">
      <div className="jbi-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          {(['restaurants', 'bars', 'vip'] as const).map(a => (
            <div key={a} className={`area-tab${activeArea === a ? ' active' : ''}`} onClick={() => { setActiveArea(a); setActiveVenue(0); }}>
              {a === 'restaurants' ? '🍽 Restaurants' : a === 'bars' ? '🍸 Bars' : '✦ VIP Tables'}
            </div>
          ))}
        </div>
        <div className="jbi-card-body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {venues.map((v, i) => (
              <div key={i} className={`venue-tab${activeVenue === i ? ' active' : ''}`} onClick={() => setActiveVenue(i)}>
                {v}
              </div>
            ))}
          </div>

          {/* Venue content */}
          <div className="g4" style={{ marginBottom: 14 }}>
            {[
              { label: 'Gross Revenue', value: '€ 64,512', badge: <Badge type="up">▲ +10.2%</Badge> },
              { label: 'Net Revenue', value: '€ 56,730', badge: <Badge type="up">▲ +8.4%</Badge> },
              { label: 'Covers', value: '840', badge: <Badge type="up">▲ +6.1%</Badge> },
              { label: 'Occupancy Rate', value: '82%', badge: <Badge type="nt">Target: 80%</Badge> },
            ].map((k, i) => (
              <div key={i} className="jbi-card">
                <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span></div>
                <div className="jbi-card-body">
                  <div className="kn sm">{k.value}</div>{k.badge}
                  <SparkPlaceholder height={50} />
                </div>
              </div>
            ))}
          </div>

          <div className="g2">
            <div className="jbi-card">
              <div className="jbi-card-header"><span className="jbi-card-label">Revenue by Day</span></div>
              <div className="jbi-card-body" style={{ height: 180, background: 'var(--bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 180" preserveAspectRatio="none" style={{ display: 'block' }}>
                  {[60, 80, 72, 90, 110, 130, 105].map((h, i) => (
                    <rect key={i} x={i * 56 + 8} y={180 - h} width={40} height={h} fill={i === 5 ? 'var(--accent)' : 'var(--accent-bg)'} rx={4} />
                  ))}
                </svg>
              </div>
            </div>
            <div className="jbi-card">
              <div className="jbi-card-header"><span className="jbi-card-label">Covers by Shift</span></div>
              <div className="jbi-card-body">
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Day', 'Night'].map((s, i) => (
                    <div key={i} style={{ flex: 1, background: 'var(--bg)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--text3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>{s}</div>
                      <div style={{ fontSize: 28, fontWeight: 200 }}>{i === 0 ? '320' : '520'}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{i === 0 ? '38%' : '62%'} of total</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ height: 130, background: 'var(--bg)', borderRadius: 8 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SALES BY CATEGORY PAGE ──
export const SalesCategoryPage: React.FC = () => {
  const categories = [
    { name: 'Cocktails', products: 4820, gross: '€ 88,700', net: '€ 78,200', pct: 38 },
    { name: 'Food — Mains', products: 2840, gross: '€ 54,200', net: '€ 47,800', pct: 23 },
    { name: 'Wine & Champagne', products: 980, gross: '€ 34,800', net: '€ 30,600', pct: 15 },
    { name: 'Spirits', products: 1640, gross: '€ 18,400', net: '€ 16,200', pct: 8 },
    { name: 'Food — Starters', products: 1820, gross: '€ 14,800', net: '€ 13,000', pct: 6 },
    { name: 'Soft Drinks', products: 2100, gross: '€ 10,200', net: '€ 8,960', pct: 4 },
    { name: 'Desserts', products: 840, gross: '€ 4,800', net: '€ 4,220', pct: 2 },
  ];

  return (
    <div className="jbi-page">
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Revenue by Category — Over Time</span><span className="jbi-card-action">→</span></div>
        <div className="jbi-card-body">
          <div style={{ height: 210, background: 'var(--bg)', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 600 210" preserveAspectRatio="none">
              <polyline points="0,160 100,140 200,148 300,110 400,75 500,55 600,45" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
              <polyline points="0,180 100,170 200,172 300,155 400,138 500,125 600,118" fill="none" stroke="var(--orange)" strokeWidth="1.8" />
              <polyline points="0,190 100,186 200,188 300,178 400,165 500,158 600,152" fill="none" stroke="var(--teal)" strokeWidth="1.8" />
            </svg>
          </div>
        </div>
      </div>

      <div className="jbi-card">
        <div className="jbi-card-header">
          <span className="jbi-card-label">Sales by Category</span>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>↕ Click columns to sort</span>
        </div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <div className="scroll-x">
            <table className="dt">
              <thead><tr>
                <th>Category</th>
                <th>Products Sold</th>
                <th>Gross Revenue</th>
                <th>Net Revenue</th>
                <th>% of Total</th>
                <th style={{ width: 28 }} />
              </tr></thead>
              <tbody>
                {categories.map((c, i) => (
                  <tr key={i}>
                    <td className="tm">{c.name}</td>
                    <td className="mono">{c.products.toLocaleString()}</td>
                    <td className="mono">{c.gross}</td>
                    <td className="mono">{c.net}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden', minWidth: 60 }}>
                          <div style={{ width: `${c.pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text2)', minWidth: 28 }}>{c.pct}%</span>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13, color: 'var(--text3)', cursor: 'pointer' }}>›</span></td>
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

// ── SALES BY PRODUCT PAGE ──
export const SalesProductPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const products = [
    { name: 'Jacqueline Signature', cat: 'Cocktails', units: 900, gross: '€ 18,000', net: '€ 15,840' },
    { name: 'Spicy Margarita', cat: 'Cocktails', units: 750, gross: '€ 15,000', net: '€ 13,200' },
    { name: 'Black Cod Jac.', cat: 'Food — Mains', units: 520, gross: '€ 24,960', net: '€ 21,965' },
    { name: 'Pornstar Martini', cat: 'Cocktails', units: 620, gross: '€ 12,400', net: '€ 10,912' },
    { name: 'Truffle Pasta', cat: 'Food — Mains', units: 480, gross: '€ 19,200', net: '€ 16,896' },
    { name: 'Dom Pérignon 2015', cat: 'Wine & Champagne', units: 48, gross: '€ 14,400', net: '€ 12,672' },
    { name: 'Negroni', cat: 'Cocktails', units: 450, gross: '€ 9,000', net: '€ 7,920' },
    { name: 'Ceviche', cat: 'Food — Starters', units: 415, gross: '€ 12,450', net: '€ 10,956' },
    { name: 'Espresso Martini', cat: 'Cocktails', units: 405, gross: '€ 8,100', net: '€ 7,128' },
    { name: 'Paloma Rosa', cat: 'Cocktails', units: 380, gross: '€ 7,600', net: '€ 6,688' },
  ].filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="jbi-page">
      <div className="g4">
        {[
          { label: 'Total SKUs', value: '248', badge: <Badge type="nt">Active products</Badge> },
          { label: 'Units Sold', value: '18,420', badge: <Badge type="up">▲ +8.1% vs LW</Badge> },
          { label: 'Top Category', value: 'Cocktails', badge: <Badge type="up">38% of units</Badge> },
          { label: 'Avg Price / Unit', value: '€ 18.40', badge: <Badge type="nt">This week</Badge> },
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
          <span className="jbi-card-label">Sales by Product</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="search-bar" style={{ maxWidth: 220 }}>
              <span style={{ color: 'var(--text3)', fontSize: 13 }}>⌕</span>
              <input type="text" placeholder="Search product…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>↕ Click columns to sort</span>
          </div>
        </div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <div className="scroll-x">
            <table className="dt">
              <thead><tr>
                <th>Product</th>
                <th>Category</th>
                <th>Units Sold ↓</th>
                <th>Gross Revenue</th>
                <th>Net Revenue</th>
              </tr></thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td className="tm">{p.name}</td>
                    <td>{p.cat}</td>
                    <td className="mono">{p.units.toLocaleString()}</td>
                    <td className="mono">{p.gross}</td>
                    <td className="mono">{p.net}</td>
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

// ── SALES BY TREND PAGE ──
export const SalesTrendPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Food Sales', value: '€ 72,400', badge: <Badge type="up">▲ +8.2% vs LY</Badge> },
        { label: 'Drink Sales', value: '€ 111,920', badge: <Badge type="dn">▼ -1.4% vs LY</Badge> },
        { label: 'Food / Drink Split', value: '39 / 61', badge: <Badge type="nt">Food% / Drink%</Badge> },
        { label: 'Avg Dish Price', value: '€ 28.40', badge: <Badge type="up">▲ +2.1% vs LY</Badge> },
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

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
      {[
        {
          label: 'Top 10 Dishes (QTY)', color: 'var(--accent)',
          items: [
            ['Black Cod Jac.', 520], ['Truffle Pasta', 480], ['Ceviche', 415],
            ['Steak Tartare', 370], ['Oysters G.', 325], ['Wagyu Steak', 290],
            ['Tuna Tataki', 265], ['Burrata', 240], ['Foie Gras', 210], ['Salmon Tiradito', 195],
          ]
        },
        {
          label: 'Top 10 Cocktails (QTY)', color: 'var(--orange)',
          items: [
            ['Jacqueline Sig.', 900], ['Spicy Margarita', 750], ['Pornstar Martini', 620],
            ['Negroni', 450], ['Espresso Martini', 405], ['Paloma Rosa', 380],
            ['Old Fashioned', 320], ['Yuzu Sour', 285], ['Hibiscus Collins', 240], ['Dry Martini', 210],
          ]
        },
        {
          label: 'Top 10 Wines (QTY)', color: 'var(--teal)',
          items: [
            ['Dom Pérignon 2015', 48], ['Vega Sicilia Único', 36], ['Ruinart Blanc', 30],
            ['Marqués de Murrieta', 28], ['Chablis 1er Cru', 24], ['Albariño Rías Baixas', 22],
            ['Ribera del Duero RR', 20], ['Sancerre Blanc', 18], ['Priorat Les Terrasses', 16], ['Puligny-Montrachet', 14],
          ]
        },
      ].map((t, ti) => (
        <div key={ti} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{t.label}</span></div>
          <div className="jbi-card-body" style={{ paddingTop: 6 }}>
            <table className="dt">
              <thead><tr><th>#</th><th>{ti === 0 ? 'Dish' : ti === 1 ? 'Cocktail' : 'Wine'}</th><th>{ti === 2 ? 'Btls' : 'QTY'}</th></tr></thead>
              <tbody>
                {t.items.map(([name, qty], i) => (
                  <tr key={i}>
                    <td style={{ color: t.color, fontWeight: 600 }}>{i + 1}</td>
                    <td className="tm">{name}</td>
                    <td className="mono">{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── DISCOUNTS & REFUNDS PAGE ──
export const SalesDiscountsPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g3">
      {[
        { label: 'Total Discounts', value: '€ 2,398', badge: <Badge type="dn">Applied this period</Badge> },
        { label: 'Total Refunds', value: <span style={{ color: 'var(--danger)' }}>€ 480</span>, badge: <Badge type="dn">Refunded this period</Badge> },
        { label: 'Total Impact', value: <span style={{ color: 'var(--danger)' }}>− € 2,998</span>, badge: <Badge type="dn">Net revenue reduction</Badge> },
      ].map((k, i) => (
        <div key={i} className="jbi-card">
          <div className="jbi-card-header"><span className="jbi-card-label">{k.label}</span></div>
          <div className="jbi-card-body">
            <div className="kn">{k.value}</div>{k.badge}
            <SparkPlaceholder height={60} />
          </div>
        </div>
      ))}
    </div>
    <div className="jbi-card">
      <div className="jbi-card-header"><span className="jbi-card-label">Discounts & Refunds Detail</span><span className="jbi-card-action">→</span></div>
      <div className="jbi-card-body" style={{ paddingTop: 8 }}>
        <table className="dt">
          <thead><tr><th>Type</th><th>Code / Reason</th><th>Area</th><th>Applied By</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {[
              { type: 'Discount', code: 'STAFF20', area: 'El Comedor', by: 'M. García', amt: '−€ 48', date: 'Mon 10' },
              { type: 'Discount', code: 'VIP15', area: 'Private Club', by: 'A. López', amt: '−€ 95', date: 'Mon 10' },
              { type: 'Refund', code: 'Wrong order', area: 'Jazz Club', by: 'Manager', amt: '−€ 68', date: 'Tue 11' },
              { type: 'Discount', code: 'BIRTHDAY', area: 'La Barra Jap.', by: 'System', amt: '−€ 32', date: 'Wed 12' },
              { type: 'Refund', code: 'Quality complaint', area: 'Cocktail Bar', by: 'Manager', amt: '−€ 85', date: 'Thu 13' },
            ].map((r, i) => (
              <tr key={i}>
                <td><Badge type={r.type === 'Refund' ? 'dn' : 'nt'}>{r.type}</Badge></td>
                <td className="tm">{r.code}</td>
                <td>{r.area}</td>
                <td>{r.by}</td>
                <td className="mono" style={{ color: 'var(--danger)' }}>{r.amt}</td>
                <td style={{ color: 'var(--text3)' }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ── TIPS PAGE ──
export const SalesTipsPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Total Tips', value: '€ 8,240', badge: <Badge type="up">▲ +4.1% vs LY</Badge>, sub: 'YTD: € 42,800' },
        { label: 'Avg Tip / Cover', value: '€ 2.89', badge: <Badge type="up">▲ +0.12 vs LY</Badge> },
        { label: 'Tip Rate', value: '4.5%', badge: <Badge type="up">% of gross revenue</Badge> },
        { label: 'Top Venue', value: 'Private Club', badge: <Badge type="up">€ 3,120 this week</Badge> },
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
        <div className="jbi-card-header"><span className="jbi-card-label">Tips by Venue</span></div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <table className="dt">
            <thead><tr><th>Venue</th><th>Total Tips</th><th>Avg/Cover</th><th>Tip Rate</th></tr></thead>
            <tbody>
              {[
                ['El Comedor', '€ 1,840', '€ 2.19', '2.9%'],
                ['Jazz Club', '€ 920', '€ 2.48', '3.3%'],
                ['Cocktail Bar', '€ 1,480', '€ 3.18', '4.0%'],
                ['Private Club', '€ 3,120', '€ 5.64', '8.5%'],
                ['La Barra Jap.', '€ 880', '€ 2.36', '4.8%'],
              ].map((r, i) => (
                <tr key={i}><td className="tm">{r[0]}</td><td className="mono">{r[1]}</td><td className="mono">{r[2]}</td><td className="mono">{r[3]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Tips Evolution</span></div>
        <div className="jbi-card-body">
          <div style={{ height: 200, background: 'var(--bg)', borderRadius: 8 }} />
        </div>
      </div>
    </div>
  </div>
);

// ── PAYMENT METHODS PAGE ──
export const SalesPaymentsPage: React.FC = () => (
  <div className="jbi-page">
    <div className="g4">
      {[
        { label: 'Card Payments', value: '€ 140,083', badge: <Badge type="nt">76% of total</Badge> },
        { label: 'Cash', value: '€ 18,432', badge: <Badge type="nt">10% of total</Badge> },
        { label: 'Gift Cards', value: '€ 3,686', badge: <Badge type="nt">2% of total</Badge> },
        { label: 'Other', value: '€ 22,118', badge: <Badge type="nt">12% of total</Badge> },
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
        <div className="jbi-card-header"><span className="jbi-card-label">Payment Mix — Donut</span></div>
        <div className="jbi-card-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <svg width="180" height="180" viewBox="0 0 100 100">
            <circle r="40" cx="50" cy="50" fill="none" stroke="var(--accent)" strokeWidth="18" strokeDasharray="190 60" strokeDashoffset="0" />
            <circle r="40" cx="50" cy="50" fill="none" stroke="var(--orange)" strokeWidth="18" strokeDasharray="25 225" strokeDashoffset="-190" />
            <circle r="40" cx="50" cy="50" fill="none" stroke="var(--teal)" strokeWidth="18" strokeDasharray="5 245" strokeDashoffset="-215" />
            <circle r="40" cx="50" cy="50" fill="none" stroke="var(--text3)" strokeWidth="18" strokeDasharray="30 220" strokeDashoffset="-220" />
            <text x="50" y="46" textAnchor="middle" style={{ fontSize: 10, fontWeight: 600, fill: 'var(--text)', fontFamily: 'inherit' }}>€ 184k</text>
            <text x="50" y="58" textAnchor="middle" style={{ fontSize: 6, fill: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>TOTAL</text>
          </svg>
          <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { c: 'var(--accent)', l: 'Card', v: '76%' },
              { c: 'var(--orange)', l: 'Cash', v: '10%' },
              { c: 'var(--teal)', l: 'Gift Card', v: '2%' },
              { c: 'var(--text3)', l: 'Other', v: '12%' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: item.c, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item.l}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginLeft: 'auto' }}>{item.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="jbi-card">
        <div className="jbi-card-header"><span className="jbi-card-label">Payment Methods by Area</span></div>
        <div className="jbi-card-body" style={{ paddingTop: 8 }}>
          <table className="dt">
            <thead><tr><th>Area</th><th>Card</th><th>Cash</th><th>Other</th></tr></thead>
            <tbody>
              {[['El Comedor', '78%', '11%', '11%'], ['Jazz Club', '72%', '15%', '13%'], ['Cocktail Bar', '82%', '6%', '12%'], ['Private Club', '94%', '1%', '5%']].map((r, i) => (
                <tr key={i}><td className="tm">{r[0]}</td><td className="mono">{r[1]}</td><td className="mono">{r[2]}</td><td className="mono">{r[3]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);
