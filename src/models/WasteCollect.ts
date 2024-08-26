import { t, Static } from 'elysia';
import { Status, WasteType } from '../utils/constants/enums';

const WasteCollectSchema = t.Object({
    id: t.Integer({ error: 'Your id field is missing' }),
    kg: t.Number({ error: 'Your kg field is missing' }),
    vol: t.Number({ error: 'Your vol field is missing' }),
    type: t.Enum(WasteType, { error: 'Your type field is missing' }),
    img: t.String(),
    point: t.Number({ error: 'Your point field is missing' }),
    info: t.Nullable(t.String()),
    is_anonim: t.Boolean({ error: 'Your type is_anonim is missing' }),
    status: t.Enum(Status),
    created_at: t.Date(),
    updated_at: t.Date(),
    user_id: t.String(),
    container_id: t.Integer(),
})
export type WasteCollectType = Static<typeof WasteCollectSchema>;

export const WasteCollectPayloadSchema = t.Omit(
    WasteCollectSchema,
    ['created_at', 'updated_at', 'status', 'id', 'user_id', 'point'])

export const WasteCollectSummarySchema = t.Object({
    dailyCollectCount: t.Integer({ error: 'Your collect count field is missing' }),
    mostCollectType: t.Enum(WasteType, { error: 'Your most collect type field is missing' }),
});

export type WasteCollectSummaryType = Static<typeof WasteCollectSummarySchema>;