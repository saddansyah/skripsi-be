import { Prisma } from "@prisma/client";
import { Static, t } from 'elysia'
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import db from "../../db/instance";
import { WasteCollectPayloadSchema, WasteCollectSummaryType, WasteCollectType } from "../../models/WasteCollect";
import { successResponse } from "../../utils/responseBuilder";
import { Status, WasteType } from "../../utils/constants/enums";

export const getMyCollectSummary = async (userId: string) => {
    try {
        const [count, type] = await db.$transaction([
            db.$queryRaw<Pick<WasteCollectSummaryType, 'daily_collect_count'>[]>`
                SELECT COUNT(*) as daily_collect_count FROM waste_collects AS co 
                WHERE 
                    user_id=${userId}::uuid  
                    AND co.created_at >= now() - INTERVAL '1 day'
                GROUP BY co.user_id;
            `,
            db.$queryRaw<Pick<WasteCollectSummaryType, 'most_collect_type'>[]>`
                SELECT co.type as most_collect_type, COUNT(co.type) AS amount FROM waste_collects as co 
                WHERE user_id=${userId}::uuid
                GROUP BY co.type
                ORDER BY amount DESC
                LIMIT 1;
            `
        ]);


        // Return JSON when success
        return successResponse<WasteCollectSummaryType>(
            {
                message: "Your waste collects is ready",
                data: [{
                    daily_collect_count: count.length == 0 ? 0 : Number((count[0].daily_collect_count as BigInt).toString()),
                    most_collect_type: type.length == 0 ? null : type[0].most_collect_type,
                }]
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

export const getMyWasteCollects = async (
    userId: string,
    options?: {
        search?: string,
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
            SELECT co.id, co.type, co.status, co.img, co.point, co.created_at, cn.id as container_id, cn.name as container_name FROM waste_collects AS co
            INNER JOIN waste_containers AS cn ON co.container_id = cn.id
            WHERE
                co.user_id=${userId}::uuid
                ${options?.search ? Prisma.sql` AND co."id"::text LIKE ${`%${options?.search || ''}%`} ` : Prisma.empty} 
                ${options?.status ? Prisma.sql` AND co."status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
                ${options?.type ? Prisma.sql` AND co."type"::text=${options?.type.toUpperCase()} ` : Prisma.empty}
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
        SELECT co.*, cn.name as container_name FROM waste_collects as co
        INNER JOIN waste_containers AS cn ON co.container_id = cn.id
        WHERE 
            co.user_id=${userId}::uuid 
            AND co.id=${id}
            ${options?.status ? Prisma.sql` AND "status"::text=${options?.status.toUpperCase()} ` : Prisma.empty}
        LIMIT 1;
        `;

        if (collect.length == 0) {
            throw new ErrorWithStatus('My waste collect is not found', 404);
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
export const addMyWasteCollect = async (userId: string, point: number, payload: Static<typeof WasteCollectPayloadSchema>) => {
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

        // TODO(Event) -> send point notification to user

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

export const updateMyWasteCollect = async (userId: string, id: number, payload: Partial<Static<typeof WasteCollectPayloadSchema>>) => {
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
            SELECT co.id, co.type, co.status, co.point, co.created_at, cn.id as container_id, cn.name as container_name, co.is_anonim,
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
            throw new ErrorWithStatus('Waste collect is not found', 404);
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

        // TODO(Event) -> send point notification to user

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

