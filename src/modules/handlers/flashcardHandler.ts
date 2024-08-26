import { Prisma } from "@prisma/client";
import db from "../../db/instance";
import { FlashcardType } from "../../models/Flashcard";
import { successResponse } from "../../utils/responseBuilder";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";

export const getRandomFlashcard = async () => {
    try {
        const flashCard = await db.$queryRaw<FlashcardType[]>`
            SELECT * FROM flashcards
            ORDER BY random()
            LIMIT 1;
        `

        return successResponse<FlashcardType>(
            {
                message: "Your flashcard is ready",
                data: flashCard
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

export const getFlashcardById = async (id: number) => {
    try {
        const flashCard = await db.$queryRaw<FlashcardType[]>`
            SELECT * FROM flashcards
            WHERE id=${id}
            LIMIT 1;
        `

        if (flashCard.length == 0) {
            throw new ErrorWithStatus('Flashcard is not found', 404);
        }

        return successResponse<FlashcardType>(
            {
                message: "Your flashcard is ready",
                data: flashCard
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