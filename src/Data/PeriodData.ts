type PeriodData = {
    nbSources: {
        date: string[],
        totalSources: number[]
    },
    top10: {
        labels: string[],
        totalLinks: number[],
        percentages: number[]
    }
}

export default PeriodData;