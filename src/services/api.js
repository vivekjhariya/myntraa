const API = import.meta.env.VITE_API_URL || '/api'

export async function request(path, options = {}) {
  const token = localStorage.getItem('myntraa_token')
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: ['Bearer', token].join(' ') } : {}), ...(options.headers || {}) }
  const response = await fetch(`${API}${path}`, { ...options, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Something went wrong')
  return data
}
export const getProducts = query => request(`/products${query ? `?${new URLSearchParams(query)}` : ''}`)
