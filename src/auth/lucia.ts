import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { db } from "~/db/drizzle";
import { session, user } from "~/db/schema/users";

const adapter = new DrizzleSQLiteAdapter(db, session, user)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: import.meta.env.PROD
        }
    },
    getUserAttributes: (attr) => ({ ...attr })
})

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes {
    username: string
}