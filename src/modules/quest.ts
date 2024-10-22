import Elysia, { t } from "elysia";
import { authenticate, authorize } from "../libs/auth";
import { QuestLogPayload } from "../models/Quest";
import { accomplishQuest, getQuestById, getRandomQuest } from "./handlers/questHandler";

const routes = (app: Elysia) =>
    app
        .group('/quest', (app) =>
            app
                .use(authenticate)
                .get('/',
                    ({ userId }) => getRandomQuest(userId)
                )
                .group('/log', (app) =>
                    app
                        .post('/',
                            ({ body, userId }) => accomplishQuest(userId, body),
                            {
                                body: QuestLogPayload
                            }
                        )
                )
                .group('/admin', (app) =>
                    app
                        .guard(
                            {
                                beforeHandle({ userId }) {
                                    return authorize(userId)
                                }
                            },
                            (app) =>
                                app
                                    .get('/:id', ({ params }) => getQuestById(params.id),
                                        {
                                            params: t.Object({
                                                id: t.Numeric({ error: 'Param id must be a number' })
                                            })
                                        }
                                    )
                        )
                )
        )

export default routes;
