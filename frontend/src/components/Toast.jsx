import { useEffect, useState } from 'react'

export default function Toast({ data }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!data) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(t)
  }, [data])

  if (!data) return null
  return (
    <div className={`toast ${visible ? 'show' : ''} ${data.isError ? 'err' : ''}`} role="status" aria-live="polite">
      {data.message}
    </div>
  )
}
