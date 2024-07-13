import { t, Static } from 'elysia';
import { Status } from '../utils/constants/status';

export enum ContainerType {
    DEPO = "DEPO",
    TONG = "TONG",
    OTHER = "OTHER"
}
const WasteContainerModel = t.Object({
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
    cluster_id: t.Integer({ error: 'Your cluster field is missing' }),
    status: t.Enum(Status),
    created_at: t.Date(),
    updated_at: t.Date()
})

export const WasteContainerPayloadModel = t.Omit(
    WasteContainerModel,
    ['created_at', 'updated_at', 'status']
)
export type WasteContainerType = Static<typeof WasteContainerModel>;




