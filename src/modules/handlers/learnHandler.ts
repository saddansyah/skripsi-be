import { Prisma } from "@prisma/client";
import { LearnType } from "../../models/Learn";
import { successResponse } from "../../utils/responseBuilder";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import db from "../../db/instance";

export const getLearns = async (
    options?: {
        search?: string,
        page?: number,
        limit?: number
        sortBy?: string,
        order?: string,
        category?: string
    }) => {

    try {
        const limit = options?.limit ?? 10;
        const offset = ((options?.page ?? 1) - 1) * (limit);

        const learns = await db.$queryRaw<LearnType[]>`
            SELECT * FROM learns 
            WHERE "title"::text LIKE ${`%${options?.search || ''}%`} 
            ${options?.category ? Prisma.sql` AND "category"::text=${options?.category} ` : Prisma.empty}
            ORDER BY ${Prisma.sql([options?.sortBy ?? 'created_at'])} ${Prisma.sql([options?.order ?? 'desc'])} 
            LIMIT ${limit} OFFSET ${offset};
        `;

        if (learns.length == 0) {
            return successResponse<LearnType>(
                {
                    message: "Learns is empty",
                    data: learns
                }
            )
        }

        // Return JSON when success
        return successResponse<LearnType>(
            {
                message: "Learns is ready",
                data: learns
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

export const getLearnById = async (id: number) => {
    try {

        const learns = await db.$queryRaw<LearnType[]>`
            SELECT * FROM learns
            WHERE id=${id}
            LIMIT 1;
        `;

        if (learns.length == 0) {
            throw new ErrorWithStatus('Learn is not found', 404);
        }

        // Return JSON when success
        return successResponse<LearnType>(
            {
                message: "Learns is ready",
                data: learns
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