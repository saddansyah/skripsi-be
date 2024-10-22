import Elysia from "elysia";
import supabase from "../services/supabase/instance";
import { ErrorWithStatus } from "../utils/exceptionBuilder";

export const authenticate = (app: Elysia) =>
    app
        .derive(
            async ({ headers }) => {
                const accessToken = headers['authorization']?.split(' ')[1];

                if (!accessToken) {
                    throw new ErrorWithStatus(`Your access token is empty`, 401, 'Unauthenticated');
                }

                const { data, error } = await supabase.auth.getUser(accessToken);
                

                if (error) {
                    throw new ErrorWithStatus(`Your access token is invalid`, 401, 'Unauthenticated');
                }

                return {
                    userId: data.user.id
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