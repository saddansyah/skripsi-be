import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(process.env.APP_PORT ?? 8080);

console.log(process.env.DIRECT_URL ?? "-");

console.log(
  `Server is running at ${app.server?.hostname}:${app.server?.port} on ${process.env.NODE_ENV} mode`
);
