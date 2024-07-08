import Elysia, { t } from "elysia";
import {
    getContainers,
    getContainerById,
    addContainer,
    updateContainer,
    deleteContainer,
} from "../controllers/containerController";
import { WasteContainerPayloadType } from "../types/WasteContainer";

const routes = new Elysia()
    .group('/container', (app) =>
        app
            .get('/',
                ({ query }) => getContainers({
                    limit: 10,
                    status: query?.status ?? '',
                    sortBy: query?.sortBy,
                    order: query?.order,
                    type: query?.type,
                    cluster_id: query?.clusterId

                }))
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
                    })
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