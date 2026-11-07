import { avatarColor, initials } from '../boardColors.js'

export default function Avatar({ name, size = 28 }) {
  return (
    <span
      className="avatar"
      title={name}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.44), background: avatarColor(name) }}
    >
      {initials(name)}
    </span>
  )
}
