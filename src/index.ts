import { Elysia } from "elysia";
import containerRoute from "./routes/container.route";
import { errorResponse } from "./libs/responseBuilder";
import { ErrorWithStatus } from "./libs/exceptionBuilder";

const app = new Elysia()
  .error({ ErrorWithStatus }) // register custom error
  .onError(({ error, code }) => {
    switch (code) {
      case 'NOT_FOUND':
        return errorResponse({ status: 404, error: "Not Found", message: "Your requested url is not found" });
      case 'ErrorWithStatus':
        return errorResponse({ status: error.status, error: error.name, message: error.message });
      default:
        return errorResponse({ status: 500, error: "Internal Server Error", message: "Something bad happened on server" });
    }
  })
  .get("/", () => 'Hello World')
  .use(containerRoute)
  .listen(process.env.APP_PORT ?? 8080);

console.log(
  `Server is running at ${app.server?.hostname}:${app.server?.port} on ${process.env.NODE_ENV} mode`
);