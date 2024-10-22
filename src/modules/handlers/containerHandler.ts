import db from '../../db/instance';
import { WasteContainerInMapType, WasteContainerPayloadSchema, WasteContainerType } from '../../models/WasteContainer';
import { Status } from '../../utils/constants/enums';
import { successResponse } from '../../utils/responseBuilder';
import { ErrorWithStatus } from '../../utils/exceptionBuilder';
import { Prisma } from '@prisma/client';
import { Static } from 'elysia';
import { CONTAINER_POINT } from '../../utils/constants/point';
import * as achievement from '../../utils/achievement';

export const getPublicContainers = async () => {
    try {
        // Database query
        const containers = await db.$queryRaw<WasteContainerType[]>`
        SELECT cn.id, cn.name, cn.lat, cn.long, CASE WHEN AVG(er.value)::float >= 0 THEN AVG(er.value)::float ELSE 0::float END AS rating, COUNT(er.value)::int as rating_count
        FROM waste_containers as cn 
        LEFT JOIN evidence_ratings as er ON er.container_id = cn.id
        WHERE 
            cn.status='ACCEPTED'
        GROUP BY cn.id
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

export const getContainers = async (
    options?: {
        search?: string,
        page?: number,
        limit?: number,
        status?: string,
        sortBy?: string,
        order?: string
        type?: string,
        cluster_id?: number
    }) => {
    try {
        const limit = options?.limit ?? 50;
        const offset = ((options?.page ?? 1) - 1) * (limit);

        // Database querys
        const containers = await db.$queryRaw<WasteContainerType[]>`
            SELECT cn.id, cn.name, cn.type, CASE WHEN AVG(er.value)::float >= 0 THEN AVG(er.value)::float ELSE 0::float END AS rating, COUNT(er.value)::int as rating_count, cn.lat, cn.long, cn.point, cn.status, cn.user_id, cl.id as cluster_id, cl.name as cluster_name FROM waste_containers as cn
            LEFT JOIN evidence_ratings AS er ON er.container_id = cn.id
            INNER JOIN waste_clusters as cl ON cn.cluster_id = cl.id
                ${options?.search ? Prisma.sql` WHERE cn."name"::text LIKE ${`%${options?.search || ''}%`} ` : Prisma.empty} 
                ${options?.status ? Prisma.sql` AND "status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
                ${options?.type ? Prisma.sql` AND "type"::text=${options?.type.toUpperCase()} ` : Prisma.empty} 
                ${options?.cluster_id ? Prisma.sql` AND "cluster_id"::int4=${options?.cluster_id} ` : Prisma.empty} 
            GROUP BY cn.id, cl.id
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

export const getPublicContainerById = async (id: number) => {
    try {
        // Database query
        const container = await db.$queryRaw<WasteContainerType[]>`
        SELECT cn.id, cn.name, cn.lat, cn.long, CASE WHEN AVG(er.value)::float >= 0 THEN AVG(er.value)::float ELSE 0::float END AS rating, COUNT(er.value)::int as rating_count FROM waste_containers as cn 
        LEFT JOIN evidence_ratings AS er ON er.container_id=cn.id
        WHERE 
            cn.id=${id} AND 
            cn.status='ACCEPTED'
        GROUP BY cn.id 
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


export const getContainerById = async (id: number, options?: { status: string }) => {
    try {
        // Database query
        const container = await db.$queryRaw<WasteContainerType[]>`
        SELECT 
            cn.id,
            cn.name,
            cn.type,
            CASE WHEN AVG(er.value)::float >= 0 THEN AVG(er.value)::float ELSE 0::float END AS rating,
            COUNT(er.value)::int as rating_count, 
            cn.max_kg,
            cn.max_vol,
            cn.lat,
            cn.long,
            cn.status,
            cn.point,
            cn.created_at,
            cn.updated_at,
            cn.cluster_id,
            cn.user_id, 
            cl.name as cluster_name 
        FROM waste_containers as cn
        LEFT JOIN evidence_ratings AS er ON er.container_id = cn.id 
        INNER JOIN waste_clusters as cl ON cn.cluster_id = cl.id 
        WHERE 
            cn.id=${id}
            ${options?.status ? Prisma.sql` AND "cn.status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
        GROUP BY cn.id, cl.id
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

export const getNearestContainer = async (lat: number, long: number, limit?: number) => {
    try {
        // Database query
        const container = await db.$queryRaw<WasteContainerInMapType[]>`
            SELECT 
            cn.id, 
            cn.name, 
            CASE WHEN AVG(er.value)::float >= 0 THEN AVG(er.value)::float ELSE 0::float END AS rating, 
            COUNT(er.value)::int as rating_count, 
            acos(sin(radians(cn.lat))*sin(radians(${lat}))+cos(radians(cn.lat))*cos(radians(${lat}))*cos(radians(${long})-radians(cn.long)))*6371 as distance, 
            cn.lat,
            cn.long 
            FROM waste_containers AS cn
            LEFT JOIN evidence_ratings AS er ON er.container_id = cn.id
            WHERE cn.status='ACCEPTED' 
            GROUP BY cn.id 
            ORDER BY distance ASC
            LIMIT ${limit ?? 1};
        `;

        // Messages is empty when empty
        if (container.length == 0) {
            throw new ErrorWithStatus('Container is not found', 404);
        }

        // Return JSON when success
        return successResponse<WasteContainerInMapType>(
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


export const addContainer = async (userId: string, payload: Static<typeof WasteContainerPayloadSchema>) => {

    try {
        // Exclude status -> status can be only altered via update, default value is PENDING
        const container = await db.$queryRaw<WasteContainerType[]>`
            INSERT INTO waste_containers 
            VALUES(
                DEFAULT, 
                ${payload.name}, 
                ${payload.type}::"ContainerType",
                0, -- Overidden by collect aggregation
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

        // Achievement Evaluator -> Container Warrior (id: 2)
        achievement.evaluate(userId, 2);

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
export const updateContainer = async (id: number, payload: Partial<Static<typeof WasteContainerPayloadSchema>>) => {
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
                rating=${existingContainer.rating}, 
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


