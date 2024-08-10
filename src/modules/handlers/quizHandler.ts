import { Prisma, Quiz } from "@prisma/client";
import { QuizLogPayload, QuizLogType, QuizType } from "../../models/Quiz";
import { successResponse } from "../../utils/responseBuilder";
import { ErrorWithStatus } from "../../utils/exceptionBuilder";
import db from "../../db/instance";
import { QUIZ_POINT } from "../../utils/constants/point";
import { Static } from "elysia";
import { hash, verify } from "../../utils/hash";

type UserQuizType = Omit<QuizType, 'created_at' | 'updated_at' | 'answer'>

export const getRandomQuiz = async (userId: string) => {
    try {
        const quiz = await db.$queryRaw<UserQuizType[]>`
            SELECT id, question, options, img FROM quizzes
            ORDER BY random()
            LIMIT 1;
        `
        // Put unique id for later post request 
        const uniqueId = await hash(`${quiz[0].id};${userId}`);

        return successResponse<UserQuizType & { unique_id: string }>(
            {
                message: "Your quiz is ready",
                data: [{ ...quiz[0], unique_id: uniqueId }]
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

export const getQuizById = async (id: number) => {
    try {
        const quiz = await db.$queryRaw<UserQuizType[]>`
            SELECT id, question, options, img FROM quizzes
            WHERE id=${id}
            LIMIT 1;
        `

        if (quiz.length == 0) {
            throw new ErrorWithStatus('Quiz is not found', 404);
        }

        return successResponse<UserQuizType>(
            {
                message: "Your quiz is ready",
                data: quiz
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

// Quiz Log

export const checkAnswerAndAddQuizLog = async (userId: string, payload: Static<typeof QuizLogPayload>) => {
    try {

        const isMatch = await verify(`${payload.quiz_id};${userId}`, payload.unique_id);

        if (!isMatch)
            throw new ErrorWithStatus('Your unique ID is not valid', 400, 'Bad Request')

        const validAnswer = await db.$queryRaw<QuizType[]>`
            SELECT answer FROM quizzes 
            WHERE id=${payload.quiz_id} 
            LIMIT 1
        `
        if (validAnswer[0].answer !== payload.answer)
            throw new ErrorWithStatus('Your answer is incorrect. Try Again.', 400, 'Bad Request')


        const quizLog = await db.$queryRaw<QuizLogType[]>`
            INSERT INTO quiz_logs
            VALUES (
                DEFAULT,
                ${QUIZ_POINT},
                now(),
                ${userId}::uuid,
                ${payload.quiz_id}
            )
            RETURNING point;
        `
        // TODO(Event) -> send point notification to user

        return successResponse<QuizLogType>(
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
