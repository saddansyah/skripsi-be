import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(process.env.APP_PORT ?? 8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
