import db from '../db/instance'
import { Prisma } from '@prisma/client';

const seed = async () => {

    const profiles = [
        {
            user: {
                connect: { id: '0be65c73-dc31-4fcb-9fba-6a80e0c0b562' }
            },
            isAdmin: true
        },
        {
            user: {
                connect: { id: 'f032cd98-a6f5-420d-824c-e9b3e9118e24' }
            },
        },

    ] satisfies Prisma.ProfileCreateInput[];

    for (const p of profiles) {
        await db.profile.create({
            data: p
        })
    };

    const waste_clusters = [
        {
            name: "Teknik",
        },
        {
            name: "FEB"
        }
    ] satisfies Prisma.WasteClusterCreateInput[]

    const cluster_teknik = await db.wasteCluster.create({
        data: waste_clusters[0],
    });

    // seed container
    const waste_containers = [
        {
            name: 'Depo Fakultas Teknik',
            type: 'DEPO',
            rating: 0.0,
            max_kg: 20000,
            max_vol: 20000,
            lat: -7.764655,
            long: 110.371049,
            status: 'ACCEPTED',
            cluster: {
                connect: { id: cluster_teknik.id }
            }
        },
        {
            name: 'Tong SGLC 1',
            type: 'DEPO',
            rating: 0.0,
            max_kg: 20000,
            max_vol: 20000,
            lat: -7.764655,
            long: 110.371049,
            cluster: {
                connect: { id: cluster_teknik.id }
            }
        },
    ] satisfies Prisma.WasteContainerCreateInput[]

    const cid: Array<number> = [];
    for (const c of waste_containers) {
        const _c = await db.wasteContainer.create({
            data: c,
        });

        cid.push(_c.id);
    };

    // seed waste collect
    const waste_collects = [
        {
            kg: 0.5,
            vol: 1,
            type: 'GUNA_ULANG',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
            point: 5,
            info: 'Sampah Guna Ulang',
            is_anonim: false,
            user: {
                connect: { id: '0be65c73-dc31-4fcb-9fba-6a80e0c0b562' }
            },
            container: {
                connect: { id: cid[0] }
            }
        },
        {
            kg: 0.8,
            vol: 0.5,
            type: 'DAUR_ULANG',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
            point: 5,
            info: 'Sampah Daur Ulang',
            is_anonim: true,
            user: {
                connect: { id: '0be65c73-dc31-4fcb-9fba-6a80e0c0b562' }
            },
            container: {
                connect: { id: cid[0] }
            }
        },
    ] satisfies Prisma.WasteCollectCreateInput[]

    for (const c of waste_collects) {
        await db.wasteCollect.create({
            data: c,
        });
    };

    // seed waste report
    const waste_reports = [
        {
            lat: -7.765070,
            long: 110.372147,
            kg: 0.8,
            vol: 1,
            type: 'GUNA_ULANG',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
            point: 5,
            info: 'Sampah Guna Ulang',
            is_anonim: false,
            user: {
                connect: { id: 'f032cd98-a6f5-420d-824c-e9b3e9118e24' }
            },
        },
        {
            lat: -7.764364,
            long: 110.373089,
            kg: 0.2,
            vol: 0.3,
            type: 'GUNA_ULANG',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
            point: 5,
            info: 'Sampah Guna Ulang',
            is_anonim: false,
            user: {
                connect: { id: 'f032cd98-a6f5-420d-824c-e9b3e9118e24' }
            },
        },

    ] satisfies Prisma.WasteReportCreateInput[];


    // Test with promises
    Promise.all(waste_reports.map((r) => db.wasteReport.create({ data: r })));


    // seed quest
    const quests = [
        {
            title: 'Menggunakan Tumblr',
            desc: 'Menggunakan tumblr untuk implementasi konsep reduce',
            point: 5,
            type: 'REUSE',
        }
    ] satisfies Prisma.QuestCreateInput[]

    for (const c of quests) {
        await db.quest.create({
            data: c,
        });
    };

    // seed quiz
    const quizzes = [
        {
            question: 'Berapa jenis sampah menurut KLHK?',
            options: '3;4;5;6',
            answer: '5',
            point: 2,
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        }
    ] satisfies Prisma.QuizCreateInput[]

    for (const c of quizzes) {
        await db.quiz.create({
            data: c,
        });
    };

}

const main = async () => {
    try {
        await seed();

        // if seed is succeded
        await db.$disconnect();
        console.log("Exit from seeding");
        process.exit(0);
    }
    catch (e) {
        console.error(e)
        await db.$disconnect()
        process.exit(1)
    }
}

main();
