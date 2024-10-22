import { Static, t } from "elysia";

export const EvidenceRatingSchema = t.Object({
    value: t.Integer({ maximum: 5, minimum: 1 }),
    is_anonim: t.Boolean(),
    point: t.Integer({ minimum: 0 }),
    info: t.Nullable(t.String()),
    created_at: t.Date(),
    user_id: t.String({ format: 'uuid' }),
    container_id: t.Integer(),
});

export type EvidenceRatingType = Static<typeof EvidenceRatingSchema>;

export const EvidenceRatingCountSchema = t.Object({
    container_id: t.Integer(),
    rating: t.Union([t.Integer({ minimum: 0 }), t.BigInt({ minimum: 0n })], { error: 'Your rating count field is missing' })
})

export type EvidenceRatingCountType = Static<typeof EvidenceRatingCountSchema>;