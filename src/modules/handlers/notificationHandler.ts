import { Prisma } from "@prisma/client";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import axios from "axios";
import { NotificationType } from "../../models/Notification";
import { WebhookType } from "../../models/Webhook";
import db from "../../db/instance";
import { AchievementType } from "../../models/Achievement";

const { ONE_SIGNAL_API_KEY, ONE_SIGNAL_APP_ID } = process.env;

export const sendAchievementNotification = async (body: WebhookType) => {
    try {
        const achievement = await db.$queryRaw<AchievementType[]>`
            SELECT * FROM achievements
            WHERE id=${body.record.achievement_id}
            LIMIT 1;
        `

        const payload: NotificationType = {
            app_id: ONE_SIGNAL_APP_ID as string,
            name: { en: `Ach-${body.record.user_id}-${body.record.achievement_id}` },
            headings: { en: 'Selamat atas capaian barunya! ' },
            contents: { en: `Kamu berhasil menyelesaikan capaian baru ${achievement[0].name}!` },
            target_channel: "push",
            include_aliases: {
                external_id: [
                    body.record.user_id
                ]
            },
            android_channel_id: '98b75ccd-b7c4-4334-89ab-0c91e1441690'
        }

        const response = await axios.post(`https://api.onesignal.com/notifications`, payload,
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
                }
            });
    }
    catch (e: any) {
        switch (e.constructor) {
            case Prisma.PrismaClientKnownRequestError:
                throw new ErrorWithStatus(e.message, 500);
            default:
                throw new ErrorWithStatus(e.message, e.status, e.name);
        }
    }
}