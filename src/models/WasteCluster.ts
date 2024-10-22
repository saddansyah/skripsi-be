import { t, Static } from 'elysia';

const WasteClusterSchema = t.Object({
    id: t.Integer(),
    name: t.String({
        maxLength: 100
    }),
    created_at: t.Date(),
    updated_at: t.Date()
})

export const WasteClusterPayloadType = t.Object({
    name: t.String({
        maxLength: 100,
        error: 'Your name field is missing'
    })
})

export type WasteClusterType = Static<typeof WasteClusterSchema>;

