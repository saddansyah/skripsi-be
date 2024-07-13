import Elysia, { Cookie } from "elysia";
import supabase from "../services/supabase/instance";
import { ErrorWithStatus } from "../utils/exceptionBuilder";
import db from "../db/instance";
import { successResponse } from "../utils/responseBuilder";

const routes = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .get(
                '/refresh',
                async ({ cookie }) => {
                    const access_token = cookie.access_token as Cookie<string>
                    const refresh_token = cookie.refresh_token as Cookie<string>

                    const { data, error } = await supabase.auth.refreshSession({
                        refresh_token: refresh_token.value
                    })

                    if (error) throw new ErrorWithStatus('Refresh token is invalid', 401, 'Unauthenticated');

                    access_token.value = data.session!.access_token;
                    refresh_token.value = data.session!.refresh_token;

                    return data.user
                }
            )
            .get(
                'create-profile',
                async ({ cookie }) => {
                    // Assume that cookie is always fresh 

                    try {
                        const access_token = cookie['access_token'] as Cookie<string>;

                        if (!access_token.value) {
                            throw new ErrorWithStatus(`Your access token is empty or invalid. Please refresh session.`, 401, 'Unauthenticated');
                        }

                        const { data, error } = await supabase.auth.getUser(access_token.value);

                        const profile = await db.$queryRaw<any>`
                            INSERT INTO profiles (user_id, is_admin, additional_point, created_at, updated_at)
                            VALUES (
                                ${data.user?.id}::uuid,
                                false,
                                DEFAULT,
                                now(),
                                now()
                            )
                            RETURNING *;
                        `

                        return successResponse<any>(
                            {
                                message: `Default profile successfully created`,
                                data: profile
                            }
                        )
                    }
                    catch (e: any) {
                        throw new ErrorWithStatus(e.message, e.status, e.name);
                    }

                }
            )
    )

export default routes;
