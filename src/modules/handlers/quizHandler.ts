import { Prisma, Quiz } from "@prisma/client";
import { QuizLogPayload, QuizLogType, QuizStatusType, QuizType } from "../../models/Quiz";
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

// To check user shouldn't answer the quiz within 24 hours
export const checkQuizStatus = async (userId: string) => {
    try {
        const quiz = await db.$queryRaw<QuizStatusType[]>`
            with latest_quiz_log as (
                select created_at from quiz_logs 
                where user_id = '02f4dcda-9e71-4285-9898-068c062655a3'
                order by created_at desc 
                limit 1
            ),
            result as (
                select l.created_at, l.created_at + INTERVAL '1 day' AS next_date from latest_quiz_log as l
            )
            select * from result;
        `

        if (quiz.length == 0) {
            throw new ErrorWithStatus('Quiz is not found', 404);
        }

        return successResponse<QuizStatusType>(
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

        if (validAnswer[0].answer !== payload.answer) {
            console.log('Answer is wrong');

            return successResponse<QuizLogType>(
                {
                    message: `Jawaban kamu salah. Coba lagi.`,
                    data: []
                }
            );
        }


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
                message: `Kamu mendapat ${quizLog[0].point!} poin. Progres quiz kamu akan tercatat di sistem.`,
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
