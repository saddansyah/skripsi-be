type Rank = {
    id: number;
    title: string;
    sum_point: number;
}

const RANK: Rank[] = [
    {
        id: 0,
        title: 'Environmental Noobie',
        sum_point: 0
    },
    {
        id: 1,
        title: 'Eco Novice',
        sum_point: 200
    },
    {
        id: 2,
        title: 'Waste Warrior',
        sum_point: 400
    },
    {
        id: 3,
        title: 'Pandawara',
        sum_point: 600
    },
    {
        id: 4,
        title: 'The Green Savior',
        sum_point: 800
    },
]

export const getRankByPoint = (point: number) => RANK.findLast((rank) => point >= rank.sum_point)!;
export const getNextRank = (rank: Rank) => rank.id < 5 ? RANK[rank.id + 1] : rank;



