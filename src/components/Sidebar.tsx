import React, { useState } from 'react';
import type { PageId } from '../types';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onOpenSettings }) => {
  const [salesOpen, setSalesOpen] = useState(false);
  const [crmOpen, setCrmOpen] = useState(false);
  const [mktOpen, setMktOpen] = useState(false);
  const [staffOpen, setStaffOpen] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);

  const navItem = (id: PageId, label: string, indent = false) => (
    <div
      key={id}
      className={`nav-item${activePage === id ? ' active' : ''}`}
      style={indent ? { paddingLeft: 32, fontSize: 12 } : {}}
      onClick={() => onNavigate(id)}
    >
      {indent && <span style={{ opacity: .4, marginRight: 6 }}>·</span>}
      {label}
    </div>
  );

  return (
    <aside className="sidebar">
      <div className="logo-area">
        <div className="logo-name">Jacqueline</div>
        <div className="logo-sub">Business Intelligence</div>
      </div>

      <nav className="nav">
        <div className={`nav-item${activePage === 'overview' ? ' active' : ''}`} onClick={() => onNavigate('overview')}>
          <span className="nav-icon">⊞</span> Overview
        </div>

        {/* SALES */}
        <div className="nav-item nav-parent" onClick={() => setSalesOpen(o => !o)}>
          <span className="nav-icon">◈</span> Sales
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text3)', transition: 'transform .2s', transform: salesOpen ? 'rotate(90deg)' : 'none' }}>›</span>
        </div>
        <div style={{ overflow: 'hidden', maxHeight: salesOpen ? 300 : 0, transition: 'max-height .28s ease' }}>
          {navItem('sales-revenue', 'Global Revenue', true)}
          {navItem('sales-area', 'Sales by Area', true)}
          {navItem('sales-category', 'Sales by Category', true)}
          {navItem('sales-product', 'Sales by Product', true)}
          {navItem('sales-trend', 'Sales by Trend', true)}
          {navItem('sales-discounts', 'Discounts & Refunds', true)}
          {navItem('sales-tips', 'Tips', true)}
          {navItem('sales-payments', 'Payment Methods', true)}
        </div>

        {/* CRM */}
        <div className="nav-item nav-parent" onClick={() => setCrmOpen(o => !o)}>
          <span className="nav-icon">◉</span> CRM
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text3)', transition: 'transform .2s', transform: crmOpen ? 'rotate(90deg)' : 'none' }}>›</span>
        </div>
        <div style={{ overflow: 'hidden', maxHeight: crmOpen ? 200 : 0, transition: 'max-height .28s ease' }}>
          {navItem('crm-clients', 'Clients', true)}
          {navItem('crm-loyalty', 'Loyalty', true)}
          {navItem('crm-satisfaction', 'Guest Satisfaction', true)}
          {navItem('crm-service', 'Customer Service', true)}
        </div>

        <div className={`nav-item${activePage === 'reservations' ? ' active' : ''}`} onClick={() => onNavigate('reservations')}>
          <span className="nav-icon">◇</span> Reservations
        </div>

        {/* MARKETING */}
        <div className="nav-item nav-parent" onClick={() => setMktOpen(o => !o)}>
          <span className="nav-icon">◎</span> Marketing
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text3)', transition: 'transform .2s', transform: mktOpen ? 'rotate(90deg)' : 'none' }}>›</span>
        </div>
        <div style={{ overflow: 'hidden', maxHeight: mktOpen ? 150 : 0, transition: 'max-height .28s ease' }}>
          {navItem('mkt-web', 'Website Analytics', true)}
          {navItem('mkt-booking', 'Booking Widget', true)}
          {navItem('mkt-paid', 'Paid Media', true)}
        </div>

        {/* STAFF */}
        <div className="nav-item nav-parent" onClick={() => setStaffOpen(o => !o)}>
          <span className="nav-icon">▦</span> Staff
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text3)', transition: 'transform .2s', transform: staffOpen ? 'rotate(90deg)' : 'none' }}>›</span>
        </div>
        <div style={{ overflow: 'hidden', maxHeight: staffOpen ? 100 : 0, transition: 'max-height .25s ease' }}>
          {navItem('labour', 'Labour Cost', true)}
          {navItem('labour-perf', 'Absences', true)}
        </div>

        {/* F&B */}
        <div className="nav-item nav-parent" onClick={() => setFbOpen(o => !o)}>
          <span className="nav-icon">◫</span> F &amp; B
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text3)', transition: 'transform .2s', transform: fbOpen ? 'rotate(90deg)' : 'none' }}>›</span>
        </div>
        <div style={{ overflow: 'hidden', maxHeight: fbOpen ? 100 : 0, transition: 'max-height .25s ease' }}>
          {navItem('fb', 'Performance', true)}
          {navItem('fb-stock', 'Stock & Purchasing', true)}
        </div>

        <div className={`nav-item${activePage === 'reports' ? ' active' : ''}`} onClick={() => onNavigate('reports')}>
          <span className="nav-icon">⊡</span> Reports
        </div>
      </nav>

      <div className="nav-bottom">
        <div className="nav-bottom-item" onClick={onOpenSettings}>⚙ Settings</div>
        <div className="nav-bottom-item">↑ Export</div>
      </div>

      <style>{`
        .sidebar { width:var(--sidebar); min-width:var(--sidebar); background:var(--white); border-right:1px solid var(--border); display:flex; flex-direction:column; }
        .logo-area { padding:22px 20px 18px; border-bottom:1px solid var(--border2); }
        .logo-name { font-size:17px; font-weight:600; color:var(--text); letter-spacing:-0.01em; }
        .logo-sub { font-family:'DM Mono',monospace; font-size:9px; color:var(--text3); letter-spacing:0.12em; text-transform:uppercase; margin-top:3px; }
        .nav { flex:1; padding:14px 0; overflow-y:auto; }
        .nav-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text3); padding:10px 20px 4px; }
        .nav-item { display:flex; align-items:center; gap:10px; padding:8px 20px; font-size:14px; font-weight:400; color:var(--text2); cursor:pointer; transition:all .15s; position:relative; user-select:none; }
        .nav-item:hover { color:var(--text); background:var(--bg); }
        .nav-item.active { color:var(--accent); background:var(--accent-bg); font-weight:500; }
        .nav-item.active::before { content:''; position:absolute; left:0; top:4px; bottom:4px; width:3px; background:var(--accent); border-radius:0 2px 2px 0; }
        .nav-icon { font-size:13px; width:18px; text-align:center; }
        .nav-bottom { padding:14px 20px; border-top:1px solid var(--border2); }
        .nav-bottom-item { display:flex; align-items:center; gap:10px; padding:7px 0; font-size:12px; color:var(--text3); cursor:pointer; transition:color .15s; }
        .nav-bottom-item:hover { color:var(--text2); }
      `}</style>
    </aside>
  );
};

export default Sidebar;
