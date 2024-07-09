import { t, Static } from 'elysia';

export enum ContainerType {
    DEPO = "DEPO",
    TONG = "TONG",
    OTHER = "OTHER"
}

export enum ContainerStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}

const WasteContainerSchema = t.Object({
    id: t.Integer(),
    name: t.String({
        maxLength: 100
    }),
    type: t.Enum(ContainerType),
    rating: t.Number(),
    max_kg: t.Number(),
    max_vol: t.Number(),
    lat: t.Number(),
    long: t.Number(),
    cluster_id: t.Integer(),
    status: t.Enum(ContainerStatus),
    created_at: t.Date(),
    updated_at: t.Date()
})

export const WasteContainerPayloadType = t.Object({
    name: t.String({
        maxLength: 100,
        error: 'Your name field is missing'
    }),
    type: t.Enum(ContainerType, { error: 'Your type field is missing' }),
    rating: t.Number({ error: 'Your rating field is missing' }),
    max_kg: t.Number({ error: 'Your kg field is missing' }),
    max_vol: t.Number({ error: 'Your vol field is missing' }),
    lat: t.Number({ error: 'Your latitude field is missing' }),
    long: t.Number({ error: 'Your longitude field is missing' }),
    cluster_id: t.Integer({ error: 'Your cluster field is missing' })
})

export type WasteContainerType = Static<typeof WasteContainerSchema>;

