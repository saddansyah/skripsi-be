import { Static, t } from "elysia";

export const DailySignInLogSchema = t.Object({
    id: t.Integer(),
    created_at: t.Date(),
    user_id: t.String({ format: 'uuid' }),
})

export type DailySignInLogType = Static<typeof DailySignInLogSchema>;

export const DailySignInStatusSchema = t.Object({
    created_at: t.Date(),
    next_date: t.Date(),
})

export type DailySignInStatusType = Static<typeof DailySignInStatusSchema>;