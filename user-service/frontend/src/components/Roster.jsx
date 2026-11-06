import { useEffect, useState } from 'react';
import { bmi, classOf, pad, round1 } from '../bmi.js';
import { Badge, BmiRow, Gauge, Trio } from './Bmi.jsx';

function Empty({ title, children }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {children}
    </div>
  );
}

function Bibs({ list, onSelect, onHover }) {
  // The staggered entrance only plays when the page first fills.
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bibs${intro ? ' intro' : ''}`}>
      {list.map((u, i) => {
        const value = bmi(u);
        return (
          <button
            key={u.id}
            className="bib"
            data-id={u.id}
            style={{ '--i': Math.min(i, 16) }}
            onClick={() => onSelect(u.id)}
            onMouseEnter={() => onHover(u.id)}
            onMouseLeave={() => onHover(null)}
          >
            <div className="no">{pad(u.id)}</div>
            <div className="name">{u.name}</div>
            <div className="mail">{u.email}</div>
            <div className="tear" />
            <Trio user={u} />
            <BmiRow value={value} cls={classOf(value)} />
            <Gauge value={value} />
          </button>
        );
      })}
    </div>
  );
}

function Table({ list, onSelect, onHover }) {
  return (
    <div className="table-wrap">
      <table className="tnum">
        <thead>
          <tr>
            <th>Bib</th><th>Name</th><th>Email</th>
            <th className="r">Age</th><th className="r">Height (cm)</th><th className="r">Weight (kg)</th>
            <th className="r">BMI</th><th>Class</th>
          </tr>
        </thead>
        <tbody>
          {list.map((u) => {
            const value = bmi(u);
            return (
              <tr
                key={u.id}
                data-id={u.id}
                tabIndex={0}
                onClick={() => onSelect(u.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(u.id);
                  }
                }}
                onMouseEnter={() => onHover(u.id)}
                onMouseLeave={() => onHover(null)}
              >
                <td>{pad(u.id)}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="r">{u.age}</td>
                <td className="r">{u.height}</td>
                <td className="r">{u.weight}</td>
                <td className="r">{round1(value).toFixed(1)}</td>
                <td><Badge cls={classOf(value)} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Roster({
  users, visible, loaded, failed, query, sort, view,
  onQuery, onSort, onView, onSelect, onHover, onAdd, onRetry, onClear,
}) {
  let body;
  if (failed && !loaded) {
    body = (
      <Empty title="Can't reach the API">
        Check that the user service and MySQL are running.<br />
        <button className="btn" onClick={onRetry}>Try again</button>
      </Empty>
    );
  } else if (!loaded) {
    body = (
      <div className="bibs">
        {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" />)}
      </div>
    );
  } else if (!users.length) {
    body = (
      <Empty title="The start line is empty">
        Add your first athlete to fill the roster.<br />
        <button className="btn primary" onClick={onAdd}>+ Add athlete</button>
      </Empty>
    );
  } else if (!visible.length) {
    body = (
      <Empty title="No athletes match">
        Try another search or clear the BMI filter.<br />
        <button className="btn" onClick={onClear}>Clear filters</button>
      </Empty>
    );
  } else if (view === 'table') {
    body = <Table list={visible} onSelect={onSelect} onHover={onHover} />;
  } else {
    body = <Bibs list={visible} onSelect={onSelect} onHover={onHover} />;
  }

  return (
    <section aria-label="Roster">
      <div className="roster-head">
        <h2>The roster</h2>
        <div className="tools">
          <label className="vh" htmlFor="q">Search athletes</label>
          <input
            className="field-inline"
            id="q"
            type="search"
            placeholder="Search name or email"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
          <label className="vh" htmlFor="sort">Sort athletes</label>
          <select className="field-inline" id="sort" value={sort} onChange={(e) => onSort(e.target.value)}>
            <option value="id">Bib number</option>
            <option value="name">Name</option>
            <option value="age">Age, oldest first</option>
            <option value="bmi">BMI, highest first</option>
            <option value="weight">Weight, heaviest first</option>
            <option value="height">Height, tallest first</option>
          </select>
          <div className="seg" role="group" aria-label="Roster view">
            {[['bibs', 'Bibs'], ['table', 'Table']].map(([key, label]) => (
              <button key={key} data-view={key} aria-pressed={view === key} onClick={() => onView(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div id="roster">{body}</div>
    </section>
  );
}
