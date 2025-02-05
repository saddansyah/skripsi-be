import { t, Static } from 'elysia';
import { ContainerType, Status } from '../utils/constants/enums';

const WasteContainerSchema = t.Object({
    id: t.Integer(),
    name: t.String({
        maxLength: 100,
        error: 'Your name field is missing'
    }),
    type: t.Enum(ContainerType, { error: 'Your type field is missing' }),
    rating: t.Number({ error: 'Your rating field is missing' }),
    rating_count: t.Number({ error: 'Your ratingCount field is missing' }),
    max_kg: t.Number({ error: 'Your kg field is missing' }),
    max_vol: t.Number({ error: 'Your vol field is missing' }),
    lat: t.Number({ error: 'Your latitude field is missing' }),
    long: t.Number({ error: 'Your longitude field is missing' }),
    status: t.Enum(Status),
    point: t.Integer(),
    cluster_id: t.Integer({ error: 'Your cluster field is missing' }),
    user_id: t.String({ format: 'uuid' }),
    created_at: t.Date(),
    updated_at: t.Date()
})

export const WasteContainerPayloadSchema = t.Omit(
    WasteContainerSchema,
    ['id', 'created_at', 'updated_at', 'status', 'user_id', 'point', 'rating', 'rating_count']
)
export type WasteContainerType = Static<typeof WasteContainerSchema>;


const WasteContainerInMapSchema = t.Object({
    id: t.Integer(),
    name: t.String({
        maxLength: 100,
        error: 'Your name field is missing'
    }),
    distance: t.Numeric(),
    lat: t.Number({ error: 'Your latitude field is missing' }),
    long: t.Number({ error: 'Your longitude field is missing' }),
    rating: t.Number({ error: 'Your rating field is missing' }),
    ratingCount: t.Number({ error: 'Your ratingCount field is missing' }),
})

export type WasteContainerInMapType = Static<typeof WasteContainerInMapSchema>;



