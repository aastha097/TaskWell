export default function Logo({ size = 24, text = true }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#0C66E4" />
        <rect x="4.5" y="4.5" width="6" height="14" rx="1.2" fill="#fff" />
        <rect x="13.5" y="4.5" width="6" height="8" rx="1.2" fill="#fff" />
      </svg>
      {text && <span className="logo-text">Trello</span>}
    </span>
  )
}
