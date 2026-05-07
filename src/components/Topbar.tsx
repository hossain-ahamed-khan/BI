import React, { useState } from 'react';
import type { Period, PageId } from '../types';

const PAGE_TITLES: Record<PageId | string, string> = {
  overview: 'Dashboard',
  'sales-revenue': 'Sales — Global Revenue',
  'sales-area': 'Sales — By Area',
  'sales-category': 'Sales — By Category',
  'sales-product': 'Sales — By Product',
  'sales-trend': 'Sales — By Trend',
  'sales-discounts': 'Discounts & Refunds',
  'sales-tips': 'Sales — Tips',
  'sales-payments': 'Sales — Payment Methods',
  reservations: 'Reservations',
  fb: 'F & B',
  'crm-clients': 'CRM — Clients',
  'crm-loyalty': 'CRM — Loyalty',
  'crm-satisfaction': 'CRM — Guest Satisfaction',
  'crm-service': 'CRM — Customer Service',
  labour: 'Staff — Labour Cost',
  'labour-perf': 'Staff — Absences',
  'mkt-web': 'Marketing — Website Analytics',
  'mkt-booking': 'Marketing — Booking Widget',
  'mkt-paid': 'Marketing — Paid Media',
  'fb-stock': 'F&B — Stock & Purchasing',
  reports: 'Reports',
};

interface TopbarProps {
  activePage: PageId;
  period: Period;
  onPeriodChange: (p: Period) => void;
  onOpenSettings: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ activePage, period, onPeriodChange, onOpenSettings }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const showPills = activePage !== 'reports';

  return (
    <header className="topbar">
      <div className="page-title">{PAGE_TITLES[activePage] || activePage}</div>
      <div className="topbar-right">
        {showPills && (
          <div className="filter-pills">
            {(['day', 'week', 'month', 'year'] as Period[]).map(p => (
              <div key={p} className={`pill${period === p ? ' active' : ''}`} onClick={() => onPeriodChange(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </div>
            ))}
            <div className={`pill${period === 'custom' ? ' active' : ''}`} onClick={() => onPeriodChange('custom')}>
              Custom
            </div>
          </div>
        )}
        <button className="filter-btn" onClick={() => {}}>
          ⊞ Filter
        </button>
        <div className="avatar" id="profileBtn" onClick={() => setProfileOpen(o => !o)}>JB</div>

        {profileOpen && (
          <div className="profile-menu" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 14px 8px', borderBottom: '1px solid var(--border2)' }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>Jacqueline Beaumont</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>jacqueline@restaurant.com</div>
            </div>
            <div style={{ padding: '6px 4px' }}>
              <div className="pmenu-item" onClick={() => { setProfileOpen(false); onOpenSettings(); }}>
                <span className="pmenu-icon">⚙</span> Settings
              </div>
              <div className="pmenu-item"><span className="pmenu-icon">👤</span> My Profile</div>
              <div className="pmenu-item"><span className="pmenu-icon">📊</span> Billing</div>
              <div className="pmenu-item" style={{ color: 'var(--danger)' }}><span className="pmenu-icon">→</span> Sign Out</div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .topbar { height:54px; background:var(--white); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 24px; flex-shrink:0; position:relative; overflow:visible; z-index:100; }
        .page-title { font-size:15px; font-weight:600; color:var(--text); }
        .topbar-right { display:flex; align-items:center; gap:8px; position:relative; }
        .filter-pills { display:flex; gap:2px; background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:3px; position:relative; }
        .pill { padding:5px 13px; border-radius:7px; font-size:12px; cursor:pointer; transition:all .15s; color:var(--text2); }
        .pill.active { background:var(--white); color:var(--text); font-weight:600; box-shadow:0 1px 4px rgba(0,0,0,0.08); }
        .pill:hover:not(.active) { color:var(--text); }
        .filter-btn { display:flex; align-items:center; gap:5px; padding:6px 12px; border:1px solid var(--border); border-radius:8px; font-size:12px; color:var(--text2); background:var(--white); cursor:pointer; font-family:inherit; transition:all .15s; }
        .filter-btn:hover { border-color:var(--accent); color:var(--accent); }
        .avatar { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--orange)); display:flex; align-items:center; justify-content:center; font-size:11px; color:#fff; font-weight:600; cursor:pointer; }
        .profile-menu { position:absolute; top:calc(100% + 8px); right:0; background:var(--white); border:1px solid var(--border); border-radius:14px; box-shadow:0 8px 32px rgba(0,0,0,.12); width:220px; z-index:9999; overflow:hidden; }
      `}</style>
    </header>
  );
};

export default Topbar;
