export const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

:root {
  --bg:#f4f5f7; --white:#fff; --border:#e8e8ec; --border2:#f0f0f4;
  --text:#1a1a2e; --text2:#6b7080; --text3:#a8adbf;
  --accent:#6c5ce7; --accent2:#a29bfe; --accent-bg:rgba(108,92,231,0.07);
  --orange:#fd7c4a; --orange-bg:rgba(253,124,74,0.08);
  --teal:#00b89c; --success:#00b07a; --success-bg:rgba(0,176,122,0.08);
  --danger:#e84545; --danger-bg:rgba(232,69,69,0.08);
  --warning:#f39c12; --warning-bg:rgba(243,156,18,0.08);
  --shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04);
  --shadow-h:0 4px 24px rgba(0,0,0,0.09);
  --sidebar:220px;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

body {
  background:var(--bg);
  color:var(--text);
  font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:300;
}

.jbi-app {
  display:flex;
  height:100vh;
  overflow:hidden;
}

/* SCROLLBAR */
::-webkit-scrollbar { width:4px; height:3px; }
::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }

/* ANIMATIONS */
@keyframes fadeUp {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes sli { from { width:0; } }
@keyframes pu {
  0%,100% { opacity:1; transform:scale(1); }
  50%     { opacity:.5; transform:scale(.75); }
}
@keyframes slideInR {
  from { transform:translateX(30px); opacity:0; }
  to   { transform:translateX(0); opacity:1; }
}
@keyframes dpIn {
  from { opacity:0; transform:translateY(-6px); }
  to   { opacity:1; transform:translateY(0); }
}

/* PAGE */
.jbi-page {
  display:flex;
  flex-direction:column;
  gap:16px;
  animation:fadeUp .3s ease both;
}

/* CARD */
.jbi-card {
  background:var(--white);
  border:1px solid var(--border);
  border-radius:14px;
  box-shadow:var(--shadow);
  overflow:hidden;
  transition:box-shadow .2s;
}
.jbi-card:hover { box-shadow:var(--shadow-h); }

.jbi-card-header {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:14px 18px 0;
}
.jbi-card-label {
  font-family:'DM Mono',monospace;
  font-size:9px;
  letter-spacing:.15em;
  text-transform:uppercase;
  color:var(--text3);
}
.jbi-card-action {
  font-size:13px;
  color:var(--text3);
  cursor:pointer;
  transition:all .15s;
}
.jbi-card-action:hover { color:var(--accent); transform:translateX(2px); }

.jbi-card-body { padding:10px 18px 16px; }

/* GRIDS */
.g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.g2l { display:grid; grid-template-columns:1.6fr 1fr; gap:14px; }
.g3m { display:grid; grid-template-columns:1.6fr 1fr 1fr; gap:14px; }

/* KPI */
.kn { font-size:36px; font-weight:200; color:var(--text); letter-spacing:-0.03em; line-height:1; margin:6px 0 5px; }
.kn.sm { font-size:26px; }
.ks { font-size:11px; color:var(--text3); margin-top:3px; }

/* BADGE */
.bd { display:inline-flex; align-items:center; gap:3px; font-size:10px; font-weight:500; padding:2px 8px; border-radius:20px; }
.bd.up { color:var(--success); background:var(--success-bg); }
.bd.dn { color:var(--danger); background:var(--danger-bg); }
.bd.nt { color:var(--text2); background:var(--bg); }

/* TABLE */
.dt { width:100%; border-collapse:collapse; }
.dt th {
  font-family:'DM Mono',monospace; font-size:8.5px; letter-spacing:.12em;
  text-transform:uppercase; color:var(--text3); text-align:left;
  padding:0 10px 8px 0; border-bottom:1px solid var(--border);
}
.dt td {
  font-size:12px; padding:8px 10px 8px 0; border-bottom:1px solid var(--border2);
  color:var(--text2); vertical-align:middle;
}
.dt tr:last-child td { border-bottom:none; }
.dt tr:hover td { background:var(--bg); }
.tm { font-weight:500; color:var(--text)!important; }
.mono { font-family:'DM Mono',monospace; }

/* STATUS PILL */
.sp { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:500; }
.sp.ok { background:var(--success-bg); color:var(--success); }
.sp.wn { background:var(--warning-bg); color:var(--warning); }
.sp.er { background:var(--danger-bg); color:var(--danger); }

/* PROGRESS */
.pw { height:5px; background:var(--bg); border-radius:10px; overflow:hidden; margin-top:4px; }
.pb { height:100%; border-radius:10px; animation:sli 1s ease both; }

/* LIVE DOT */
.ld { width:7px; height:7px; border-radius:50%; display:inline-block; }
.ld.on { background:var(--success); animation:pu 2s infinite; }
.ld.off { background:var(--danger); }
.ld.wn { background:var(--warning); }

/* SOURCE ROW */
.sr { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border2); }
.sr:last-child { border-bottom:none; }
.si { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0; }
.sn { font-size:13px; font-weight:500; color:var(--text); }

/* KPI META ROW */
.kmr { display:flex; justify-content:space-between; font-size:12px; color:var(--text2); margin-bottom:4px; }

/* SCROLL X */
.scroll-x { overflow-x:auto; }
.scroll-x::-webkit-scrollbar { height:3px; }

/* TIER BADGES */
.tier { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:20px; font-size:10px; font-weight:600; letter-spacing:.02em; }
.tier-new { background:#f0f4ff; color:#4a6cf7; }
.tier-potential { background:#f5f0ff; color:var(--accent); }
.tier-loyal { background:#e8f8f2; color:var(--success); }
.tier-vip { background:#fff7e6; color:#c47d00; }
.tier-super { background:#fff0f0; color:#c0392b; }
.tier-risk { background:#fff3cd; color:#856404; border:1px solid #ffc107; }

/* REVIEW CARD */
.review-card { background:var(--white); border:1px solid var(--border); border-radius:12px; padding:14px 16px; transition:box-shadow .15s; }
.review-card:hover { box-shadow:var(--shadow-h); }
.review-card.negative { border-left:3px solid var(--danger); }
.review-card.warning { border-left:3px solid var(--warning); }
.review-stars { display:flex; gap:2px; font-size:12px; color:#f39c12; margin:4px 0; }
.review-text { font-size:12px; color:var(--text2); line-height:1.55; margin:6px 0; }
.review-meta { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:6px; }

/* ALERT CARD */
.alert-card { background:var(--danger-bg); border:1px solid rgba(232,69,69,.2); border-radius:10px; padding:12px 14px; display:flex; gap:12px; align-items:flex-start; }
.alert-icon { font-size:16px; flex-shrink:0; margin-top:1px; }
.alert-title { font-size:12px; font-weight:600; color:var(--danger); }
.alert-body { font-size:11px; color:var(--text2); margin-top:3px; line-height:1.45; }

/* SEARCH BAR */
.search-bar { display:flex; align-items:center; gap:8px; background:var(--white); border:1px solid var(--border); border-radius:9px; padding:7px 12px; width:100%; }
.search-bar input { border:none; outline:none; font-size:13px; font-family:inherit; color:var(--text); background:transparent; flex:1; }
.search-bar input::placeholder { color:var(--text3); }

/* CHANNEL CARD */
.ch-card { background:var(--white); border:1px solid var(--border); border-radius:14px; padding:18px; box-shadow:var(--shadow); }
.ch-stat { display:flex; justify-content:space-between; font-size:12px; padding:5px 0; border-bottom:1px solid var(--border2); }
.ch-stat:last-child { border-bottom:none; }

/* LOYALTY */
.loy-tier-row { display:flex; align-items:center; gap:14px; padding:12px 0; border-bottom:1px solid var(--border2); }
.loy-tier-row:last-child { border-bottom:none; }
.loy-bar-track { flex:1; height:8px; background:var(--bg); border-radius:10px; overflow:hidden; }
.loy-bar-fill { height:100%; border-radius:10px; }
.loy-count { font-family:'DM Mono',monospace; font-size:12px; color:var(--text); min-width:36px; text-align:right; }
.loy-delta { font-size:10px; font-weight:600; min-width:46px; text-align:right; }
.loy-delta.up { color:var(--success); }
.loy-delta.dn { color:var(--danger); }

/* AREA TAB */
.area-tab { padding:10px 22px; font-size:13px; font-weight:500; color:var(--text2); cursor:pointer; border-bottom:2px solid transparent; transition:all .15s; }
.area-tab.active { color:var(--accent); border-bottom-color:var(--accent); }
.area-tab:hover:not(.active) { color:var(--text); background:var(--bg); }

/* VENUE TAB */
.venue-tab { padding:6px 16px; font-size:12px; font-weight:500; color:var(--text2); cursor:pointer; border-radius:20px; background:var(--bg); border:1px solid var(--border2); transition:all .15s; }
.venue-tab.active { background:var(--accent); color:#fff; border-color:var(--accent); }
.venue-tab:hover:not(.active) { border-color:var(--accent); color:var(--accent); }

/* SUB TABS */
.sub-tabs { display:flex; gap:2px; background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:3px; width:fit-content; margin-bottom:4px; }
.sub-tab { padding:5px 14px; border-radius:7px; font-size:12px; cursor:pointer; color:var(--text2); transition:all .15s; white-space:nowrap; }
.sub-tab.active { background:var(--white); color:var(--text); font-weight:600; box-shadow:0 1px 4px rgba(0,0,0,0.08); }

/* SETTINGS */
.settings-overlay { position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:10000; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity .2s; }
.settings-overlay.open { opacity:1; pointer-events:all; }
.settings-modal { background:#fff; border-radius:18px; width:860px; max-width:95vw; max-height:90vh; display:flex; overflow:hidden; box-shadow:0 24px 80px rgba(0,0,0,.18); transform:translateY(20px); transition:transform .25s; }
.settings-overlay.open .settings-modal { transform:translateY(0); }
.settings-sidebar { width:200px; flex-shrink:0; background:var(--bg); border-right:1px solid var(--border); padding:16px 0; }
.settings-nav-item { display:flex; align-items:center; gap:8px; padding:9px 16px; font-size:13px; color:var(--text2); cursor:pointer; transition:background .15s; }
.settings-nav-item:hover { background:#eeeef5; color:var(--text); }
.settings-nav-item.active { background:var(--accent-bg); color:var(--accent); font-weight:500; }
.settings-body { flex:1; overflow-y:auto; padding:28px 28px 40px; }
.settings-input { width:100%; padding:9px 12px; border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); background:#fff; outline:none; box-sizing:border-box; font-family:inherit; }
.settings-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-bg); }
.settings-select { width:100%; padding:9px 12px; border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); background:#fff; outline:none; box-sizing:border-box; font-family:inherit; cursor:pointer; }
.settings-btn { padding:9px 20px; background:var(--accent); color:#fff; border:none; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; font-family:inherit; }
.settings-btn.sec { background:transparent; color:var(--text2); border:1px solid var(--border); }

/* TEAM */
.team-member-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border); }
.team-avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:#fff; flex-shrink:0; }
.team-name { font-size:13px; font-weight:500; color:var(--text); }
.team-email { font-size:11px; color:var(--text3); }
.role-badge { font-size:10px; padding:2px 8px; border-radius:10px; font-weight:500; font-family:'DM Mono',monospace; }
.role-superadmin { background:#f0edff; color:var(--accent); }
.role-admin { background:#e6fff6; color:var(--success); }
.role-manager { background:#fff4e6; color:var(--orange); }
.role-submanager { background:#fff0f0; color:var(--danger); }
.role-accountant { background:#e8f4ff; color:#1a73e8; }

/* STAFF TABLE */
.staff-week-table td, .staff-week-table th { text-align:right; padding:9px 14px!important; font-size:12px; }
.staff-week-table td:first-child, .staff-week-table th:first-child { text-align:left; font-weight:500; color:var(--text); }
.staff-week-table tbody tr:hover { background:var(--accent-bg); }
.staff-week-table .section-row td { background:var(--bg); color:var(--text3); font-size:10px; font-family:'DM Mono',monospace; letter-spacing:.1em; text-transform:uppercase; padding:6px 14px!important; }

/* PROFILE MENU */
.pmenu-item { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; font-size:13px; color:var(--text); cursor:pointer; transition:background .15s; }
.pmenu-item:hover { background:var(--bg); }

/* MODAL */
.modal-overlay { position:fixed; inset:0; background:rgba(26,26,46,0.45); z-index:1000; display:none; align-items:flex-start; justify-content:flex-end; padding:12px; }
.modal-overlay.open { display:flex; }
.modal { background:var(--white); border-radius:16px; width:480px; max-height:calc(100vh - 24px); overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.18); animation:slideInR .25s ease; }
.modal-hdr { display:flex; align-items:center; justify-content:space-between; padding:20px 20px 0; }
.modal-close { width:28px; height:28px; border-radius:50%; background:var(--bg); border:none; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; color:var(--text2); }
.modal-close:hover { background:var(--border); color:var(--text); }
.modal-avatar { width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:600; color:#fff; }
.modal-section { padding:16px 20px; border-bottom:1px solid var(--border2); }
.modal-section:last-child { border-bottom:none; }
.modal-sec-title { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:var(--text3); margin-bottom:10px; }
.modal-row { display:flex; justify-content:space-between; align-items:center; padding:5px 0; font-size:12px; }
.modal-row span:first-child { color:var(--text2); }
.modal-row span:last-child { color:var(--text); font-weight:500; }
.modal-tag { display:inline-block; padding:3px 9px; border-radius:20px; font-size:10px; font-weight:500; background:var(--accent-bg); color:var(--accent); margin:3px 3px 3px 0; }
.visit-row { display:flex; gap:10px; padding:7px 0; border-bottom:1px solid var(--border2); font-size:12px; align-items:center; }
.visit-row:last-child { border-bottom:none; }
.visit-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); flex-shrink:0; }
`;
