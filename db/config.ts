import { column, defineDb, defineTable } from 'astro:db';

export default defineDb({
  tables: {
    test: defineTable({
        columns: {
            name: column.text()
        }
    })
   },
})