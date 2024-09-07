import { Static, t } from "elysia";


export const StreakSchema = t.Object({
    weekly_streak_count: t.Integer(),
    weekly_streak_remaining: t.Integer(),
});

export type StreakType = Static<typeof StreakSchema>;