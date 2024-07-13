import Elysia, { t } from "elysia";
import { authenticate, authorize } from "../libs/auth";
import { checkAnswerAndAddQuizLog, getQuizByID, getRandomQuiz } from "./handlers/quizHandler";
import { QuizLogPayload } from "../models/Quiz";

const routes = (app: Elysia) =>
    app
        .use(authenticate)
        .group('/quiz', (app) =>
            app
                .get('/', ({ userId }) => getRandomQuiz(userId))
                .group('/log', (app) =>
                    app
                        .post('/',
                            ({ body, userId }) => checkAnswerAndAddQuizLog(userId, body),
                            {
                                body: QuizLogPayload
                            }
                        )
                )
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
                                    .get('/:id', ({ params }) => getQuizByID(params.id),
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