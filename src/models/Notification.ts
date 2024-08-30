import { Static, t } from "elysia";

export const NotificationSchema = t.Object({
    app_id: t.String(),
    name: t.Object({ en: t.String() }),
    headings: t.Object({ en: t.String() }),
    contents: t.Object({ en: t.String() }),
    target_channel: t.String(),
    android_channel_id: t.String(), // specify notification setting group
    include_aliases: t.Object({
        external_id: t.Array(t.String())
    })
});

export type NotificationType = Static<typeof NotificationSchema>;