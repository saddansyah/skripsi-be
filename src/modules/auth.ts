import Elysia, { Cookie, t } from "elysia";
import supabase from "../services/supabase/instance";
import { ErrorWithStatus } from "../utils/exceptionBuilder";
import { streamResponse, successResponse } from "../utils/responseBuilder";
import Stream from "@elysiajs/stream";
import { authenticate } from "../libs/auth";

const routes = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .post('/signout', async () => {
                const { error } = await supabase.auth.signOut();

                if (error) throw new ErrorWithStatus('Sign out failed', 500, 'Server Error');

                return successResponse({
                    message: 'Sign in success',
                    data: [null]
                });
            })
            .post('/signin/google', async ({ body }) => {
                console.log(body);
                const { data } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    access_token: body.accessToken,
                    token: body.idToken,
                })

                console.log(data);

                return successResponse({
                    message: 'Sign in success',
                    data: [{
                        accessToken: data.session?.access_token,
                        refreshToken: data.session?.refresh_token,
                    }]
                });
            },
                {
                    body: t.Object({ idToken: t.String(), accessToken: t.String() })
                }
            )
            .post(
                '/refresh',
                async ({ body }) => {
                    const { data, error } = await supabase.auth.refreshSession({ refresh_token: body.refreshToken });

                    if (error) throw new ErrorWithStatus('Refresh token is invalid', 401, 'Unauthenticated');

                    return successResponse(
                        {
                            message: `Session is refreshed`,
                            data: [{
                                accessToken: data.session?.access_token,
                                refreshToken: data.session?.refresh_token
                            }]
                        }
                    );
                },
                {
                    body: t.Object({ refreshToken: t.String() })
                }
            )
            .use(authenticate)
            .get('/stream', ({ set }) => {
                const stream = new Stream();

                const { data } = supabase.auth.onAuthStateChange((e, s) => {

                    stream.send(streamResponse({
                        event: e,
                        data: s ? {
                            accessToken: s.access_token,
                            refreshToken: s.refresh_token
                        } : null
                    }))

                });

                return stream;
            })
    )

export default routes;
