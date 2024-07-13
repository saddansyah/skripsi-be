import { Prisma } from "@prisma/client";
import { Static, t } from 'elysia'
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import db from "../../db/instance";
import { WasteCollectPayloadModel, WasteCollectType } from "../../models/WasteCollect";
import { successResponse } from "../../utils/responseBuilder";
import { Status } from "../../utils/constants/status";

export const getMyWasteCollects = async (
    userId: string,
    options?: {
        page?: number,
        limit?: number,
        status?: string,
        sortBy?: string,
        order?: string,
        type?: string,
        container_id?: number
    }) => {

    try {
        const limit = options?.limit ?? 10;
        const offset = ((options?.page ?? 1) - 1) * (limit);

        const collects = await db.$queryRaw<WasteCollectType[]>`
            SELECT co.id, co.type, co.status, co.point, co.created_at, cn.name as container FROM waste_collects AS co
            INNER JOIN waste_containers AS cn ON co.container_id = cn.id
            WHERE
                user_id=${userId}::uuid
                ${options?.status ? Prisma.sql` AND "status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
                ${options?.type ? Prisma.sql` AND "type"::text=${options?.type.toUpperCase()} ` : Prisma.empty}
                ${options?.container_id ? Prisma.sql` AND "container_id"::int4=${options?.container_id} ` : Prisma.empty}
            ORDER BY ${Prisma.sql([options?.sortBy ?? 'id'])} ${Prisma.sql([options?.order ?? 'asc'])} 
            LIMIT ${limit} OFFSET ${offset};
            `;

        if (collects.length == 0) {
            return successResponse<WasteCollectType>(
                {
                    message: "Your waste collects is empty",
                    data: collects
                }
            )
        }

        // Return JSON when success
        return successResponse<WasteCollectType>(
            {
                message: "Your waste collects is ready",
                data: collects
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

export const getMyWasteCollectById = async (
    userId: string,
    id: number,
    options?: {
        status?: string
    }) => {

    try {
        const collect = await db.$queryRaw<WasteCollectType[]>`
        SELECT * FROM waste_collects
        WHERE 
            user_id=${userId}::uuid 
            AND id=${id}
            ${options?.status ? Prisma.sql` AND "status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
        LIMIT 1;
        `;

        if (collect.length == 0) {
            return successResponse<WasteCollectType>(
                {
                    message: "Your waste collect is empty",
                    data: collect
                }
            )
        }

        // Return JSON when success
        return successResponse<WasteCollectType>(
            {
                message: "Your waste collect is ready",
                data: collect
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

// Set default point to 5
export const addMyWasteCollect = async (userId: string, point: number, payload: Omit<WasteCollectType, 'id' | 'status' | 'created_at' | 'updated_at' | 'user_id' | 'point'>) => {

    try {
        const collect = await db.$queryRaw<WasteCollectType[]>`
            INSERT INTO waste_collects
            VALUES(
                DEFAULT,
                ${payload.kg},
                ${payload.vol},
                ${payload.type}::"WasteType",
                ${payload.img},
                ${point},
                ${payload?.info ?? '-'},
                ${payload.is_anonim},
                DEFAULT,
                now(),
                now(),
                ${payload.container_id},
                ${userId}::uuid
            )
            RETURNING *;
        `;

        return successResponse<WasteCollectType>(
            {
                message: `New collect successfully created`,
                data: collect
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

export const updateMyWasteCollect = async (userId: string, id: number, payload: Partial<Static<typeof WasteCollectPayloadModel>>) => {
    try {
        const existingCollect = (await db.$queryRaw<WasteCollectType[]>`SELECT * FROM waste_collects WHERE id=${id} LIMIT 1`)[0];

        const collect = await db.$queryRaw<WasteCollectType[]>`
            UPDATE waste_collects
            SET 
                kg=${payload.kg ?? existingCollect.kg}, 
                vol=${payload.vol ?? existingCollect.vol}, 
                type=${payload.type ?? existingCollect.type}::"WasteType",
                img=${payload.img ?? existingCollect.img}, 
                info=${payload.info ?? existingCollect.info}, 
                is_anonim=${payload.is_anonim ?? existingCollect.is_anonim}, 
                container_id=${payload.container_id ?? existingCollect.container_id}
            WHERE 
                id=${id} 
                AND user_id=${userId}::uuid
            RETURNING *;
        `

        return successResponse<WasteCollectType>(
            {
                message: `Collect with id ${existingCollect.id} is successfully updated`,
                data: collect
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

export const deleteMyWasteCollect = async (userId: string, id: number) => {
    try {
        const collect = await db.$queryRaw<WasteCollectType[]>`
            DELETE FROM waste_collects
            WHERE 
                id=${id} 
                AND user_id=${userId}::uuid
            RETURNING *;
        `;

        if (collect.length == 0)
            throw new ErrorWithStatus(`Collect with id ${collect[0].id} is already deleted`, 404, 'Not Found');

        // Return JSON when success
        return successResponse<WasteCollectType>(
            {
                message: `Collect with id ${id} is deleted`,
                data: collect
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

// Admin Controllers

export const getWasteCollects = async (
    options?: {
        page?: number,
        limit?: number,
        status?: string,
        sortBy?: string,
        order?: string,
        type?: string,
        container_id?: number
    }) => {

    try {
        const limit = options?.limit ?? 10;
        const offset = ((options?.page ?? 1) - 1) * (limit);

        const collects = await db.$queryRaw<WasteCollectType[]>`
            SELECT co.id, co.type, co.status, co.point, co.created_at, cn.name as container, co.is_anonim,
                (CASE WHEN co.is_anonim = true THEN 'Anonim' ELSE u.email END) AS reporter_email 
            FROM waste_collects AS co 
            INNER JOIN waste_containers AS cn ON co.container_id = cn.id 
            INNER JOIN auth.users AS u ON co.user_id = u.id 
            ${options?.status ? Prisma.sql` "WHERE status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
            ${options?.type ? Prisma.sql` AND "type"::text=${options?.type.toUpperCase()} ` : Prisma.empty}
            ${options?.container_id ? Prisma.sql` AND "container_id"::int4=${options?.container_id} ` : Prisma.empty}
            ORDER BY ${Prisma.sql([options?.sortBy ?? 'id'])} ${Prisma.sql([options?.order ?? 'asc'])} 
            LIMIT ${limit} OFFSET ${offset};
            `;

        if (collects.length == 0) {
            return successResponse<WasteCollectType>(
                {
                    message: "Waste collects is empty",
                    data: collects
                }
            )
        }

        // Return JSON when success
        return successResponse<WasteCollectType>(
            {
                message: "Waste collects is ready",
                data: collects
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

export const getWasteCollectById = async (
    id: number,
    options?: {
        status?: string
    }) => {

    try {
        const collect = await db.$queryRaw<WasteCollectType[]>`
        SELECT * FROM waste_collects
        WHERE 
            id=${id} 
            ${options?.status ? Prisma.sql` AND "status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
        LIMIT 1;
        `;

        if (collect.length == 0) {
            return successResponse<WasteCollectType>(
                {
                    message: "Waste collect is empty",
                    data: collect
                }
            )
        }

        // Return JSON when success
        return successResponse<WasteCollectType>(
            {
                message: "Waste collect is ready",
                data: collect
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


export const updateWasteCollectStatus = async (id: number, payload: { status: Status }) => {
    try {
        const collect = await db.$queryRaw<WasteCollectType[]>`
        UPDATE waste_collects 
        SET 
            status=${payload.status}::"Status", 
            updated_at=now() 
        WHERE id=${id} 
        RETURNING *;
        `;

        return successResponse<WasteCollectType>(
            {
                message: `Collect with id ${id} successfully updated`,
                data: collect
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

export const deleteWasteCollect = async (id: number) => {
    try {
        const collect = await db.$queryRaw<WasteCollectType[]>`
            DELETE FROM waste_collects
            WHERE 
                id=${id}
            RETURNING *;
        `;

        if (collect.length == 0)
            throw new ErrorWithStatus(`Collect with id ${id} is already empty`, 404, 'Not Found');

        // Return JSON when success
        return successResponse<WasteCollectType>(
            {
                message: `Collect with id ${id} is deleted`,
                data: collect
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

