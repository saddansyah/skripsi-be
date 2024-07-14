import { Elysia, t } from "elysia";
import { cors } from '@elysiajs/cors'

// Modules
import learn from "./modules/learn";
import container from "./modules/container";
import cluster from "./modules/cluster";
import collect from "./modules/collect";
import profile from "./modules/profile";
import achievement from "./modules/achievement";
import auth from "./modules/auth";
import user from "./modules/user";
import quiz from "./modules/quiz";
import quest from "./modules/quest";
import storage from "./modules/storage";

// Utilities
import { errorResponse } from "./utils/responseBuilder";
import { ErrorWithStatus } from "./utils/exceptionBuilder";

const app = new Elysia()
  .error({ ErrorWithStatus }) // register custom error
  .onError(({ error, code }) => {
    console.error(error.stack);
    switch (code) {
      case 'ErrorWithStatus':
        return errorResponse({ status: error.status, error: error.name, message: error.message });
      case 'VALIDATION':
        if (error.message.startsWith('{\n'))
          return errorResponse({ status: 400, error: "Validation Error", message: error.validator.Errors(error.value).First().message });
        return errorResponse({ status: 400, error: "Validation Error", message: error.message });
      case 'NOT_FOUND':
        return errorResponse({ status: 404, error: "Not Found", message: "Your requested url is not found" });
      default:
        return errorResponse({ status: 500, error: "Internal Server Error", message: error.message });
    }
  })
  .use(cors())
  .get("/", () => { return { hello: 'world!' } })
  .group('/api', (app) =>
    app
      .use(storage)
      .use(auth)
      .use(profile)
      .use(achievement)
      .use(container)
      .use(cluster)
      .use(collect)
      .use(user)
      .use(learn)
      .use(quiz)
      .use(quest)
      .get("/", () => { return { hello: 'api ' } })
  )
  .listen(process.env.APP_PORT ?? 8080);

console.log(
  `Server is running at ${app.server?.hostname}:${app.server?.port} on ${process.env.NODE_ENV} mode`
);
