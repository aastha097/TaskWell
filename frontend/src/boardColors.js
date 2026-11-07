const GRADIENTS = [
  'linear-gradient(135deg,#0C66E4,#669DF1)',
  'linear-gradient(135deg,#6E5DC6,#B8ACF6)',
  'linear-gradient(135deg,#1F845A,#7EE2B8)',
  'linear-gradient(135deg,#C25100,#FEA362)',
  'linear-gradient(135deg,#AE4787,#F797D2)',
  'linear-gradient(135deg,#206A83,#6CC3E0)',
]

const AVATARS = ['#0C66E4', '#6E5DC6', '#1F845A', '#B65C02', '#AE4787', '#206A83', '#C9372C']

function hash(str = '') {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

export const boardGradient = (id = '') => GRADIENTS[hash(String(id)) % GRADIENTS.length]
export const avatarColor = (name = '') => AVATARS[hash(name) % AVATARS.length]
export const initials = (name = '') => (name.trim()[0] || '?').toUpperCase()
