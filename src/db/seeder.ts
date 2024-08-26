import db from '../db/instance'
import { Prisma } from '@prisma/client';
import { CONTAINER_POINT } from '../utils/constants/point';

const seed = async () => {

    const user1 = '59f18cb8-2889-46cd-b6a0-b9ab179a9517';
    const user2 = '02f4dcda-9e71-4285-9898-068c062655a3';

    const waste_clusters = [
        {
            name: "F. Teknik"
        },
        {
            name: "F. Farmasi",
        },
        {
            name: "FIB"
        },
        {
            name: "F. Hukum"
        },
        {
            name: "FKKMK"
        },
        {
            name: "FKG"
        },
        {
            name: "FKH"
        },
        {
            name: "FEB"
        },

        {
            name: "FMIPA"
        },
        {
            name: "FISIPOL"
        },
        {
            name: "F. Psikologi"
        },
        {
            name: "F. Peternakan"
        },
        {
            name: "FTP"
        },
        {
            name: "F. Pertanian"
        },
        {
            name: "F. Geografi"
        },
        {
            name: "F. Kehutanan"
        },
    ] satisfies Prisma.WasteClusterCreateInput[]

    const cluster = await Promise.all(waste_clusters.map((r) => db.wasteCluster.create({ data: r })));

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
            point: CONTAINER_POINT,
            cluster: {
                connect: { id: cluster[0].id }
            },
            user: {
                connect: { id: user1 }
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
            point: CONTAINER_POINT,
            cluster: {
                connect: { id: cluster[0].id }
            },
            user: {
                connect: { id: user1 }
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
            status: 'ACCEPTED',
            user: {
                connect: { id: user1 }
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
            status: 'PENDING',
            user: {
                connect: { id: user1 }
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
            status: 'ACCEPTED',
            user: {
                connect: { id: user2 }
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
            status: 'ACCEPTED',
            user: {
                connect: { id: user2 }
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
            type: 'REUSE',
        },
        {
            title: 'Membawa Tas Belanja Sendiri',
            desc: 'Menggunakan tas belanja sendiri saat berbelanja untuk mengurangi penggunaan kantong plastik',
            type: 'REDUCE',
        },
        {
            title: 'Daur Ulang Botol Plastik',
            desc: 'Mengumpulkan dan mendaur ulang botol plastik bekas',
            type: 'RECYCLE',
        },
        {
            title: 'Menggunakan Kertas Bekas',
            desc: 'Menggunakan kertas bekas untuk mencatat atau keperluan lainnya',
            type: 'REUSE',
        },
        {
            title: 'Mengurangi Penggunaan Sedotan Plastik',
            desc: 'Menggunakan sedotan stainless atau bambu untuk mengurangi penggunaan sedotan plastik',
            type: 'REDUCE',
        },
        {
            title: 'Mendaur Ulang Sampah Organik',
            desc: 'Membuat kompos dari sampah organik di rumah',
            type: 'RECYCLE',
        },
        {
            title: 'Memilah Sampah Rumah Tangga',
            desc: 'Memilah sampah rumah tangga menjadi sampah organik dan anorganik',
            type: 'REUSE',
        },
        {
            title: 'Menggunakan Produk Ramah Lingkungan',
            desc: 'Menggunakan produk ramah lingkungan seperti sikat gigi bambu atau sabun alami',
            type: 'REDUCE',
        },
        {
            title: 'Mengumpulkan Sampah Elektronik',
            desc: 'Mengumpulkan dan mendaur ulang sampah elektronik',
            type: 'RECYCLE',
        },
        {
            title: 'Memanfaatkan Limbah Dapur',
            desc: 'Menggunakan sisa-sisa makanan atau limbah dapur untuk membuat pupuk organik',
            type: 'REUSE',
        }
    ] satisfies Prisma.QuestCreateInput[]

    const qsid: Array<number> = [];
    for (const q of quests) {
        const _q = await db.quest.create({
            data: q,
        });
        qsid.push(_q.id);
    };

    const questLog = [
        {
            point: 5,
            quest: { connect: { id: qsid[0] } },
            user: { connect: { id: user1 } },
        },
        {
            point: 5,
            quest: { connect: { id: qsid[3] } },
            user: { connect: { id: user1 } },
        },
        {
            point: 5,
            quest: { connect: { id: qsid[2] } },
            user: { connect: { id: user1 } },
        },
        {
            point: 5,
            quest: { connect: { id: qsid[7] } },
            user: { connect: { id: user2 } },
        },
        {
            point: 5,
            quest: { connect: { id: qsid[4] } },
            user: { connect: { id: user2 } },
        }
    ] satisfies Prisma.QuestLogCreateInput[];

    Promise.all(questLog.map((r) => db.questLog.create({ data: r })));

    // seed quiz
    const quizzes = [
        {
            question: 'Berapa jenis sampah menurut KLHK?',
            options: '3;4;5;6',
            answer: '5',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        },
        {
            question: 'Sampah organik dapat diolah menjadi apa?',
            options: 'Kompos;Plastik;Kertas;Kaca',
            answer: 'Kompos',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        },
        {
            question: 'Apa itu daur ulang (recycle)?',
            options: 'Proses membakar sampah;Proses membuat produk baru dari bahan lama;Proses membuang sampah di tempat terbuka;Proses menimbun sampah',
            answer: 'Proses membuat produk baru dari bahan lama',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        },
        {
            question: 'Apa warna tempat sampah untuk sampah plastik di Indonesia?',
            options: 'Hijau;Kuning;Merah;Biru',
            answer: 'Kuning',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        },
        {
            question: 'Sampah jenis apa yang dapat menyebabkan pencemaran air?',
            options: 'Sampah organik;Sampah plastik;Sampah kimia;Sampah kaca',
            answer: 'Sampah kimia',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        },
        {
            question: 'Mengurangi penggunaan kantong plastik termasuk dalam prinsip apa?',
            options: 'Reuse;Recycle;Reduce;Rethink',
            answer: 'Reduce',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        },
        {
            question: 'Apa tujuan utama dari pengelolaan sampah?',
            options: 'Mengurangi jumlah sampah;Meningkatkan jumlah sampah;Membuang sampah ke laut;Mengubur sampah',
            answer: 'Mengurangi jumlah sampah',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        },
        {
            question: 'Apa yang dimaksud dengan sampah B3?',
            options: 'Sampah organik;Sampah anorganik;Sampah berbahaya dan beracun;Sampah elektronik',
            answer: 'Sampah berbahaya dan beracun',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        },
        {
            question: 'Mengapa penting untuk memilah sampah sejak dari rumah?',
            options: 'Agar rumah tetap bersih;Agar mudah diangkut;Agar sampah tidak menumpuk;Agar memudahkan proses daur ulang',
            answer: 'Agar memudahkan proses daur ulang',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        },
        {
            question: 'Apa yang dapat kita lakukan dengan sampah elektronik?',
            options: 'Membuangnya di tempat sampah biasa;Menjualnya;Menguburnya;Mendaur ulangnya',
            answer: 'Mendaur ulangnya',
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
        }
    ] satisfies Prisma.QuizCreateInput[]

    const qzid: Array<number> = [];
    for (const q of quizzes) {
        const _q = await db.quiz.create({
            data: q,
        });
        qzid.push(_q.id);
    };

    const quizLog = [
        {
            point: 5,
            quiz: { connect: { id: qzid[0] } },
            user: { connect: { id: user1 } },
        },
        {
            point: 5,
            quiz: { connect: { id: qzid[3] } },
            user: { connect: { id: user1 } },
        },
        {
            point: 5,
            quiz: { connect: { id: qzid[2] } },
            user: { connect: { id: user1 } },
        },
        {
            point: 5,
            quiz: { connect: { id: qzid[7] } },
            user: { connect: { id: user2 } },
        },
        {
            point: 5,
            quiz: { connect: { id: qzid[4] } },
            user: { connect: { id: user2 } },
        }
    ] satisfies Prisma.QuizLogCreateInput[];

    Promise.all(quizLog.map((r) => db.quizLog.create({ data: r })));

    const achievements = [
        {
            name: 'To the Moon',
            description: 'Mengumpulkan sebanyak 100 point',
            img: 'https://cdn-icons-png.flaticon.com/512/7339/7339233.png',
        },
        {
            name: 'Avid Learner',
            description: 'Membaca semua learn',
            img: 'https://cdn-icons-png.flaticon.com/512/7339/7339233.png',
        },
    ] satisfies Prisma.AchievementCreateInput[]


    const aid: Array<number> = [];
    for (const a of achievements) {
        const _a = await db.achievement.create({
            data: a,
        });

        aid.push(_a.id);
    };

    const assignedAchievement = [
        {
            user: {
                connect: { id: user1 }
            },
            achievement: {
                connect: { id: aid[0] }
            }
        },
        {
            user: {
                connect: { id: user2 }
            },
            achievement: {
                connect: { id: aid[1] }
            }
        },
    ] satisfies Prisma.AssignedAchievementCreateInput[];

    for (const a of assignedAchievement) {
        await db.assignedAchievement.create({
            data: a,
        });
    };

    const learns = [
        {
            title: 'Pentingnya Memilah Sampah di Rumah',
            excerpt: 'Memilah sampah rumah tangga sangat penting untuk membantu proses daur ulang dan mengurangi penumpukan sampah di TPA.',
            content: `
    ## Pentingnya Memilah Sampah di Rumah
    
    Memilah sampah rumah tangga sangat penting untuk membantu proses daur ulang dan mengurangi penumpukan sampah di Tempat Pembuangan Akhir (TPA). Dengan memisahkan sampah organik, anorganik, dan berbahaya, kita dapat membantu mengurangi dampak negatif terhadap lingkungan.
    
    ### Langkah-langkah Memilah Sampah:
    
    1. **Sampah Organik**: Pisahkan sisa makanan, daun, dan bahan organik lainnya. Sampah ini dapat dijadikan kompos.
    2. **Sampah Anorganik**: Kumpulkan plastik, kertas, kaca, dan logam. Sampah ini bisa didaur ulang.
    3. **Sampah Berbahaya**: Pisahkan baterai, lampu neon, dan limbah elektronik. Sampah ini membutuhkan penanganan khusus.
    
    Dengan memilah sampah, kita turut serta dalam menjaga kebersihan dan kelestarian lingkungan.
            `,
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
            category: 'Reuse'
        },
        {
            title: 'Mengurangi Penggunaan Plastik Sekali Pakai',
            excerpt: 'Plastik sekali pakai memberikan dampak besar terhadap pencemaran lingkungan. Mengurangi penggunaannya adalah langkah kecil dengan dampak besar.',
            content: `
    ## Mengurangi Penggunaan Plastik Sekali Pakai
    
    Plastik sekali pakai memberikan dampak besar terhadap pencemaran lingkungan. Mengurangi penggunaannya adalah langkah kecil dengan dampak besar. Setiap tahun, jutaan ton plastik mencemari lautan dan merusak ekosistem.
    
    ### Tips Mengurangi Penggunaan Plastik:
    
    1. **Bawa Tas Belanja Sendiri**: Gunakan tas kain atau anyaman yang dapat digunakan berulang kali.
    2. **Gunakan Botol Minum Reusable**: Hindari membeli botol air mineral plastik, bawalah botol minum sendiri.
    3. **Hindari Sedotan Plastik**: Gunakan sedotan stainless atau bambu.
    
    Dengan mengurangi penggunaan plastik sekali pakai, kita dapat membantu mengurangi pencemaran plastik di lingkungan kita.
            `,
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
            category: 'Reuse'
        },
        {
            title: 'Daur Ulang Sampah Elektronik',
            excerpt: 'Sampah elektronik merupakan salah satu jenis limbah yang paling cepat meningkat. Mendaur ulang sampah elektronik adalah cara efektif untuk mengurangi dampak negatifnya.',
            content: `
    ## Daur Ulang Sampah Elektronik
    
    Sampah elektronik merupakan salah satu jenis limbah yang paling cepat meningkat. Mendaur ulang sampah elektronik adalah cara efektif untuk mengurangi dampak negatifnya. Limbah elektronik mengandung bahan berbahaya seperti merkuri dan timbal yang dapat mencemari lingkungan jika tidak ditangani dengan benar.
    
    ### Cara Mendaur Ulang Sampah Elektronik:
    
    1. **Kumpulkan Barang Elektronik Lama**: Telepon genggam, komputer, dan perangkat elektronik lainnya yang sudah tidak terpakai.
    2. **Serahkan ke Pusat Daur Ulang**: Banyak pusat daur ulang menerima barang elektronik untuk didaur ulang.
    3. **Dukung Program Pengolahan E-Waste**: Ikuti program atau kampanye yang fokus pada pengolahan sampah elektronik.
    
    Dengan mendaur ulang sampah elektronik, kita dapat membantu mengurangi pencemaran lingkungan dan memanfaatkan kembali bahan-bahan yang ada.
            `,
            img: 'https://cdn.rri.co.id/berita/Bukittinggi/o/1715099109820-IMG_8799/wc5nmycwdytppuo.jpeg',
            category: 'Reduce'
        }
    ] satisfies Prisma.LearnCreateInput[];

    for (const a of learns) {
        await db.learn.create({
            data: a,
        });
    };

    const flashCards = [
        {
            content: "Setiap tahun, sekitar 300 juta ton plastik diproduksi di seluruh dunia, dengan lebih dari 50% di antaranya sekali pakai."
        },
        {
            content: "Diperkirakan lebih dari 8 juta ton plastik masuk ke lautan setiap tahun, mengancam kehidupan laut dan ekosistem."
        },
        {
            content: "Plastik dapat membutuhkan hingga 1.000 tahun untuk terurai secara alami di lingkungan."
        },
        {
            content: "Sekitar 100.000 paus, penyu, dan burung laut mati setiap tahun akibat tertelan atau terjerat plastik."
        },
        {
            content: "Hanya sekitar 9% plastik yang diproduksi yang berhasil didaur ulang secara global."
        },
        {
            content: "Plastik menyumbang sekitar 3,8% dari emisi gas rumah kaca global setiap tahun."
        },
        {
            content: "Pembakaran sampah menghasilkan polutan berbahaya seperti dioksin dan partikel halus yang dapat membahayakan kesehatan manusia."
        },
        {
            content: "Paparan terhadap sampah yang tidak dikelola dengan baik dapat menyebabkan penyakit infeksi dan masalah kesehatan lainnya."
        },
        {
            content: "Setiap tahun, sekitar 50 juta ton limbah elektronik dihasilkan di seluruh dunia, dengan sebagian besar tidak didaur ulang secara benar."
        },
        {
            content: "Sampah plastik dan polusi air menyebabkan kerusakan terumbu karang, yang merupakan habitat penting bagi banyak spesies laut."
        },
        {
            content: "Sampah organik yang terurai di tempat pembuangan akhir menghasilkan metana, gas rumah kaca yang kuat."
        },
        {
            content: "Sekitar 70% air dunia digunakan untuk pertanian, industri, dan kebutuhan domestik, menekankan pentingnya konservasi air."
        },
        {
            content: "Setiap tahun, sekitar 10 juta hektar hutan ditebang, menyebabkan kehilangan habitat dan peningkatan emisi karbon."
        },
        {
            content: "Energi terbarukan seperti matahari dan angin kini mencakup sekitar 29% dari total kapasitas energi dunia."
        },
        {
            content: "Meningkatkan efisiensi energi dapat mengurangi konsumsi energi dan emisi karbon secara signifikan."
        },
        {
            content: "Mengomposkan sampah organik dapat mengurangi volume sampah yang masuk ke tempat pembuangan akhir dan menghasilkan pupuk alami."
        },
        {
            content: "Beberapa perusahaan mengklaim ramah lingkungan tanpa tindakan nyata, yang dikenal sebagai greenwashing."
        },
        {
            content: "Keanekaragaman hayati penting untuk stabilitas ekosistem dan keberlanjutan planet."
        },
        {
            content: "Urbanisasi yang cepat dapat menyebabkan degradasi lingkungan seperti polusi udara dan penurunan kualitas air."
        },
        {
            content: "Hanya sekitar 2,5% air di bumi yang dapat digunakan oleh manusia, dengan sebagian besar tersimpan di es dan es permanen."
        },
        {
            content: "Pemanasan global menyebabkan peningkatan suhu rata-rata bumi, mencairnya es kutub, dan naiknya permukaan laut."
        },
        {
            content: "Menghemat energi melalui penggunaan lampu LED, peralatan hemat energi, dan isolasi bangunan dapat mengurangi konsumsi energi."
        },
        {
            content: "Hutan menyediakan habitat bagi lebih dari 80% spesies darat dan menyimpan sekitar 80% karbon di atmosfer."
        },
        {
            content: "Pertanian berkelanjutan dapat meningkatkan produktivitas tanah, mengurangi erosi, dan menjaga keanekaragaman hayati."
        },
        {
            content: "Polusi air disebabkan oleh limbah industri, pertanian, dan domestik yang mencemari sumber air bersih."
        },
        {
            content: "Erosi tanah dapat menyebabkan degradasi lahan, mengurangi kesuburan tanah, dan menyebabkan sedimentasi di badan air."
        },
        {
            content: "Menggunakan kembali produk dan kemasan dapat mengurangi jumlah sampah yang dihasilkan dan menghemat sumber daya."
        },
        {
            content: "Sekitar sepertiga dari makanan yang diproduksi di dunia hilang atau terbuang, menyebabkan pemborosan sumber daya dan emisi gas rumah kaca."
        },
        {
            content: "Energi nuklir adalah sumber energi rendah karbon yang dapat membantu mengurangi emisi gas rumah kaca, meskipun memiliki tantangan dalam pengelolaan limbah."
        },
        {
            content: "Menggunakan transportasi umum, bersepeda, atau berjalan kaki dapat mengurangi emisi karbon dan polusi udara."
        },
        {
            content: "Pertanian organik menghindari penggunaan pestisida dan bahan kimia sintetis, menjaga kesehatan tanah dan lingkungan."
        },
        {
            content: "Mengurangi penggunaan kertas dan mendaur ulang kertas dapat mengurangi deforestasi dan konsumsi energi."
        },
        {
            content: "Energi matahari adalah sumber energi terbarukan yang melimpah dan ramah lingkungan, mengurangi ketergantungan pada bahan bakar fosil."
        },
        {
            content: "Limbah berbahaya seperti baterai dan bahan kimia harus diolah dengan benar untuk mencegah pencemaran lingkungan."
        },
        {
            content: "Menggunakan baterai yang dapat diisi ulang dan mendaur ulang baterai bekas dapat mengurangi limbah elektronik."
        },
        {
            content: "Teknologi smart grid dapat meningkatkan efisiensi distribusi energi dan mengurangi kehilangan energi."
        },
        {
            content: "Pengelolaan limbah plastik yang baik melibatkan pengurangan penggunaan, pengumpulan, pemilahan, dan daur ulang."
        },
        {
            content: "Penggunaan energi fosil seperti minyak, gas, dan batu bara menyebabkan emisi gas rumah kaca dan polusi udara."
        },
        {
            content: "Pemanasan global dapat meningkatkan risiko penyakit terkait panas, penyebaran penyakit vektor, dan gangguan kesehatan mental."
        },
        {
            content: "Restorasi ekosistem melibatkan upaya memperbaiki dan memulihkan ekosistem yang rusak untuk mendukung keanekaragaman hayati dan fungsi ekologis."
        },
        {
            content: "Kota besar cenderung lebih panas daripada daerah sekitarnya karena aktivitas manusia dan infrastruktur yang padat."
        },
        {
            content: "Menghemat air melalui penggunaan efisien dan teknologi konservasi dapat membantu mengurangi tekanan pada sumber daya air."
        },
        {
            content: "Ekosistem laut mendukung sekitar 50% oksigen bumi dan menyediakan sumber protein bagi miliaran orang."
        },
        {
            content: "Teknologi hijau seperti panel surya, turbin angin, dan kendaraan listrik membantu mengurangi dampak lingkungan dari aktivitas manusia."
        },
        {
            content: "Memilah sampah rumah tangga menjadi organik, anorganik, dan berbahaya dapat meningkatkan efisiensi pengelolaan sampah."
        },
        {
            content: "Plastik mikro, partikel kecil plastik yang sulit diurai, dapat mencemari air dan tanah serta masuk ke rantai makanan."
        },
        {
            content: "Menanam kembali pohon di area yang deforestasi dapat membantu menyerap karbon dioksida, mengembalikan habitat, dan mencegah erosi tanah."
        },
        {
            content: "Menggunakan bahan yang ramah lingkungan seperti bambu, kaca, dan logam daur ulang dapat mengurangi dampak lingkungan dari produksi dan konsumsi."
        },
        {
            content: "Perubahan iklim dapat mempengaruhi ekonomi global melalui dampak pada pertanian, kesehatan, dan infrastruktur."
        },
        {
            content: "Keterlibatan komunitas dalam upaya pelestarian lingkungan seperti bersih-bersih, penanaman pohon, dan edukasi dapat meningkatkan kesadaran dan aksi kolektif."
        }
    ] satisfies Prisma.FlashCardCreateInput[];

    Promise.all(flashCards.map((r) => db.flashCard.create({ data: r })));
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
