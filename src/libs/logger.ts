import Elysia from "elysia";
import { ErrorWithStatus } from "../utils/exceptionBuilder";
import { errorResponse } from "../utils/responseBuilder";

export const logger = (app: Elysia) =>
    app
        .derive({ as: "global" }, () => ({ start: Date.now() }))
        .onError({ as: "global" }, (ctx) => {
            const date = new Date(Date.now()).toLocaleString('sv', { timeZoneName: 'short' });
            console.error(
                "<- ",
                ctx.request.method,
                ctx.path,
                ctx.set.status ?? 200,
                `(${date})`,
            );
            console.error("--------");
            console.error(ctx.error.stack);
        })
        .onBeforeHandle({ as: "global" }, (ctx) => {
            const date = new Date(Date.now()).toLocaleString('sv', { timeZoneName: 'short' });
            console.log(
                "-> ",
                ctx.request.method,
                ctx.path,
                `(${date})`
            );
        })
        .onAfterHandle({ as: "global" }, (ctx) => {
            const date = new Date(Date.now()).toLocaleString('sv', { timeZoneName: 'short' });
            console.log(
                "<- ",
                ctx.request.method,
                ctx.path,
                ctx.set.status ?? 200,
                "in",
                Date.now() - ctx.start,
                "ms",
                `(${date})`
            );
        });