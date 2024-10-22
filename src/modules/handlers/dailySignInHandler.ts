import { Prisma } from "@prisma/client";
import db from "../../db/instance";
import { DailySignInLogType, DailySignInStatusType } from "../../models/DailySignInLog";
import { successResponse } from "../../utils/responseBuilder";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import { STREAK_POINT } from "../../utils/constants/point";
import { StreakType } from "../../models/Streak";

export const claimDailySignIn = async (userId: string) => {
    try {
        const signInLog = await db.$queryRaw<DailySignInLogType[]>`
            INSERT INTO daily_sign_in_logs
            VALUES(
                DEFAULT,
                now(),
                ${userId}::uuid
            )
            RETURNING *
        `;

        return successResponse<DailySignInLogType>(
            {
                message: `Your daily sign in successfully claimed`,
                data: signInLog
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

export const claimDailySignInStreak = async (userId: string) => {
    try {
        const streak = await db.$queryRaw<StreakType[]>`
            INSERT INTO streaks
            VALUES(
                DEFAULT,
                ${STREAK_POINT},
                now(),
                ${userId}
            )
            RETURNING *
        `;

        return successResponse<StreakType>(
            {
                message: `Your streak in successfully claimed`,
                data: streak
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

export const checkDailySignInStreak = async (userId: string) => {
    try {
        const streak = await db.$queryRaw<StreakType[]>`
            with last_week_logs as (
            select * from daily_sign_in_logs
                where
                    user_id=${userId}::uuid and
                    created_at > now() - INTERVAL '8 day'
                ),
            streak as (
                select count(*)::int4 as weekly_streak_count, 7 - count(*)::int4 weekly_streak_remaining from last_week_logs 
            )

            select * from streak;
        `


        return successResponse<StreakType>(
            {
                message: "Your streak is ready",
                data: streak
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

export const checkDailySignInStatus = async (userId: string) => {
    try {
        const signInStatus = await db.$queryRaw<DailySignInStatusType[]>`
            with latest_sign_in_log as (
                select created_at from daily_sign_in_logs 
                where user_id=${userId}::uuid
                order by created_at desc 
                limit 1
            ),
            result as (
                select l.created_at, l.created_at + INTERVAL '1 day' AS next_date from latest_sign_in_log as l
            )
            select * from result;
        `

        if (signInStatus.length == 0) {
            return successResponse<DailySignInStatusType>(
                {
                    message: "Your log status is just created",
                    data: [{ created_at: new Date(), next_date: new Date() }]
                }
            )
        }

        return successResponse<DailySignInStatusType>(
            {
                message: "Your sign in staus is ready",
                data: signInStatus
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