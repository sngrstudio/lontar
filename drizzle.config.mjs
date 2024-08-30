/** @type { import("drizzle-kit").Config } */
export default {
  schema: './src/db/schema/*',
  out: './src/db/__migrations/',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE
  }
}