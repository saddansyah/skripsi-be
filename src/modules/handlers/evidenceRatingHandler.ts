import { Prisma } from "@prisma/client";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import db from "../../db/instance";
import { successResponse } from "../../utils/responseBuilder";
import { EvidenceRatingCountType, EvidenceRatingType } from "../../models/EvidenceRating";
import { RATING_POINT } from "../../utils/constants/point";
import * as achievement from '../../utils/achievement';

export const getContainerRating = async (containerId: number, userId: string) => {
    try {
        const ratings = await db.$queryRaw<EvidenceRatingCountType[]>`
            SELECT er.* FROM evidence_ratings AS er
            WHERE er.container_id=${containerId} AND er.user_id=${userId}::uuid
            LIMIT 1;
        `

        if (ratings.length == 0) {
            return successResponse<EvidenceRatingCountType>(
                {
                    message: "Rating is empty",
                    data: ratings
                }
            )
        }

        // Return JSON when success
        return successResponse<EvidenceRatingCountType>(
            {
                message: "Rating is ready",
                data: ratings
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

export const addContainerRating = async (userId: string, payload: Omit<EvidenceRatingType, 'point' | 'created_at' | 'user_id'>) => {
    try {
        const rating = await db.$queryRaw<EvidenceRatingType[]>`
            INSERT INTO evidence_ratings
            VALUES(
                ${payload.value},
                ${payload.is_anonim},
                ${RATING_POINT},
                ${payload.info},
                DEFAULT,
                ${userId}::uuid,
                ${payload.container_id}
            )
            RETURNING *;
        `;

        // Achievement Evaluator -> New Explorer (id: 3)
        achievement.evaluate(userId, 3);

        // Return JSON when success
        return successResponse<EvidenceRatingType>(
            {
                message: `Rating is successfully created. You got ${RATING_POINT} point`,
                data: rating
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

export const deleteContainerRating = async (containerId: number, userId: string) => {
    try {

        await db.$queryRaw<EvidenceRatingType[]>`
            DELETE FROM evidence_ratings
            WHERE user_id=${userId}::uuid AND container_id=${containerId};
        `;

        // Return JSON when success
        return successResponse<EvidenceRatingType>(
            {
                message: "Container is deleted",
                data: []
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