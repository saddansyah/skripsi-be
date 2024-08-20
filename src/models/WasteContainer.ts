import { t, Static } from 'elysia';
import { ContainerType, Status } from '../utils/constants/enums';

const WasteContainerModel = t.Object({
    id: t.Integer(),
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
    status: t.Enum(Status),
    point: t.Integer(),
    cluster_id: t.Integer({ error: 'Your cluster field is missing' }),
    user_id: t.String({ format: 'uuid' }),
    created_at: t.Date(),
    updated_at: t.Date()
})

export const WasteContainerPayloadModel = t.Omit(
    WasteContainerModel,
    ['id', 'created_at', 'updated_at', 'status', 'user_id', 'point', 'rating']
)
export type WasteContainerType = Static<typeof WasteContainerModel>;




