'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Buildings, ChatCircle, CheckCircle, HouseLine, PencilSimple, WarningCircle } from '@phosphor-icons/react/dist/ssr';
import { CONTACT_EMAIL } from '@/lib/content';

// One form, three routes (tracker Sitemap: "Enquiry form, developer and consumer routes; form only, no login").
// The visitor says who they are and the fields change to what that route needs. There is no form backend in
// phase 1, so sending opens the visitor's email app with everything filled in, and the page says so plainly.
// /contact?as=builder or ?as=resident opens on that route (used by links elsewhere on the site).
const ROLES = [
  { id: 'resident', label: 'I live in a tower', Icon: HouseLine },
  { id: 'builder', label: 'I build towers', Icon: Buildings },
  { id: 'other', label: 'Something else', Icon: ChatCircle },
];

const STAGES = ['Not started yet', 'Design', 'Structure', 'Services', 'Finishing'];

const FIELDS = {
  resident: [
    { name: 'name', label: 'Your name', required: true, error: 'Add your name.', autoComplete: 'name' },
    { name: 'reply', label: 'Phone or email', required: true, error: 'Add a phone number or an email address.', autoComplete: 'email', hint: 'We reply here.' },
    { name: 'tower', label: 'Your tower or society', autoComplete: 'organization', optional: true },
    { name: 'city', label: 'City', autoComplete: 'address-level2', optional: true },
    { name: 'message', label: 'What would you like to know?', required: true, error: 'Add a short message.', area: true },
  ],
  builder: [
    { name: 'name', label: 'Your name', required: true, error: 'Add your name.', autoComplete: 'name' },
    { name: 'company', label: 'Company', required: true, error: 'Add your company name.', autoComplete: 'organization' },
    { name: 'reply', label: 'Phone or email', required: true, error: 'Add a phone number or an email address.', autoComplete: 'email', hint: 'We reply here.' },
    { name: 'city', label: 'City of the project', required: true, error: 'Add the city of the project.', autoComplete: 'address-level2' },
    { name: 'stage', label: 'Construction stage', select: STAGES, half: true },
    { name: 'flats', label: 'Flats in the project', inputMode: 'numeric', optional: true, half: true },
    { name: 'message', label: 'Anything else', area: true, optional: true },
  ],
  other: [
    { name: 'name', label: 'Your name', required: true, error: 'Add your name.', autoComplete: 'name' },
    { name: 'reply', label: 'Phone or email', required: true, error: 'Add a phone number or an email address.', autoComplete: 'email', hint: 'We reply here.' },
    { name: 'message', label: 'Your message', required: true, error: 'Add a short message.', area: true },
  ],
};

const SUBJECT = {
  resident: 'A resident asking about Moya One',
  builder: 'Moya One for our project',
  other: 'A message for Moya One',
};

// an email address, or a phone number with at least ten digits
const isReply = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v.replace(/\D/g, '').length >= 10;

function check(role, values) {
  const errors = {};
  for (const f of FIELDS[role]) {
    const v = (values[f.name] || '').trim();
    if (f.required && !v) errors[f.name] = f.error;
  }
  const reply = (values.reply || '').trim();
  if (reply && !isReply(reply)) errors.reply = 'Add an email address, or a phone number with its full ten digits.';
  if (values.flats && /\D/.test(values.flats.trim())) errors.flats = 'Use digits only, for example 240.';
  return errors;
}

export default function ContactForm() {
  const [role, setRole] = useState('resident');
  const [values, setValues] = useState({ stage: STAGES[0] });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const formRef = useRef(null);
  const doneRef = useRef(null);

  useEffect(() => {
    const as = new URLSearchParams(window.location.search).get('as');
    if (ROLES.some((r) => r.id === as)) setRole(as);
  }, []);

  useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (errors[name]) setErrors(({ [name]: _, ...rest }) => rest);
  };

  const fields = FIELDS[role];

  const submit = (e) => {
    e.preventDefault();
    const found = check(role, values);
    setErrors(found);
    const first = fields.find((f) => found[f.name]);
    if (first) {
      formRef.current?.querySelector(`[name="${first.name}"]`)?.focus();
      return;
    }
    const lines = [
      'Hello Moya One,',
      '',
      `I am writing as: ${ROLES.find((r) => r.id === role).label.toLowerCase()}`,
      ...fields
        .filter((f) => f.name !== 'message' && (values[f.name] || '').trim())
        .map((f) => `${f.label}: ${values[f.name].trim()}`),
      '',
      (values.message || '').trim(),
    ];
    // PLACEHOLDER: sends to the placeholder address in lib/content.js until the client confirms the real one.
    const subject = role === 'builder' && values.company ? `Moya One for ${values.company.trim()}` : SUBJECT[role];
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      lines.join('\n').trim(),
    )}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="ct-panel ct-done" role="status" tabIndex={-1} ref={doneRef}>
        <CheckCircle size={44} aria-hidden="true" className="ct-done-icon" />
        <h2 className="ct-done-title">Your message is ready to send.</h2>
        <p>
          Your email app should have opened with everything filled in. Press send there, and it comes to us.
        </p>
        <p className="ct-done-small">
          Nothing opened? Write to{' '}
          {/* PLACEHOLDER: contact email, see lib/content.js */}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> directly.
        </p>
        <button type="button" className="btn btn-secondary" onClick={() => setSent(false)}>
          <PencilSimple size={20} aria-hidden="true" />
          Change your message
        </button>
      </div>
    );
  }

  return (
    <form className="ct-panel ct-form" ref={formRef} onSubmit={submit} noValidate aria-labelledby="ct-form-title">
      <h2 id="ct-form-title" className="ct-form-title">
        Who is writing?
      </h2>
      <fieldset className="ct-roles">
        <legend className="sr-only">You are writing as</legend>
        {ROLES.map((r) => (
          <label key={r.id} className={role === r.id ? 'is-on' : undefined}>
            <input
              type="radio"
              name="role"
              value={r.id}
              checked={role === r.id}
              onChange={() => {
                setRole(r.id);
                setErrors({});
              }}
            />
            <r.Icon size={24} aria-hidden="true" />
            {r.label}
          </label>
        ))}
      </fieldset>

      <div className="ct-fields" key={role}>
        {fields.map((f, i) => {
          const id = `ct-${f.name}`;
          const err = errors[f.name];
          const described = [f.hint && `${id}-hint`, err && `${id}-err`].filter(Boolean).join(' ') || undefined;
          const common = {
            id,
            name: f.name,
            value: values[f.name] || '',
            onChange: set(f.name),
            'aria-invalid': err ? true : undefined,
            'aria-describedby': described,
            'aria-required': f.required || undefined,
          };
          return (
            <div key={f.name} className={`ct-field${f.half ? ' is-half' : ''}`} style={{ '--i': i }}>
              <label htmlFor={id}>
                {f.label}
                {f.optional && <span className="ct-optional">Optional</span>}
              </label>
              {f.area ? (
                <textarea {...common} rows={4} />
              ) : f.select ? (
                <select {...common}>
                  {f.select.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <input {...common} type="text" autoComplete={f.autoComplete} inputMode={f.inputMode} />
              )}
              {f.hint && !err && (
                <p className="ct-hint" id={`${id}-hint`}>
                  {f.hint}
                </p>
              )}
              {err && (
                <p className="ct-error" id={`${id}-err`}>
                  <WarningCircle size={18} aria-hidden="true" />
                  {err}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="ct-send">
        <button type="submit" className="btn btn-primary">
          Send message
          <ArrowRight size={20} aria-hidden="true" />
        </button>
        <p className="ct-send-note">This opens your email app with your message filled in.</p>
      </div>
    </form>
  );
}
