import cookie from "@elysiajs/cookie";
import Elysia, { t } from "elysia";
import supabase from "../services/supabase/instance";
import { ErrorWithStatus } from "../utils/exceptionBuilder";

export const authenticate = (app: Elysia) =>
    app
        .use(cookie())
        .derive(
            async ({ cookie }) => {
                // We can assure that access and refresh token are string
                const access_token = cookie['access_token'] as unknown as string
                const refresh_token = cookie['refresh_token'] as unknown as string

                if (!access_token && !refresh_token) {
                    throw new ErrorWithStatus(`You're not signed up as admin`, 401, 'Unauthenticated');
                }

                const { data, error } = await supabase.auth.getUser(access_token);

                if (error) throw new ErrorWithStatus('User is not authenticated or session has timed up', 401, 'Unauthorized');

                if (data.user)
                    return {
                        userId: data.user.id
                    }

                const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refresh_token })

                if (refreshError) throw new ErrorWithStatus('Error when refreshing session', 500, 'Session');
                return {
                    userId: refreshed.user!.id
                    // user_isAdmin: profiles.
                }
            },
        )
        .derive(
            async ({ userId }) => {
                const { data, error } = await supabase.from('profiles').select('isAdmin').eq('user_id', userId);

                if (!data) throw new ErrorWithStatus('Missing user profile', 404, 'Not Found');
                if (error) throw new ErrorWithStatus('Error when fetching profile', 500, 'Internal Server Error');

                return {
                    userId,
                    userIsAdmin: data[0].isAdmin
                }
            })