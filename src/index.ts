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
import { authenticate } from "./libs/auth";
import { logger } from "./libs/logger";

const app = new Elysia()
  .use(logger)
  .error({ ErrorWithStatus })
  .onError((ctx) => {
    switch (ctx.code) {
      case 'ErrorWithStatus':
        return errorResponse({ status: ctx.error.status, error: ctx.error.name, message: ctx.error.message });
      case 'VALIDATION':
        if (ctx.error.message.startsWith('{\n'))
          return errorResponse({ status: 400, error: "Validation Error", message: ctx.error.validator.Errors(ctx.error.value).First().message });
        return errorResponse({ status: 400, error: "Validation Error", message: ctx.error.message });
      case 'NOT_FOUND':
        return errorResponse({ status: 404, error: "Not Found", message: "Your requested url is not found" });
      default:
        return errorResponse({ status: 500, error: "Internal Server Error", message: ctx.error.message });
    }
  })
  .use(cors())
  .get("/", () => { return { hello: 'world!' } })
  .group('/api', (app) =>
    app
      .use(auth)
      // authenticated routes
      .use(authenticate)
      .use(container)
      .use(storage)
      .use(profile)
      .use(achievement)
      .use(cluster)
      .use(collect)
      .use(user)
      .use(learn)
      .use(quiz)
      .use(quest)
      .get("/", () => { return { hello: 'api ' } })
  )
  .listen(process.env.APP_PORT ?? 8080);
// .listen({ port: 80, hostname: '192.168.223.131' });

console.log(
  `Server is running at ${app.server?.hostname}:${app.server?.port} on ${process.env.NODE_ENV} mode`
);
