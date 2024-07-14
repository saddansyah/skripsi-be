import { Static, t } from "elysia";
import { QuestType as Type } from "../utils/constants/enums";

export const QuestSchema = t.Object({
    id: t.Integer(),
    title: t.String({ maxLength: 100 }),
    desc: t.String(),
    img: t.String(),
    type: t.Enum(Type),
    created_at: t.Date(),
    updated_at: t.Date()
})

export type QuestType = Static<typeof QuestSchema>;

export const QuestLogSchema = t.Object({
    id: t.Integer(),
    point: t.Integer(),
    created_at: t.Date(),
    user_id: t.String({ format: 'uuid' }),
    quest_id: t.Integer()
})

export type QuestLogType = Static<typeof QuestLogSchema>;

export const QuestLogPayload = t.Object({
    quest_id: t.Integer(),
    answer: t.String(),
    unique_id: t.String()
})