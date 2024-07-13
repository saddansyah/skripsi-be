import Elysia, { t } from "elysia";
import { addCluster, deleteCluster, getClusters, updateCluster } from "./handlers/clusterHandler";
import { getContainerById } from "./handlers/containerHandler";
import { WasteClusterPayloadType } from "../models/WasteCluster";
import { authenticate, authorize } from "../libs/auth";

const routes = (app: Elysia) =>
    app
        .use(authenticate)
        .group('/cluster', (app) =>
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
                                ({ query }) => getClusters({
                                    page: query?.page,
                                    limit: query?.limit,
                                    sortBy: query?.sortBy,
                                    order: query?.order,
                                }),
                                {
                                    query: t.Object({
                                        page: t.Optional(t.Numeric()),
                                        limit: t.Optional(t.Numeric()),
                                        sortBy: t.Optional(t.String()),
                                        order: t.Optional(t.String())
                                    })
                                }
                            )
                            .get('/:id',
                                ({ params }) => getContainerById(params.id),
                                {
                                    params: t.Object({
                                        id: t.Numeric({ error: 'Param id must be a number' })
                                    })
                                }
                            )
                            .post('/',
                                ({ body }) => addCluster(body),
                                {
                                    body: WasteClusterPayloadType
                                }
                            )
                            .patch('/:id',
                                ({ params, body }) => updateCluster(params.id, body),
                                {
                                    params: t.Object({
                                        id: t.Numeric({ error: 'Param id must be a number' })
                                    }),
                                    body: t.Partial(WasteClusterPayloadType)
                                }
                            )
                            .delete('/:id',
                                ({ params }) => deleteCluster(params.id),
                                {
                                    params: t.Object({
                                        id: t.Numeric({ error: 'Param id must be a number' })
                                    })
                                }
                            )
                )
        );

export default routes;