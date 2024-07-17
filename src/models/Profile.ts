import { t, Static } from 'elysia';

export const ProfileSchema = t.Object({
    user_id: t.String(),
    user_data: t.Object({
        iss: t.String(),
        sub: t.String(),
        name: t.String(),
        email: t.String(),
        picture: t.String(),
        full_name: t.String(),
        avatar_url: t.String(),
        provided_id: t.String(),
        email_verified: t.Boolean(),
        phone_verified: t.Boolean(),
    }),
    is_admin: t.Boolean(),
    last_sign_in_at: t.Date(),
    total_points: t.Integer(),
    rank: t.String()
});

export type ProfileType = Static<typeof ProfileSchema>;

