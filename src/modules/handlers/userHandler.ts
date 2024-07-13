import { Prisma } from "@prisma/client";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import db from "../../db/instance";
import { ProfileType } from "../../models/Profile";
import { successResponse } from "../../utils/responseBuilder";

export const getUsers = async (
    options?: {
        page?: number,
        limit?: number,
        sortBy?: string,
        order?: string,
        type?: string
    }) => {

    try {
        const limit = options?.limit ?? 10;
        const offset = ((options?.page ?? 1) - 1) * (limit);

        const users = await db.$queryRaw<(ProfileType & { 'updated_at': string, 'created_at': string })[]>`
            SELECT u.id, u.raw_user_meta_data, p.is_admin, SUM(f.point)::int4 as total_points, u.last_sign_in_at, u.created_at, u.updated_at
            FROM auth.users as u 
                FULL OUTER JOIN profiles AS p ON u.id = p.user_id 
                FULL OUTER JOIN (
                    SELECT user_id, point FROM waste_collects
                    UNION ALL
                    SELECT user_id, point FROM waste_reports
                    UNION ALL
                    SELECT user_id, point FROM quiz_log
                    UNION ALL
                    SELECT user_id, point FROM quests_log
                    UNION ALL 
                    SELECT user_id, additional_point as point FROM profiles
                ) f on u.id = f.user_id
            GROUP BY 
                u.id,
                p.user_id
            LIMIT ${limit} OFFSET ${offset}
        `;

        if (users.length == 0) {
            return successResponse<ProfileType & {}>(
                {
                    message: "No user has signed in",
                    data: users
                }
            )
        }

        return successResponse<ProfileType & { 'updated_at': string, 'created_at': string }>(
            {
                message: "Users is ready",
                data: users
            }
        )

    }
    catch (e: any) {
        switch (e.constructor) {
            case Prisma.PrismaClientKnownRequestError:
                throw new ErrorWithStatus(e.message, 500);
            default:
                throw new ErrorWithStatus(e.message, e.status, e.name);
        }
    }
}

export const getUserById = async (id: string) => {

    try {
        const users = await db.$queryRaw<(ProfileType & { 'updated_at': string, 'created_at': string })[]>`
            SELECT u.id, u.raw_user_meta_data, p.is_admin, SUM(f.point)::int4 as total_points, u.last_sign_in_at, u.created_at, u.updated_at
            FROM auth.users as u 
                FULL OUTER JOIN profiles AS p ON u.id = p.user_id 
                FULL OUTER JOIN (
                    SELECT user_id, point FROM waste_collects
                    UNION ALL
                    SELECT user_id, point FROM waste_reports
                    UNION ALL
                    SELECT user_id, point FROM quiz_log
                    UNION ALL
                    SELECT user_id, point FROM quests_log
                    UNION ALL 
                    SELECT user_id, additional_point as point FROM profiles
                ) f on u.id = f.user_id
            WHERE u.id=${id}::uuid
            GROUP BY 
                u.id,
                p.user_id
            LIMIT 1
        `;

        if (users.length == 0) {
            return successResponse<ProfileType & {}>(
                {
                    message: "No user with corresponding id",
                    data: users
                }
            )
        }

        return successResponse<ProfileType & { 'updated_at': string, 'created_at': string }>(
            {
                message: "User is ready",
                data: users
            }
        )

    }
    catch (e: any) {
        switch (e.constructor) {
            case Prisma.PrismaClientKnownRequestError:
                throw new ErrorWithStatus(e.message, 500);
            default:
                throw new ErrorWithStatus(e.message, e.status, e.name);
        }
    }
}

export const deleteUser = async (id: string, userId: string) => {
    try {
        if (id === userId) {
            throw new ErrorWithStatus('Cannot delete current signed in user', 403, 'Unauthorized')
        }

        const users = await db.$queryRaw<ProfileType[]>`
            DELETE FROM auth.users
            WHERE 
                id=${id}::uuid
            RETURNING id, raw_user_meta_data;
        `;

        if (users.length == 0)
            throw new ErrorWithStatus(`User with id ${users[0].id} is deleted`, 404, 'Not Found');

        return successResponse<ProfileType>(
            {
                message: "User is deleted",
                data: users
            }
        )

    }
    catch (e: any) {
        switch (e.constructor) {
            case Prisma.PrismaClientKnownRequestError:
                throw new ErrorWithStatus(e.message, 500);
            default:
                throw new ErrorWithStatus(e.message, e.status, e.name);
        }
    }
}

