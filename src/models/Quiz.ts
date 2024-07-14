import { Static, t } from "elysia";

export const QuizSchema = t.Object({
    id: t.Integer(),
    question: t.String(),
    options: t.String(),
    answer: t.String({ maxLength: 100 }),
    img: t.String(),
    created_at: t.Date(),
    updated_at: t.Date()
})

export type QuizType = Static<typeof QuizSchema>;

export const QuizLogSchema = t.Object({
    id: t.Integer(),
    point: t.Integer(),
    created_at: t.Date(),
    user_id: t.String({ format: 'uuid' }),
    quest_id: t.Integer()
})

export type QuizLogType = Static<typeof QuizLogSchema>;

export const QuizLogPayload = t.Object({
    quiz_id: t.Integer(),
    answer: t.String(),
    unique_id: t.String()
})