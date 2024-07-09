import { Elysia } from "elysia";
import { errorResponse } from "./utils/responseBuilder";
import { ErrorWithStatus } from "./utils/exceptionBuilder";

// Routes
import containerRoute from "./routes/containerRoute";
import clusterRoute from "./routes/clusterRoute";

const app = new Elysia()
  .error({ ErrorWithStatus }) // register custom error
  .onError(({ error, code }) => {
    switch (code) {
      case 'VALIDATION':
        if (error.message.startsWith('{\n'))
          return errorResponse({ status: 400, error: "Validation Error", message: error.validator.Errors(error.value).First().message });
        return errorResponse({ status: 400, error: "Validation Error", message: error.message });
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
  .use(clusterRoute)
  .listen(process.env.APP_PORT ?? 8080);

console.log(
  `Server is running at ${app.server?.hostname}:${app.server?.port} on ${process.env.NODE_ENV} mode`
);
