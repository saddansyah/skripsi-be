import db from "../db/instance";
import { Prisma } from "@prisma/client";
import { ErrorWithStatus } from "../utils/exceptionBuilder";
import { WasteClusterType } from "../types/WasteCluster";
import { successResponse } from "../utils/responseBuilder";

export const getClusters = async (
    options?: {
        limit?: number,
        sortBy?: string,
        order?: string
    }) => {

    try {
        const clusters = await db.$queryRaw`
            SELECT * FROM waste_clusters 
            ORDER BY ${Prisma.sql([options?.sortBy ?? 'name'])} ${Prisma.sql([options?.order ?? 'asc'])} 
            LIMIT ${options?.limit ?? 10};
        ` as WasteClusterType[];

        // Messages is empty when empty
        if (clusters.length == 0) {
            return successResponse<WasteClusterType>(
                {
                    message: "Clusters is empty",
                    data: clusters
                }
            )
        }

        // Return JSON when success
        return successResponse<WasteClusterType>(
            {
                message: "Clusters is ready",
                data: clusters
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

export const getClusterById = async (id: number) => {
    try {
        const cluster = await db.$queryRaw`
            SELECT * FROM waste_clusters 
            WHERE id=${id}
        ` as WasteClusterType[];

        // Messages is empty when empty
        if (!cluster) {
            return successResponse<WasteClusterType>(
                {
                    message: "Cluster is empty",
                    data: cluster
                }
            )
        }

        // Return JSON when success
        return successResponse<WasteClusterType>(
            {
                message: "Cluster is ready",
                data: cluster
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

export const addCluster = async (payload: Omit<WasteClusterType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
        const cluster = await db.$queryRaw`
            INSERT INTO waste_clusters 
            VALUES(DEFAULT, 
            ${payload.name}, 
            now(), 
            now()) 
            RETURNING *;
        ` as WasteClusterType[];

        return successResponse<WasteClusterType>(
            {
                message: `Cluster ${payload.name} successfully created`,
                data: cluster
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

export const updateCluster = async (id: number, payload: Partial<Omit<WasteClusterType, 'id' | 'created_at' | 'updated_at'>>) => {
    if (Object.keys(payload).length == 0) {
        throw new ErrorWithStatus('Body must be not empty', 400, 'Validation Error');
    }

    try {
        const existingCluster = ((await db.$queryRaw`SELECT * FROM waste_clusters WHERE id=${id} LIMIT 1`) as WasteClusterType[])[0];

        const cluster = await db.$queryRaw`
        UPDATE waste_clusters 
        SET name=${payload.name ?? existingCluster.name} 
        WHERE id=${id} 
        RETURNING *;
        ` as WasteClusterType[];

        return successResponse<WasteClusterType>(
            {
                message: `Cluster ${existingCluster.name} successfully updated`,
                data: cluster
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

export const deleteCluster = async (id: number) => {
    try {
        await db.$queryRaw`
            DELETE FROM waste_clusters
            WHERE id=${id};
        `;

        // Return JSON when success
        return successResponse<WasteClusterType>(
            {
                message: "Cluster is deleted",
                data: []
            }
        )
    }
    catch (e: any) {
        switch (e.constructor) {
            case Prisma.PrismaClientKnownRequestError:
                throw new ErrorWithStatus(e.code === '23503' ? `Your choosed waste cluster is strongly related with waste container(s)` : e.message, 500);
            default:
                throw new ErrorWithStatus(e.message, 500);
        }
    }
}