import { Static, t } from "elysia";

export const SessionSchema = t.Object({
    accessToken: t.String(),
    refreshToken: t.String(),
})

export type SessionType = Static<typeof SessionSchema>;