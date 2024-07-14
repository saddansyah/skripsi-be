import Elysia, { t } from "elysia";
import {
    getContainers,
    getContainerById,
    addContainer,
    updateContainer,
    deleteContainer,
    updateContainerStatus,
} from "./handlers/containerHandler";
import { WasteContainerPayloadModel } from "../models/WasteContainer";
import { Status } from "../utils/constants/enums";
import { authenticate, authorize } from "../libs/auth";

const routes = (app: Elysia) =>
    app
        .use(authenticate)
        .group('/container', (app) =>
            app
                .get('/',
                    ({ query }) => getContainers({
                        page: query?.page,
                        limit: query?.limit,
                        status: query?.status,
                        sortBy: query?.sortBy,
                        order: query?.order,
                        type: query?.type,
                        cluster_id: query?.clusterId
                    }),
                    {
                        query: t.Object({
                            page: t.Optional(t.Numeric()),
                            limit: t.Optional(t.Numeric()),
                            status: t.Optional(t.String()),
                            sortBy: t.Optional(t.String()),
                            order: t.Optional(t.String()),
                            type: t.Optional(t.String()),
                            clusterId: t.Optional(t.Numeric()),
                        })
                    })
                .get('/:id',
                    ({ params, query }) => getContainerById(params.id, { status: query?.status ?? '' }),
                    {
                        params: t.Object({
                            id: t.Numeric({ error: 'Param id must be a number' })
                        })
                    }
                )
                .post('/',
                    ({ body, userId }) => addContainer(userId, body),
                    {
                        body: WasteContainerPayloadModel
                    }
                )
                .patch('/:id',
                    ({ params, body }) => updateContainer(params.id, body),
                    {
                        params: t.Object({
                            id: t.Numeric({ error: 'Param id must be a number' })
                        }),
                        body: t.Partial(WasteContainerPayloadModel)
                    }
                )
                .delete('/:id',
                    ({ params, query }) => deleteContainer(params.id),
                    {
                        params: t.Object({
                            id: t.Numeric({ error: 'Param id must be a number' })
                        })
                    })
                .guard(
                    {
                        beforeHandle({ userId }) {
                            return authorize(userId);
                        },
                    },
                    (app) =>
                        app
                            .patch('/status/:id',
                                ({ params, body, userId }) => updateContainerStatus(userId, params.id, body.status),
                                {
                                    body: t.Object({ status: t.Enum(Status, { error: 'Status is not valid' }) }),
                                    params: t.Object({ id: t.Numeric({ error: 'Param is must be number' }) })
                                }
                            )
                )
        )



export default routes; 