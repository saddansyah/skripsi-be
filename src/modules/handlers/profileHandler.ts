import { Static, t } from "elysia";
import { Prisma } from "@prisma/client";

import db from "../../db/instance";
import { AssignedAchievementType } from "../../models/Achievement";
import { ProfileSchema, ProfileType } from "../../models/Profile";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import { successResponse } from "../../utils/responseBuilder";
import { getRankByPoint } from "../../utils/constants/ranks";

export const getMyProfile = async (userId: string) => {
    try {
        const profile = await db.$queryRaw<ProfileType[]>`
            SELECT u.id, u.raw_user_meta_data, p.is_admin, u.last_sign_in_at, SUM(f.point)::int4 as total_points 
            FROM auth.users as u 
                FULL OUTER JOIN profiles AS p ON u.id = p.user_id 
                FULL OUTER JOIN (
                    SELECT user_id, point FROM waste_collects WHERE user_id=${userId}::uuid
                    UNION ALL
                    SELECT user_id, point FROM waste_reports WHERE user_id=${userId}::uuid
                    UNION ALL
                    SELECT user_id, point FROM quiz_logs WHERE user_id=${userId}::uuid
                    UNION ALL
                    SELECT user_id, point FROM quests_logs WHERE user_id=${userId}::uuid
                    UNION ALL 
                    SELECT user_id, additional_point as point FROM profiles WHERE user_id=${userId}::uuid
                ) f on u.id = f.user_id
            WHERE u.id = ${userId}::uuid 
            GROUP BY 
                u.id,
                p.user_id
            LIMIT 1
        `;

        const rank = getRankByPoint(profile[0].total_points);

        // Return JSON when success
        return successResponse<ProfileType>(
            {
                message: "Your profile is ready",
                data: [{ ...profile[0], rank: rank?.title! }]
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

// The point must be cached in frontend to compare the result
export const getLeaderboard = async (options?: { limit?: number }) => {
    try {
        const limit = options?.limit ?? 10;

        const leaderboard = await db.$queryRaw<Partial<Static<typeof ProfileSchema>>[]>`
            SELECT u.id, u.raw_user_meta_data, SUM(f.point)::int4 AS total_points
                FROM auth.users AS u 
                INNER JOIN (
                    SELECT user_id, point FROM waste_collects
                    UNION ALL
                    SELECT user_id, point FROM waste_reports
                    UNION ALL
                    SELECT user_id, point FROM quiz_logs
                    UNION ALL
                    SELECT user_id, point FROM quests_logs
                    UNION ALL 
                    SELECT user_id, additional_point as point FROM profiles
                ) as f on u.id = f.user_id
            GROUP BY
                u.id
            ORDER BY total_points DESC
            LIMIT ${limit};
        `;

        // Return JSON when success
        return successResponse<Partial<Static<typeof ProfileSchema>>>(
            {
                message: "Leaderboard is ready",
                data: leaderboard
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

export const getMyAchievement = async (userId: string) => {
    try {
        const achievement = await db.$queryRaw<AssignedAchievementType[]>`
            SELECT a.id, a.name, a.description, a.img 
            FROM assigned_achievement
                FULL OUTER JOIN auth.users AS u ON assigned_achievement.user_id = u.id 
                FULL OUTER JOIN achievement AS a ON assigned_achievement.achievement_id = a.id 
            WHERE u.id = ${userId}::uuid;
        `;

        // Return JSON when success
        return successResponse<AssignedAchievementType>(
            {
                message: "Your achievement is ready",
                data: achievement
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