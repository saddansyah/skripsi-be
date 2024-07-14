import { t, Static } from 'elysia';
import { Status, WasteType } from '../utils/constants/enums';

const WasteCollectModel = t.Object({
    id: t.Integer({ error: 'Your id field is missing' }),
    kg: t.Number({ error: 'Your kg field is missing' }),
    vol: t.Number({ error: 'Your vol field is missing' }),
    type: t.Enum(WasteType, { error: 'Your type field is missing' }),
    img: t.Union([t.String(), t.File({ maxSize: '20m' })]),
    point: t.Number({ error: 'Your point field is missing' }),
    info: t.Nullable(t.String()),
    is_anonim: t.Boolean({ error: 'Your type is_anonim is missing' }),
    status: t.Enum(Status),
    created_at: t.Date(),
    updated_at: t.Date(),
    user_id: t.String(),
    container_id: t.Integer(),
})
export type WasteCollectType = Static<typeof WasteCollectModel>;

export const WasteCollectPayloadModel = t.Omit(
    WasteCollectModel,
    ['created_at', 'updated_at', 'status', 'id', 'user_id', 'point'])