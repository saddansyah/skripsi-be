import { Static, t } from "elysia";


export const AchievementSchema = t.Object({
    id: t.Integer(),
    name: t.String(),
    description: t.String(),
    img: t.String(),
    created_at: t.Date(),
    updated_at: t.Date(),
})

export type AchievementType = Static<typeof AchievementSchema>;

export const AssignedAchievementSchema = t.Omit(
    AchievementSchema,
    ['created_at', 'updated_at']
)

export type AssignedAchievementType = Static<typeof AssignedAchievementSchema>;

export const ShouldAwardSchema = t.Object({
    should_award: t.Boolean()
})

export type ShouldAwardType = Static<typeof ShouldAwardSchema>;