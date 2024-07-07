import { t, Static } from 'elysia';

export const UserSchema = t.Object({
    id: t.String(),
    email: t.String({ maxLength: 200 }),
    name: t.String({ maxLength: 100 }),
    is_admin: t.Boolean(),
    img: t.String(),
    point: t.Integer(),
    created_at: t.Nullable(t.String()),
    updated_at: t.Nullable(t.String()),
});

export type UserType = Static<typeof UserSchema>;

