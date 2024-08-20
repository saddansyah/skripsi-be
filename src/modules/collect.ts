import Elysia, { t } from "elysia";
import { authenticate, authorize } from "../libs/auth";
import { addMyWasteCollect, deleteMyWasteCollect, deleteWasteCollect, getMyWasteCollectById, getMyWasteCollects, getWasteCollectById, getWasteCollects, updateMyWasteCollect, updateWasteCollectStatus } from "./handlers/collectHandler";
import { WasteCollectPayloadModel } from "../models/WasteCollect";
import { Status } from "../utils/constants/enums";
import { COLLECT_POINT } from "../utils/constants/point";

const routes = (app: Elysia) =>
    app
        .group('/collect', (app) =>
            app
                .use(authenticate)
                .get('/', ({ query, userId }) => getMyWasteCollects(userId, {
                    search: query?.search,
                    page: query?.page,
                    limit: query?.limit,
                    status: query?.status,
                    sortBy: query?.sortBy,
                    order: query?.order,
                    type: query?.type,
                    container_id: query?.containerId
                }),
                    {
                        query: t.Object({
                            search: t.Optional(t.String()),
                            page: t.Optional(t.Numeric()),
                            limit: t.Optional(t.Numeric()),
                            status: t.Optional(t.String()),
                            sortBy: t.Optional(t.String()),
                            order: t.Optional(t.String()),
                            type: t.Optional(t.String()),
                            containerId: t.Optional(t.Numeric()),
                        })
                    }
                )
                .get('/:id',
                    ({ params, query, userId }) => getMyWasteCollectById(userId, params.id, {
                        status: query?.status
                    }),
                    {
                        params: t.Object({
                            id: t.Numeric({ error: 'Param id must be a number' })
                        })
                    }
                )
                .post('/',
                    ({ body, userId }) => {
                        addMyWasteCollect(userId, COLLECT_POINT, body);
                    },
                    {
                        body: WasteCollectPayloadModel
                    }
                )
                .patch('/:id',
                    ({ params, body, userId }) => updateMyWasteCollect(userId, params.id, body),
                    {
                        params: t.Object({
                            id: t.Numeric({ error: 'Param id must be a number' })
                        }),
                        body: t.Partial(WasteCollectPayloadModel)
                    }
                )
                .delete('/:id',
                    ({ params, userId }) => deleteMyWasteCollect(userId, params.id),
                    {
                        params: t.Object({
                            id: t.Numeric({ error: 'Param id must be a number' })
                        })
                    })
                // Admin Routes
                .group('/admin', (app) =>
                    app
                        .guard(
                            {
                                beforeHandle({ userId }) {
                                    return authorize(userId);
                                },
                            },
                            (app) =>
                                app
                                    .get('/',
                                        ({ query }) => getWasteCollects(
                                            {
                                                page: query?.page,
                                                limit: query?.limit,
                                                status: query?.status,
                                                sortBy: query?.sortBy,
                                                order: query?.order,
                                                type: query?.type,
                                                container_id: query?.containerId
                                            }
                                        ),
                                        {
                                            query: t.Object({
                                                page: t.Optional(t.Numeric()),
                                                limit: t.Optional(t.Numeric()),
                                                status: t.Optional(t.String()),
                                                sortBy: t.Optional(t.String()),
                                                order: t.Optional(t.String()),
                                                type: t.Optional(t.String()),
                                                containerId: t.Optional(t.Numeric()),
                                            })
                                        }

                                    )
                                    .get('/:id',
                                        ({ params, query }) => getWasteCollectById(params.id, {
                                            status: query?.status
                                        }),
                                        {
                                            params: t.Object({
                                                id: t.Numeric({ error: 'Param id must be a number' })
                                            })
                                        }
                                    )
                                    .patch('/:id',
                                        ({ params, body }) => updateWasteCollectStatus(params.id, body),
                                        {
                                            params: t.Object({
                                                id: t.Numeric({ error: 'Param id must be a number' })
                                            }),
                                            body: t.Object({
                                                status: t.Enum(Status)
                                            })
                                        }

                                    )
                                    .delete('/:id',
                                        ({ params, body }) => deleteWasteCollect(params.id),
                                        {
                                            params: t.Object({
                                                id: t.Numeric({ error: 'Param id must be a number' })
                                            })
                                        }
                                    )
                        )
                )
        )


export default routes