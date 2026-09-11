import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT || 3001),
  jwtSecret: process.env.JWT_SECRET || 'myntraa-demo-secret-change-me',
  isProduction: process.env.NODE_ENV === 'production'
}
