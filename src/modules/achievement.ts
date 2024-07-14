import Elysia, { t } from "elysia";
import { authenticate, authorize } from "../libs/auth";
import { getAchievementById, getAchievements } from "./handlers/achievementHandler";

const routes = (app: Elysia) =>
    app
        .use(authenticate)
        .group('/achievement', (app) =>
            app
                .get('/',
                    ({ query }) => getAchievements({
                        page: query?.page,
                        limit: query?.limit,
                        sortBy: query?.sortBy,
                        order: query?.order
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
                    ({ params }) => getAchievementById(params.id),
                    {
                        params: t.Object({
                            id: t.Numeric({ error: 'Param id must be a number' })
                        })
                    }
                )
                .guard(
                    {
                        beforeHandle({ userId }) {
                            authorize(userId);
                        }
                    },
                    (app) =>
                        app
                            .post('/', () => { })
                            .patch('/', () => { })
                            .delete('/', () => { })
                )
        )

export default routes;