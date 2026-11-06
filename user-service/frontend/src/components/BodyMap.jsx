import { useEffect, useRef, useState } from 'react';
import { CLASSES, bmi, classOf, round1 } from '../bmi.js';
import { useTip } from './Tooltip.jsx';

const MARGIN = { t: 10, r: 10, b: 44, l: 50 };
const LABEL_BMI = { under: 16.4, healthy: 21.7, over: 27.4, obese: 34 };
const isoline = (value, height) => value * (height / 100) ** 2;

function range(start, end, step) {
  const out = [];
  for (let t = Math.ceil(start / step) * step; t <= end; t += step) out.push(t);
  return out;
}

function Dot({ user, x, y, dim, on, onSelect }) {
  const { bind, hide } = useTip();
  const value = bmi(user);
  const cls = classOf(value);
  const tip = (
    <>
      <b>{user.name}</b>
      {user.height} cm · {user.weight} kg
      <br />
      BMI {round1(value)} · {cls.label}
    </>
  );
  const select = () => {
    hide();
    onSelect(user.id);
  };
  return (
    <g
      className={`dot${dim ? ' dim' : ''}${on ? ' on' : ''}`}
      data-id={user.id}
      tabIndex={0}
      role="button"
      aria-label={`${user.name}, ${user.height} centimetres, ${user.weight} kilograms, ${cls.label}`}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select();
        }
      }}
      {...bind(tip)}
    >
      <circle cx={x} cy={y} r="14" fill="transparent" />
      <circle className="mark" cx={x} cy={y} r="6.5" fill={cls.color} />
    </g>
  );
}

export default function BodyMap({ users, filter, hoveredId, onToggleFilter, onSelect }) {
  const svgRef = useRef(null);
  const [size, setSize] = useState({ W: 800, H: 450 });

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setSize({ W: width, H: height });
    });
    observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  const { W, H } = size;
  const m = MARGIN;
  const heights = users.map((u) => u.height);
  const weights = users.map((u) => u.weight);
  const h0 = Math.floor((Math.min(...heights, 165) - 3) / 10) * 10;
  const h1 = Math.ceil((Math.max(...heights, 185) + 3) / 10) * 10;
  const w0 = Math.floor((Math.min(...weights, 55) - 4) / 20) * 20;
  const w1 = Math.ceil((Math.max(...weights, 95) + 4) / 20) * 20;
  const x = (h) => m.l + ((h - h0) / (h1 - h0)) * (W - m.l - m.r);
  const y = (w) => H - m.b - ((w - w0) / (w1 - w0)) * (H - m.t - m.b);

  const zonePoints = (cls) => {
    const top = [];
    const bottom = [];
    for (let i = 0; i <= 24; i++) {
      const h = h0 + ((h1 - h0) * i) / 24;
      top.push(`${x(h).toFixed(1)},${y(isoline(cls.hi, h)).toFixed(1)}`);
      bottom.unshift(`${x(h).toFixed(1)},${y(isoline(cls.lo, h)).toFixed(1)}`);
    }
    return [...top, ...bottom].join(' ');
  };

  // Each zone is named on the zone itself, so class never depends on colour alone.
  const zoneLabel = (cls) => {
    const value = LABEL_BMI[cls.key];
    const yMax = w1 - (w1 - w0) * 0.06;
    const yMin = w0 + (w1 - w0) * 0.05;
    let h = h0 + (h1 - h0) * 0.87;
    let w = isoline(value, h);
    if (w > yMax) {
      w = yMax;
      h = 100 * Math.sqrt(w / value);
    }
    if (w < yMin) return null;
    return (
      <text key={cls.key} className="zone-label" x={x(h)} y={y(w) + 6} textAnchor="middle">
        {cls.label}
      </text>
    );
  };

  let stepX = h1 - h0 > 80 ? 20 : 10;
  if (W < 460) stepX *= 2;

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h2>Body map</h2>
          <p className="sub">Each dot is one athlete. Select a dot to open their bib.</p>
        </div>
        <div className="legend" id="legend" role="group" aria-label="Filter by BMI class">
          {CLASSES.map((c) => (
            <button key={c.key} data-filter={c.key} aria-pressed={filter === c.key} onClick={() => onToggleFilter(c.key)}>
              <span className="sw" style={{ background: c.color }} />
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <svg
        id="map"
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="group"
        aria-label="Scatter plot of weight against height, with BMI class zones"
      >
        <defs>
          <clipPath id="plot">
            <rect x={m.l} y={m.t} width={Math.max(0, W - m.l - m.r)} height={Math.max(0, H - m.t - m.b)} rx="6" />
          </clipPath>
        </defs>
        <g clipPath="url(#plot)">
          {CLASSES.map((c) => (
            <polygon key={c.key} points={zonePoints(c)} fill={c.color} fillOpacity=".11" />
          ))}
        </g>

        {range(w0, w1, 20).map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="var(--grid)" strokeOpacity=".7" />
            <text x={m.l - 9} y={y(t) + 4} textAnchor="end">{t}</text>
          </g>
        ))}
        {range(h0, h1, stepX).map((t) => (
          <text key={t} x={x(t)} y={H - m.b + 20} textAnchor="middle">{t}</text>
        ))}
        <line x1={m.l} x2={W - m.r} y1={H - m.b} y2={H - m.b} stroke="var(--axis)" />
        <text className="axis-title" x={(m.l + W - m.r) / 2} y={H - 5} textAnchor="middle">Height (cm)</text>
        <text className="axis-title" transform={`translate(13 ${(m.t + H - m.b) / 2}) rotate(-90)`} textAnchor="middle">
          Weight (kg)
        </text>

        {W >= 460 && CLASSES.map(zoneLabel)}

        {users.map((u) => (
          <Dot
            key={u.id}
            user={u}
            x={x(u.height)}
            y={y(u.weight)}
            dim={!!filter && classOf(bmi(u)).key !== filter}
            on={hoveredId === u.id}
            onSelect={onSelect}
          />
        ))}
      </svg>
    </div>
  );
}
