import { betterAuth } from 'better-auth'
import { pool } from './db'

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  appName: 'Kuyay Natural',
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
})

export async function getSessionFromRequest(req) {
  try {
    return await auth.api.getSession({ headers: req.headers })
  } catch {
    return null
  }
}
