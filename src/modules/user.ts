import Elysia, { t } from "elysia";
import { authenticate, authorize } from "../libs/auth";
import { deleteUser, getUserById, getUsers } from "./handlers/userHandler";

const routes = (app: Elysia) =>
    app
        .group('/user', (app) =>
            app
                .use(authenticate)
                .guard(
                    {
                        beforeHandle({ userId }) {
                            return authorize(userId);
                        },
                    },
                    (app) =>
                        app
                            .get('/',
                                ({ query }) => getUsers({
                                    page: query?.page,
                                    limit: query?.limit,
                                    sortBy: query?.sortBy,
                                    order: query?.order,
                                    type: query?.type,
                                }),
                                {
                                    query: t.Object({
                                        page: t.Optional(t.Numeric()),
                                        limit: t.Optional(t.Numeric()),
                                        sortBy: t.Optional(t.String()),
                                        order: t.Optional(t.String()),
                                        type: t.Optional(t.String())
                                    })
                                }
                            )
                            .get('/:id',
                                ({ params }) => getUserById(params.id),
                                {
                                    params: t.Object({
                                        id: t.String({ format: "uuid", error: 'Param id must be in UUID format' })
                                    })
                                }
                            )
                            .delete('/:id',
                                ({ params, userId }) => deleteUser(params.id, userId),
                                {
                                    params: t.Object({
                                        id: t.String({ format: "uuid", error: 'Param id must be in UUID format' })
                                    })
                                }
                            )
                )
        )

export default routes;