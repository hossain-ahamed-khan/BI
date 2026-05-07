import React from 'react';

// ── CARD ──
interface CardProps {
  label?: string;
  action?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  headerExtra?: React.ReactNode;
}
export const Card: React.FC<CardProps> = ({ label, action = '→', children, style, headerExtra }) => (
  <div className="jbi-card" style={style}>
    {label !== undefined && (
      <div className="jbi-card-header">
        <span className="jbi-card-label">{label}</span>
        {headerExtra}
        {action && <span className="jbi-card-action">{action}</span>}
      </div>
    )}
    <div className="jbi-card-body">{children}</div>
  </div>
);

// ── KPI CARD ──
interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  badge?: React.ReactNode;
  sub?: string;
  sparkHeight?: number;
}
export const KpiCard: React.FC<KpiCardProps> = ({ label, value, badge, sub }) => (
  <div className="jbi-card">
    <div className="jbi-card-header">
      <span className="jbi-card-label">{label}</span>
      <span className="jbi-card-action">→</span>
    </div>
    <div className="jbi-card-body">
      <div className="kn">{value}</div>
      {badge}
      {sub && <div className="ks" style={{ marginTop: 3 }}>{sub}</div>}
      <div style={{ height: 60, marginTop: 10, background: 'var(--bg)', borderRadius: 6, opacity: .4 }} />
    </div>
  </div>
);

// ── BADGE ──
interface BadgeProps {
  type?: 'up' | 'dn' | 'nt' | 'warn';
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export const Badge: React.FC<BadgeProps> = ({ type = 'nt', children, style }) => {
  const cls = type === 'warn' ? '' : type;
  const warnStyle = type === 'warn' ? { background: 'var(--warning-bg)', color: 'var(--warning)' } : {};
  return <span className={`bd ${cls}`} style={{ ...warnStyle, ...style }}>{children}</span>;
};

// ── STATUS PILL ──
interface StatusPillProps {
  status: 'ok' | 'wn' | 'er';
  children: React.ReactNode;
}
export const StatusPill: React.FC<StatusPillProps> = ({ status, children }) => (
  <span className={`sp ${status}`}>{children}</span>
);

// ── LIVE DOT ──
interface LiveDotProps {
  status: 'on' | 'off' | 'wn';
}
export const LiveDot: React.FC<LiveDotProps> = ({ status }) => (
  <span className={`ld ${status}`} />
);

// ── SOURCE ROW ──
interface SourceRowProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  name: string;
  status: 'ok' | 'wn' | 'er';
  statusLabel: string;
}
export const SourceRow: React.FC<SourceRowProps> = ({ icon, iconBg, iconColor, name, status, statusLabel }) => (
  <div className="sr">
    <div className="si" style={{ background: iconBg, color: iconColor }}>{icon}</div>
    <div style={{ flex: 1 }}><div className="sn">{name}</div></div>
    <span className={`sp ${status}`}>
      <LiveDot status={status === 'ok' ? 'on' : status === 'wn' ? 'wn' : 'off'} /> {statusLabel}
    </span>
  </div>
);

// ── PROGRESS BAR ──
interface ProgressBarProps {
  label: string;
  value: string;
  pct: number;
  color?: string;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, pct, color = 'var(--accent)' }) => (
  <div>
    <div className="kmr"><span>{label}</span><span className="mono">{value}</span></div>
    <div className="pw"><div className="pb" style={{ width: `${pct}%`, background: color }} /></div>
  </div>
);

// ── SPARKLINE PLACEHOLDER ──
export const SparkPlaceholder: React.FC<{ height?: number }> = ({ height = 60 }) => (
  <div style={{
    height,
    marginTop: 10,
    background: 'linear-gradient(90deg, var(--accent-bg) 0%, var(--accent-bg) 100%)',
    borderRadius: 6,
    opacity: .5,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
      <polyline
        points="0,45 28,38 56,42 84,30 112,25 140,18 168,22 200,15"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        opacity="0.6"
      />
    </svg>
  </div>
);
