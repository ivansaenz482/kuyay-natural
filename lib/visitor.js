const VISITOR_KEY = 'kuyay_visitor'

export function getVisitorId() {
  if (typeof window === 'undefined') return ''
  try {
    let id = window.localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id =
        window.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      window.localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

export function isAdminBrowser() {
  if (typeof document === 'undefined') return false
  return /(^|;\s*)better-auth\.session_token=/.test(document.cookie)
}
