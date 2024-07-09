import Elysia, { t } from "elysia";
import {
    getContainers,
    getContainerById,
    addContainer,
    updateContainer,
    deleteContainer,
    updateContainerStatus,
} from "../controllers/containerController";
import { ContainerStatus, WasteContainerPayloadType } from "../types/WasteContainer";
import { ErrorWithStatus } from "../utils/exceptionBuilder";

const routes = new Elysia()
    .group('/container', (app) =>
        app
            .guard(
                {
                    beforeHandle({ }) {
                        // TODO -> replace with supabase auth checker
                        const isAdmin = false;
                        if (!isAdmin) {
                            throw new ErrorWithStatus("You're not signed in as admin", 403, 'Unauthorized')
                        }
                    }
                },
                (app) =>
                    app
                        .patch('/status/:id',
                            ({ params, body }) => updateContainerStatus(params.id, body.status),
                            {
                                body: t.Object({ status: t.Enum(ContainerStatus, { error: 'Status is not valid' }) }),
                                params: t.Object({ id: t.Numeric({ error: 'Param is must be number' }) })
                            }
                        )
            )
            .get('/',
                ({ query }) => getContainers({
                    limit: query?.limit,
                    status: query?.status,
                    sortBy: query?.sortBy,
                    order: query?.order,
                    type: query?.type,
                    cluster_id: query?.clusterId
                }),
                {
                    query: t.Object({
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
                ({ body }) => addContainer(body),
                {
                    body: WasteContainerPayloadType
                }
            )
            .patch('/:id',
                ({ params, body }) => updateContainer(params.id, body),
                {
                    params: t.Object({
                        id: t.Numeric({ error: 'Param id must be a number' })
                    }),
                    body: t.Partial(WasteContainerPayloadType)
                }
            )
            .delete('/:id',
                ({ params, query }) => deleteContainer(params.id),
                {
                    params: t.Object({
                        id: t.Numeric({ error: 'Param id must be a number' })
                    })
                })
    )

export default routes; 