import { Static, t } from "elysia";

export const FlashcardSchema = t.Object({
    id: t.Integer(),
    content: t.String(),
    created_at: t.Date(),
})

export type FlashcardType = Static<typeof FlashcardSchema>;