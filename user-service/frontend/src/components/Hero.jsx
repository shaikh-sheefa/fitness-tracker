import { useEffect, useRef, useState } from 'react';
import { bmi, classOf, classOfUser, round1 } from '../bmi.js';

function useTween(target, duration = 600) {
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = target;
      setValue(target);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let frame;
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      current.current = p === 1 ? target : from + (target - from) * (1 - (1 - p) ** 3);
      setValue(current.current);
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function summarise(users) {
  const n = users.length;
  if (!n) return { n: 0, age: 0, avg: 0, healthy: 0 };
  const ages = users.map((u) => u.age).sort((a, b) => a - b);
  return {
    n,
    age: n % 2 ? ages[(n - 1) / 2] : (ages[n / 2 - 1] + ages[n / 2]) / 2,
    avg: users.reduce((sum, u) => sum + bmi(u), 0) / n,
    healthy: users.filter((u) => classOfUser(u).key === 'healthy').length,
  };
}

export default function Hero({ users, loaded }) {
  const { n, age, avg, healthy } = summarise(users);
  const count = useTween(n);
  const ageValue = useTween(age);
  const bmiValue = useTween(avg);
  const healthyValue = useTween(n ? (healthy / n) * 100 : 0);

  return (
    <section className="hero">
      <p className="eyebrow">Fitness Tracker · User Service</p>
      <h1 id="headline">
        <mark>{loaded ? Math.round(count) : '--'}</mark> {n === 1 ? 'athlete' : 'athletes'} on the start line
      </h1>
      <div className="tiles">
        <div className="tile">
          <div className="k">Median age</div>
          <div className="v" id="t-age">
            {n ? <>{round1(ageValue)}<small>years</small></> : '–'}
          </div>
        </div>
        <div className="tile">
          <div className="k">Average BMI</div>
          <div className="v" id="t-bmi">
            {n ? <>{bmiValue.toFixed(1)}<small>{classOf(avg).label.toLowerCase()}</small></> : '–'}
          </div>
        </div>
        <div className="tile">
          <div className="k">In the healthy range</div>
          <div className="v" id="t-healthy">
            {n ? <>{Math.round(healthyValue)}%<small>{healthy} of {n}</small></> : '–'}
          </div>
        </div>
      </div>
    </section>
  );
}
