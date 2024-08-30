import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { lucia } from '~/auth/lucia';
import { generateIdFromEntropySize } from "lucia";
import { hash, verify } from '@node-rs/argon2';
import { db } from '~/db/drizzle';
import { user as userTable } from '~/db/schema/users';
import { eq } from 'drizzle-orm';

export const signup = defineAction({ 
    accept: 'form',
    input: z.object({
        username: z.string(),
        password: z.string()
    }),
    handler: async ({ username, password }, { cookies }) => {
        const id = generateIdFromEntropySize(10)
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        })
        await db.insert(userTable).values({
            id,
            username,
            passwordHash
        }).onConflictDoNothing()

        const session = await lucia.createSession(id, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    }
   })

   export const login = defineAction({ 
    accept: 'form',
    input: z.object({
        username: z.string(),
        password: z.string()
    }),
    handler: async ({ username, password }, { cookies }) => {
        const user = await db.select().from(userTable).where(eq(userTable.username, username)).limit(1)

        if (!user.at(0)) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'Invalid username or password'
            })
        }

        const passwordIsValid = await verify(user.at(0)?.passwordHash as string ,password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        })

        if (!passwordIsValid) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'Invalid username or password'
            })
        }

        const session = await lucia.createSession(user.at(0)?.id as string, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    }
   })

export const logout = defineAction({
    accept: 'form',
    handler: async ({}, { cookies, locals }) => {
        if (!locals.session) {
            throw new ActionError({
                code: 'UNAUTHORIZED'
            })
        }

        await lucia.invalidateSession(locals.session.id)
        const sessionCookie = lucia.createBlankSessionCookie();
	    cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
})