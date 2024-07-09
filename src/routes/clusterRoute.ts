import Elysia, { t } from "elysia";
import { ErrorWithStatus } from "../utils/exceptionBuilder";
import { addCluster, deleteCluster, getClusters, updateCluster } from "../controllers/clusterController";
import { getContainerById } from "../controllers/containerController";
import { WasteClusterPayloadType } from "../types/WasteCluster";

const routes = new Elysia()
    .group('/cluster', (app) =>
        app
            .guard(
                {
                    beforeHandle({ }) {
                        // TODO -> replace with supabase auth checker
                        const isAdmin = true;
                        if (!isAdmin) {
                            throw new ErrorWithStatus("You're not signed in as admin", 403, 'Unauthorized')
                        }
                    }
                },
                (app) =>
                    app
                        .get('/',
                            ({ query }) => getClusters({
                                limit: query?.limit,
                                sortBy: query?.sortBy,
                                order: query?.order,
                            }),
                            {
                                query: t.Object({
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