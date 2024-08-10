const RANK = [
    {
        id: 0,
        title: 'Environmental Noobie',
        sum_point: 0,
        img: '-'
    },
    {
        id: 1,
        title: 'Eco Novice',
        sum_point: 200,
        img: '-'
    },
    {
        id: 2,
        title: 'Waste Warrior',
        sum_point: 400,
        img: '-'
    },
    {
        id: 3,
        title: 'Pandawara',
        sum_point: 600,
        img: '-'
    },
    {
        id: 4,
        title: 'The Green Savior',
        sum_point: 800,
        img: '-'
    },
]

export const getRankByPoint = (point: number) => RANK.findLast((rank) => point >= rank.sum_point);



