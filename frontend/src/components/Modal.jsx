import { useEffect, useRef } from 'react'
import { Close } from './Icons.jsx'

export default function Modal({ title, onClose, children, width = 480, autoFocus = true }) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const previous = document.activeElement
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    const first = autoFocus && ref.current?.querySelector('input, textarea, select')
    ;(first || ref.current)?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus?.()
    }
  }, [autoFocus])

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title || 'Dialog'} style={{ maxWidth: width }} ref={ref} tabIndex={-1}>
        {title && (
          <header className="modal-head">
            <h2>{title}</h2>
            <button className="icon-btn" onClick={onClose} aria-label="Close"><Close /></button>
          </header>
        )}
        {children}
      </div>
    </div>
  )
}
