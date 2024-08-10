import { Prisma } from "@prisma/client";
import { successResponse } from "../../utils/responseBuilder";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import db from "../../db/instance";
import { QUEST_POINT } from "../../utils/constants/point";
import { Static } from "elysia";
import { QuestLogPayload, QuestLogType, QuestType } from "../../models/Quest";
import { hash, verify } from "../../utils/hash";

export const getRandomQuest = async (userId: string) => {
    try {
        const quest = await db.$queryRaw<QuestType[]>`
            SELECT id, title, "desc", img, type FROM quests
            ORDER BY random()
            LIMIT 1;
        `
        // Put unique id for later post request 
        const uniqueId = await hash(`${quest[0].id};${userId}`);

        return successResponse<QuestType & { unique_id: string }>(
            {
                message: "Your quests is ready",
                data: [{ ...quest[0], unique_id: uniqueId }]
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

export const getQuestById = async (id: number) => {
    try {
        const quest = await db.$queryRaw<QuestType[]>`
            SELECT id, title, desc, img, type FROM quests
            WHERE id=${id}
            LIMIT 1;
        `

        if (quest.length == 0) {
            throw new ErrorWithStatus('Quest is not found', 404);
        }

        return successResponse<QuestType>(
            {
                message: "Your quest is ready",
                data: quest
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

// Quest Log

export const accomplishQuest = async (userId: string, payload: Static<typeof QuestLogPayload>) => {
    try {

        const isMatch = await verify(`${payload.quest_id};${userId}`, payload.unique_id);

        if (!isMatch)
            throw new ErrorWithStatus('Your unique ID is not valid', 400, 'Bad Request')

        const quizLog = await db.$queryRaw<QuestLogType[]>`
            INSERT INTO quest_logs
            VALUES (
                DEFAULT,
                ${QUEST_POINT},
                now(),
                ${userId}::uuid,
                ${payload.quest_id}
            )
            RETURNING point;
        `
        // TODO(Event) -> send point notification to user

        return successResponse<QuestLogType>(
            {
                message: `You got ${quizLog[0].point!} point. Your progress will be recorded in our system`,
                data: quizLog
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
