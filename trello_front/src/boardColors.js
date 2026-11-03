// Purely visual: gives each board a stable Trello-like gradient based on its id.
const GRADIENTS = [
  'linear-gradient(135deg,#0C66E4,#669DF1)',
  'linear-gradient(135deg,#6E5DC6,#B8ACF6)',
  'linear-gradient(135deg,#1F845A,#7EE2B8)',
  'linear-gradient(135deg,#C25100,#FEA362)',
  'linear-gradient(135deg,#AE4787,#F797D2)',
  'linear-gradient(135deg,#206A83,#6CC3E0)',
]

export function boardGradient(id = '') {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return GRADIENTS[h % GRADIENTS.length]
}

export function initials(name = '') {
  return (name.trim()[0] || '?').toUpperCase()
}
