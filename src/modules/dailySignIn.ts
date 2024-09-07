import Elysia from "elysia";
import { authenticate } from "../libs/auth";
import { checkDailySignInStatus, checkDailySignInStreak, claimDailySignIn, claimDailySignInStreak } from "./handlers/dailySignInHandler";

const routes = (app: Elysia) =>
    app
        .group('/daily-sign-in', (app) =>
            app
                .use(authenticate)
                .get('/', ({ userId }) => checkDailySignInStatus(userId))
                .post('/', ({ userId }) => claimDailySignIn(userId))
                .group('/streak', (app) =>
                    app
                        .get('/', ({ userId }) => checkDailySignInStreak(userId))
                        .post('/', ({ userId }) => claimDailySignInStreak(userId))
                )
        )


export default routes;