import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as api from './api.js';
import { bmi, classOfUser, pad } from './bmi.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import BodyMap from './components/BodyMap.jsx';
import { AgeChart, ClassMix } from './components/Charts.jsx';
import Roster from './components/Roster.jsx';
import AthleteDialog from './components/AthleteDialog.jsx';

export default function App() {
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState({ kind: '', text: 'Connecting…' });
  const [filter, setFilter] = useState(null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('id');
  const [view, setView] = useState('bibs');
  const [hoveredId, setHoveredId] = useState(null);
  const [dialog, setDialog] = useState(null); // { mode: 'detail' | 'form' | 'delete', user? }
  const [toast, setToast] = useState({ text: '', bad: false, show: false });
  const toastTimer = useRef();

  const showToast = useCallback((text, bad = false) => {
    setToast({ text, bad, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200);
  }, []);

  const load = useCallback(async () => {
    const started = performance.now();
    try {
      const list = await api.listUsers();
      setUsers(list ?? []);
      setLoaded(true);
      setFailed(false);
      setStatus({ kind: 'ok', text: `API live · ${Math.round(performance.now() - started)} ms` });
    } catch {
      setFailed(true);
      setStatus({ kind: 'bad', text: 'API unreachable' });
    }
  }, []);

  useEffect(() => {
    load();
    return () => clearTimeout(toastTimer.current);
  }, [load]);

  const openDetail = useCallback(
    async (id) => {
      try {
        setDialog({ mode: 'detail', user: await api.getUser(id) });
      } catch (e) {
        if (e.status === 404) {
          showToast('That athlete no longer exists', true);
          load();
        } else {
          showToast(`Could not load that athlete. ${e.message}`, true);
        }
      }
    },
    [load, showToast]
  );

  const toggleFilter = useCallback((key) => setFilter((f) => (f === key ? null : key)), []);

  const clearFilters = () => {
    setFilter(null);
    setQuery('');
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = users.filter(
      (u) =>
        (!filter || classOfUser(u).key === filter) &&
        (!q || `${u.name} ${u.email}`.toLowerCase().includes(q))
    );
    return list.sort((a, b) => {
      if (sort === 'id') return a.id - b.id;
      if (sort === 'name') return String(a.name).localeCompare(String(b.name));
      if (sort === 'bmi') return bmi(b) - bmi(a);
      return b[sort] - a[sort];
    });
  }, [users, filter, query, sort]);

  const handleSaved = (saved, isEdit) => {
    setDialog(null);
    showToast(isEdit ? `${saved.name} updated` : `${saved.name} got bib ${pad(saved.id)}`);
    load();
  };

  const handleDeleted = (notFound) => {
    setDialog(null);
    showToast(notFound ? 'That athlete no longer exists' : 'Athlete deleted', notFound);
    load();
  };

  return (
    <>
      <Header status={status} onAdd={() => setDialog({ mode: 'form' })} />

      <main className="wrap">
        <Hero users={users} loaded={loaded} />

        <section className="panels" aria-label="Group overview">
          <BodyMap
            users={users}
            filter={filter}
            hoveredId={hoveredId}
            onToggleFilter={toggleFilter}
            onSelect={openDetail}
          />
          <div className="side">
            <ClassMix users={users} />
            <AgeChart users={users} />
          </div>
        </section>

        <Roster
          users={users}
          visible={visible}
          loaded={loaded}
          failed={failed}
          query={query}
          sort={sort}
          view={view}
          onQuery={setQuery}
          onSort={setSort}
          onView={setView}
          onSelect={openDetail}
          onHover={setHoveredId}
          onAdd={() => setDialog({ mode: 'form' })}
          onRetry={load}
          onClear={clearFilters}
        />

        <footer>
          BMI classes use the WHO adult cut-offs. BMI is a rough screen, is less reliable for athletes
          with a lot of muscle, and doesn't apply directly to under-18s.
        </footer>
      </main>

      {dialog && (
        <AthleteDialog
          mode={dialog.mode}
          user={dialog.user}
          onMode={(mode) => setDialog((d) => ({ ...d, mode }))}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}

      <div
        id="toast"
        role="status"
        className={`${toast.show ? 'show' : ''} ${toast.bad ? 'bad' : ''}`.trim()}
      >
        {toast.text}
      </div>
    </>
  );
}
