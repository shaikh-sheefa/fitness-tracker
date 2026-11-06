import { CLASSES, round1 } from '../bmi.js';

const GAUGE_MIN = 14;
const GAUGE_MAX = 40;

export function Badge({ cls }) {
  return (
    <span className={`badge ${cls.key}`}>
      <i style={{ background: cls.color }} aria-hidden="true">{cls.icon}</i>
      {cls.label}
    </span>
  );
}

export function Gauge({ value }) {
  const pos = Math.min(100, Math.max(0, ((value - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100));
  return (
    <div className="gauge" aria-hidden="true">
      {CLASSES.map((c) => (
        <span
          key={c.key}
          style={{
            flex: Math.min(c.hi, GAUGE_MAX) - Math.max(c.lo, GAUGE_MIN),
            background: c.color,
          }}
        />
      ))}
      <u style={{ left: `${pos}%` }} />
    </div>
  );
}

export function BmiRow({ value, cls, style }) {
  return (
    <div className="bmi-row" style={style}>
      <span>BMI <span className="tnum">{round1(value).toFixed(1)}</span></span>
      <Badge cls={cls} />
    </div>
  );
}

export function Trio({ user }) {
  return (
    <div className="trio">
      <div><b>{user.age}</b><span>years</span></div>
      <div><b>{user.height}</b><span>cm</span></div>
      <div><b>{user.weight}</b><span>kg</span></div>
    </div>
  );
}
