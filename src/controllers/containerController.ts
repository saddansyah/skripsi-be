import db from '../db/instance';
import { WasteContainerType } from '../types/WasteContainer';
import { successResponse } from '../utils/responseBuilder';
import { ErrorWithStatus } from '../utils/exceptionBuilder';
import { Prisma } from '@prisma/client';

export const getContainers = async (
    options?: {
        limit?: number,
        status: string,
        sortBy?: string,
        order?: string
        type?: string,
        cluster_id?: string
    }) => {
    try {
        // Database querys
        const containers = await db.$queryRaw`
        SELECT * FROM waste_containers 
        WHERE 
        status${Prisma.sql([options?.status == 'all' ? "!='REJECTED'" : "='ACCEPTED'"])} AND (
        ${Prisma.sql([options?.type ? 'type =' : 'name !='])} ${Prisma.sql([`'${options?.type?.toUpperCase()}'` ?? `''`])} AND
        ${Prisma.sql([options?.cluster_id ? 'cluster_id =' : 'name !='])} ${Prisma.sql([`'${options?.cluster_id}'` ?? `''`])})
        ORDER BY ${Prisma.sql([options?.sortBy ?? 'name'])} ${Prisma.sql([options?.order ?? 'asc'])} 
        LIMIT ${options?.limit};
        ` as WasteContainerType[];

        // Messages is empty when empty
        if (containers.length == 0) {
            return successResponse<WasteContainerType>(
                {
                    message: "Container is empty",
                    data: containers
                }
            )
        }

        // Return JSON when success
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
                throw new ErrorWithStatus(e.message, 500);
            default:
                throw new ErrorWithStatus(e.message, 500);
        }
    }
}

export const getContainerById = async (id: number, options?: { status: string }) => {
    try {
        // Database query
        const container = await db.$queryRaw`
        SELECT * FROM waste_containers
        WHERE status${Prisma.sql([options?.status == 'all' ? "!='REJECTED'" : "='ACCEPTED'"])} AND id=${id};
        ` as WasteContainerType[];

        // Messages is empty when empty
        if (!container) {
            return successResponse<WasteContainerType>(
                {
                    message: "Container is empty",
                    data: container
                }
            )
        }

        // Return JSON when success
        return successResponse<WasteContainerType>(
            {
                message: "Container is ready",
                data: container
            }
        )
    }
    catch (e: any) {
        switch (e.constructor) {
            case Prisma.PrismaClientKnownRequestError:
                throw new ErrorWithStatus(e.message, 500);
            default:
                throw new ErrorWithStatus(e.message, 500);
        }
    }
}


export const addContainer = async (payload: Omit<WasteContainerType, 'id' | 'status'>) => {

    try {

        // Exclude status -> status can be only altered via update, default value is PENDING
        const container = await db.$queryRaw`
            INSERT INTO waste_containers 
            VALUES(DEFAULT, 
            ${payload.name}, 
            ${payload.rating}, 
            ${payload.max_kg}, 
            ${payload.max_vol}, 
            ${payload.lat}, 
            ${payload.long}, 
            now(), 
            now(), 
            ${payload.cluster_id}, 
            ${Prisma.sql([`'${payload.type}'`])})
            RETURNING *;

        ` as WasteContainerType[];

        // Return JSON when success
        return successResponse<WasteContainerType>(
            {
                message: `Container ${payload.name} successfully created`,
                data: container
            }
        )
    }
    catch (e: any) {
        switch (e.constructor) {
            case Prisma.PrismaClientKnownRequestError:
                throw new ErrorWithStatus(e.message, 500);
            default:
                throw new ErrorWithStatus(e.message, 500);
        }
    }
}

// Payload set to any to accomate dynamic property changes
export const updateContainer = async (id: number, payload: any) => {
    // Override validation error
    if (Object.keys(payload).length == 0) {
        throw new ErrorWithStatus('Body must be not empty', 400, 'Validation Error');
    }

    try {
        // Method -> find one based on id then update it
        const existingContainer = ((await db.$queryRaw`SELECT * FROM waste_containers WHERE id=${id} LIMIT 1`) as WasteContainerType[])[0];

        const container = await db.$queryRaw`
            UPDATE waste_containers 
            SET name=${payload.name ?? existingContainer.name}, 
            rating=${payload.rating ?? existingContainer.rating}, 
            max_kg=${payload.max_kg ?? existingContainer.max_kg}, 
            max_vol=${payload.max_vol ?? existingContainer.max_vol}, 
            lat=${payload.lat ?? existingContainer.lat}, 
            long=${payload.long ?? existingContainer.long},
            cluster_id=${payload.cluster_id ?? existingContainer.cluster_id}, 
            type=${Prisma.sql([`'${payload.type ?? existingContainer.type}'`])}
            WHERE id=${id}
            RETURNING *;
        ` as WasteContainerType[];

        // Return JSON when success
        return successResponse<WasteContainerType>(
            {
                message: `Container ${existingContainer.name} successfully updated`,
                data: container
            }
        )

    }
    catch (e: any) {
        switch (e.constructor) {
            case Prisma.PrismaClientKnownRequestError:
                throw new ErrorWithStatus(e.message, 500);
            default:
                throw new ErrorWithStatus(e.message, 500);
        }
    }

}

export const deleteContainer = async (id: number) => {
    try {

        await db.$queryRaw`
            DELETE FROM waste_containers
            WHERE id=${id};
        `;

        // Return JSON when success
        return successResponse<WasteContainerType>(
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
                throw new ErrorWithStatus(e.message, 500);
        }
    }
}


