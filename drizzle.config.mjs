import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'sqlite',
    schema: './src/data/schema/*',
    out: './src/data/__migrations'
})