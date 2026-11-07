import { useState } from 'react'
import Modal from './Modal.jsx'

export default function FormModal({ title, fields, submitLabel, hint, onSubmit, onClose }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ''])))

  function submit(e) {
    e.preventDefault()
    const clean = Object.fromEntries(fields.map((f) => [f.name, values[f.name].trim()]))
    if (fields.some((f) => f.required && !clean[f.name])) return
    onSubmit(clean)
    onClose()
  }

  return (
    <Modal title={title} onClose={onClose} width={420}>
      <form className="form" onSubmit={submit}>
        {fields.map((f) => (
          <label key={f.name} className="field">
            <span>{f.label}{f.required && ' *'}</span>
            <input
              value={values[f.name]}
              placeholder={f.placeholder}
              required={f.required}
              onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
            />
          </label>
        ))}
        {hint && <p className="muted">{hint}</p>}
        <div className="form-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary">{submitLabel}</button>
        </div>
      </form>
    </Modal>
  )
}
