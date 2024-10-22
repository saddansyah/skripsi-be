import { Prisma } from "@prisma/client";
import { AchievementType } from "../../models/Achievement";
import { successResponse } from "../../utils/responseBuilder";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import db from "../../db/instance";

export const getAchievements = async (
    options?: {
        page?: number,
        limit?: number,
        sortBy?: string,
        order?: string,
    }) => {

    try {
        const limit = options?.limit ?? 10;
        const offset = ((options?.page ?? 1) - 1) * (limit);

        const achievements = await db.$queryRaw<AchievementType[]>`
            SELECT * FROM achievements 
            ORDER BY ${Prisma.sql([options?.sortBy ?? 'id'])} ${Prisma.sql([options?.order ?? 'asc'])} 
            LIMIT ${limit} OFFSET ${offset}; 
        `

        if (achievements.length == 0) {
            return successResponse<AchievementType>(
                {
                    message: "Achievements is empty",
                    data: achievements
                }
            )
        }

        // Return JSON when success
        return successResponse<AchievementType>(
            {
                message: "Achievements is ready",
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

export const getAchievementById = async (id: number) => {
    try {

        const achievement = await db.$queryRaw<AchievementType[]>`
            SELECT * FROM achievements
            WHERE id=${id}
            LIMIT 1;
        `

        if (achievement.length == 0) {
            throw new ErrorWithStatus('Achievement is not found', 404);
        }

        // Return JSON when success
        return successResponse<AchievementType>(
            {
                message: `Achievement with ${id} is ready`,
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