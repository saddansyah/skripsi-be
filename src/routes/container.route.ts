import Elysia, { error } from "elysia";
import { getContainers } from "../controllers/container.controller";

const routes = new Elysia()
    .group('/container', (app) =>
        app
            .get('/', () => getContainers())
            .get('/:id', ({ params }) => { return { id: params.id } })
    )

export default routes; 