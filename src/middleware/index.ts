import { defineMiddleware } from "astro:middleware";
import { lucia } from "~/auth/lucia";

export const onRequest = defineMiddleware(async ({ cookies, locals }, next) => {
    const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null
    if (!sessionId) {
        locals.user = null
        locals.session = null

        return next()
    }

    const { session, user } = await lucia.validateSession(sessionId)
    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    }
    if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    }

    locals.session = session
    locals.user = user    
    
    return next()
})