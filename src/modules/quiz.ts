import Elysia, { t } from "elysia";
import { authenticate, authorize } from "../libs/auth";
import { checkAnswerAndAddQuizLog, checkQuizStatus, getQuizById, getRandomQuiz } from "./handlers/quizHandler";

const routes = (app: Elysia) =>
    app
        .group('/quiz', (app) =>
            app
                .use(authenticate)
                .get('/', ({ userId }) => getRandomQuiz(userId))
                .get('/status', ({ userId }) => checkQuizStatus(userId))
                .post('/', ({ userId, body }) => checkAnswerAndAddQuizLog(userId, body), {
                    body: t.Object({
                        answer: t.String(),
                        unique_id: t.String(),
                        quiz_id: t.Numeric(),
                    })
                })
                .group('/admin', (app) =>
                    app
                        .guard(
                            {
                                beforeHandle({ userId }) {
                                    return authorize(userId)
                                }
                            },
                            (app) =>
                                app
                                    .get('/:id', ({ params }) => getQuizById(params.id),
                                        {
                                            params: t.Object({
                                                id: t.Numeric({ error: 'Param id must be a number' })
                                            })
                                        }
                                    )
                        )
                )
        )

export default routes;