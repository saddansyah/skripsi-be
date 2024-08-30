import { Prisma } from "@prisma/client";
import db from "../db/instance";
import { AssignedAchievementType, ShouldAwardType } from "../models/Achievement";
import { ErrorWithStatus } from "./exceptionBuilder";

export const evaluate = async (userId: string, achievementId: number) => {
    // Check is user should awarded
    try {

        let achievement;

        switch (achievementId) {
            case 1:
                achievement = await db.$queryRaw<ShouldAwardType[]>`
                    SELECT
                        CASE
                            WHEN COUNT(co.id) > 0
                            AND COUNT(aa.achievement_id) = 0 THEN TRUE
                            ELSE FALSE
                        END AS should_award
                    FROM
                        waste_collects as co
                    LEFT JOIN assigned_achievements as aa ON co.user_id = aa.user_id
                        AND aa.achievement_id=${achievementId}
                    WHERE
                        co.user_id=${userId}::uuid;
                `;
                break;
            case 2:
                achievement = await db.$queryRaw<ShouldAwardType[]>`
                    SELECT
                        CASE
                            WHEN COUNT(cn.id) > 0
                            AND COUNT(aa.achievement_id) = 0 THEN TRUE
                            ELSE FALSE
                        END AS should_award
                    FROM
                        waste_containers as cn
                    LEFT JOIN assigned_achievements as aa ON cn.user_id = aa.user_id
                        AND aa.achievement_id=${achievementId}
                    WHERE
                        cn.user_id=${userId}::uuid;
                `;
            case 3:
                achievement = await db.$queryRaw<ShouldAwardType[]>`
                    SELECT
                        CASE
                            WHEN COUNT(er.*) > 0
                            AND COUNT(aa.achievement_id) = 0 THEN TRUE
                            ELSE FALSE
                        END AS should_award
                    FROM
                        evidence_ratings as er
                    LEFT JOIN assigned_achievements as aa ON er.user_id = aa.user_id
                        AND aa.achievement_id=${achievementId}
                    WHERE
                        er.user_id=${userId}::uuid;
                `
            default:
                achievement = await db.$queryRaw<ShouldAwardType[]>`
                    SELECT FALSE AS should_award
                `;
                break;
        }



        if (achievement[0].should_award) {
            // Assigned Achievement table has notification webhook
            await db.$queryRaw<AssignedAchievementType[]>`
                INSERT INTO assigned_achievements
                VALUES (
                    DEFAULT,
                    ${userId}::uuid,
                    ${achievementId}
                );
        `;

            console.log(`Achievement with id ${achievementId} is sent to user via push notification!`)
        }
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


