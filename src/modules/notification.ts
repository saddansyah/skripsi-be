import Elysia, { t } from "elysia";
import { sendAchievementNotification } from "./handlers/notificationHandler";
import { WebhookSchema } from "../models/Webhook";

const routes = (app: Elysia) =>
    app
        .group('/notification', (app) =>
            app
                .post('/', ({ body }) => {
                    sendAchievementNotification(body);
                },
                    { body: WebhookSchema }
                )
        )

export default routes;