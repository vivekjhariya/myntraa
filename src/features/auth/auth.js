export const storedUser = () => { try { return JSON.parse(localStorage.getItem('myntraa_user')) } catch { return null } }
