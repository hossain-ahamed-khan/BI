import React, { useState } from 'react';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'team' | 'notifications' | 'integrations' | 'billing';

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [members, setMembers] = useState([
    { initials: 'JB', name: 'Jacqueline Beaumont', email: 'jacqueline@restaurant.com', role: 'Super Admin', color: 'linear-gradient(135deg,var(--accent),var(--orange))' },
    { initials: 'MG', name: 'Miguel García', email: 'm.garcia@restaurant.com', role: 'Manager', color: 'linear-gradient(135deg,var(--success),var(--teal))' },
    { initials: 'AL', name: 'Ana López', email: 'a.lopez@restaurant.com', role: 'Admin', color: 'linear-gradient(135deg,var(--accent2),#7c8cf8)' },
    { initials: 'RC', name: 'Roberto Comes', email: 'r.comes@restaurant.com', role: 'Accountant', color: 'linear-gradient(135deg,#1a73e8,#4fc3f7)' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Manager');

  const navItems: { id: SettingsTab; icon: string; label: string }[] = [
    { id: 'general', icon: '⚙', label: 'General' },
    { id: 'team', icon: '👥', label: 'Team' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'integrations', icon: '◈', label: 'Integrations' },
    { id: 'billing', icon: '💳', label: 'Billing' },
  ];

  const roleColors: Record<string, string> = {
    'Super Admin': 'role-superadmin',
    'Admin': 'role-admin',
    'Manager': 'role-manager',
    'Sub Manager': 'role-submanager',
    'Accountant': 'role-accountant',
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const initials = inviteEmail.substring(0, 2).toUpperCase();
    const colors = [
      'linear-gradient(135deg,var(--accent),var(--orange))',
      'linear-gradient(135deg,var(--success),var(--teal))',
      'linear-gradient(135deg,var(--accent2),#7c8cf8)',
    ];
    setMembers(m => [...m, {
      initials,
      name: inviteEmail,
      email: 'Invite pending',
      role: inviteRole,
      color: colors[Math.floor(Math.random() * colors.length)],
    }]);
    setInviteEmail('');
  };

  return (
    <div className={`settings-overlay${open ? ' open' : ''}`} onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="settings-sidebar-title">Settings</div>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`settings-nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="settings-nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="settings-body">
          {/* GENERAL */}
          {activeTab === 'general' && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>General Settings</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>Configure your workspace preferences</div>

              <div style={{ marginBottom: 18 }}>
                <div className="settings-label">Restaurant Name</div>
                <input className="settings-input" defaultValue="Jacqueline" />
              </div>
              <div style={{ marginBottom: 18 }}>
                <div className="settings-label">Primary Currency</div>
                <select className="settings-select">
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>USD ($)</option>
                </select>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div className="settings-label">Timezone</div>
                <select className="settings-select">
                  <option>Europe/Madrid (UTC+1)</option>
                  <option>Europe/London (UTC+0)</option>
                  <option>Europe/Paris (UTC+1)</option>
                </select>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div className="settings-label">Fiscal Week Start</div>
                <select className="settings-select">
                  <option>Monday</option>
                  <option>Sunday</option>
                  <option>Saturday</option>
                </select>
              </div>
              <div style={{ marginBottom: 18 }}>
                <div className="settings-label">Report Language</div>
                <select className="settings-select">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="settings-btn">Save Changes</button>
                <button className="settings-btn sec">Cancel</button>
              </div>
            </div>
          )}

          {/* TEAM */}
          {activeTab === 'team' && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Team Management</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>Manage team members and their access roles</div>

              <div id="teamMembersList">
                {members.map((m, i) => (
                  <div key={i} className="team-member-row">
                    <div className="team-avatar" style={{ background: m.color }}>{m.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div className="team-name">{m.name}</div>
                      <div className="team-email">{m.email}</div>
                    </div>
                    <span className={`role-badge ${roleColors[m.role] || 'role-manager'}`}>{m.role}</span>
                    <select className="settings-select" style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }} defaultValue={m.role}>
                      <option>Super Admin</option>
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Sub Manager</option>
                      <option>Accountant</option>
                    </select>
                    {i > 0 && (
                      <button
                        onClick={() => setMembers(ms => ms.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
                      >✕</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="invite-form" style={{ background: 'var(--bg)', borderRadius: 12, padding: 16, marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 12 }}>Invite Team Member</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    className="settings-input"
                    placeholder="Email address"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <select className="settings-select" style={{ width: 140 }} value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option value="Manager">Manager</option>
                    <option>Sub Manager</option>
                    <option>Accountant</option>
                  </select>
                  <button className="settings-btn" onClick={handleInvite}>Send Invite</button>
                </div>
              </div>

              {/* Permissions matrix */}
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Role Permissions</div>
                <div className="scroll-x">
                  <table className="dt">
                    <thead>
                      <tr>
                        <th>Permission</th>
                        <th style={{ textAlign: 'center' }}>Super Admin</th>
                        <th style={{ textAlign: 'center' }}>Admin</th>
                        <th style={{ textAlign: 'center' }}>Manager</th>
                        <th style={{ textAlign: 'center' }}>Accountant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['View Dashboard', true, true, true, true],
                        ['Export Reports', true, true, true, true],
                        ['Edit Settings', true, true, false, false],
                        ['Manage Team', true, true, false, false],
                        ['Manage Integrations', true, false, false, false],
                        ['View Billing', true, true, false, true],
                        ['Delete Data', true, false, false, false],
                      ].map((row, i) => (
                        <tr key={i}>
                          <td className="tm">{row[0] as string}</td>
                          {[row[1], row[2], row[3], row[4]].map((allowed, j) => (
                            <td key={j} style={{ textAlign: 'center' }}>
                              {allowed
                                ? <span style={{ color: 'var(--success)', fontSize: 14 }}>✓</span>
                                : <span style={{ color: 'var(--border)', fontSize: 14 }}>—</span>
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Notification Settings</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>Configure when and how you receive alerts</div>

              {[
                { label: 'Weekly Report Auto-Send', desc: 'Send PDF report every Monday at 08:00', on: true },
                { label: 'Monthly Report Auto-Send', desc: 'Send PDF report on 1st of each month', on: true },
                { label: 'Revenue Alert', desc: 'Alert if daily revenue drops > 20% vs LY', on: true },
                { label: 'Labour Cost Alert', desc: 'Alert if weekly labour cost % exceeds 25%', on: true },
                { label: 'Negative Review Alert', desc: 'Immediate alert for 1-2 star reviews', on: false },
                { label: 'Price Increase Alert', desc: 'Alert for supplier price increases > 5%', on: true },
                { label: 'No-Show Spike Alert', desc: 'Alert if daily no-show rate exceeds 5%', on: false },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border2)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <div style={{ position: 'relative', width: 36, height: 20, cursor: 'pointer' }}>
                    <div style={{ width: 36, height: 20, borderRadius: 20, background: item.on ? 'var(--accent)' : 'var(--border)', transition: 'background .2s' }} />
                    <div style={{ position: 'absolute', top: 3, left: item.on ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 20 }}>
                <div className="settings-label">Notification Email</div>
                <input className="settings-input" defaultValue="jacqueline@restaurant.com" />
              </div>
              <button className="settings-btn" style={{ marginTop: 16 }}>Save Preferences</button>
            </div>
          )}

          {/* INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Integrations</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>Connected data sources and third-party services</div>

              {[
                { icon: '◈', name: 'Square POS', desc: 'Point of Sale · Sales & payment data', status: 'Connected', color: 'var(--accent-bg)', iconColor: 'var(--accent)', statusType: 'ok' },
                { icon: '◇', name: 'SevenRooms', desc: 'Reservation & CRM platform', status: 'Connected', color: '#f0f0ff', iconColor: 'var(--accent2)', statusType: 'ok' },
                { icon: '◫', name: 'Haddock', desc: 'F&B cost & inventory management', status: 'Delayed', color: 'var(--warning-bg)', iconColor: 'var(--warning)', statusType: 'wn' },
                { icon: '◎', name: 'Google Analytics 4', desc: 'Website traffic & behaviour', status: 'Connected', color: 'var(--orange-bg)', iconColor: 'var(--orange)', statusType: 'ok' },
                { icon: '◎', name: 'Meta Ads', desc: 'Facebook & Instagram advertising', status: 'Connected', color: '#fff0e6', iconColor: '#e8612a', statusType: 'ok' },
                { icon: '◎', name: 'Google Ads', desc: 'Search & display advertising', status: 'Connected', color: '#e8f4ff', iconColor: '#1a73e8', statusType: 'ok' },
                { icon: '▦', name: 'Skello', desc: 'Staff scheduling & hours tracking', status: 'Connected', color: 'var(--success-bg)', iconColor: 'var(--success)', statusType: 'ok' },
                { icon: '□', name: 'TikTok Ads', desc: 'TikTok advertising platform', status: 'Not connected', color: 'var(--bg)', iconColor: 'var(--text3)', statusType: 'er' },
              ].map((int, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border2)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: int.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: int.iconColor, flexShrink: 0 }}>{int.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{int.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{int.desc}</div>
                  </div>
                  <span className={`sp ${int.statusType}`}>{int.status}</span>
                  <button style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 11, color: 'var(--text2)', background: 'var(--white)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {int.statusType === 'er' ? 'Connect' : 'Configure'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* BILLING */}
          {activeTab === 'billing' && (
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Billing & Plan</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>Manage your subscription and payment details</div>

              <div style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))', borderRadius: 14, padding: '20px 24px', marginBottom: 20, color: '#fff' }}>
                <div style={{ fontSize: 10, fontFamily: 'DM Mono', letterSpacing: '.15em', textTransform: 'uppercase', opacity: .8 }}>Current Plan</div>
                <div style={{ fontSize: 24, fontWeight: 600, marginTop: 6 }}>Business Pro</div>
                <div style={{ fontSize: 12, opacity: .8, marginTop: 4 }}>€ 299 / month · Billed annually · Renews Apr 2027</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                  {['All integrations', 'Unlimited exports', 'Team access (10)', 'Priority support'].map(f => (
                    <span key={f} style={{ background: 'rgba(255,255,255,.2)', borderRadius: 20, padding: '3px 10px', fontSize: 11 }}>✓ {f}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 10 }}>Payment Method</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 10 }}>
                  <span style={{ fontSize: 20 }}>💳</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Visa ending in 4242</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>Expires 08/2027</div>
                  </div>
                  <button style={{ marginLeft: 'auto', padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 11, color: 'var(--text2)', background: 'var(--white)', cursor: 'pointer', fontFamily: 'inherit' }}>Update</button>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 10 }}>Invoice History</div>
                <table className="dt">
                  <thead><tr><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {[['Mar 2026', '€ 299', 'Paid'], ['Feb 2026', '€ 299', 'Paid'], ['Jan 2026', '€ 299', 'Paid']].map((r, i) => (
                      <tr key={i}>
                        <td>{r[0]}</td><td className="mono">{r[1]}</td>
                        <td><span className="sp ok">✓ {r[2]}</span></td>
                        <td><button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', fontSize: 11, cursor: 'pointer', color: 'var(--text2)', fontFamily: 'inherit' }}>↓</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: '50%', background: 'var(--bg)', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >✕</button>
      </div>
    </div>
  );
};

export default SettingsModal;
