import Elysia, { Cookie, t } from "elysia";
import supabase from "../services/supabase/instance";
import { ErrorWithStatus } from "../utils/exceptionBuilder";
import { streamResponse, successResponse } from "../utils/responseBuilder";
import Stream from "@elysiajs/stream";

const routes = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .post('/signout', async () => {
                await supabase.auth.signOut();
            })
            .post('/signin/google', async ({ body }) => {
                await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    access_token: body.accessToken,
                    token: body.idToken,
                })
            },
                {
                    body: t.Object({ idToken: t.String(), accessToken: t.String() })
                }
            )
            .get('/state', ({ set }) => {
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
            .post(
                '/refresh',
                async ({ body }) => {
                    const { data, error } = await supabase.auth.refreshSession({
                        refresh_token: body.refreshToken
                    });

                    if (error) throw new ErrorWithStatus('Refresh token is invalid', 401, 'Unauthenticated');

                    return successResponse<any>(
                        {
                            message: `Session is refreshed`,
                            data: [{
                                access_token: data.session!.access_token,
                                refresh_token: data.session!.refresh_token
                            }]
                        }
                    );
                },
                {
                    body: t.Object({ refreshToken: t.String() })
                }
            )
    )

export default routes;
