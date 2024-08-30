import { Static, t } from "elysia";

export const WebhookSchema = t.Object({
    type: t.String(),
    table: t.String(),
    record: t.Object({
        user_id: t.String(),
        created_at: t.String(),
        achievement_id: t.Numeric(),
    }),
    schema: t.String(),
    old_record: t.Nullable(t.String())
});

export type WebhookType = Static<typeof WebhookSchema>;