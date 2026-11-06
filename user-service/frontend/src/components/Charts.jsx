import { CLASSES, classOfUser, plural } from '../bmi.js';
import { useTip } from './Tooltip.jsx';

const AGE_GROUPS = [
  { lo: 13, hi: 19, label: '13–19' },
  { lo: 20, hi: 29, label: '20–29' },
  { lo: 30, hi: 39, label: '30–39' },
  { lo: 40, hi: 49, label: '40–49' },
  { lo: 50, hi: 59, label: '50–59' },
  { lo: 60, hi: 100, label: '60+' },
];

export function ClassMix({ users }) {
  const { bind } = useTip();
  const counts = Object.fromEntries(CLASSES.map((c) => [c.key, 0]));
  users.forEach((u) => counts[classOfUser(u).key]++);

  return (
    <div className="panel">
      <h2>BMI class</h2>
      <div className="mix" id="mix">
        {CLASSES.filter((c) => counts[c.key]).map((c) => (
          <span
            key={c.key}
            style={{ flex: counts[c.key], background: c.color }}
            {...bind(
              <>
                <b>{c.label}</b>
                {plural(counts[c.key], 'athlete')} · {Math.round((counts[c.key] / users.length) * 100)}%
              </>
            )}
          />
        ))}
      </div>
      <ul className="mixrows" id="mixrows">
        {CLASSES.map((c) => (
          <li key={c.key}>
            <span className="sw" style={{ background: c.color }} />
            {c.label} <span className="range">{c.range}</span>
            <b className="tnum">{counts[c.key]}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AgeChart({ users }) {
  const { bind } = useTip();
  const groups = AGE_GROUPS.map((g) => users.filter((u) => u.age >= g.lo && u.age <= g.hi).length);
  const max = Math.max(...groups, 1);
  const peak = groups.indexOf(max);

  return (
    <div className="panel">
      <h2>Age</h2>
      <p className="sub">Athletes per age group</p>
      <div className="ages" id="ages">
        {groups.map((n, i) => (
          <div
            key={AGE_GROUPS[i].label}
            className="age-col"
            {...bind(
              <>
                <b>Age {AGE_GROUPS[i].label}</b>
                {plural(n, 'athlete')}
              </>
            )}
          >
            {i === peak && n > 0 && <em className="tnum">{n}</em>}
            <i style={{ height: `${n ? Math.max(4, (n / max) * 78) : 0}%` }} />
          </div>
        ))}
      </div>
      <div className="age-labels" id="age-labels">
        {AGE_GROUPS.map((g) => (
          <span key={g.label}>{g.label}</span>
        ))}
      </div>
    </div>
  );
}
