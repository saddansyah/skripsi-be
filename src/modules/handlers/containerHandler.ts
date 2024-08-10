import db from '../../db/instance';
import { WasteContainerPayloadModel, WasteContainerType } from '../../models/WasteContainer';
import { Status } from '../../utils/constants/enums';
import { successResponse } from '../../utils/responseBuilder';
import { ErrorWithStatus } from '../../utils/exceptionBuilder';
import { Prisma } from '@prisma/client';
import { Static } from 'elysia';
import { CONTAINER_POINT } from '../../utils/constants/point';

export const getContainers = async (
    options?: {
        page?: number,
        limit?: number,
        status?: string,
        sortBy?: string,
        order?: string
        type?: string,
        cluster_id?: number
    }) => {
    try {
        const limit = options?.limit ?? 10;
        const offset = ((options?.page ?? 1) - 1) * (limit);

        // Database querys
        const containers = await db.$queryRaw<WasteContainerType[]>`
            SELECT cn.id, cn.name, cn.type, cn.rating, cn.status, cl.id as cluster_id, cl.name as cluster_name FROM waste_containers as cn
            INNER JOIN waste_clusters as cl ON cn.cluster_id = cl.id
                ${options?.status ? Prisma.sql` WHERE "status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
                ${options?.type ? Prisma.sql` AND "type"::text=${options?.type.toUpperCase()} ` : Prisma.empty} 
                ${options?.cluster_id ? Prisma.sql` AND "cluster_id"::int4=${options?.cluster_id} ` : Prisma.empty} 
            ORDER BY ${Prisma.sql([options?.sortBy ? `cn.${options?.sortBy}` : `cn.name`])} ${Prisma.sql([options?.order ?? 'asc'])} 
            LIMIT ${limit} OFFSET ${offset};
        `;

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
                throw new ErrorWithStatus(e.message, e.status, e.name);
        }
    }
}

export const getContainerById = async (id: number, options?: { status: string }) => {
    try {
        // Database query
        const container = await db.$queryRaw<WasteContainerType[]>`
        SELECT * FROM waste_containers
        WHERE 
            id=${id}
            ${options?.status ? Prisma.sql` AND "status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
        LIMIT 1;
        `;

        // Messages is empty when empty
        if (container.length == 0) {
            throw new ErrorWithStatus('Container is not found', 404);
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
                throw new ErrorWithStatus(e.message, e.status, e.name);
        }
    }
}


export const addContainer = async (userId: string, payload: Static<typeof WasteContainerPayloadModel>) => {

    try {
        // Exclude status -> status can be only altered via update, default value is PENDING
        const [container, _] = await db.$transaction([
            db.$queryRaw<WasteContainerType[]>`
                INSERT INTO waste_containers 
                VALUES(
                    DEFAULT, 
                    ${payload.name}, 
                    ${payload.type}::"ContainerType",
                    ${payload.rating}, 
                    ${payload.max_kg}, 
                    ${payload.max_vol}, 
                    ${payload.lat}, 
                    ${payload.long},
                    DEFAULT,
                    ${CONTAINER_POINT},
                    now(), 
                    now(), 
                    ${payload.cluster_id},
                    ${userId}::uuid
                )
                RETURNING *;
            `
            ,
            db.$queryRaw`
                UPDATE profiles 
                SET additional_point=additional_point+${CONTAINER_POINT} 
                WHERE user_id=${userId}::uuid;
            `
        ])

        // TODO(Event) -> send to point notification to user

        // Return JSON when success
        return successResponse<WasteContainerType>(
            {
                message: `Container ${payload.name} successfully created. You got ${CONTAINER_POINT} point`,
                data: container
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

// Payload set to any to accomate dynamic property changes
export const updateContainer = async (id: number, payload: Partial<Static<typeof WasteContainerPayloadModel>>) => {
    // Override validation error
    if (Object.keys(payload).length == 0) {
        throw new ErrorWithStatus('Body must be not empty', 400, 'Validation Error');
    }

    try {
        // Method -> find one based on id then update it
        const existingContainer = (await db.$queryRaw<WasteContainerType[]>`SELECT * FROM waste_containers WHERE id=${id} LIMIT 1`)[0];

        const container = await db.$queryRaw<WasteContainerType[]>`
            UPDATE waste_containers 
            SET 
                name=${payload.name ?? existingContainer.name}, 
                rating=${payload.rating ?? existingContainer.rating}, 
                max_kg=${payload.max_kg ?? existingContainer.max_kg}, 
                max_vol=${payload.max_vol ?? existingContainer.max_vol}, 
                lat=${payload.lat ?? existingContainer.lat}, 
                long=${payload.long ?? existingContainer.long},
                updated_at=now(),
                cluster_id=${payload.cluster_id ?? existingContainer.cluster_id}, 
                type=${payload.type ?? existingContainer.type}::"ContainerType"
            WHERE id=${id}
            RETURNING *;
        `;

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
                throw new ErrorWithStatus(e.message, e.status, e.name);
        }
    }
}

export const deleteContainer = async (id: number) => {
    try {

        await db.$queryRaw<WasteContainerType[]>`
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
                throw new ErrorWithStatus(e.message, e.status, e.name);
        }
    }
}

export const updateContainerStatus = async (userId: string, id: number, status: Status) => {
    try {
        // Method -> find one based on id then update it

        const container = await db.$queryRaw<WasteContainerType[]>`
            UPDATE waste_containers 
            SET 
                status=${status}::"Status", 
                updated_at=now() 
            WHERE id=${id}
            RETURNING *;
        `;

        // TODO(Event) -> send to point notification to user

        if (container[0].status === `ACCEPTED`) {
            await db.$queryRaw`
                UPDATE profiles 
                SET additional_point=additional_point+${container[0].point}
                WHERE user_id=${userId}::uuid;
            `
        }

        // Return JSON when success
        return successResponse<WasteContainerType>(
            {
                message: `Container with id ${id} updated to ${status}`,
                data: container
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


