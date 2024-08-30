import { Static, t } from "elysia";
import { Prisma } from "@prisma/client";

import db from "../../db/instance";
import { AssignedAchievementType } from "../../models/Achievement";
import { ProfileSchema, ProfileType } from "../../models/Profile";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import { successResponse } from "../../utils/responseBuilder";
import { getNextRank, getRankByPoint } from "../../utils/constants/ranks";

export const getMyProfile = async (userId: string) => {
    try {
        const profile = await db.$queryRaw<ProfileType[]>`
            SELECT u.id, u.raw_user_meta_data, p.is_admin, u.last_sign_in_at, SUM(f.point)::int4 as total_points 
            FROM auth.users as u 
                FULL OUTER JOIN profiles AS p ON u.id = p.user_id 
                FULL OUTER JOIN (
                    SELECT user_id, point FROM waste_collects WHERE user_id=${userId}::uuid AND status='ACCEPTED'
                    UNION ALL
                    SELECT user_id, point FROM waste_reports WHERE user_id=${userId}::uuid AND status='ACCEPTED'
                    UNION ALL
                    SELECT user_id, point FROM quiz_logs WHERE user_id=${userId}::uuid
                    UNION ALL
                    SELECT user_id, point FROM quests_logs WHERE user_id=${userId}::uuid
                    UNION ALL 
                    SELECT user_id, point FROM waste_containers WHERE user_id=${userId}::uuid AND status='ACCEPTED'
                ) f on u.id = f.user_id
            WHERE u.id = ${userId}::uuid 
            GROUP BY 
                u.id,
                p.user_id
            LIMIT 1
        `;

        const rank = getRankByPoint(profile[0].total_points);
        const nextRank = getNextRank(rank);
        const nextPoint = nextRank.sum_point - profile[0].total_points;
        console.log(nextPoint);

        // Return JSON when success
        return successResponse<ProfileType>(
            {
                message: "Your profile is ready",
                data: [{ ...profile[0], rank: rank?.title ?? 'Environmental Noobie', next_rank: nextRank?.title, next_point: nextPoint < 0 ? 0 : nextPoint }]
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
export const getLeaderboard = async (userId: string, options?: { limit?: number }) => {
    try {
        const limit = options?.limit ?? 10;

        const leaderboard = await db.$queryRaw<Partial<Static<typeof ProfileSchema>>[]>`
            with users_with_point as ( 
                SELECT u.id, u.raw_user_meta_data -> 'name' as name, u.raw_user_meta_data -> 'avatar_url' as img, SUM(f.point)::int4 AS total_point
                            FROM auth.users AS u 
                            INNER JOIN (
                                SELECT user_id, point FROM waste_collects WHERE status='ACCEPTED'
                                UNION ALL
                                SELECT user_id, point FROM waste_reports WHERE status='ACCEPTED'
                                UNION ALL
                                SELECT user_id, point FROM quiz_logs
                                UNION ALL
                                SELECT user_id, point FROM quests_logs
                                UNION ALL 
                                SELECT user_id, point FROM waste_containers WHERE status='ACCEPTED'
                            ) as f on u.id = f.user_id
                        GROUP BY
                            u.id
                        ORDER BY total_point DESC
                ),
            top_users as (select * from users_with_point limit ${limit}),
            me as (select * from users_with_point where id=${userId}::uuid),
            result as (select * from top_users union all select * from me WHERE me.id NOT IN (SELECT id FROM top_users))

            select * from result
            order by total_point desc;
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
        const achievements = await db.$queryRaw<AssignedAchievementType[]>`
            SELECT a.id, a.name, a.description, a.img, aa.created_at
            FROM assigned_achievements as aa 
                INNER JOIN auth.users AS u ON aa.user_id = u.id 
                INNER JOIN achievements AS a ON aa.achievement_id = a.id 
                WHERE u.id = ${userId}::uuid
            ORDER BY aa.created_at desc
            ;
        `;

        if (achievements.length == 0) {
            return successResponse<AssignedAchievementType>(
                {
                    message: "No achievement(s) are collected",
                    data: achievements
                }
            )
        }

        // Return JSON when success
        return successResponse<AssignedAchievementType>(
            {
                message: "Your achievement is ready",
                data: achievements
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