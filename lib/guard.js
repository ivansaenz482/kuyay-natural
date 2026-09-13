import { auth } from '@/lib/auth'

export async function isAdmin(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    return Boolean(session?.user)
  } catch {
    return false
  }
}

export async function getAdminUser(req) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    return session?.user || null
  } catch {
    return null
  }
}

export function unauthorized() {
  return Response.json({ error: 'No autorizado' }, { status: 401 })
}
