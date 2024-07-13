import Elysia, { t } from "elysia";
import { authenticate, authorize } from "../libs/auth";
import { getLearnById, getLearns } from "./handlers/learnHandler";

const routes = (app: Elysia) =>
    app
        .use(authenticate)
        .group('/learn', (app) =>
            app
                .get('/', ({ query }) => getLearns({
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
                            type: t.Optional(t.String()),
                        })
                    }
                )
                .get('/:id',
                    ({ params }) => getLearnById(params.id),
                    {
                        params: t.Object({
                            id: t.Numeric({ error: 'Param id must be a number' })
                        })
                    }
                )
                .guard(
                    {
                        beforeHandle({ userId }) {
                            return authorize(userId);
                        }
                    },
                    (app) =>
                        app
                            .post('/', () => { })
                            .patch('/:id', () => { })
                            .delete('/:id', () => { })
                )
        );

export default routes;