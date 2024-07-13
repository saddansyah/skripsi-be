import Elysia, { t } from "elysia";
import { authenticate } from "../libs/auth";
import { getLeaderboard, getMyAchievement, getMyProfile } from "./handlers/profileHandler";

const routes = (app: Elysia) =>
    app
        .use(authenticate)
        .group('/my', (app) =>
            app
                .get('/',
                    ({ userId }) => getMyProfile(userId))
                .get('/leaderboard',
                    ({ query }) => getLeaderboard({ limit: query?.limit }),
                    {
                        query: t.Object({
                            limit: t.Optional(t.Numeric())
                        })
                    })
                .get('/achievement',
                    ({ userId }) => getMyAchievement(userId))
        )

export default routes;