import { Prisma } from "@prisma/client";

export const sql = (query: string) => {
    return Prisma.sql`${sql}`;
}