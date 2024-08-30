import Elysia, { t } from "elysia";
import { addContainerRating, deleteContainerRating, getContainerRating } from "./handlers/evidenceRatingHandler";
import { EvidenceRatingSchema } from "../models/EvidenceRating";
import { authenticate } from "../libs/auth";

const routes = (app: Elysia) =>
    app
        .group('/rating', (app) =>
            app
                .group('/container', (app) =>
                    app
                        .use(authenticate)
                        .get('/:id',
                            ({ userId, params }) => getContainerRating(params.id, userId),
                            {
                                params: t.Object({
                                    id: t.Numeric({ error: 'Param id must be a number' })
                                })
                            }
                        )
                        .post('/',
                            ({ userId, body }) => addContainerRating(userId, body),
                            {
                                body: t.Omit(EvidenceRatingSchema, ['point', 'created_at', 'user_id'])
                            }
                        )
                        .delete('/:id',
                            ({ params, userId }) => deleteContainerRating(params.id, userId),
                            {
                                params: t.Object({
                                    id: t.Numeric({ error: 'Param id must be a number' })
                                })
                            }
                        )
                )
        )
export default routes;