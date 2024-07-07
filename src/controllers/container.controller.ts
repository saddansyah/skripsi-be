import db from '../db/instance';
import { WasteContainerType } from '../types/WasteContainer';
import { successResponse } from '../libs/responseBuilder';
import { ErrorWithStatus } from '../libs/exceptionBuilder';
import { Prisma } from '@prisma/client';

export const getContainers = async (options?: { limit?: number }) => {
    try {
        const containers = await db.$queryRaw`SELECT * FROM waste_containers LIMIT ${options?.limit ?? 10}` as WasteContainerType[];

        return successResponse<WasteContainerType>(
            {
                message: "Container is ready",
                data: containers
            }
        )
    }
    catch (e: any) {
        switch (e.constructor) {
            case Prisma.PrismaClientKnownRequestError:
                throw new ErrorWithStatus("Error when querying databases", 500);
            default:
                throw new ErrorWithStatus("Something error is happened", 500);
        }
    }

}
