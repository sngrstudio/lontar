import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { lucia } from '~/auth/lucia';
import { generateIdFromEntropySize } from "lucia";
import { hash } from '@node-rs/argon2';
import { db } from '~/db/drizzle';
import { user as userTable } from '~/db/schema/users';

export const signUp = defineAction({ 
    accept: 'form',
    input: z.object({
        username: z.string(),
        password: z.string()
    }),
    handler: async ({ username, password }, { cookies }) => {
        const passwordHash = await hash(password, {
            // recommended minimum parameters
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        })
        await db.insert(userTable).values({
            id: generateIdFromEntropySize(10),
            username,
            passwordHash
        })

        const session = await lucia.createSession(username, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    }
   })