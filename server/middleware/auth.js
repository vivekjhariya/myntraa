import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    req.user = token ? jwt.verify(token, env.jwtSecret) : null
    if (!req.user) return res.status(401).json({ message: 'Please log in to continue' })
    next()
  } catch { res.status(401).json({ message: 'Session expired. Please log in again.' }) }
}
