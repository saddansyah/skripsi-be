import { Static, t } from "elysia";

export const LearnSchema = t.Object({
    id: t.Integer(),
    title: t.String({ maxLength: 100 }),
    excerpt: t.String({ maxLength: 255 }),
    content: t.String(),
    img: t.String()
})

export type LearnType = Static<typeof LearnSchema>;