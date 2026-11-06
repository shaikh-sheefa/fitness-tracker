import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as api from '../api.js';
import { bmi, bmiFrom, classOf, pad, round1 } from '../bmi.js';
import { BmiRow, Gauge, Trio } from './Bmi.jsx';

const FormError = ({ text }) => (text ? <p className="note" role="alert"><strong>!</strong> {text}</p> : null);

function Detail({ user, onMode, onClose }) {
  const value = bmi(user);
  const squared = (user.height / 100) ** 2;
  const lo = 18.5 * squared;
  const hi = 24.9 * squared;
  let gap = 'Currently inside that range.';
  if (user.weight < lo) gap = `${round1(lo - user.weight)} kg below that range.`;
  if (user.weight > hi) gap = `${round1(user.weight - hi)} kg above that range.`;

  return (
    <div className="dlg">
      <div className="no">{pad(user.id)}</div>
      <div className="name">{user.name}</div>
      <div className="mail">{user.email}</div>
      <div className="tear" style={{ margin: '16px -26px' }} />
      <Trio user={user} />
      <BmiRow value={value} cls={classOf(value)} />
      <Gauge value={value} />
      <p className="note">
        Healthy weight at {user.height} cm: <strong>{Math.round(lo)}–{Math.round(hi)} kg</strong>. {gap}
      </p>
      <div className="actions">
        <button className="btn left" data-action="ask-delete" onClick={() => onMode('delete')}>Delete</button>
        <button className="btn" data-action="close" onClick={onClose}>Close</button>
        <button className="btn primary" data-action="edit" onClick={() => onMode('form')}>Edit</button>
      </div>
    </div>
  );
}

function Field({ name, label, form, errors, onChange, inputRef, ...input }) {
  return (
    <label className={`f${errors[name] ? ' err' : ''}`} data-f={name}>
      <span>{label}</span>
      <input ref={inputRef} name={name} value={form[name]} onChange={onChange} {...input} />
      <div className="msg">{errors[name]}</div>
    </label>
  );
}

function AthleteForm({ user, onClose, onSaved }) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    age: user?.age ?? '',
    height: user?.height ?? '',
    weight: user?.weight ?? '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);
  const firstInput = useRef(null);

  useEffect(() => firstInput.current?.focus(), []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const number = (v) => (String(v).trim() === '' ? null : Number(v));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setError('');
    const body = {
      name: form.name,
      email: form.email,
      age: number(form.age),
      height: number(form.height),
      weight: number(form.weight),
    };
    try {
      const saved = await (isEdit ? api.updateUser(user.id, body) : api.createUser(body));
      onSaved(saved, isEdit);
    } catch (err) {
      setSaving(false);
      if (err.fields) {
        setErrors(err.fields);
        const first = Object.keys(err.fields)[0];
        formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      } else {
        setError(`Could not save. ${err.message}`);
      }
    }
  };

  const height = parseFloat(form.height);
  const weight = parseFloat(form.weight);
  const preview = height > 0 && weight > 0 ? bmiFrom(height, weight) : null;
  const shared = { form, errors, onChange };

  return (
    <form className="dlg" id="form" noValidate ref={formRef} onSubmit={submit}>
      <h3>{isEdit ? `Edit bib ${pad(user.id)}` : 'New athlete'}</h3>
      <Field {...shared} name="name" label="Name" type="text" autoComplete="off" inputRef={firstInput} />
      <Field {...shared} name="email" label="Email" type="email" autoComplete="off" />
      <div className="row3">
        <Field {...shared} name="age" label="Age" type="number" inputMode="numeric" />
        <Field {...shared} name="height" label="Height (cm)" type="number" step="any" inputMode="decimal" />
        <Field {...shared} name="weight" label="Weight (kg)" type="number" step="any" inputMode="decimal" />
      </div>
      <div id="preview">
        {preview !== null && (
          <>
            <BmiRow value={preview} cls={classOf(preview)} style={{ marginTop: 2 }} />
            <Gauge value={preview} />
          </>
        )}
      </div>
      <FormError text={error} />
      <div className="actions">
        <button type="button" className="btn" data-action="close" onClick={onClose}>Cancel</button>
        <button className="btn primary" type="submit" disabled={saving}>
          {isEdit ? 'Save changes' : 'Add to roster'}
        </button>
      </div>
    </form>
  );
}

function ConfirmDelete({ user, onClose, onDeleted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await api.deleteUser(user.id);
      onDeleted(false);
    } catch (err) {
      if (err.status === 404) {
        onDeleted(true);
        return;
      }
      setBusy(false);
      setError(`Could not delete. ${err.message}`);
    }
  };

  return (
    <div className="dlg">
      <h3>Delete bib {pad(user.id)}?</h3>
      <p style={{ margin: 0, color: 'var(--ink-2)' }}>
        {user.name} will be permanently removed from the database.
      </p>
      <FormError text={error} />
      <div className="actions">
        <button className="btn" data-action="close" onClick={onClose}>Keep athlete</button>
        <button className="btn danger" data-action="delete" disabled={busy} onClick={confirm}>Delete athlete</button>
      </div>
    </div>
  );
}

export default function AthleteDialog({ mode, user, onMode, onClose, onSaved, onDeleted }) {
  const ref = useRef(null);

  // Layout effect: close before React removes the node, so focus returns to the page.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el.open) el.showModal();
    return () => {
      if (el.open) el.close();
    };
  }, []);

  return (
    <dialog
      id="dlg"
      ref={ref}
      aria-label="Athlete"
      onClose={() => {
        // StrictMode opens the dialog twice in development; ignore the stale close event.
        if (!ref.current?.open) onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {mode === 'detail' && <Detail user={user} onMode={onMode} onClose={onClose} />}
      {mode === 'form' && <AthleteForm user={user} onClose={onClose} onSaved={onSaved} />}
      {mode === 'delete' && <ConfirmDelete user={user} onClose={onClose} onDeleted={onDeleted} />}
    </dialog>
  );
}
