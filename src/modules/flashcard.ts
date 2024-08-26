import Elysia, { t } from "elysia";
import { getFlashcardById, getRandomFlashcard } from "./handlers/flashcardHandler";

const routes = (app: Elysia) =>
    app
        .group('/flashcard', (app) =>
            app
                .get('/', () => getRandomFlashcard())
                .get('/:id', ({ params }) => getFlashcardById(params.id), {
                    params: t.Object({
                        id: t.Numeric({ error: 'Param id must be a number' })
                    })
                })
        );

export default routes;