import cookie from "@elysiajs/cookie";
import Elysia, { Cookie } from "elysia";
import supabase from "../services/supabase/instance";
import { ErrorWithStatus } from "../utils/exceptionBuilder";
import db from "../db/instance";
import { ProfileType } from "../models/Profile";


export const authenticate = (app: Elysia) =>
    app
        .use(cookie())
        .derive(
            async ({ cookie }) => {
                // We can assure that access and refresh token are string
                const access_token = cookie['access_token'] as Cookie<string>;
                const refresh_token = cookie['refresh_token'] as Cookie<string>;

                if (!access_token.value && !refresh_token.value) {
                    throw new ErrorWithStatus(`Your access token is empty or invalid`, 401, 'Unauthenticated');
                }

                const { data, error } = await supabase.auth.getUser(access_token.value);

                if (data.user)
                    return {
                        userId: data.user.id
                    }

                const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refresh_token.value })

                if (refreshError) throw new ErrorWithStatus('Your session has expired', 401, 'Unauthenticated');

                // Replace new token in cookie
                access_token.value = refreshed.session!.access_token;
                refresh_token.value = refreshed.session!.refresh_token;

                return {
                    userId: refreshed.user!.id
                }
            },
        )

// Must be placed under authenticate
export const authorize = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('is_admin').eq('user_id', userId);

    if (data?.length === 0) {
        throw new ErrorWithStatus('Profile is missing', 404, 'Not Found');
    }
    if (error) {
        throw new ErrorWithStatus('Error when fetching profile', 500, 'Internal Server Error');
    }
    if (!data[0].is_admin) {
        throw new ErrorWithStatus("You're not signed in as admin", 403, 'Unauthorized');
    }

}